<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  submitTask: (title: string) => Promise<boolean>
}>()

const title = ref('')

async function submit() {
  const taskTitle = title.value.trim()
  if (!taskTitle) return

  if (await props.submitTask(taskTitle)) {
    title.value = ''
  }
}
</script>

<template>
  <form class="mb-6 flex items-center gap-3.5 max-[460px]:flex-col max-[460px]:items-stretch" @submit.prevent="submit">
    <n-input
      v-model:value="title"
      class="min-w-0 flex-1"
      size="large"
      placeholder="记下一件今天想做的事..."
      aria-label="添加今天的记录"
      @keydown.enter.prevent="submit"
    />
    <n-button
      class="add-button shrink-0 font-700 shadow-[0_5px_0_var(--app-button-shadow)] transition-[transform,box-shadow] duration-150 ease-[var(--app-motion-ease)] hover:-translate-y-px hover:shadow-[0_6px_0_var(--app-button-shadow)] active:translate-y-[3px] active:shadow-[0_1px_0_var(--app-button-shadow)] max-[460px]:w-full"
      type="primary"
      size="large"
      :disabled="!title.trim()"
      attr-type="submit"
    >
      添加记录
    </n-button>
  </form>
</template>

<style scoped>
.add-button:disabled {
  box-shadow: 0 3px 0 var(--app-button-shadow);
}
</style>
