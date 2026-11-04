<script setup lang="ts">
const props = defineProps<{
  trigger: number
}>()

const emit = defineEmits<{
  finished: [trigger: number]
}>()
</script>

<template>
  <span
    v-if="props.trigger > 0"
    :key="props.trigger"
    class="pointer-events-none absolute inset-0 z-0 flex-center"
    aria-hidden="true"
  >
    <span
      class="h-[22px] w-[22px] rounded-full animate-[checkbox-splash_600ms_ease]"
      @animationend="emit('finished', props.trigger)"
    />
  </span>
</template>
