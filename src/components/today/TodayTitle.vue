<script setup lang="ts">
withDefaults(defineProps<{ title?: string }>(), {
  title: '今天',
})
</script>

<template>
  <h1 class="m-0 text-[clamp(24px,3vw,32px)] leading-none">
    <span
      class="today-ribbon relative inline-flex h-[2em] items-center justify-center px-[1.6em] text-[var(--app-ribbon-text)] font-900 tracking-[0.04em] whitespace-nowrap drop-shadow-[0_0.08em_0.12em_var(--app-shadow-color)]"
    >
      <span class="ribbon-back ribbon-back-left" aria-hidden="true" />
      <span class="ribbon-back ribbon-back-right" aria-hidden="true" />
      <span class="ribbon-fold ribbon-fold-left" aria-hidden="true" />
      <span class="ribbon-fold ribbon-fold-right" aria-hidden="true" />
      <span class="ribbon-front" aria-hidden="true" />
      <span class="ribbon-text relative z-4 inline-flex h-[2em] items-center pt-[0.11em] text-[var(--app-ribbon-text)] [text-shadow:0_0.04em_0.08em_var(--app-shadow-color)]">
        {{ title }}
      </span>
    </span>
  </h1>
</template>

<style scoped>
.ribbon-back {
  position: absolute;
  bottom: -0.4em;
  z-index: 1;
  width: 1.7em;
  height: 1.7em;
  background: var(--app-ribbon-tail);
}

.ribbon-back-left {
  left: -0.6em;
  clip-path: polygon(100% 0%, 100% 100%, 0% 100%, 30% 50%, 0% 0%);
}

.ribbon-back-right {
  right: -0.6em;
  clip-path: polygon(0% 0%, 100% 0%, 70% 50%, 100% 100%, 0% 100%);
}

.ribbon-fold {
  position: absolute;
  top: calc(100% - 0.05em);
  z-index: 2;
  width: 0;
  height: 0;
  border-style: solid;
}

.ribbon-fold-left {
  left: 0.15em;
  border-width: 0 0.95em 0.45em 0;
  border-color: transparent var(--app-ribbon-fold) transparent transparent;
}

.ribbon-fold-right {
  right: 0.16em;
  border-width: 0 0 0.45em 0.95em;
  border-color: transparent transparent transparent var(--app-ribbon-fold);
}

.ribbon-front {
  position: absolute;
  z-index: 3;
  inset: 0 0.1em;
  border-radius: 0.2em;
  background: var(--app-ribbon-front);
  box-shadow: inset 0 -0.06em 0 var(--app-shadow-color);
  pointer-events: none;
  transform: perspective(11.5em) rotateX(3deg);
}
</style>
