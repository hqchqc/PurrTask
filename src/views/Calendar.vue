<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useTaskStore } from '@/stores/task'
import type { Task } from '@/types/task'
import { APP_LOCALE } from '@/constants/app'
import { getLocalDateKey } from '@/utils/dateRange'

const taskStore = useTaskStore()
const visibleMonth = ref(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
const today = new Date()
const weekdayNames = ['日', '一', '二', '三', '四', '五', '六']
const monthFormatter = new Intl.DateTimeFormat(APP_LOCALE, {
  year: 'numeric',
  month: 'long',
})
const dayFormatter = new Intl.DateTimeFormat(APP_LOCALE, {
  month: 'long',
  day: 'numeric',
})

const monthRange = computed(() => {
  const firstDay = new Date(
    visibleMonth.value.getFullYear(),
    visibleMonth.value.getMonth(),
    1,
  )
  const start = new Date(
    firstDay.getFullYear(),
    firstDay.getMonth(),
    firstDay.getDate() - firstDay.getDay(),
  )
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 42)
  return { start: start.getTime(), end: end.getTime() }
})

const tasksByDate = computed(() => {
  const grouped = new Map<string, Task[]>()
  for (const task of taskStore.tasks) {
    const date = new Date(task.createdAt)
    const key = getLocalDateKey(date)
    const tasks = grouped.get(key) ?? []
    tasks.push(task)
    grouped.set(key, tasks)
  }
  return grouped
})

const calendarDays = computed(() => {
  const start = new Date(monthRange.value.start)
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + index)
    const key = getLocalDateKey(date)
    const dayTasks = tasksByDate.value.get(key) ?? []
    const isCurrentMonth = date.getMonth() === visibleMonth.value.getMonth()
    const isToday = date.getFullYear() === today.getFullYear()
      && date.getMonth() === today.getMonth()
      && date.getDate() === today.getDate()

    return {
      date,
      key,
      dayTasks,
      isCurrentMonth,
      isToday,
      visibleTasks: dayTasks.slice(0, 2),
      remainingCount: Math.max(0, dayTasks.length - 2),
    }
  })
})

const monthTotal = computed(() =>
  taskStore.tasks.filter((task) => {
    const date = new Date(task.createdAt)
    return date.getFullYear() === visibleMonth.value.getFullYear()
      && date.getMonth() === visibleMonth.value.getMonth()
  }).length,
)

async function loadVisibleMonth() {
  await taskStore.loadActiveTasks(monthRange.value.start, monthRange.value.end)
}

function changeMonth(offset: number) {
  visibleMonth.value = new Date(
    visibleMonth.value.getFullYear(),
    visibleMonth.value.getMonth() + offset,
    1,
  )
}

function showCurrentMonth() {
  visibleMonth.value = new Date(today.getFullYear(), today.getMonth(), 1)
}

watch(
  () => monthRange.value.start,
  () => {
    if (mounted.value) void loadVisibleMonth()
  },
)

const mounted = ref(false)
onMounted(() => {
  mounted.value = true
  void loadVisibleMonth()
})
</script>

<template>
  <main class="page-shell">
    <div class="page-content-wide">
      <section
        class="surface-card p-5 shadow-[0_6px_18px_var(--app-shadow-color)] max-[700px]:p-3"
        aria-label="任务日历"
      >
        <div class="mb-4 flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="calendar-nav"
              aria-label="上个月"
              @click="changeMonth(-1)"
            >
              ‹
            </button>
            <button
              type="button"
              class="calendar-nav"
              aria-label="下个月"
              @click="changeMonth(1)"
            >
              ›
            </button>
            <h2 class="m-0 ml-1 rounded-xl bg-[var(--app-input-bg)] px-3 py-1.5 text-base text-[var(--app-text-color)] font-800">
              {{ monthFormatter.format(visibleMonth) }}
            </h2>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs text-[var(--app-text-muted)] max-[460px]:hidden">
              {{ monthTotal }} 条记录
            </span>
            <button type="button" class="calendar-today" @click="showCurrentMonth">
              今天
            </button>
          </div>
        </div>

        <p v-if="taskStore.errorMessage" class="mb-3 text-sm text-red-600" role="alert">
          日历记录读取失败：{{ taskStore.errorMessage }}
        </p>
        <p v-else-if="taskStore.activeTasksLoading" class="mb-3 text-sm text-[var(--app-text-muted)]" role="status">
          正在读取本月记录…
        </p>

        <div class="calendar-grid" role="grid" :aria-label="monthFormatter.format(visibleMonth)">
          <div
            v-for="weekday in weekdayNames"
            :key="weekday"
            class="calendar-weekday"
            role="columnheader"
          >
            周{{ weekday }}
          </div>
          <article
            v-for="day in calendarDays"
            :key="day.key"
            class="calendar-day"
            :class="{
              'calendar-day-outside': !day.isCurrentMonth,
              'calendar-day-today': day.isToday,
            }"
            role="gridcell"
            :aria-label="`${dayFormatter.format(day.date)}，${day.dayTasks.length} 条记录`"
          >
            <div class="mb-2 flex items-center justify-between gap-1">
              <span class="calendar-date" :class="{ 'calendar-date-today': day.isToday }">
                {{ day.date.getDate() }}
              </span>
              <span
                v-if="day.dayTasks.length"
                class="text-[10px] text-[var(--app-text-muted)] tabular-nums"
              >
                {{ day.dayTasks.length }} 条
              </span>
            </div>

            <div class="flex flex-col gap-1">
              <div
                v-for="task in day.visibleTasks"
                :key="task.id"
                class="calendar-task"
                :class="{ 'calendar-task-done': task.done }"
                :title="task.title"
              >
                <span class="calendar-task-dot" :class="{ 'calendar-task-dot-done': task.done }" aria-hidden="true" />
                <span class="min-w-0 flex-1 truncate">{{ task.title }}</span>
              </div>
              <span v-if="day.remainingCount" class="pl-2 text-[10px] text-[var(--app-text-muted)]">
                还有 {{ day.remainingCount }} 条…
              </span>
            </div>
          </article>
        </div>
      </section>

      <div class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[var(--app-text-muted)]" aria-label="日历图例">
        <span class="inline-flex items-center gap-2">
          <span class="calendar-legend-dot calendar-task-dot-done" aria-hidden="true" />
          已完成
        </span>
        <span class="inline-flex items-center gap-2">
          <span class="calendar-legend-dot" aria-hidden="true" />
          待继续
        </span>
        <span>记录按创建日期归入日历</span>
      </div>
    </div>
  </main>
