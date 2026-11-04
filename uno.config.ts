import {
  defineConfig,
  presetAttributify,
  presetWind3,
  presetIcons,
  presetWebFonts,
} from "unocss";

export default defineConfig({
  presets: [
    presetAttributify({}),
    presetWind3(),
    presetIcons(),
    presetWebFonts({
      provider: "none",
      fonts: {
        sans: ["Nunito", "Noto Sans SC", "system-ui", "sans-serif"],
      },
    }),
  ],
  theme: {
    colors: {
      primary: {
        DEFAULT: "var(--primary-color)",
        hover: "var(--primary-color-hover)",
        pressed: "var(--primary-color-pressed)",
        suppl: "var(--primary-color-suppl)",
        soft: "var(--primary-color-soft)",
      },
    },
    fontFamily: {
      sans: "var(--font-sans)",
      mono: "Consolas, Menlo, ui-monospace, monospace",
    },
  },
  shortcuts: {
    "flex-center": "flex items-center justify-center",
    "flex-between": "flex items-center justify-between",
    card: "rounded-xl bg-white p-4 shadow-sm",
    "page-shell": "min-h-full px-[clamp(20px,4vw,56px)] pb-12 pt-8 text-[var(--app-text-color)] max-[700px]:px-[18px] max-[700px]:pb-9 max-[700px]:pt-6",
    "page-content": "mx-auto w-full max-w-[980px]",
    "page-content-wide": "mx-auto w-full max-w-[1100px]",
    "surface-card": "rounded-[var(--app-radius-lg)] border border-[var(--app-border-color)] bg-[var(--app-surface-color)]",
    "ui-base": "font-sans font-400",
    "ui-medium": "font-sans font-500",
    "ui-semibold": "font-sans font-600",
    "ui-bold": "font-sans font-700",
  },
  safelist: ["i-line-md:trash"],
  preflights: [
    {
      getCSS: () => `
        html {
          font-family: var(--font-sans);
          font-weight: 400;
        }
        body {
          font-family: inherit;
          font-weight: inherit;
        }
        code, pre {
          font-family: var(--font-mono);
        }
      `,
    },
  ],
});
