<script setup lang="ts">
import { computed, onMounted } from 'vue'
import TodayTitle from '@/components/today/TodayTitle.vue'
import TypewriterText from '@/components/TypewriterText.vue'
import WeekSummary from '@/components/week/WeekSummary.vue'
import { useTaskStore } from '@/stores/task'
import { getLocalDateKey, getPreviousWeekRange } from '@/utils/dateRange'
import type { Task } from '@/types/task'
import { APP_LOCALE } from '@/constants/app'
import { getTaskStats } from '@/utils/taskStats'

const taskStore = useTaskStore()
const range = getPreviousWeekRange()
const tasks = computed(() => taskStore.tasks)
const stats = computed(() => getTaskStats(tasks.value))
const dateFormatter = new Intl.DateTimeFormat(APP_LOCALE, {
  month: 'long',
  day: 'numeric',
})
const rangeDateFormatter = new Intl.DateTimeFormat(APP_LOCALE, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})
const weekdayFormatter = new Intl.DateTimeFormat(APP_LOCALE, { weekday: 'long' })
const timeFormatter = new Intl.DateTimeFormat(APP_LOCALE, {
  hour: '2-digit',
  minute: '2-digit',
})
const dateRangeLabel = `${rangeDateFormatter.format(range.start)} - ${rangeDateFormatter.format(range.end - 1)}`
const days = computed(() => {
  const groupedTasks = new Map<string, Task[]>()
  for (const task of tasks.value) {
    const date = new Date(task.createdAt)
    const key = getLocalDateKey(date)
    const group = groupedTasks.get(key) ?? []
    group.push(task)
    groupedTasks.set(key, group)
  }

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(range.start)
    date.setDate(date.getDate() + index)
    const key = getLocalDateKey(date)
    const dayTasks = (groupedTasks.get(key) ?? []).sort((a, b) => a.createdAt - b.createdAt)
    const completed = dayTasks.filter((task) => task.done).length
    const total = dayTasks.length

    return {
      key,
      date,
      tasks: dayTasks,
      total,
      completed,
      pending: total - completed,
      label: `${dateFormatter.format(date)} ${weekdayFormatter.format(date)}`,
    }
  })
})
const activeDays = computed(() => days.value.filter((day) => day.total > 0).length)
const mostActiveDay = computed(() =>
  days.value.reduce((best, day) => day.total > best.total ? day : best, days.value[0]),
)

function formatTaskTime(timestamp: number) {
  return timeFormatter.format(timestamp)
}

onMounted(() => taskStore.loadActiveTasks(range.start, range.end))
</script>

<template>
  <main class="page-shell">
    <div class="page-content">
      <header class="mb-8">
        <TodayTitle title="最近 7 天" />
        <p class="mb-0 mt-[18px] min-h-[1.5em] text-sm text-[var(--app-text-secondary)]">
          <TypewriterText :text="`${dateRangeLabel} · 上周完成的记录`" />
        </p>
      </header>

      <WeekSummary
        :total="stats.total"
        :completed="stats.completed"
        :pending="stats.pending"
        :progress="stats.progress"
        :active-days="activeDays"
        :most-active-day="mostActiveDay.total ? mostActiveDay.label : '暂无'"
        :most-active-count="mostActiveDay.total"
      />

      <p v-if="taskStore.errorMessage" class="mb-4 text-sm text-red-600" role="alert">
        任务数据读取或保存失败：{{ taskStore.errorMessage }}
      </p>
      <p v-else-if="taskStore.activeTasksLoading && !tasks.length" class="mb-4 text-sm text-[var(--app-text-muted)]" role="status">
        正在读取上周的记录…
      </p>

      <section
        v-if="!taskStore.activeTasksLoading || tasks.length"
        class="flex flex-col gap-5"
        aria-label="上周每日记录"
      >
        <article
          v-for="day in days"
          :key="day.key"
          class="week-day"
          :aria-label="`${day.label}的任务`"
        >
          <header class="week-day-heading">
            <strong class="week-day-number">{{ day.date.getDate() }}</strong>
            <div class="min-w-0">
              <h2 class="m-0 text-sm text-[var(--app-text-color)] font-800">
                {{ weekdayFormatter.format(day.date) }}
              </h2>
              <span class="text-xs text-[var(--app-text-muted)]">{{ dateFormatter.format(day.date) }}</span>
            </div>
          </header>

          <div v-if="day.total" class="week-day-timeline">
            <article
              v-for="task in day.tasks"
              :key="task.id"
              class="week-task"
              :class="task.done ? 'week-task-completed' : 'week-task-pending'"
            >
              <time
                class="week-task-time"
                :datetime="new Date(task.createdAt).toISOString()"
              >
                {{ formatTaskTime(task.createdAt) }}
              </time>
              <span class="week-task-node" aria-hidden="true">
                <span class="week-task-node-core">
                  <span v-if="task.done" class="i-line-md:confirm h-3 w-3" />
                </span>
              </span>
              <div class="week-task-card">
                <p
                  class="m-0 break-words text-sm font-700"
                  :class="task.done ? 'text-[var(--app-text-secondary)] line-through decoration-[var(--app-success-color)]/45' : 'text-[var(--app-text-color)]'"
                >
                  {{ task.title }}
                </p>
                <span class="week-task-status" :class="task.done ? 'week-task-status-completed' : 'week-task-status-pending'">
                  {{ task.done ? '已完成' : '未完成' }}
                </span>
              </div>
            </article>
          </div>
          <p v-else class="week-day-empty">
            这一天还没有记录
          </p>

        </article>
      </section>
    </div>
  </main>
