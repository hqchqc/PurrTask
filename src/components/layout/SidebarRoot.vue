<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SplashEffect from '@/components/SplashEffect.vue'
import appIcon from '@/assets/icon.png'

const router = useRouter()
const route = useRoute()

const menuItems = [
  { id: 'tasks', label: '任务', icon: 'i-line-md:confirm-square' },
  { id: 'calendar', label: '日历', icon: 'i-line-md:calendar' },
  { id: 'settings', label: '设置', icon: 'i-line-md:cog' },
] as const

type MenuItemId = (typeof menuItems)[number]['id']

const selectedMenuId = computed<MenuItemId>(() => {
  if (route.name === 'calendar') return 'calendar'
  if (route.name === 'settings') return 'settings'
  return 'tasks'
})
const splashMenuId = ref<MenuItemId | null>(null)
const splashAnimationId = ref(0)

function selectMenu(item: (typeof menuItems)[number]) {
  if (selectedMenuId.value !== item.id) {
    splashMenuId.value = item.id
    splashAnimationId.value += 1
  }

  if (item.id === 'tasks') {
    void router.push({ name: 'today' })
  } else if (item.id === 'calendar') {
    void router.push({ name: 'calendar' })
  } else {
    void router.push({ name: 'settings' })
  }
}

function finishSplash(itemId: MenuItemId, trigger: number) {
  if (splashMenuId.value === itemId && splashAnimationId.value === trigger) {
    splashMenuId.value = null
  }
}
</script>

<template>
  <div class="h-full flex flex-col items-center gap-4">
    <div class="w-10 h-10 overflow-hidden rounded-full bg-primary-soft">
      <img :src="appIcon" alt="Purr Task" class="h-full w-full object-cover" />
    </div>

    <nav aria-label="主导航" class="flex flex-col items-center gap-4 flex-shrink-0">
      <button v-for="item in menuItems" :key="item.id" type="button" :aria-label="item.label"
        :aria-pressed="selectedMenuId === item.id"
        class="relative w-10 h-10 cursor-pointer rounded-lg border-0 bg-transparent p-0 flex-center transition-colors hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        :class="selectedMenuId === item.id ? 'text-primary' : 'text-gray-400'" @click="selectMenu(item)">
        <span :class="[item.icon, 'z-10 h-6 w-6']" aria-hidden="true" />
        <SplashEffect
          :trigger="splashMenuId === item.id ? splashAnimationId : 0"
          @finished="finishSplash(item.id, $event)"
        />
      </button>
    </nav>

    <div class="flex-1 min-h-0" />
  </div>
</template>
