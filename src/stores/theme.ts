import { defineStore } from "pinia";
import {
  formatHex,
  modeOklch,
  parse,
  parseHex,
  useMode,
  useParser,
} from "culori/fn";
import {
  backgroundPresets,
  DEFAULT_BACKGROUND,
  isBackgroundPresetId,
  type BackgroundPresetId,
} from "@/theme/backgrounds";
import {
  DEFAULT_PROGRESS_BACKGROUND,
  isProgressBackgroundId,
  type ProgressBackgroundId,
} from "@/theme/progressBackgrounds";
import { DEFAULT_PRIMARY_COLOR } from "@/theme/colors";

const BACKGROUND_STORAGE_KEY = "purr-task-background";
const COLOR_STORAGE_KEY = "purr-task-primary-color";
const PROGRESS_BACKGROUND_STORAGE_KEY = "purr-task-progress-background";

function getStoredBackground(): BackgroundPresetId {
  const saved = localStorage.getItem(BACKGROUND_STORAGE_KEY);
  return saved && isBackgroundPresetId(saved) ? saved : DEFAULT_BACKGROUND;
}

function getStoredPrimaryColor() {
  const saved = localStorage.getItem(COLOR_STORAGE_KEY);
  return saved && /^#[\da-f]{6}$/i.test(saved) ? saved : DEFAULT_PRIMARY_COLOR;
}

function getStoredProgressBackground(): ProgressBackgroundId {
  const saved = localStorage.getItem(PROGRESS_BACKGROUND_STORAGE_KEY);
  return saved && isProgressBackgroundId(saved) ? saved : DEFAULT_PROGRESS_BACKGROUND;
}

const defaultPalette = {
  primaryColor: DEFAULT_PRIMARY_COLOR,
  primaryColorHover: "#36ad6a",
  primaryColorPressed: "#0c7a43",
  primaryColorSuppl: "#63e2b7",
};

const oklch = useMode(modeOklch);
useParser(parseHex);

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function generatePrimaryPalette(baseColor: string) {
  const parsed = parse(baseColor);
  if (!parsed) return defaultPalette;

  const color = oklch(parsed);
  if (!color || typeof color.l !== "number" || !Number.isFinite(color.l)) {
    return defaultPalette;
  }

  const hover = { ...color, l: clamp(color.l - 0.06) };
  const pressed = { ...color, l: clamp(color.l - 0.12) };
  const suppl = { ...color, l: clamp(color.l + 0.08) };

  return {
    primaryColor: formatHex(parsed),
    primaryColorHover: formatHex(hover),
    primaryColorPressed: formatHex(pressed),
    primaryColorSuppl: formatHex(suppl),
  };
}

export const useThemeStore = defineStore("theme", {
  state() {
    return {
      basePrimary: getStoredPrimaryColor(),
      backgroundId: getStoredBackground(),
      progressBackgroundId: getStoredProgressBackground(),
    };
  },
  getters: {
    palette: (state) => generatePrimaryPalette(state.basePrimary),
    cssVariables(): Record<string, string> {
      return {
        "--primary-color": this.palette.primaryColor,
        "--primary-color-hover": this.palette.primaryColorHover,
        "--primary-color-pressed": this.palette.primaryColorPressed,
        "--primary-color-suppl": this.palette.primaryColorSuppl,
        "--primary-color-soft": `color-mix(in srgb, ${this.palette.primaryColor} 10%, transparent)`,
        "--progress-color-light": `color-mix(in srgb, ${this.palette.primaryColor} 65%, white)`,
        "--progress-color-mid": `color-mix(in srgb, ${this.palette.primaryColor} 76%, white)`,
        "--progress-color-deep": `color-mix(in srgb, ${this.palette.primaryColor} 86%, white)`,
        "--app-page-bg": "#f8f6ef",
        "--app-page-background": this.selectedBackground.background,
        "--app-surface-color": "#fffdf7",
        "--app-surface-muted-color": "#f2ecdf",
        "--app-text-color": "#704f32",
        "--app-text-secondary": "#8f7d65",
        "--app-text-muted": "#a3937c",
        "--app-border-color": "#e9dfce",
        "--app-input-bg": "#fffbe7",
        "--app-input-border": "#c4b89e",
        "--app-focus-color": "#ffcc00",
        "--app-focus-shadow": "color-mix(in srgb, #ffcc00 25%, transparent)",
        "--app-button-shadow": "#bdaea0",
        "--app-success-color": this.palette.primaryColor,
        "--app-ribbon-front": this.palette.primaryColor,
        "--app-ribbon-tail": this.palette.primaryColorPressed,
        "--app-ribbon-fold": this.palette.primaryColorPressed,
        "--app-ribbon-text": "#fffdf7",
        "--app-primary-soft": `color-mix(in srgb, ${this.palette.primaryColor} 11%, #fffdf7)`,
        "--app-primary-soft-solid": `color-mix(in srgb, ${this.palette.primaryColor} 24%, #fffdf7)`,
        "--app-shadow-color": "rgb(91 67 42 / 8%)",
        "--app-radius": "18px",
        "--app-radius-lg": "24px",
        "--app-radius-pill": "50px",
        "--app-motion-ease": "cubic-bezier(0.4, 0, 0.2, 1)",
        "--app-motion-fast": "0.15s",
        "--app-motion": "0.25s",
        "--app-motion-slow": "0.35s",
      };
    },
    selectedBackground: (state) =>
      backgroundPresets.find((preset) => preset.id === state.backgroundId) ?? backgroundPresets[0],
    selectedProgressBackground: (state) =>
      isProgressBackgroundId(state.progressBackgroundId)
        ? state.progressBackgroundId
        : DEFAULT_PROGRESS_BACKGROUND,
  },
  actions: {
    setPrimaryColor(color: string) {
      if (!/^#[\da-f]{6}$/i.test(color)) return;
      this.basePrimary = color;
      localStorage.setItem(COLOR_STORAGE_KEY, color);
    },
    setBackground(id: BackgroundPresetId) {
      this.backgroundId = id;
      localStorage.setItem(BACKGROUND_STORAGE_KEY, id);
    },
    setProgressBackground(id: ProgressBackgroundId) {
      if (!isProgressBackgroundId(id)) return;
      this.progressBackgroundId = id;
      localStorage.setItem(PROGRESS_BACKGROUND_STORAGE_KEY, id);
    },
  },
});
