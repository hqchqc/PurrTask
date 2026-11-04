<script setup lang="ts">
import { computed } from 'vue'
import { NColorPicker } from 'naive-ui'
import TodayTitle from '@/components/today/TodayTitle.vue'
import TypewriterText from '@/components/TypewriterText.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import { useThemeStore } from '@/stores/theme'
import { backgroundPresets } from '@/theme/backgrounds'
import { themeColorPresets } from '@/theme/colors'
import { progressBackgrounds } from '@/theme/progressBackgrounds'

const themeStore = useThemeStore()
const isCustomColor = computed(() =>
  !themeColorPresets.some((color) => color.value === themeStore.basePrimary.toLowerCase()),
)

function setCustomColor(color: string | null) {
  if (color)
    themeStore.setPrimaryColor(color)
}
</script>

<template>
  <main class="page-shell">
    <div class="page-content">
      <header class="mb-8">
        <TodayTitle title="设置" />
        <p class="mb-0 mt-[18px] min-h-[1.5em] text-sm text-[var(--app-text-secondary)]">
          <TypewriterText text="调整应用外观，让每一天都更合心意。" />
        </p>
      </header>

      <div class="flex flex-col gap-5">
        <section
          class="surface-card p-6 max-[700px]:p-4"
          aria-labelledby="theme-color-title"
        >
          <div class="mb-5">
            <h2 id="theme-color-title" class="m-0 text-lg text-[var(--app-text-color)] font-800">
              主题颜色
            </h2>
            <p class="mb-0 mt-1 text-sm text-[var(--app-text-secondary)]">
              选择主色，按钮、进度条和装饰会同步更新。
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <button
              v-for="color in themeColorPresets"
              :key="color.value"
              type="button"
              class="theme-color-option"
              :class="{ 'theme-color-option-selected': themeStore.basePrimary.toLowerCase() === color.value }"
              :style="{ '--swatch-color': color.value }"
              :aria-label="`${color.label}主题色`"
              :aria-pressed="themeStore.basePrimary.toLowerCase() === color.value"
              @click="themeStore.setPrimaryColor(color.value)"
            >
              <span class="theme-color-swatch" aria-hidden="true" />
              <span>{{ color.label }}</span>
            </button>
            <NColorPicker
              :value="themeStore.basePrimary"
              :show-alpha="false"
              :modes="['hex']"
              :swatches="themeColorPresets.map((color) => color.value)"
              @update:value="setCustomColor"
            >
              <template #trigger="{ onClick, ref }">
                <button
                  :ref="ref"
                  type="button"
                  class="theme-color-option custom-color-option"
                  :class="{ 'theme-color-option-selected': isCustomColor }"
                  :style="{ '--swatch-color': themeStore.basePrimary }"
                  aria-label="自定义主题颜色"
                  :aria-pressed="isCustomColor"
                  @click="onClick"
                >
                  <span class="theme-color-swatch" aria-hidden="true">
                    <span
                      v-if="isCustomColor"
                      class="i-line-md:confirm h-4 w-4 text-white drop-shadow"
                    />
                  </span>
                  <span>自定义</span>
                </button>
              </template>
            </NColorPicker>
            <span class="ml-auto inline-flex items-center gap-2 text-xs text-[var(--app-text-muted)]">
              {{ themeStore.basePrimary.toUpperCase() }}
            </span>
          </div>
        </section>

        <section
          class="surface-card p-6 max-[700px]:p-4"
          aria-labelledby="progress-background-title"
        >
          <div class="mb-5">
            <h2 id="progress-background-title" class="m-0 text-lg text-[var(--app-text-color)] font-800">
              进度条样式
            </h2>
            <p class="mb-0 mt-1 text-sm text-[var(--app-text-secondary)]">
              选择后会同步应用到所有页面的进度条，并在下次启动时保留。
            </p>
          </div>

          <div class="grid grid-cols-3 gap-3 max-[700px]:grid-cols-2">
            <button
              v-for="preset in progressBackgrounds"
              :key="preset.id"
              type="button"
              class="progress-style-option"
              :class="{ 'progress-style-option-selected': themeStore.progressBackgroundId === preset.id }"
              :aria-pressed="themeStore.progressBackgroundId === preset.id"
              @click.stop="themeStore.setProgressBackground(preset.id)"
            >
              <ProgressBar
                class="progress-style-preview"
                :percent="100"
                :label="`${preset.label}进度条预览`"
                :appearance="preset.id"
                :height="24"
                aria-hidden="true"
              />
              <span class="font-700">{{ preset.label }}</span>
              <span class="progress-style-description">{{ preset.description }}</span>
              <span
                v-if="themeStore.progressBackgroundId === preset.id"
                class="progress-style-check i-line-md:confirm"
                aria-hidden="true"
              />
            </button>
          </div>
        </section>

        <section
          class="surface-card p-6 max-[700px]:p-4"
          aria-labelledby="background-title"
        >
          <div class="mb-5">
            <h2 id="background-title" class="m-0 text-lg text-[var(--app-text-color)] font-800">
              全局背景
            </h2>
            <p class="mb-0 mt-1 text-sm text-[var(--app-text-secondary)]">
              选择喜欢的背景图案，会应用到页面内容和一级导航。
            </p>
          </div>

          <div class="grid grid-cols-4 gap-3 max-[700px]:grid-cols-3 max-[460px]:grid-cols-2">
            <button
              v-for="preset in backgroundPresets"
              :key="preset.id"
              type="button"
              class="background-option"
              :class="{ 'background-option-selected': themeStore.backgroundId === preset.id }"
              :aria-pressed="themeStore.backgroundId === preset.id"
              @click="themeStore.setBackground(preset.id)"
            >
              <span
                class="background-preview"
                :style="{ background: preset.background }"
                aria-hidden="true"
              />
              <span class="flex items-center justify-between gap-2">
                <span class="truncate">{{ preset.label }}</span>
                <span
                  v-if="themeStore.backgroundId === preset.id"
                  class="i-line-md:confirm h-4 w-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
              </span>
            </button>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<style scoped>
