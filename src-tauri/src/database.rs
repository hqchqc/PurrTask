use std::sync::Mutex;

use rusqlite::{Connection, OptionalExtension, params};
use serde::Serialize;
use uuid::Uuid;

pub struct Database(pub Mutex<Connection>);

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Task {
    pub id: String,
    pub title: String,
    pub done: bool,
    pub created_at: i64,
    pub finished_at: Option<i64>,
    pub deleted_at: Option<i64>,
    pub updated_at: i64,
}

impl Database {
    pub fn open(path: impl AsRef<std::path::Path>) -> Result<Self, String> {
        let connection = Connection::open(path).map_err(|error| error.to_string())?;
        Self::from_connection(connection)
    }

    fn from_connection(mut connection: Connection) -> Result<Self, String> {
        connection
            .busy_timeout(std::time::Duration::from_secs(5))
            .map_err(|error| error.to_string())?;
        connection
            .pragma_update(None, "foreign_keys", "ON")
            .map_err(|error| error.to_string())?;

        let version: i64 = connection
            .pragma_query_value(None, "user_version", |row| row.get(0))
            .map_err(|error| error.to_string())?;
        if version > 1 {
            return Err(format!(
                "Database schema version {version} is newer than supported"
            ));
        }
        if version == 0 {
            let transaction = connection
                .transaction()
                .map_err(|error| error.to_string())?;
            transaction
                .execute_batch(
                    "CREATE TABLE tasks (
                        id TEXT PRIMARY KEY NOT NULL,
                        title TEXT NOT NULL CHECK (length(trim(title)) > 0),
                        created_at INTEGER NOT NULL,
                        finished_at INTEGER,
                        deleted_at INTEGER,
                        updated_at INTEGER NOT NULL
                    );
                    CREATE INDEX tasks_created_at_idx ON tasks(created_at);
                    CREATE INDEX tasks_deleted_at_idx ON tasks(deleted_at);
                    PRAGMA user_version = 1;",
                )
                .map_err(|error| error.to_string())?;
            transaction.commit().map_err(|error| error.to_string())?;
        }

        Ok(Self(Mutex::new(connection)))
    }

    #[cfg(test)]
    fn in_memory() -> Result<Self, String> {
        Self::from_connection(Connection::open_in_memory().map_err(|error| error.to_string())?)
    }
}

fn current_timestamp() -> Result<i64, String> {
    let duration = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map_err(|error| error.to_string())?;
    i64::try_from(duration.as_millis()).map_err(|error| error.to_string())
}

fn task_from_row(row: &rusqlite::Row<'_>) -> rusqlite::Result<Task> {
    Ok(Task {
        id: row.get("id")?,
        title: row.get("title")?,
        done: row.get::<_, Option<i64>>("finished_at")?.is_some(),
        created_at: row.get("created_at")?,
        finished_at: row.get("finished_at")?,
        deleted_at: row.get("deleted_at")?,
        updated_at: row.get("updated_at")?,
    })
}

pub fn list_active_tasks(start: i64, end: i64, db: &Database) -> Result<Vec<Task>, String> {
    if start >= end {
        return Err("Task query start must be before end".to_string());
    }
    let connection = db.0.lock().map_err(|error| error.to_string())?;
    let mut statement = connection
        .prepare(
            "SELECT id, title, created_at, finished_at, deleted_at, updated_at
             FROM tasks
             WHERE deleted_at IS NULL AND created_at >= ?1 AND created_at < ?2
             ORDER BY created_at DESC",
        )
        .map_err(|error| error.to_string())?;
    let rows = statement
        .query_map(params![start, end], task_from_row)
        .map_err(|error| error.to_string())?;
    rows.collect::<Result<Vec<_>, _>>()
        .map_err(|error| error.to_string())
}

pub fn list_deleted_tasks(db: &Database) -> Result<Vec<Task>, String> {
    let connection = db.0.lock().map_err(|error| error.to_string())?;
    let mut statement = connection
        .prepare(
            "SELECT id, title, created_at, finished_at, deleted_at, updated_at
             FROM tasks
             WHERE deleted_at IS NOT NULL
             ORDER BY deleted_at DESC",
        )
        .map_err(|error| error.to_string())?;
    let rows = statement
        .query_map([], task_from_row)
        .map_err(|error| error.to_string())?;
    rows.collect::<Result<Vec<_>, _>>()
        .map_err(|error| error.to_string())
}

fn find_task(connection: &Connection, task_id: &str) -> Result<Option<Task>, String> {
    connection
        .query_row(
            "SELECT id, title, created_at, finished_at, deleted_at, updated_at
             FROM tasks WHERE id = ?1",
            [task_id],
            task_from_row,
        )
        .optional()
        .map_err(|error| error.to_string())
}

