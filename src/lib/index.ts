export const COLORS = ['#476978', '#668878', '#a9784f', '#a95f5f', '#67839a', '#7f718c']

export const pretty = (value: string) => value.replaceAll('_', ' ').replace(/\b\w/g, c => c.toUpperCase())