</template>

<style scoped>
.week-day {
  display: grid;
  grid-template-columns: 132px minmax(0, 1fr);
  gap: 12px 20px;
  padding: 20px;
  border: 1px solid var(--app-border-color);
  border-radius: var(--app-radius-lg);
  background: var(--app-surface-color);
}

.week-day-heading {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding-top: 8px;
}

.week-day-number {
  color: var(--primary-color);
  font-size: 30px;
  font-weight: 800;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.week-day-timeline {
  --timeline-time-width: 72px;
  --timeline-node-width: 42px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.week-day-timeline::before {
  position: absolute;
  top: 28px;
  bottom: 28px;
  left: calc(var(--timeline-time-width) + var(--timeline-node-width) / 2);
  width: 2px;
  background: repeating-linear-gradient(
    to bottom,
    color-mix(in srgb, var(--primary-color) 38%, var(--app-border-color)) 0 5px,
    transparent 5px 10px
  );
  content: "";
}

.week-task {
  position: relative;
  display: grid;
  grid-template-columns: var(--timeline-time-width) var(--timeline-node-width) minmax(0, 1fr);
  align-items: center;
}

.week-task-time {
  justify-self: end;
  padding: 5px 8px;
  border: 1px solid color-mix(in srgb, var(--app-border-color) 75%, transparent);
  border-radius: var(--app-radius-pill);
  background: color-mix(in srgb, var(--app-surface-muted-color) 72%, transparent);
  color: var(--app-text-muted);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.week-task-node {
  z-index: 1;
  display: grid;
  width: 22px;
  height: 22px;
  place-items: center;
  justify-self: center;
  border: 2px solid color-mix(in srgb, var(--primary-color) 30%, var(--app-surface-color));
  border-radius: 50%;
  background: var(--app-surface-color);
  box-shadow: 0 2px 0 var(--app-button-shadow);
}

.week-task-node-core {
  display: grid;
  width: 10px;
  height: 10px;
  place-items: center;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  transition:
    width 180ms ease,
    height 180ms ease,
    background-color 180ms ease;
}

.week-task-completed .week-task-node-core {
  width: 18px;
  height: 18px;
  background: var(--app-success-color);
}

.week-task-pending .week-task-node-core {
  background: var(--primary-color);
}

.week-task-card {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 11px 14px;
  border: 1px solid var(--app-border-color);
  border-radius: var(--app-radius);
  background: var(--app-surface-color);
  box-shadow: 0 3px 0 color-mix(in srgb, var(--app-button-shadow) 62%, transparent);
  transition:
    border-color 150ms ease,
    box-shadow 150ms ease,
    transform 150ms ease;
}

.week-task:hover .week-task-card {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--primary-color) 48%, var(--app-border-color));
  box-shadow: 0 5px 0 color-mix(in srgb, var(--app-button-shadow) 62%, transparent);
}

.week-task:active .week-task-card {
  transform: translateY(1px);
  box-shadow: 0 1px 0 color-mix(in srgb, var(--app-button-shadow) 62%, transparent);
}

.week-task-completed .week-task-card {
  border-color: color-mix(in srgb, var(--app-success-color) 24%, var(--app-border-color));
  background: color-mix(in srgb, var(--app-success-color) 4%, var(--app-surface-color));
}

.week-task-completed .week-task-card p {
  color: var(--app-text-muted);
  text-decoration-color: color-mix(in srgb, var(--app-success-color) 45%, transparent);
}

.week-task-pending .week-task-card p {
  color: var(--app-text-color);
}

.week-task-status {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  margin: 0;
  padding: 4px 9px;
  border-radius: var(--app-radius-pill);
  font-size: 10px;
  font-weight: 800;
}

.week-task-status-completed {
  background: color-mix(in srgb, var(--app-success-color) 14%, var(--app-surface-color));
  color: var(--app-success-color);
}

.week-task-status-pending {
  background: color-mix(in srgb, var(--primary-color) 10%, var(--app-surface-color));
  color: var(--primary-color);
}

.week-day-empty {
  grid-column: 2;
  margin: 0;
  padding: 16px;
  border: 1px dashed var(--app-border-color);
  border-radius: var(--app-radius);
  color: var(--app-text-muted);
  font-size: 13px;
}

@media (max-width: 700px) {
  .week-day-timeline {
    --timeline-time-width: 48px;
    --timeline-node-width: 40px;
  }

  .week-day-timeline::before {
    top: 28px;
    bottom: 28px;
  }

  .week-task {
    min-width: 0;
  }

  .week-task-card {
    gap: 8px;
    padding: 10px 9px;
  }

  .week-day-empty {
    grid-column: 1;
  }
}

@media (max-width: 460px) {
  .week-day-timeline {
    --timeline-time-width: 40px;
    --timeline-node-width: 38px;
  }

  .week-task-time {
    padding: 4px 5px;
    font-size: 10px;
  }

  .week-task-card {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
  }
}

@media (max-width: 700px) {
  .week-day {
    grid-template-columns: 1fr;
    gap: 14px;
    padding: 16px;
  }

  .week-day-heading {
    align-items: center;
    padding-top: 0;
  }

  .week-day-number {
    font-size: 26px;
  }
}
</style>