pub fn create_task(title: String, db: &Database) -> Result<Task, String> {
    let title = title.trim();
    if title.is_empty() {
        return Err("Task title cannot be empty".to_string());
    }

    let now = current_timestamp()?;
    let task = Task {
        id: Uuid::new_v4().to_string(),
        title: title.to_string(),
        done: false,
        created_at: now,
        finished_at: None,
        deleted_at: None,
        updated_at: now,
    };
    let connection = db.0.lock().map_err(|error| error.to_string())?;
    connection
        .execute(
            "INSERT INTO tasks (id, title, created_at, updated_at) VALUES (?1, ?2, ?3, ?3)",
            params![task.id, task.title, task.created_at],
        )
        .map_err(|error| error.to_string())?;
    Ok(task)
}

pub fn set_task_done(task_id: String, done: bool, db: &Database) -> Result<Task, String> {
    let now = current_timestamp()?;
    let connection = db.0.lock().map_err(|error| error.to_string())?;
    let changed = connection
        .execute(
            "UPDATE tasks
             SET finished_at = ?1, updated_at = ?2
             WHERE id = ?3 AND deleted_at IS NULL",
            params![if done { Some(now) } else { None }, now, task_id],
        )
        .map_err(|error| error.to_string())?;
    if changed == 0 {
        return Err("Task was not found or has been deleted".to_string());
    }
    find_task(&connection, &task_id)?.ok_or_else(|| "Updated task could not be loaded".to_string())
}

pub fn soft_delete_task(task_id: String, db: &Database) -> Result<Task, String> {
    let now = current_timestamp()?;
    let connection = db.0.lock().map_err(|error| error.to_string())?;
    let changed = connection
        .execute(
            "UPDATE tasks SET deleted_at = ?1, updated_at = ?1
             WHERE id = ?2 AND deleted_at IS NULL",
            params![now, task_id],
        )
        .map_err(|error| error.to_string())?;
    if changed == 0 {
        return Err("Task was not found or has already been deleted".to_string());
    }
    find_task(&connection, &task_id)?.ok_or_else(|| "Deleted task could not be loaded".to_string())
}

pub fn restore_task(task_id: String, db: &Database) -> Result<Task, String> {
    let now = current_timestamp()?;
    let connection = db.0.lock().map_err(|error| error.to_string())?;
    let changed = connection
        .execute(
            "UPDATE tasks SET deleted_at = NULL, updated_at = ?1
             WHERE id = ?2 AND deleted_at IS NOT NULL",
            params![now, task_id],
        )
        .map_err(|error| error.to_string())?;
    if changed == 0 {
        return Err("Deleted task was not found".to_string());
    }
    find_task(&connection, &task_id)?.ok_or_else(|| "Restored task could not be loaded".to_string())
}

pub fn permanently_delete_task(task_id: String, db: &Database) -> Result<(), String> {
    let connection = db.0.lock().map_err(|error| error.to_string())?;
    let changed = connection
        .execute(
            "DELETE FROM tasks WHERE id = ?1 AND deleted_at IS NOT NULL",
            [task_id],
        )
        .map_err(|error| error.to_string())?;
    if changed == 0 {
        return Err("Only deleted tasks can be permanently removed".to_string());
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn task_can_be_created_completed_deleted_and_restored() {
        let db = Database::in_memory().expect("database should initialize");
        let task = create_task("  Write tests  ".to_string(), &db).expect("task should be created");
        assert_eq!(task.title, "Write tests");
        assert!(!task.done);

        let completed =
            set_task_done(task.id.clone(), true, &db).expect("task should be completed");
        assert!(completed.done);
        assert!(completed.finished_at.is_some());

        let deleted = soft_delete_task(task.id.clone(), &db).expect("task should be deleted");
        assert!(deleted.deleted_at.is_some());
        assert!(
            list_active_tasks(0, i64::MAX, &db)
                .expect("active tasks should load")
                .is_empty()
        );
        assert_eq!(list_deleted_tasks(&db).expect("trash should load").len(), 1);

        let restored = restore_task(task.id, &db).expect("task should be restored");
        assert!(restored.deleted_at.is_none());
        assert_eq!(
            list_active_tasks(0, i64::MAX, &db)
                .expect("active tasks should load")
                .len(),
            1
        );
    }

    #[test]
    fn empty_titles_are_rejected_and_only_trash_can_be_purged() {
        let db = Database::in_memory().expect("database should initialize");
        assert!(create_task("  ".to_string(), &db).is_err());
        let task = create_task("Keep me".to_string(), &db).expect("task should be created");
        assert!(permanently_delete_task(task.id.clone(), &db).is_err());

        soft_delete_task(task.id.clone(), &db).expect("task should be deleted");
        permanently_delete_task(task.id.clone(), &db).expect("trash item should be purged");
        assert!(
            list_deleted_tasks(&db)
                .expect("trash should load")
                .is_empty()
        );
    }
}