</template>

<style scoped>
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  overflow: hidden;
  border: 1px solid var(--app-border-color);
  border-radius: var(--app-radius);
  background:
    radial-gradient(circle, color-mix(in srgb, var(--app-text-muted) 13%, transparent) 1px, transparent 1.2px) 0 0 / 28px 28px,
    var(--app-surface-color);
}

.calendar-weekday {
  display: flex;
  min-height: 36px;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--app-border-color);
  color: var(--app-text-muted);
  font-size: 12px;
  font-weight: 700;
}

.calendar-day {
  min-width: 0;
  min-height: 122px;
  padding: 8px;
  border-right: 1px solid var(--app-border-color);
  border-bottom: 1px solid var(--app-border-color);
  background-color: color-mix(in srgb, var(--app-surface-color) 92%, transparent);
}

.calendar-day:nth-child(7n) {
  border-right: 0;
}

.calendar-day:nth-last-child(-n + 7) {
  border-bottom: 0;
}

.calendar-day-outside {
  background-color: color-mix(in srgb, var(--app-surface-muted-color) 52%, transparent);
}

.calendar-day-today {
  background-color: color-mix(in srgb, var(--primary-color) 5%, var(--app-surface-color));
}

.calendar-date {
  display: inline-flex;
  width: 27px;
  height: 27px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--app-text-color);
  font-size: 13px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.calendar-day-outside .calendar-date {
  color: var(--app-text-muted);
  opacity: 0.65;
}

.calendar-date-today {
  background: var(--primary-color);
  color: var(--app-ribbon-text) !important;
}

.calendar-task {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 5px;
  overflow: hidden;
  border-radius: 7px;
  padding: 3px 5px;
  background: var(--app-primary-soft);
  color: var(--app-text-secondary);
  font-size: 10px;
  line-height: 1.35;
}

.calendar-task-done {
  color: var(--app-text-muted);
  text-decoration: line-through;
  text-decoration-color: color-mix(in srgb, var(--primary-color) 65%, transparent);
}

.calendar-task-dot,
.calendar-legend-dot {
  width: 6px;
  height: 6px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: var(--app-text-muted);
}

.calendar-task-dot-done {
  background: var(--primary-color);
}

.calendar-legend-dot {
  width: 8px;
  height: 8px;
}

.calendar-nav,
.calendar-today {
  display: inline-flex;
  min-width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: var(--app-text-secondary);
  font-family: inherit;
  font-weight: 700;
  transition: background-color 150ms ease, color 150ms ease;
}

.calendar-nav {
  font-size: 26px;
  line-height: 1;
}

.calendar-today {
  padding: 0 11px;
  font-size: 12px;
}

.calendar-nav:hover,
.calendar-today:hover {
  background: var(--app-primary-soft);
  color: var(--primary-color);
}

.calendar-nav:focus-visible,
.calendar-today:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

@media (max-width: 700px) {
  .calendar-day {
    min-height: 96px;
    padding: 5px;
  }

  .calendar-task {
    padding: 3px;
    font-size: 9px;
  }
}

@media (max-width: 460px) {
  .calendar-day {
    min-height: 74px;
    padding: 3px;
  }

  .calendar-date {
    width: 22px;
    height: 22px;
    font-size: 11px;
  }

  .calendar-day > div:first-child {
    margin-bottom: 4px;
  }

  .calendar-task {
    gap: 3px;
    padding: 2px;
    font-size: 8px;
  }

  .calendar-task-dot {
    width: 4px;
    height: 4px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .calendar-nav,
  .calendar-today {
    transition: none;
  }
}
</style>