.background-option {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  border: 1px solid var(--app-border-color);
  border-radius: var(--app-radius);
  background: var(--app-surface-color);
  color: var(--app-text-secondary);
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  text-align: left;
  transition:
    border-color 150ms ease,
    box-shadow 150ms ease,
    transform 150ms ease;
}

.progress-style-option {
  position: relative;
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: stretch;
  gap: 9px;
  padding: 12px;
  border: 1px solid var(--app-border-color);
  border-radius: var(--app-radius);
  background: var(--app-surface-color);
  color: var(--app-text-secondary);
  font: inherit;
  font-size: 12px;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 150ms ease,
    box-shadow 150ms ease,
    transform 150ms ease;
}

.progress-style-option:hover {
  transform: translateY(-2px);
  border-color: var(--primary-color-suppl);
}

.progress-style-option-selected {
  border: 2px solid var(--primary-color);
  padding: 11px;
  color: var(--app-text-color);
  box-shadow: 0 0 0 3px var(--primary-color-soft);
}

.progress-style-check {
  position: absolute;
  bottom: 8px;
  right: 8px;
  height: 18px;
  width: 18px;
  border-radius: 999px;
  background: var(--primary-color);
  color: white;
  font-size: 13px;
}

.progress-style-option:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.progress-style-preview {
  width: 100%;
}

.progress-style-description {
  overflow: hidden;
  color: var(--app-text-muted);
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.theme-color-option,
.custom-color-option {
  display: inline-flex;
  min-width: 76px;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  padding: 9px 10px;
  border: 1px solid var(--app-border-color);
  border-radius: var(--app-radius);
  background: var(--app-surface-color);
  color: var(--app-text-secondary);
  font: inherit;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease;
}

.theme-color-option:hover,
.custom-color-option:hover {
  transform: translateY(-2px);
  border-color: var(--primary-color-suppl);
}

.theme-color-option-selected {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px var(--primary-color-soft);
  color: var(--app-text-color);
}

.theme-color-swatch,
.custom-color-swatch {
  display: block;
  width: 25px;
  height: 25px;
  border: 2px solid color-mix(in srgb, var(--app-surface-color) 80%, white);
  border-radius: 50%;
  background: var(--swatch-color);
  box-shadow: 0 1px 4px var(--app-shadow-color);
}

.custom-color-option {
  position: relative;
}

.custom-color-option input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  opacity: 0;
}

.theme-color-option:focus-visible,
.custom-color-option:focus-within {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.background-option:hover {
  transform: translateY(-2px);
  border-color: var(--primary-color-suppl);
}

.background-option-selected {
  border: 2px solid var(--primary-color);
  padding: 7px;
  color: var(--app-text-color);
  box-shadow: 0 0 0 3px var(--primary-color-soft);
}

.background-option:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.background-preview {
  display: block;
  width: 100%;
  height: 74px;
  border: 1px solid color-mix(in srgb, var(--app-border-color) 70%, transparent);
  border-radius: calc(var(--app-radius) - 6px);
}

@media (prefers-reduced-motion: reduce) {
  .background-option,
  .progress-style-option {
    transition: none;
  }
}
</style>
