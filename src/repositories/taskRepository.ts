import { invoke } from '@tauri-apps/api/core'
import type { Task } from '@/types/task'

export const taskRepository = {
  listActive(start: number, end: number) {
    return invoke<Task[]>('list_active_tasks', { start, end })
  },

  listDeleted() {
    return invoke<Task[]>('list_deleted_tasks')
  },

  create(title: string) {
    return invoke<Task>('create_task', { title })
  },

  setDone(taskId: string, done: boolean) {
    return invoke<Task>('set_task_done', { taskId, done })
  },

  softDelete(taskId: string) {
    return invoke<Task>('soft_delete_task', { taskId })
  },

  restore(taskId: string) {
    return invoke<Task>('restore_task', { taskId })
  },

  permanentlyDelete(taskId: string) {
    return invoke<void>('permanently_delete_task', { taskId })
  },
}
