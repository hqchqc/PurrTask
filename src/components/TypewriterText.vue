<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  text: string
  speed?: number
}>(), {
  speed: 38,
})

const displayedText = ref('')
let timer: ReturnType<typeof setTimeout> | undefined
let characters: string[] = []
let mounted = false
let reduceMotion = false

function stopTyping() {
  if (timer !== undefined) {
    clearTimeout(timer)
    timer = undefined
  }
}

function typeNextCharacter(index: number) {
  if (index >= characters.length) return
  displayedText.value += characters[index]
  timer = setTimeout(() => typeNextCharacter(index + 1), props.speed)
}

function startTyping() {
  stopTyping()
  characters = Array.from(props.text)
  displayedText.value = ''

  if (reduceMotion) {
    displayedText.value = props.text
    return
  }

  typeNextCharacter(0)
}

watch(() => props.text, () => {
  if (mounted) startTyping()
})

onMounted(() => {
  mounted = true
  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  startTyping()
})

onBeforeUnmount(stopTyping)
</script>

<template>
  <span class="typewriter" :aria-label="text">
    <span aria-hidden="true">{{ displayedText }}</span>
  </span>
</template>

<style scoped>
.typewriter {
  display: inline;
}

.typewriter > span {
  border-right: 1px solid currentColor;
  animation: typewriter-caret 0.8s steps(1, end) infinite;
}

@keyframes typewriter-caret {
  50% {
    border-color: transparent;
  }
}

@media (prefers-reduced-motion: reduce) {
  .typewriter > span {
    border-right: 0;
    animation: none;
  }
}
</style>
