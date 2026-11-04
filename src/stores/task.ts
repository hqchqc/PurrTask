import { defineStore } from "pinia";
import { taskRepository } from "@/repositories/taskRepository";
import type { Task } from "@/types/task";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function sortNewestFirst(tasks: Task[]) {
  return [...tasks].sort((a, b) => b.createdAt - a.createdAt);
}

export const useTaskStore = defineStore("task", {
  state() {
    return {
      tasks: [] as Task[],
      deletedTasks: [] as Task[],
      activeRange: null as { start: number; end: number } | null,
      activeLoadRequestId: 0,
      deletedLoadRequestId: 0,
      activeTasksLoading: false,
      deletedTasksLoading: false,
      errorMessage: null as string | null,
      pendingPermanentDeleteId: null as string | null,
    };
  },
  actions: {
    async loadActiveTasks(start: number, end: number) {
      const rangeChanged =
        this.activeRange?.start !== start || this.activeRange?.end !== end;
      const requestId = ++this.activeLoadRequestId;
      this.activeTasksLoading = true;
      this.errorMessage = null;
      this.activeRange = { start, end };
      if (rangeChanged) {
        this.tasks = [];
      }

      try {
        const tasks = await taskRepository.listActive(start, end);
        if (requestId === this.activeLoadRequestId) {
          this.tasks = sortNewestFirst(tasks);
        }
      } catch (error) {
        if (requestId === this.activeLoadRequestId) {
          this.errorMessage = getErrorMessage(error);
        }
      } finally {
        if (requestId === this.activeLoadRequestId) {
          this.activeTasksLoading = false;
        }
      }
    },
    async loadDeletedTasks() {
      const requestId = ++this.deletedLoadRequestId;
      this.deletedTasksLoading = true;
      this.errorMessage = null;

      try {
        const tasks = await taskRepository.listDeleted();
        if (requestId === this.deletedLoadRequestId) {
          this.deletedTasks = tasks;
        }
      } catch (error) {
        if (requestId === this.deletedLoadRequestId) {
          this.errorMessage = getErrorMessage(error);
        }
      } finally {
        if (requestId === this.deletedLoadRequestId) {
          this.deletedTasksLoading = false;
        }
      }
    },
    async addTask(title: string) {
      this.errorMessage = null;
      try {
        const task = await taskRepository.create(title);
        if (
          this.activeRange &&
          task.createdAt >= this.activeRange.start &&
          task.createdAt < this.activeRange.end
        ) {
          this.tasks = sortNewestFirst([...this.tasks, task]);
        }
        return true;
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
        return false;
      }
    },
    async toggleTask(taskId: string, done: boolean) {
      this.errorMessage = null;
      try {
        const updatedTask = await taskRepository.setDone(taskId, done);
        this.tasks = this.tasks.map((task) => task.id === taskId ? updatedTask : task);
      } catch (error) {
        const operationError = getErrorMessage(error);
        this.errorMessage = operationError;
        await this.reloadActiveRange();
        this.errorMessage = this.errorMessage && this.errorMessage !== operationError
          ? `${operationError}; refresh failed: ${this.errorMessage}`
          : operationError;
      }
    },
    async removeTask(taskId: string) {
      this.errorMessage = null;
      try {
        const deletedTask = await taskRepository.softDelete(taskId);
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
        this.deletedTasks = sortNewestFirst([deletedTask, ...this.deletedTasks]);
      } catch (error) {
        const operationError = getErrorMessage(error);
        this.errorMessage = operationError;
        await this.reloadActiveRange();
        this.errorMessage = this.errorMessage && this.errorMessage !== operationError
          ? `${operationError}; refresh failed: ${this.errorMessage}`
          : operationError;
      }
    },
    async restoreTask(taskId: string) {
      this.errorMessage = null;
      try {
        const task = await taskRepository.restore(taskId);
        this.deletedTasks = this.deletedTasks.filter((item) => item.id !== taskId);
        if (
          this.activeRange &&
          task.createdAt >= this.activeRange.start &&
          task.createdAt < this.activeRange.end
        ) {
          this.tasks = sortNewestFirst([...this.tasks, task]);
        }
      } catch (error) {
        const operationError = getErrorMessage(error);
        this.errorMessage = operationError;
        await this.loadDeletedTasks();
        this.errorMessage = this.errorMessage && this.errorMessage !== operationError
          ? `${operationError}; refresh failed: ${this.errorMessage}`
          : operationError;
      }
    },
    async permanentlyDeleteTask(taskId: string) {
      this.errorMessage = null;
      try {
        await taskRepository.permanentlyDelete(taskId);
        this.deletedTasks = this.deletedTasks.filter((task) => task.id !== taskId);
        this.pendingPermanentDeleteId = null;
      } catch (error) {
        this.errorMessage = getErrorMessage(error);
      }
    },
    async reloadActiveRange() {
      if (this.activeRange) {
        await this.loadActiveTasks(this.activeRange.start, this.activeRange.end);
      }
    },
  },
});
