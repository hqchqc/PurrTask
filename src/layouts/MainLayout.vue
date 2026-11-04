<script setup lang="ts">
import { RouterView } from 'vue-router'
import SidebarRoot from '@/components/layout/SidebarRoot.vue'
</script>

<template>
  <div class="app-page-background w-full h-full flex overflow-hidden">
    <SidebarRoot class="h-full w-16 flex-shrink-0 border-r border-[var(--app-border-color)]" />
    <div class="scrollbar-hidden h-full min-w-0 flex-1 overflow-auto">
      <RouterView v-slot="{ Component, route }">
        <Transition name="main-page" mode="out-in">
          <component
            :is="Component"
            :key="['today', 'week', 'trash'].includes(String(route.name)) ? 'tasks' : route.name"
          />
        </Transition>
      </RouterView>
    </div>
  </div>
</template>

<style>
.main-page-enter-active,
.main-page-leave-active {
  transition:
    opacity 240ms ease,
    transform 240ms ease;
}

.main-page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.main-page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
  .main-page-enter-active,
  .main-page-leave-active {
    transition: none;
  }
}
</style>
