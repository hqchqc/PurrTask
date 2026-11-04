function dots(color: string, primaryDot: string, secondaryDot: string) {
  return `radial-gradient(circle, ${primaryDot} 1.4px, transparent 1.4px) 0 0 / 28px 28px, radial-gradient(circle, ${secondaryDot} 1px, transparent 1px) 7px 7px / 14px 14px, ${color}`
}

function tiledIllustration(svg: string, width: number, height: number, color: string) {
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 0 0 / ${width}px ${height}px repeat, ${color}`
}

const sprinklesBackground = tiledIllustration(
  `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="220" viewBox="0 0 260 220">
    <defs><linearGradient id="c" x2="0" y2="1"><stop stop-color="#fff" stop-opacity=".62"/><stop offset=".48" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#503d35" stop-opacity=".2"/></linearGradient></defs>
    <g transform="translate(22 28) rotate(24 9 2.5)"><rect width="18" height="5" rx="2.5" fill="#f8a6b2"/><rect width="18" height="5" rx="2.5" fill="url(#c)"/></g>
    <g transform="translate(112 24) rotate(-38 8 2.5)"><rect width="16" height="5" rx="2.5" fill="#f5d04a"/><rect width="16" height="5" rx="2.5" fill="url(#c)"/></g>
    <g transform="translate(202 38) rotate(58 8 2.5)"><rect width="16" height="5" rx="2.5" fill="#95d5b2"/><rect width="16" height="5" rx="2.5" fill="url(#c)"/></g>
    <g transform="translate(62 82) rotate(76 7 2.5)"><rect width="15" height="5" rx="2.5" fill="#8ecae6"/><rect width="15" height="5" rx="2.5" fill="url(#c)"/></g>
    <g transform="translate(157 92) rotate(12 9 2.5)"><rect width="19" height="5" rx="2.5" fill="#f4a261"/><rect width="19" height="5" rx="2.5" fill="url(#c)"/></g>
    <g transform="translate(222 132) rotate(-55 8 2.5)"><rect width="16" height="5" rx="2.5" fill="#c9a7f5"/><rect width="16" height="5" rx="2.5" fill="url(#c)"/></g>
    <g transform="translate(25 158) rotate(-48 8 2.5)"><rect width="17" height="5" rx="2.5" fill="#f5d04a"/><rect width="17" height="5" rx="2.5" fill="url(#c)"/></g>
    <g transform="translate(106 184) rotate(32 9 2.5)"><rect width="18" height="5" rx="2.5" fill="#f8a6b2"/><rect width="18" height="5" rx="2.5" fill="url(#c)"/></g>
    <g transform="translate(192 190) rotate(-16 7 2.5)"><rect width="15" height="5" rx="2.5" fill="#8ecae6"/><rect width="15" height="5" rx="2.5" fill="url(#c)"/></g>
  </svg>`,
  260,
  220,
  '#fff8ef',
)

const sweetCornerBackground = tiledIllustration(
  `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="220" viewBox="0 0 280 220">
    <g transform="translate(16 20)">
      <path d="M5 23h48l-5 34H10z" fill="#f1b1a2"/><path d="M8 32h42v8H8z" fill="#fff5df"/><path d="M11 45h35l-3 9H14z" fill="#f6d18b"/><path d="M12 24c0-11 8-19 17-19s17 8 17 19" fill="#fff0d6"/><circle cx="22" cy="8" r="4" fill="#e88979"/><circle cx="36" cy="11" r="4" fill="#e88979"/>
    </g>
    <g transform="translate(103 18)">
      <path d="M4 28 28 8l25 20v29H4z" fill="#f6d18b"/><path d="M4 28h49v8H4z" fill="#f1a08f"/><path d="M13 39h31v18H13z" fill="#fff5df"/><circle cx="29" cy="20" r="5" fill="#e88979"/>
    </g>
    <g transform="translate(202 26)">
      <circle cx="27" cy="29" r="23" fill="#e99c85"/><circle cx="27" cy="29" r="10" fill="#fff0d6"/><circle cx="27" cy="29" r="5" fill="#f2d18a"/><circle cx="10" cy="13" r="3" fill="#f3d37e"/><circle cx="45" cy="43" r="3" fill="#f3d37e"/>
    </g>
    <g transform="translate(52 115)">
      <ellipse cx="27" cy="20" rx="26" ry="15" fill="#fff2d6"/><ellipse cx="27" cy="18" rx="25" ry="13" fill="#f3d18c"/><ellipse cx="27" cy="16" rx="24" ry="11" fill="#e9967d"/><path d="M5 20c4 11 40 11 44 0" fill="#fff2d6"/>
    </g>
    <g transform="translate(153 121)">
      <path d="M4 34c0-18 17-30 34-30s34 12 34 30z" fill="#d79a58"/><path d="M12 27c4-12 15-17 26-17s22 5 26 17" fill="none" stroke="#f8d99a" stroke-width="5"/><path d="M7 34h65" stroke="#fff1d2" stroke-width="7" stroke-linecap="round"/>
    </g>
    <g transform="translate(232 133)"><circle cx="12" cy="12" r="8" fill="#a9cabb"/><circle cx="31" cy="26" r="6" fill="#f1b1a2"/><circle cx="8" cy="44" r="5" fill="#f3d37e"/></g>
  </svg>`,
  280,
  220,
  '#fdf3e3',
)

const coffeeBreakBackground = tiledIllustration(
  `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="220" viewBox="0 0 280 220">
    <g transform="translate(18 18)">
      <path d="M7 16h42l-4 35c-1 8-7 12-17 12S12 59 11 51z" fill="#fffaf0" stroke="#d3b798" stroke-width="3"/><path d="M45 24h9c13 0 13 20 0 20h-8" fill="none" stroke="#d3b798" stroke-width="4"/><ellipse cx="28" cy="17" rx="21" ry="5" fill="#68452f"/><path d="M20 11c-5-7 4-9 0-15m12 15c-5-7 4-9 0-15" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
    </g>
    <g transform="translate(112 18) rotate(-22 20 20)"><ellipse cx="22" cy="25" rx="12" ry="18" fill="#9c704d"/><path d="M20 8c9 8 9 24 0 34" fill="none" stroke="#d7b18b" stroke-width="3"/></g>
    <g transform="translate(205 18)">
      <path d="M3 42c0-21 17-37 38-37s38 16 38 37z" fill="#d99d5e"/><path d="M12 34c6-11 16-17 29-17s23 6 29 17" fill="none" stroke="#f6d69d" stroke-width="6"/><path d="M8 42h66" stroke="#fff3dc" stroke-width="6" stroke-linecap="round"/>
    </g>
    <g transform="translate(54 116)">
      <path d="M7 16h43l-4 34c-1 8-7 12-18 12S11 58 10 50z" fill="#e9c9a5" stroke="#c49d78" stroke-width="3"/><path d="M46 23h9c13 0 13 20 0 20h-8" fill="none" stroke="#c49d78" stroke-width="4"/><ellipse cx="29" cy="17" rx="21" ry="5" fill="#775034"/><path d="M21 11c-5-7 4-9 0-15m12 15c-5-7 4-9 0-15" fill="none" stroke="#fffaf0" stroke-width="2" stroke-linecap="round"/>
    </g>
    <g transform="translate(157 128) rotate(28 20 20)"><ellipse cx="22" cy="25" rx="12" ry="18" fill="#a8764f"/><path d="M20 8c9 8 9 24 0 34" fill="none" stroke="#e0bd95" stroke-width="3"/></g>
    <g fill="#9fbd8c"><ellipse cx="23" cy="126" rx="8" ry="18" transform="rotate(42 23 126)"/><ellipse cx="38" cy="135" rx="7" ry="16" transform="rotate(-42 38 135)"/></g>
  </svg>`,
  280,
  220,
  '#f6eee3',
)

export const backgroundPresets = [
  { id: 'default', label: '奶油波点', background: dots('#f7f3df', 'rgb(196 184 158 / 15%)', 'rgb(196 184 158 / 10%)') },
  { id: 'grid', label: '温柔网格', background: 'linear-gradient(rgb(196 184 158 / 28%) 1px, transparent 1px) 0 0 / 24px 24px, linear-gradient(90deg, rgb(196 184 158 / 28%) 1px, transparent 1px) 0 0 / 24px 24px, #f7f3df' },
  { id: 'dots-dark-green', label: '薄荷森林', background: dots('#bfe3bf', 'rgb(90 160 90 / 22%)', 'rgb(140 200 140 / 15%)') },
  { id: 'sprinkles', label: '彩色针糖', background: sprinklesBackground },
  { id: 'sweet-corner', label: '甜点街角', background: sweetCornerBackground },
  { id: 'coffee-break', label: '咖啡时光', background: coffeeBreakBackground },
  { id: 'dots-pink', label: '樱花粉', background: dots('#fde4e8', 'rgb(248 166 178 / 26%)', 'rgb(255 200 210 / 18%)') },
  { id: 'dots-purple', label: '薰衣草', background: dots('#f0e8ff', 'rgb(183 125 238 / 18%)', 'rgb(220 180 255 / 12%)') },
  { id: 'dots-blue', label: '晴空蓝', background: dots('#e8edff', 'rgb(136 157 240 / 18%)', 'rgb(180 195 255 / 12%)') },
  { id: 'dots-yellow', label: '柠檬黄', background: dots('#fff8e0', 'rgb(247 205 103 / 26%)', 'rgb(255 230 160 / 18%)') },
  { id: 'dots-orange', label: '蜜橘', background: dots('#fff0e8', 'rgb(229 146 102 / 18%)', 'rgb(255 190 150 / 12%)') },
  { id: 'dots-teal', label: '青柠薄荷', background: dots('#e8faf5', 'rgb(130 213 187 / 26%)', 'rgb(170 235 210 / 18%)') },
  { id: 'dots-green', label: '嫩叶绿', background: dots('#e8f5e8', 'rgb(138 198 138 / 18%)', 'rgb(180 220 180 / 12%)') },
  { id: 'dots-red', label: '莓果红', background: dots('#ffe8e8', 'rgb(252 115 109 / 18%)', 'rgb(255 160 155 / 12%)') },
  { id: 'dots-lime-green', label: '青柚绿', background: dots('#f5f8e0', 'rgb(209 218 73 / 26%)', 'rgb(230 240 130 / 18%)') },
  { id: 'dots-yellow-green', label: '香草黄绿', background: dots('#fffde8', 'rgb(236 223 82 / 26%)', 'rgb(255 245 140 / 18%)') },
  { id: 'dots-brown', label: '燕麦棕', background: dots('#f5f0e0', 'rgb(154 131 90 / 18%)', 'rgb(190 165 120 / 12%)') },
  { id: 'dots-warm-peach-pink', label: '蜜桃粉', background: dots('#fff0e8', 'rgb(225 140 111 / 18%)', 'rgb(255 185 160 / 12%)') },
  { id: 'dots-gray', label: '云朵灰', background: dots('#ffffff', 'rgb(140 140 140 / 18%)', 'rgb(190 190 190 / 12%)') },
] as const

export type BackgroundPresetId = (typeof backgroundPresets)[number]['id']
export const DEFAULT_BACKGROUND: BackgroundPresetId = 'default'

export function isBackgroundPresetId(value: string): value is BackgroundPresetId {
  return backgroundPresets.some((preset) => preset.id === value)
}
