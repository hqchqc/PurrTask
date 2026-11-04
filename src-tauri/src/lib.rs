mod database;

use database::Database;
use tauri::Manager;

#[tauri::command(rename_all = "camelCase")]
fn list_active_tasks(
    start: i64,
    end: i64,
    db: tauri::State<'_, Database>,
) -> Result<Vec<database::Task>, String> {
    database::list_active_tasks(start, end, &db)
}

#[tauri::command]
fn list_deleted_tasks(db: tauri::State<'_, Database>) -> Result<Vec<database::Task>, String> {
    database::list_deleted_tasks(&db)
}

#[tauri::command]
fn create_task(title: String, db: tauri::State<'_, Database>) -> Result<database::Task, String> {
    database::create_task(title, &db)
}

#[tauri::command(rename_all = "camelCase")]
fn set_task_done(
    task_id: String,
    done: bool,
    db: tauri::State<'_, Database>,
) -> Result<database::Task, String> {
    database::set_task_done(task_id, done, &db)
}

#[tauri::command(rename_all = "camelCase")]
fn soft_delete_task(
    task_id: String,
    db: tauri::State<'_, Database>,
) -> Result<database::Task, String> {
    database::soft_delete_task(task_id, &db)
}

#[tauri::command(rename_all = "camelCase")]
fn restore_task(task_id: String, db: tauri::State<'_, Database>) -> Result<database::Task, String> {
    database::restore_task(task_id, &db)
}

#[tauri::command(rename_all = "camelCase")]
fn permanently_delete_task(task_id: String, db: tauri::State<'_, Database>) -> Result<(), String> {
    database::permanently_delete_task(task_id, &db)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let window = app
                .get_webview_window("main")
                .ok_or_else(|| std::io::Error::other("Main application window was not found"))?;
            let icon = app.default_window_icon().cloned().ok_or_else(|| {
                std::io::Error::other("Application window icon is not configured")
            })?;
            window.set_icon(icon)?;

            let data_dir = app.path().app_data_dir()?;
            std::fs::create_dir_all(&data_dir)?;
            let database_path = data_dir.join("purr-task.sqlite3");
            let database = Database::open(database_path).map_err(std::io::Error::other)?;
            app.manage(database);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            list_active_tasks,
            list_deleted_tasks,
            create_task,
            set_task_done,
            soft_delete_task,
            restore_task,
            permanently_delete_task
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
