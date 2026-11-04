<script setup lang="ts">
import { RouterView } from 'vue-router'
import SidebarList from '@/components/layout/SidebarList.vue'
</script>

<template>
  <div class="h-full w-full flex overflow-hidden">
    <SidebarList class="h-full w-64 flex-shrink-0" />
    <div class="scrollbar-hidden h-full min-w-0 flex-1 overflow-auto">
      <RouterView v-slot="{ Component, route }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.name" />
        </Transition>
      </RouterView>
    </div>
  </div>
</template>

<style>
.scrollbar-hidden {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}

.page-enter-active,
.page-leave-active {
  transition:
    opacity 260ms ease,
    transform 260ms ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active {
    transition: none;
  }
}
</style>
