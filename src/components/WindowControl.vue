<script setup lang="ts">
import { getCurrentWindow } from '@tauri-apps/api/window'
import { ref, watchEffect } from 'vue'

const win = getCurrentWindow()
const isMax = ref(false)

// 监听窗口最大化状态
watchEffect(async () => {
  isMax.value = await win.isMaximized()
})

const minimize = () => win.minimize()
const toggleMaximize = async () => {
  await win.toggleMaximize()
  isMax.value = await win.isMaximized()
}
const close = () => win.close()
</script>

<template>
  <div class="flex items-center gap-0">
    <div @click="minimize"
      class="w-10 h-[32px] flex items-center justify-center hover:bg-gray-200 cursor-pointer select-none transition-colors">
      <span class="text-base">−</span>
    </div>
    <div @click="toggleMaximize"
      class="w-10 h-[32px] flex items-center justify-center hover:bg-gray-200 cursor-pointer select-none transition-colors">
      <span class="text-base">{{ isMax ? '❐' : '□' }}</span>
    </div>
    <div @click="close"
      class="w-10 h-[32px] flex items-center justify-center hover:bg-red-500 hover:text-white cursor-pointer select-none transition-colors">
      <span class="text-base">×</span>
    </div>
  </div>
</template>
