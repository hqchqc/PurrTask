<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useThemeStore } from '@/stores/theme'
import {
  getProgressBackground,
  type ProgressBackgroundId,
} from '@/theme/progressBackgrounds'

const props = withDefaults(defineProps<{
  percent: number
  label: string
  height?: number
  appearance?: ProgressBackgroundId
}>(), {
  height: 24,
})

const themeStore = useThemeStore()
const trackElement = ref<HTMLElement | null>(null)
const trackWidth = ref(0)
let resizeObserver: ResizeObserver | undefined

const safePercent = computed(() => {
  if (!Number.isFinite(props.percent)) return 0
  return Math.min(100, Math.max(0, Math.round(props.percent)))
})

const selectedAppearance = computed(() =>
  getProgressBackground(props.appearance ?? themeStore.selectedProgressBackground),
)

const isSceneAppearance = computed(() => Boolean(selectedAppearance.value.image))

const progressStyle = computed(() => ({
  '--progress-fill-width': `${safePercent.value}%`,
  '--progress-scene-size': trackWidth.value > 0 ? `${trackWidth.value}px auto` : '100% auto',
  backgroundImage: isSceneAppearance.value ? selectedAppearance.value.image : undefined,
}))

onMounted(() => {
  const element = trackElement.value
  if (!element)
    return

  const updateWidth = () => {
    trackWidth.value = element.clientWidth
  }

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(updateWidth)
    resizeObserver.observe(element)
  }
  updateWidth()
})

onUnmounted(() => resizeObserver?.disconnect())
</script>

<template>
  <div
    ref="trackElement"
    class="progress-track"
    :style="{ '--progress-height': `${height}px` }"
    role="progressbar"
    :aria-valuenow="safePercent"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-label="label"
  >
    <span
      class="progress-fill"
      :class="{
        'progress-fill-scene': isSceneAppearance,
        'progress-fill-wave': selectedAppearance.wave,
      }"
      :style="progressStyle"
      aria-hidden="true"
    >
      <span v-if="selectedAppearance.wave" class="progress-wave" />
    </span>
  </div>
</template>

<style scoped>
.progress-track {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: var(--progress-height);
  overflow: hidden;
  border: 2px solid color-mix(in srgb, var(--app-border-color) 85%, var(--app-text-muted));
  border-radius: var(--app-radius-pill);
  background:
    radial-gradient(circle, color-mix(in srgb, var(--app-text-muted) 16%, transparent) 1px, transparent 1.2px) 5px 5px / 12px 12px,
    var(--app-surface-muted-color);
}

.progress-fill {
  position: absolute;
  inset: 0;
  right: auto;
  width: var(--progress-fill-width);
  max-width: 100%;
  overflow: hidden;
  border-radius: inherit;
  background: linear-gradient(
      180deg,
      var(--progress-color-light, color-mix(in srgb, var(--primary-color) 65%, white)) 0%,
      var(--progress-color-mid, color-mix(in srgb, var(--primary-color) 76%, white)) 62%,
      var(--progress-color-deep, color-mix(in srgb, var(--primary-color) 86%, white)) 100%
    );
  box-shadow: inset 0 2px 0 color-mix(in srgb, white 42%, transparent);
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-fill-scene {
  background-color: transparent;
  background-position: left top;
  background-size: var(--progress-scene-size);
  background-repeat: no-repeat;
  box-shadow: none;
}

.progress-fill-wave {
  background: linear-gradient(
      180deg,
      var(--progress-color-light, color-mix(in srgb, var(--primary-color) 65%, white)) 0%,
      var(--progress-color-mid, color-mix(in srgb, var(--primary-color) 76%, white)) 62%,
      var(--progress-color-deep, color-mix(in srgb, var(--primary-color) 86%, white)) 100%
    );
}

.progress-wave {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
  color: white;
  pointer-events: none;
}

.progress-wave::before,
.progress-wave::after {
  position: absolute;
  inset: 0;
  right: -112px;
  background: currentColor;
  content: "";
  opacity: 0.28;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 112 24' preserveAspectRatio='none'%3E%3Cpath d='M0 12 C14 4 42 4 56 12 S98 20 112 12 V24 H0Z' fill='white'/%3E%3C/svg%3E") left center / 112px 100% repeat-x;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 112 24' preserveAspectRatio='none'%3E%3Cpath d='M0 12 C14 4 42 4 56 12 S98 20 112 12 V24 H0Z' fill='white'/%3E%3C/svg%3E") left center / 112px 100% repeat-x;
  animation: progress-wave-drift 6s linear infinite;
}

.progress-wave::after {
  top: 20%;
  opacity: 0.48;
  -webkit-mask-position: -28px center;
  mask-position: -28px center;
  animation-duration: 9s;
  animation-direction: reverse;
}

@keyframes progress-wave-drift {
  to {
    transform: translateX(-112px);
  }
}
</style>
