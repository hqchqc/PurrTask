<script setup lang="ts">
import { onMounted } from 'vue'
import TodayTitle from '@/components/today/TodayTitle.vue'
import TypewriterText from '@/components/TypewriterText.vue'
import { useTaskStore } from '@/stores/task'
import { APP_LOCALE } from '@/constants/app'

const taskStore = useTaskStore()
const deletedAtFormatter = new Intl.DateTimeFormat(APP_LOCALE, {
  dateStyle: 'medium',
  timeStyle: 'short',
})

onMounted(() => taskStore.loadDeletedTasks())
</script>

<template>
  <main class="page-shell">
    <div class="page-content">
      <header class="mb-8">
        <TodayTitle title="垃圾桶" />
        <p class="mb-0 mt-[18px] min-h-[1.5em] text-sm text-[var(--app-text-secondary)]">
          <TypewriterText text="删除的记录会保留在这里，你可以恢复或永久删除。" />
        </p>
      </header>

      <p v-if="taskStore.errorMessage" class="mb-4 text-sm text-red-600" role="alert">
        垃圾桶数据操作失败：{{ taskStore.errorMessage }}
      </p>
      <p v-else-if="taskStore.deletedTasksLoading && !taskStore.deletedTasks.length" class="mb-4 text-sm text-[var(--app-text-muted)]" role="status">
        正在读取垃圾桶…
      </p>

      <section v-if="taskStore.deletedTasks.length" class="flex flex-col gap-3" aria-label="已删除记录">
        <article
          v-for="task in taskStore.deletedTasks"
          :key="task.id"
          class="flex items-center gap-4 rounded-[var(--app-radius)] border border-[var(--app-border-color)] bg-[var(--app-surface-color)] px-5 py-4 max-[460px]:flex-wrap"
        >
          <div class="min-w-0 flex-1">
            <p class="m-0 break-all text-sm text-[var(--app-text-color)] font-600">{{ task.title }}</p>
            <p class="mb-0 mt-1 text-xs text-[var(--app-text-muted)]">
              删除于 {{ task.deletedAt === null ? '未知时间' : deletedAtFormatter.format(task.deletedAt) }}
            </p>
          </div>
          <n-button quaternary type="primary" @click="taskStore.restoreTask(task.id)">
            恢复
          </n-button>
          <n-button
            v-if="taskStore.pendingPermanentDeleteId !== task.id"
            quaternary
            type="error"
            @click="taskStore.pendingPermanentDeleteId = task.id"
          >
            永久删除
          </n-button>
          <template v-else>
            <span class="text-xs text-[var(--app-text-secondary)]">确定永久删除？</span>
            <n-button quaternary type="error" @click="taskStore.permanentlyDeleteTask(task.id)">
              确认
            </n-button>
            <n-button quaternary @click="taskStore.pendingPermanentDeleteId = null">
              取消
            </n-button>
          </template>
        </article>
      </section>
      <div
        v-else-if="!taskStore.deletedTasksLoading && !taskStore.errorMessage"
        class="flex min-h-[190px] items-center justify-center rounded-[var(--app-radius-lg)] border border-dashed border-[var(--app-border-color)] bg-[var(--app-surface-color)] text-sm text-[var(--app-text-muted)]"
      >
        垃圾桶是空的
      </div>
    </div>
  </main>
</template>
