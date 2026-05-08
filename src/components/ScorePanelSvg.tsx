import React from 'react';
import { SvgXml } from 'react-native-svg';

const svgXml = `<svg width="500" height="500" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E2C974" />
      <stop offset="30%" stop-color="#FFF2A8" />
      <stop offset="70%" stop-color="#C69E38" />
      <stop offset="100%" stop-color="#8B6914" />
    </linearGradient>

    <linearGradient id="bone" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="20%" stop-color="#FDFBF4" />
      <stop offset="80%" stop-color="#EBE2CD" />
      <stop offset="100%" stop-color="#D1C3A5" />
    </linearGradient>

    <filter id="drop_shadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="#000000" flood-opacity="0.8" />
    </filter>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3.5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <polygon id="seg-a" points="10,2 28,2 32,6 28,10 10,10 6,6" />
    <polygon id="seg-b" points="34,8 38,12 38,26 34,30 30,26 30,12" />
    <polygon id="seg-c" points="34,34 38,38 38,52 34,56 30,52 30,38" />
    <polygon id="seg-d" points="10,54 28,54 32,58 28,62 10,62 6,58" />
    <polygon id="seg-e" points="4,34 8,38 8,52 4,56 0,52 0,38" />
    <polygon id="seg-f" points="4,8 8,12 8,26 4,30 0,26 0,12" />
    <polygon id="seg-g" points="10,28 28,28 32,32 28,36 10,36 6,32" />

    <g id="digit-bg">
      <use href="#seg-a"/><use href="#seg-b"/><use href="#seg-c"/><use href="#seg-d"/><use href="#seg-e"/><use href="#seg-f"/><use href="#seg-g"/>
    </g>
    <g id="digit-0">
      <use href="#seg-a"/><use href="#seg-b"/><use href="#seg-c"/><use href="#seg-d"/><use href="#seg-e"/><use href="#seg-f"/>
    </g>
    <g id="digit-2">
      <use href="#seg-a"/><use href="#seg-b"/><use href="#seg-g"/><use href="#seg-e"/><use href="#seg-d"/>
    </g>
    <g id="digit-5">
      <use href="#seg-a"/><use href="#seg-f"/><use href="#seg-g"/><use href="#seg-c"/><use href="#seg-d"/>
    </g>

    <g id="tenbo-10000">
      <rect x="0" y="0" width="240" height="22" rx="11" fill="url(#bone)" filter="url(#drop_shadow)" />
      <path d="M 12 3 L 228 3" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity="0.9" />
      <circle cx="90" cy="11" r="4" fill="#1A1A1A" />
      <circle cx="150" cy="11" r="4" fill="#1A1A1A" />
      <circle cx="120" cy="11" r="4.5" fill="#CC0000" />
      <circle cx="112" cy="6" r="2.2" fill="#CC0000" />
      <circle cx="112" cy="16" r="2.2" fill="#CC0000" />
      <circle cx="128" cy="6" r="2.2" fill="#CC0000" />
      <circle cx="128" cy="16" r="2.2" fill="#CC0000" />
      <circle cx="104" cy="11" r="2.2" fill="#CC0000" />
      <circle cx="136" cy="11" r="2.2" fill="#CC0000" />
    </g>

    <g id="tenbo-5000">
      <rect x="0" y="0" width="240" height="22" rx="11" fill="url(#bone)" filter="url(#drop_shadow)" />
      <path d="M 12 3 L 228 3" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity="0.9" />
      <circle cx="120" cy="11" r="4.5" fill="#CC0000" />
      <circle cx="112" cy="6" r="2.2" fill="#CC0000" />
      <circle cx="112" cy="16" r="2.2" fill="#CC0000" />
      <circle cx="128" cy="6" r="2.2" fill="#CC0000" />
      <circle cx="128" cy="16" r="2.2" fill="#CC0000" />
    </g>
  </defs>

  <path d="M 80 15 L 420 15 L 485 80 L 485 420 L 420 485 L 80 485 L 15 420 L 15 80 Z" fill="#0C2115" stroke="url(#gold)" stroke-width="4" stroke-linejoin="round"/>
  <path d="M 90 35 L 410 35 L 465 90 L 465 410 L 410 465 L 90 465 L 35 410 L 35 90 Z" fill="none" stroke="#183623" stroke-width="2" stroke-linejoin="round"/>

  <polygon points="50,45 65,45 50,60" fill="url(#gold)"/>
  <polygon points="450,45 435,45 450,60" fill="url(#gold)"/>
  <polygon points="50,455 65,455 50,440" fill="url(#gold)"/>
  <polygon points="450,455 435,455 450,440" fill="url(#gold)"/>

  <g fill="#09180F" stroke="#122A1A" stroke-width="2">
    <rect x="45" y="150" width="30" height="200" rx="15" />
    <path d="M 52 220 L 68 220 M 52 240 L 68 240 M 52 260 L 68 260 M 52 280 L 68 280" stroke="#183623" stroke-width="2" stroke-linecap="round"/>
    <rect x="425" y="150" width="30" height="200" rx="15" />
    <path d="M 432 220 L 448 220 M 432 240 L 448 240 M 432 260 L 448 260 M 432 280 L 448 280" stroke="#183623" stroke-width="2" stroke-linecap="round"/>
  </g>

  <use href="#tenbo-10000" x="130" y="45" />
  <use href="#tenbo-10000" x="130" y="75" />
  <use href="#tenbo-5000" x="130" y="105" />

  <rect x="70" y="151" width="360" height="140" rx="15" fill="#000000" stroke="url(#gold)" stroke-width="3"/>

  <g fill="#331A00" transform="translate(105, 178) scale(1.4) skewX(-10)">
    <use href="#digit-bg" x="0" y="0" />
    <use href="#digit-bg" x="46" y="0" />
    <use href="#digit-bg" x="92" y="0" />
    <use href="#digit-bg" x="138" y="0" />
    <use href="#digit-bg" x="184" y="0" />
  </g>

  <g fill="#FF9900" filter="url(#glow)" transform="translate(105, 178) scale(1.4) skewX(-10)">
    <use href="#digit-2" x="0" y="0" />
    <use href="#digit-5" x="46" y="0" />
    <use href="#digit-0" x="92" y="0" />
    <use href="#digit-0" x="138" y="0" />
    <use href="#digit-0" x="184" y="0" />
  </g>

  <rect x="120" y="315" width="260" height="140" rx="15" fill="#040A07" stroke="url(#gold)" stroke-width="2"/>

  <text x="250" y="345" fill="url(#gold)" font-family="ShipporiMincho_700Bold" font-size="14" text-anchor="middle" letter-spacing="4">半荘戦　 1 / 8</text>
  <text x="250" y="395" fill="url(#gold)" font-family="ShipporiMincho_800ExtraBold" font-size="34" font-weight="bold" text-anchor="middle" letter-spacing="6">東 1 局</text>

  <circle cx="165" cy="425" r="5" fill="#D32F2F" />
  <text x="200" y="431" fill="#E0E0E0" font-family="NotoSerifJP_600SemiBold" font-size="16" text-anchor="middle" letter-spacing="2">0 本場</text>

  <text x="300" y="431" fill="#E0E0E0" font-family="NotoSerifJP_600SemiBold" font-size="16" text-anchor="middle" letter-spacing="2">供託 0</text>
</svg>`;

interface Props {
  size?: number;
}

export function ScorePanelSvg({ size = 260 }: Props) {
  return <SvgXml xml={svgXml} width={size} height={size} />;
}
