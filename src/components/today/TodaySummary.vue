<script setup lang="ts">
import ProgressBar from '@/components/ProgressBar.vue'

defineProps<{
  total: number
  completed: number
  pending: number
  progress: number
}>()
</script>

<template>
  <section
    class="mb-7 mt-[-12px] flex items-center gap-[22px] rounded-[var(--app-radius)] border border-[var(--app-border-color)] bg-[var(--app-surface-color)] px-[18px] py-3.5 max-[700px]:gap-3 max-[700px]:px-3 max-[700px]:py-[13px] max-[460px]:grid max-[460px]:grid-cols-3 max-[460px]:gap-3"
    aria-label="今日统计"
  >
    <div class="min-w-[90px] flex-1 max-[460px]:col-span-3">
      <div class="mb-[7px] flex items-center justify-between gap-2.5 text-[11px]">
        <span class="text-[var(--app-text-muted)]">今日完成度</span>
        <strong class="text-primary text-[12px] tabular-nums">{{ progress }}%</strong>
      </div>
      <ProgressBar :percent="progress" label="今日完成度" />
    </div>
    <div class="flex min-w-12 flex-col items-center gap-0.5">
      <strong class="text-[15px] text-[var(--app-text-color)] font-800 leading-none tabular-nums">{{ total }}</strong>
      <span class="text-[10px] text-[var(--app-text-muted)] whitespace-nowrap">条记录</span>
    </div>
    <div class="flex min-w-12 flex-col items-center gap-0.5">
      <strong class="text-[15px] text-[var(--app-text-color)] font-800 leading-none tabular-nums">{{ completed }}</strong>
      <span class="text-[10px] text-[var(--app-text-muted)] whitespace-nowrap">已完成</span>
    </div>
    <div class="flex min-w-12 flex-col items-center gap-0.5">
      <strong class="text-[15px] text-[var(--app-text-color)] font-800 leading-none tabular-nums">{{ pending }}</strong>
      <span class="text-[10px] text-[var(--app-text-muted)] whitespace-nowrap">待继续</span>
    </div>
  </section>
</template>
