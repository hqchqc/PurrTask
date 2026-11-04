import type { Task } from '@/types/task'

export function getTaskStats(tasks: readonly Task[]) {
  const completed = tasks.filter((task) => task.done).length
  const total = tasks.length

  return {
    total,
    completed,
    pending: total - completed,
    progress: total ? Math.round((completed / total) * 100) : 0,
  }
}
