<script setup lang="ts">
import { computed, onMounted } from 'vue'
import TodayClock from '@/components/today/TodayClock.vue'
import TodayRecordComposer from '@/components/today/TodayRecordComposer.vue'
import TodaySummary from '@/components/today/TodaySummary.vue'
import TodayTimeline from '@/components/today/TodayTimeline.vue'
import TodayTitle from '@/components/today/TodayTitle.vue'
import TypewriterText from '@/components/TypewriterText.vue'
import { useTaskStore } from '@/stores/task'
import { getLocalDateRange } from '@/utils/dateRange'
import { getTaskStats } from '@/utils/taskStats'

const taskStore = useTaskStore()
const todayRange = getLocalDateRange(1)

const todayTasks = computed(() => taskStore.tasks)
const stats = computed(() => getTaskStats(todayTasks.value))

function addTask(title: string) {
  return taskStore.addTask(title)
}

onMounted(() => taskStore.loadActiveTasks(todayRange.start, todayRange.end))
</script>

<template>
  <main class="page-shell">
    <div class="page-content">
      <header class="mb-8 flex items-center justify-between gap-6 max-[700px]:mb-6 max-[700px]:items-start max-[460px]:flex-col max-[460px]:gap-5">
        <div class="min-w-0">
          <TodayTitle />
          <p class="mb-0 mt-[18px] min-h-[1.5em] text-[14px] text-[var(--app-text-secondary)] tracking-[0.02em]">
            <TypewriterText text="给自己一点时间，把今天过成喜欢的样子。" />
          </p>
        </div>
        <TodayClock />
      </header>

      <TodaySummary
        :total="stats.total"
        :completed="stats.completed"
        :pending="stats.pending"
        :progress="stats.progress"
      />

      <p v-if="taskStore.errorMessage" class="mb-4 text-sm text-red-600" role="alert">
        任务数据读取或保存失败：{{ taskStore.errorMessage }}
      </p>
      <p v-else-if="taskStore.activeTasksLoading && !todayTasks.length" class="mb-4 text-sm text-[var(--app-text-muted)]" role="status">
        正在读取今天的记录…
      </p>

      <section
        class="surface-card p-5 shadow-[0_3px_12px_var(--app-shadow-color)] max-[700px]:p-4"
        aria-labelledby="records-title"
      >
        <div class="mb-[18px] flex items-end justify-between gap-4">
          <div>
            <p class="mb-[5px] mt-0 text-[10px] text-[var(--app-text-muted)] font-800 tracking-[1.5px]">
              LITTLE THINGS MATTER
            </p>
            <h2
              id="records-title"
              class="m-0 text-[19px] text-[var(--app-text-color)] font-800 tracking-[0.01em] max-[460px]:text-[17px]"
            >
              今天做了什么
            </h2>
          </div>
          <span
            class="rounded-[var(--app-radius-pill)] bg-[var(--app-surface-muted-color)] px-3 py-1.5 text-[12px] text-[var(--app-text-secondary)] font-700 whitespace-nowrap"
          >
            {{ stats.total }} 条记录
          </span>
        </div>

        <TodayRecordComposer :submit-task="addTask" />
        <TodayTimeline
          v-if="!taskStore.activeTasksLoading || todayTasks.length"
          :tasks="todayTasks"
          @toggle="taskStore.toggleTask"
          @remove="taskStore.removeTask"
        />
      </section>
    </div>
  </main>
</template>
