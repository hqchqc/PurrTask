<script setup lang="ts">
import { ref, TransitionGroup } from 'vue'
import SplashEffect from '@/components/SplashEffect.vue'
import { APP_LOCALE } from '@/constants/app'
import type { Task } from '@/types/task'

withDefaults(defineProps<{
  tasks: Task[]
  showDate?: boolean
  readOnly?: boolean
  showRemove?: boolean
  emptyTitle?: string
  emptyDescription?: string
}>(), {
  readOnly: false,
  showRemove: true,
})

const emit = defineEmits<{
  toggle: [taskId: string, done: boolean]
  remove: [taskId: string]
}>()

const splashTaskId = ref<string | null>(null)
const splashTrigger = ref(0)
const taskTimeFormatter = new Intl.DateTimeFormat(APP_LOCALE, {
  hour: '2-digit',
  minute: '2-digit',
})
const taskDateTimeFormatter = new Intl.DateTimeFormat(APP_LOCALE, {
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

function toggleTask(taskId: string, checked: boolean) {
  if (checked) {
    splashTaskId.value = taskId
    splashTrigger.value += 1
  } else {
    splashTaskId.value = null
  }

  emit('toggle', taskId, checked)
}

function finishSplash(taskId: string, trigger: number) {
  if (splashTaskId.value === taskId && splashTrigger.value === trigger) {
    splashTaskId.value = null
  }
}

function formatTaskTime(timestamp: number, showDate = false) {
  return (showDate ? taskDateTimeFormatter : taskTimeFormatter).format(timestamp)
}
</script>

<template>
  <div v-if="tasks.length" class="px-0.5 py-1">
    <TransitionGroup
      tag="div"
      class="today-timeline"
      :class="{ 'today-timeline-with-date': showDate }"
      enter-from-class="record-enter-from"
      enter-active-class="record-transition"
      leave-to-class="record-leave-to"
      leave-active-class="record-transition record-leave-active"
      move-class="record-transition"
    >
      <article
        v-for="task in tasks"
        :key="task.id"
        class="timeline-row group"
        :class="{ 'timeline-row-completed': task.done }"
      >
        <time
          class="timeline-time"
          :datetime="new Date(task.createdAt).toISOString()"
        >
          {{ formatTaskTime(task.createdAt, showDate) }}
        </time>
        <span class="timeline-node" aria-hidden="true">
          <span class="timeline-node-core" />
        </span>
        <div class="timeline-card">
          <span
            v-if="!readOnly"
            class="timeline-check-target"
          >
            <SplashEffect
              :trigger="splashTaskId === task.id ? splashTrigger : 0"
              @finished="finishSplash(task.id, $event)"
            />
            <n-checkbox
              class="timeline-checkbox"
              :checked="task.done"
              size="large"
              :aria-label="`${task.done ? '标记为未完成' : '标记为已完成'}：${task.title}`"
              @update:checked="toggleTask(task.id, $event)"
            />
          </span>
          <div class="min-w-0 flex-1">
            <p
              class="m-0 break-all text-[14px] text-[var(--app-text-color)] font-600 transition-colors duration-150"
              :class="{ 'text-[var(--app-text-muted)] line-through': task.done }"
            >
              {{ task.title }}
            </p>
            <span
              class="mt-1 inline-block text-[11px] text-[var(--app-text-muted)]"
              :class="{ 'text-primary font-700': task.done }"
            >
              {{ task.done ? '完成啦，做得真棒' : '正在进行中' }}
            </span>
          </div>
          <n-button
            v-if="showRemove && !readOnly"
            class="opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-visible:opacity-100 max-[700px]:opacity-100"
            quaternary
            size="small"
            type="error"
            :aria-label="`删除记录：${task.title}`"
            @click="emit('remove', task.id)"
          >
            删除
          </n-button>
        </div>
      </article>
    </TransitionGroup>
  </div>
  <div
    v-else
    class="flex min-h-[190px] flex-col items-center justify-center rounded-[var(--app-radius-lg)] border border-dashed border-[var(--app-border-color)] bg-[var(--app-surface-color)] p-[26px] text-center"
  >
    <span
      class="mb-3 h-[24px] w-[24px] border-[5px] border-[var(--app-primary-soft-solid)] rounded-full bg-primary shadow-[0_0_0_4px_var(--app-primary-soft)]"
      aria-hidden="true"
    />
    <p class="m-0 text-[14px] text-[var(--app-text-color)] font-800">
      {{ $props.emptyTitle ?? '今天的故事还没开始' }}
    </p>
    <p class="mb-0 mt-1.5 text-[12px] text-[var(--app-text-muted)]">
      {{ $props.emptyDescription ?? '记下一件小事，让它成为今天的第一个小小成就。' }}
    </p>
  </div>
</template>

<style scoped>
.today-timeline {
  --timeline-time-width: 72px;
  --timeline-node-width: 42px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.today-timeline::before {
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

.today-timeline-with-date {
  --timeline-time-width: 100px;
}

.timeline-row {
  position: relative;
  display: grid;
  grid-template-columns: var(--timeline-time-width) var(--timeline-node-width) minmax(0, 1fr);
  align-items: center;
}

.timeline-time {
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

.timeline-node {
  z-index: 1;
  display: grid;
  width: 22px;
  height: 22px;
  place-items: center;
  justify-self: center;
  border: 2px solid color-mix(in srgb, var(--app-text-muted) 35%, var(--app-surface-color));
  border-radius: 50%;
  background: var(--app-surface-color);
  box-shadow: 0 2px 0 var(--app-button-shadow);
}

.timeline-node-core {
  box-sizing: border-box;
  width: 10px;
  height: 10px;
  border: 1.5px solid color-mix(in srgb, var(--app-text-muted) 42%, var(--app-surface-color));
  border-radius: 50%;
  background: var(--app-surface-color);
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    background-color 180ms ease;
}

.timeline-row:hover .timeline-node {
  border-color: color-mix(in srgb, var(--primary-color) 45%, var(--app-surface-color));
}

.timeline-row:hover .timeline-node-core {
  border-color: color-mix(in srgb, var(--primary-color) 65%, var(--app-surface-color));
}

.timeline-row-completed .timeline-node-core {
  transform: scale(1.25);
  border-color: var(--app-success-color);
  background: var(--app-success-color);
}

.timeline-card {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 12px;
  padding: 9px 14px 9px 9px;
  border: 1px solid var(--app-border-color);
  border-radius: var(--app-radius);
  background: var(--app-surface-color);
  box-shadow: 0 3px 0 color-mix(in srgb, var(--app-button-shadow) 62%, transparent);
  transition:
    border-color 150ms ease,
    box-shadow 150ms ease,
    transform 150ms ease;
}

.timeline-row:hover .timeline-card {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--primary-color) 48%, var(--app-border-color));
  box-shadow: 0 5px 0 color-mix(in srgb, var(--app-button-shadow) 62%, transparent);
}

.timeline-row:active .timeline-card {
  transform: translateY(1px);
  box-shadow: 0 1px 0 color-mix(in srgb, var(--app-button-shadow) 62%, transparent);
}

.timeline-check-target {
  position: relative;
  display: flex;
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: transparent;
  cursor: pointer;
  transition: background-color 150ms ease, transform 150ms ease;
}

.timeline-check-target:hover {
  transform: translateY(-1px);
  background: color-mix(in srgb, var(--primary-color) 8%, var(--app-surface-color));
}

.timeline-check-target:focus-within {
  background: color-mix(in srgb, var(--primary-color) 10%, var(--app-surface-color));
}

.record-enter-from,
.record-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.record-transition {
  transition: all var(--app-motion) var(--app-motion-ease);
}

.record-leave-active {
  position: absolute;
  width: 100%;
}

.timeline-checkbox {
  --n-size: 22px;
  display: flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
}

.timeline-checkbox :deep(.n-checkbox__input-box) {
  border-radius: 50%;
  transition:
    background-color 150ms ease,
    border-color 150ms ease,
    box-shadow 150ms ease;
}

@media (max-width: 700px) {
  .today-timeline {
    --timeline-time-width: 48px;
    --timeline-node-width: 40px;
  }

  .today-timeline-with-date {
    --timeline-time-width: 76px;
  }
}

@media (max-width: 460px) {
  .today-timeline {
    --timeline-time-width: 40px;
    --timeline-node-width: 38px;
  }

  .today-timeline-with-date {
    --timeline-time-width: 68px;
  }

  .timeline-time {
    padding: 4px 5px;
    font-size: 10px;
  }

  .timeline-card {
    gap: 8px;
    padding-right: 8px;
  }
}
</style>
