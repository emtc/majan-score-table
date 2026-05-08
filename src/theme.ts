export const M = {
  feltDeep: '#0d3a2a',
  feltMid: '#155139',
  feltHi: '#1b6346',
  woodDark: '#2a1a10',
  woodMid: '#4a2c18',
  woodHi: '#6b3e22',
  gold: '#d4a64a',
  goldHi: '#f3d07a',
  goldDeep: '#8a6420',
  ivory: '#f3ead2',
  ivoryDim: '#cfc4a8',
  bone: '#e6d9b8',
  ink: '#1c130a',
  inkSoft: '#3a2a1a',
  red: '#a8321f',
  redHi: '#c64a2e',
  redDeep: '#6b1f10',
  green: '#7fc28a',
  greenRed: '#d97a6a',
};

// Font family strings — must match loaded fonts in app/_layout.tsx
export const F = {
  display: 'ShipporiMincho_800ExtraBold',
  displayBold: 'ShipporiMincho_700Bold',
  serif: 'NotoSerifJP_400Regular',
  serifMedium: 'NotoSerifJP_500Medium',
  serifSemiBold: 'NotoSerifJP_600SemiBold',
  serifBold: 'NotoSerifJP_700Bold',
  serifBlack: 'NotoSerifJP_900Black',
};

export function formatNum(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
