<script setup lang="ts">
import ProgressBar from '@/components/ProgressBar.vue'

defineProps<{
  total: number
  completed: number
  pending: number
  progress: number
  activeDays: number
  mostActiveDay: string
  mostActiveCount: number
}>()
</script>

<template>
  <section
    class="surface-card mb-7 mt-[-12px] p-5 max-[700px]:p-4"
    aria-label="最近 7 天统计"
  >
    <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p class="m-0 text-xs text-[var(--app-text-muted)]">最近一周的完成情况</p>
        <p class="mb-0 mt-1 text-sm text-[var(--app-text-secondary)]">
          共记录 <strong class="text-[var(--app-text-color)]">{{ total }}</strong> 件事，
          完成率 <strong class="text-primary">{{ progress }}%</strong>
        </p>
      </div>
      <p class="m-0 text-xs text-[var(--app-text-muted)]">
        最活跃：<strong class="text-[var(--app-text-secondary)]">{{ mostActiveDay }}</strong>
        <span v-if="mostActiveCount">（{{ mostActiveCount }} 条）</span>
      </p>
    </div>

    <ProgressBar class="mb-5" :percent="progress" label="最近 7 天完成率" />

    <div class="grid grid-cols-4 gap-3 max-[460px]:grid-cols-2">
      <div class="rounded-[var(--app-radius)] bg-[var(--app-surface-muted-color)] px-3 py-2.5">
        <strong class="block text-lg text-[var(--app-text-color)] font-800 tabular-nums">{{ total }}</strong>
        <span class="text-xs text-[var(--app-text-muted)]">总记录</span>
      </div>
      <div class="rounded-[var(--app-radius)] bg-[var(--app-surface-muted-color)] px-3 py-2.5">
        <strong class="block text-lg text-primary font-800 tabular-nums">{{ completed }}</strong>
        <span class="text-xs text-[var(--app-text-muted)]">已完成</span>
      </div>
      <div class="rounded-[var(--app-radius)] bg-[var(--app-surface-muted-color)] px-3 py-2.5">
        <strong class="block text-lg text-[var(--app-text-color)] font-800 tabular-nums">{{ pending }}</strong>
        <span class="text-xs text-[var(--app-text-muted)]">待继续</span>
      </div>
      <div class="rounded-[var(--app-radius)] bg-[var(--app-surface-muted-color)] px-3 py-2.5">
        <strong class="block text-lg text-[var(--app-text-color)] font-800 tabular-nums">{{ activeDays }}<span class="ml-0.5 text-xs font-600">/ 7 天</span></strong>
        <span class="text-xs text-[var(--app-text-muted)]">有记录的天数</span>
      </div>
    </div>
  </section>
</template>
