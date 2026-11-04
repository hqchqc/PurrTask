export type ProgressBackgroundId =
  | 'classic'
  | 'sweet-corner'
  | 'forest-grove'
  | 'starry-camp'
  | 'coffee-break'
  | 'wave'

function scene(svg: string) {
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

export const progressBackgrounds: Array<{
  id: ProgressBackgroundId
  label: string
  description: string
  image?: string
  wave?: boolean
}> = [
  { id: 'classic', label: '经典渐变', description: '轻柔的主题色渐变' },
  {
    id: 'sweet-corner',
    label: '甜点街角',
    description: '奶油天空与粉橘色丘陵',
    image: scene(`<svg xmlns="http://www.w3.org/2000/svg" width="520" height="48" viewBox="0 0 520 48"><defs><linearGradient id="s" x2="0" y2="1"><stop stop-color="#ffeacb"/><stop offset="1" stop-color="#f6b6a5"/></linearGradient></defs><path fill="url(#s)" d="M0 0h520v48H0z"/><path fill="#f3a18f" d="M0 34q65-22 130 0t130 0 130 0 130 0v14H0z"/><path fill="#f8d59b" d="M0 40q75-15 150 0t150 0 150 0 150 0v8H0z"/><circle cx="64" cy="14" r="7" fill="#fff5df"/><circle cx="68" cy="11" r="3" fill="#fff"/><circle cx="245" cy="19" r="6" fill="#fff0d6"/><path fill="#fff5df" d="M382 28q8-15 16 0zM402 30q8-14 16 0z"/></svg>`),
  },
  {
    id: 'forest-grove',
    label: '森林小径',
    description: '薄荷山丘与林间小树',
    image: scene(`<svg xmlns="http://www.w3.org/2000/svg" width="520" height="48" viewBox="0 0 520 48"><defs><linearGradient id="f" x2="0" y2="1"><stop stop-color="#c9eee1"/><stop offset="1" stop-color="#8fcdb3"/></linearGradient></defs><path fill="url(#f)" d="M0 0h520v48H0z"/><circle cx="440" cy="13" r="8" fill="#ffe89b"/><path fill="#73bb98" d="M0 34q70-24 140 0t140 0 140 0 140 0v14H0z"/><path fill="#4d9d7d" d="M0 42q65-16 130 0t130 0 130 0 130 0v6H0z"/><g fill="#387e66"><path d="m75 34 9-16 9 16h-5v7h-8v-7zM100 36l8-14 8 14h-5v6h-6v-6zM320 35l10-18 10 18h-6v8h-8v-8zM352 37l8-14 8 14h-5v6h-6v-6z"/></g></svg>`),
  },
  {
    id: 'starry-camp',
    label: '星空营地',
    description: '夜空、星星和远山',
    image: scene(`<svg xmlns="http://www.w3.org/2000/svg" width="520" height="48" viewBox="0 0 520 48"><defs><linearGradient id="n" x2="0" y2="1"><stop stop-color="#465b91"/><stop offset="1" stop-color="#8295c2"/></linearGradient></defs><path fill="url(#n)" d="M0 0h520v48H0z"/><circle cx="434" cy="13" r="7" fill="#fff0b8"/><g fill="#fff" opacity=".9"><circle cx="46" cy="11" r="1.5"/><circle cx="105" cy="21" r="1"/><circle cx="198" cy="10" r="1.4"/><circle cx="286" cy="17" r="1"/><circle cx="375" cy="8" r="1.2"/></g><path fill="#6475a4" d="m0 39 70-22 50 18 62-25 72 29 62-22 70 21 66-26 68 20v16H0z"/><path fill="#394e7d" d="M0 44q70-14 140 0t140 0 140 0 140 0v4H0z"/><path fill="#f7c77f" d="m224 40 14-18 14 18z"/><path fill="#fff0c8" d="m238 22 14 18h-14z"/></svg>`),
  },
  {
    id: 'coffee-break',
    label: '咖啡时光',
    description: '暖棕山丘与咖啡香气',
    image: scene(`<svg xmlns="http://www.w3.org/2000/svg" width="520" height="48" viewBox="0 0 520 48"><defs><linearGradient id="c" x2="0" y2="1"><stop stop-color="#f4dfc1"/><stop offset="1" stop-color="#c99c72"/></linearGradient></defs><path fill="url(#c)" d="M0 0h520v48H0z"/><circle cx="432" cy="13" r="8" fill="#fff0c9"/><path fill="#bb8a62" d="M0 36q70-22 140 0t140 0 140 0 140 0v12H0z"/><path fill="#936748" d="M0 43q70-15 140 0t140 0 140 0 140 0v5H0z"/><g fill="none" stroke="#fff4df" stroke-linecap="round" stroke-width="2"><path d="M82 21q-5-5 0-9t0-7M95 21q-5-5 0-9t0-7"/></g><path fill="#fff4df" d="M76 25h27l-3 13q-1 4-10 4t-11-4z"/><path fill="#80563b" d="M81 27h17l-2 5H83z"/></svg>`),
  },
  { id: 'wave', label: '薄荷海浪', description: '双层波浪缓缓流动', wave: true },
]

const progressBackgroundIds = new Set<ProgressBackgroundId>(
  progressBackgrounds.map((preset) => preset.id),
)

export function isProgressBackgroundId(value: string): value is ProgressBackgroundId {
  return progressBackgroundIds.has(value as ProgressBackgroundId)
}

export function getProgressBackground(id: ProgressBackgroundId) {
  return progressBackgrounds.find((preset) => preset.id === id) ?? progressBackgrounds[0]
}

export const DEFAULT_PROGRESS_BACKGROUND: ProgressBackgroundId = 'classic'
