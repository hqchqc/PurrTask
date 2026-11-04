<script setup lang="ts">
import { computed } from 'vue'
import { useNow } from '@vueuse/core'
import { APP_LOCALE } from '@/constants/app'

const weekdayFormatter = new Intl.DateTimeFormat(APP_LOCALE, { weekday: 'long' })
const monthDayFormatter = new Intl.DateTimeFormat(APP_LOCALE, {
  month: 'long',
  day: 'numeric',
})
const now = useNow()
const hour = computed(() => String(now.value.getHours()).padStart(2, '0'))
const minute = computed(() => String(now.value.getMinutes()).padStart(2, '0'))
const weekday = computed(() => weekdayFormatter.format(now.value))
const monthDay = computed(() => monthDayFormatter.format(now.value))
</script>

<template>
  <section
    class="today-clock surface-card inline-flex shrink-0 flex-col items-center gap-2.5 px-6 pb-[13px] pt-4 shadow-[0_2px_6px_var(--app-shadow-color)] max-[700px]:px-3.5 max-[700px]:pb-2.5 max-[700px]:pt-3 max-[700px]:min-w-0 max-[460px]:self-end max-[460px]:flex-row max-[460px]:gap-3"
    role="timer"
    aria-live="off"
    aria-label="当前时间和日期"
  >
    <div class="text-[40px] text-[var(--app-text-color)] font-900 tracking-[1px] leading-none tabular-nums max-[700px]:text-[30px] max-[460px]:text-[27px]">
      {{ hour }}<span class="clock-colon mx-0.5 inline-block">:</span>{{ minute }}
    </div>
    <div class="inline-flex items-center gap-[5px] rounded-[var(--app-radius-pill)] bg-[var(--app-primary-soft)] px-[13px] py-[5px] text-[12px] text-[var(--app-text-secondary)] font-700 whitespace-nowrap max-[460px]:gap-[3px] max-[460px]:px-[9px] max-[460px]:text-[11px]">
      <span class="text-primary font-800">{{ weekday }}</span>
      <span class="text-[var(--app-text-muted)]" aria-hidden="true">·</span>
      <span>{{ monthDay }}</span>
    </div>
  </section>
</template>

<style scoped>
.today-clock {
  animation: clock-fade-in var(--app-motion-slow) var(--app-motion-ease);
}

.clock-colon {
  transform: translateY(-0.1em);
  animation: clock-blink 1s step-end infinite;
}

@keyframes clock-fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes clock-blink {
  50% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .today-clock,
  .clock-colon {
    animation: none;
  }
}
</style>
