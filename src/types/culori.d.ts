declare module "culori/fn" {
  export type AnyColor = {
    mode: string;
    r?: number;
    g?: number;
    b?: number;
    l?: number;
    c?: number;
    h?: number;
    alpha?: number;
  };
  export type OklchColor = {
    mode: "oklch";
    l: number;
    c: number;
    h: number;
    alpha?: number;
  };
  export function parse(str: string): AnyColor | undefined;
  export function parseHex(str: string): AnyColor | undefined;
  export function useMode(m: unknown): (color: AnyColor) => AnyColor;
  export function useParser(parser: (str: string) => AnyColor | undefined): void;
  export const modeRgb: unknown;
  export const modeOklch: unknown;
  export function formatHex(color: AnyColor): string;
}
