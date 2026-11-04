<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import WindowControl from '@/components/WindowControl.vue'
import { RouterView } from 'vue-router'
import type { GlobalThemeOverrides } from 'naive-ui'

const themeStore = useThemeStore()

const themeOverrides = computed<GlobalThemeOverrides>(() => {
  return {
    common: {
      palette: themeStore.palette,
      fontFamily: "'Nunito', 'Noto Sans SC', system-ui, sans-serif",
      borderRadius: 'var(--app-radius)',
      borderRadiusSmall: 'calc(var(--app-radius) * 0.6)',
    },
    Button: {
      heightLarge: '50px',
      borderRadiusTiny: 'var(--app-radius)',
      borderRadiusSmall: 'var(--app-radius)',
      borderRadiusMedium: 'var(--app-radius)',
      borderRadiusLarge: 'var(--app-radius)',
      paddingRoundLarge: '0 26px',
      fontWeight: '700',
      colorPrimary: themeStore.palette.primaryColor,
      colorHoverPrimary: themeStore.palette.primaryColorHover,
      colorPressedPrimary: themeStore.palette.primaryColorPressed,
      colorFocusPrimary: themeStore.palette.primaryColor,
      colorDisabledPrimary: `color-mix(in srgb, ${themeStore.palette.primaryColor} 35%, #fffdf7)`,
      borderPrimary: themeStore.palette.primaryColor,
      borderHoverPrimary: themeStore.palette.primaryColorHover,
      borderPressedPrimary: themeStore.palette.primaryColorPressed,
      borderFocusPrimary: themeStore.palette.primaryColor,
      borderDisabledPrimary: `color-mix(in srgb, ${themeStore.palette.primaryColor} 35%, #fffdf7)`,
      rippleColorPrimary: themeStore.palette.primaryColorSuppl,
    },
    Input: {
      heightLarge: '50px',
      borderRadius: 'var(--app-radius)',
      color: 'var(--app-input-bg)',
      colorFocus: 'var(--app-input-bg)',
      caretColor: themeStore.palette.primaryColor,
      border: '2.5px solid var(--app-input-border)',
      borderHover: '2.5px solid var(--primary-color-suppl)',
      borderFocus: '2.5px solid var(--primary-color)',
      boxShadowFocus: '0 0 0 3px color-mix(in srgb, var(--primary-color) 20%, transparent)',
      paddingLarge: '0 20px',
    },
    Checkbox: {
      colorChecked: themeStore.palette.primaryColor,
      borderChecked: themeStore.palette.primaryColor,
      borderFocus: themeStore.palette.primaryColor,
      boxShadowFocus: `0 0 0 2px color-mix(in srgb, ${themeStore.palette.primaryColor} 18%, transparent)`,
    },
  }
})
</script>

<template>
  <div :style="themeStore.cssVariables" class="app-shell w-full h-full">
    <n-config-provider :theme-overrides="themeOverrides">
      <div class="app-global-background w-full h-screen flex flex-col text-gray-800">
        <div data-tauri-drag-region class="h-8 w-full flex items-center justify-end flex-shrink-0">
          <WindowControl />
        </div>
        <RouterView class="flex-1 min-h-0" />
      </div>
    </n-config-provider>
  </div>
</template>
