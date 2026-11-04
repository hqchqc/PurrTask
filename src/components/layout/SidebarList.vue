<script setup lang="ts">
import { computed } from 'vue'
import { useNow } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const activeListId = computed(() => route.name)

const visibleLists = [
  { id: 'today', name: '今天' },
  { id: 'week', name: '最近7天' },
  { id: 'trash', name: '垃圾桶', icon: 'i-line-md:trash' },
]
const now = useNow()
const todayDate = computed(() => now.value.getDate())

function selectList(id: string) {
  void router.push({ name: id })
}
</script>

<template>
  <aside class="task-sidebar h-full overflow-y-auto p-4">
    <div class="task-sidebar-panel relative flex min-h-full flex-col overflow-hidden rounded-[var(--app-radius-lg)] border p-4">
      <div class="task-sidebar-wave" aria-hidden="true">
        <svg
          class="task-sidebar-wave-layer task-sidebar-wave-back"
          viewBox="0 0 960 120"
          preserveAspectRatio="none"
        >
          <path d="M0 42 C80 10 160 10 240 42 S400 74 480 42 S640 10 720 42 S880 74 960 42 V120 H0 Z" />
          <path transform="translate(960 0)" d="M0 42 C80 10 160 10 240 42 S400 74 480 42 S640 10 720 42 S880 74 960 42 V120 H0 Z" />
        </svg>
        <svg
          class="task-sidebar-wave-layer task-sidebar-wave-front"
          viewBox="0 0 960 120"
          preserveAspectRatio="none"
        >
          <path d="M0 58 C80 28 160 28 240 58 S400 88 480 58 S640 28 720 58 S880 88 960 58 V120 H0 Z" />
          <path transform="translate(960 0)" d="M0 58 C80 28 160 28 240 58 S400 88 480 58 S640 28 720 58 S880 88 960 58 V120 H0 Z" />
        </svg>
      </div>
      <nav class="relative z-1 flex flex-col gap-3" aria-label="任务导航">
        <button
          v-for="item in visibleLists"
          :key="item.id"
          type="button"
          class="group relative flex min-h-12 w-full items-center gap-3 overflow-hidden rounded-2xl border-0 px-3 py-2.5 text-left text-sm transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          :class="activeListId === item.id
            ? 'bg-primary-soft font-semibold text-primary shadow-[0_4px_12px_var(--primary-color-soft)]'
            : 'bg-white/50 text-stone-600 hover:bg-white/80 hover:shadow-[0_4px_12px_var(--primary-color-soft)]'"
          :aria-current="activeListId === item.id ? 'page' : undefined"
          @click="selectList(item.id)"
        >
          <span
            class="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-100/80 transition-colors duration-200 group-hover:bg-white"
            :class="activeListId === item.id ? 'bg-white' : ''"
            aria-hidden="true"
          >
            <span
              v-if="item.id === 'today' || item.id === 'week'"
              class="flex h-6 w-5 flex-col overflow-hidden rounded-md border border-primary/30 bg-primary-soft shadow-sm"
            >
              <span class="relative flex h-1.5 items-center justify-center gap-1 bg-primary">
                <span class="h-1 w-0.5 rounded-full bg-white/80" />
                <span class="h-1 w-0.5 rounded-full bg-white/80" />
              </span>
              <span class="flex flex-1 items-center justify-center text-[10px] font-bold leading-none text-primary">
                {{ item.id === 'today' ? todayDate : 7 }}
              </span>
            </span>
            <span
              v-else
              :class="[item.icon, 'h-5 w-5 text-primary']"
            />
          </span>

          <span class="min-w-0 flex-1 truncate">{{ item.name }}</span>

          <span
            v-if="activeListId === item.id"
            class="h-2 w-2 shrink-0 rounded-full bg-primary shadow-sm"
            aria-hidden="true"
          />
        </button>
      </nav>
    </div>
  </aside>
</template>

<style scoped>
.task-sidebar-panel {
  border-color: color-mix(in srgb, var(--primary-color) 18%, var(--app-border-color));
  background: color-mix(in srgb, var(--primary-color) 7%, var(--app-surface-color));
  padding-bottom: 116px;
}

.task-sidebar-wave {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 126px;
  overflow: hidden;
  pointer-events: none;
}

.task-sidebar-wave-layer {
  position: absolute;
  bottom: 0;
  width: 200%;
  height: 100%;
  overflow: visible;
  fill: var(--primary-color);
  animation: sidebar-wave-flow 9s linear infinite;
  will-change: transform;
}

.task-sidebar-wave-back {
  opacity: 0.3;
  animation-duration: 13s;
  animation-direction: reverse;
}

.task-sidebar-wave-front {
  opacity: 0.78;
}

@keyframes sidebar-wave-flow {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
</style>
