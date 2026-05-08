import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Pressable, StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FeltBackground } from '../components/FeltBackground';
import { SmallActionBtn } from '../components/atoms';
import { WINDS, dealerOf, roundLabel, totalKyoku } from '../logic';
import { F, M, formatNum } from '../theme';
import type { Game } from '../types';

const CARD_W = 180;
const CARD_H = 80;

interface Props {
  game: Game;
  openSheet: () => void;
  onEnd: () => void;
  onUndo: () => void;
  dimmed?: boolean;
}

export function TableScreen({ game, openSheet, onEnd, onUndo, dimmed }: Props) {
  const { width: screenW, height: screenH } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const n = game.setup.n;
  const dealer = dealerOf(game.round, n);
  const playerWind = (i: number) => (i - dealer + n) % n;

  const seats =
    n === 4
      ? [
          { idx: 0, pos: 'bottom' as const },
          { idx: 1, pos: 'right' as const },
          { idx: 2, pos: 'top' as const },
          { idx: 3, pos: 'left' as const },
        ]
      : [
          { idx: 0, pos: 'bottom' as const },
          { idx: 1, pos: 'right' as const },
          { idx: 2, pos: 'left' as const },
        ];

  // Card position calculator — compensates for RN rotation not affecting layout
  // Visual size after rotation: bottom/top → W×H, left/right → H×W
  const edgeInset = 18;

  function cardStyle(pos: 'bottom' | 'top' | 'left' | 'right') {
    switch (pos) {
      case 'bottom':
        return {
          left: (screenW - CARD_W) / 2,
          bottom: insets.bottom + edgeInset,
          transform: [],
        };
      case 'top':
        return {
          left: (screenW - CARD_W) / 2,
          top: insets.top + edgeInset,
          transform: [{ rotate: '180deg' }],
        };
      case 'right': {
        // Visual center x = screenW - edgeInset - H/2, y = screenH/2
        // Layout: left = visualCenterX - W/2, top = screenH/2 - H/2
        const cx = screenW - edgeInset - CARD_H / 2;
        return {
          left: cx - CARD_W / 2,
          top: screenH / 2 - CARD_H / 2,
          transform: [{ rotate: '-90deg' }],
        };
      }
      case 'left': {
        const cx = edgeInset + CARD_H / 2;
        return {
          left: cx - CARD_W / 2,
          top: screenH / 2 - CARD_H / 2,
          transform: [{ rotate: '90deg' }],
        };
      }
    }
  }

  return (
    <View style={styles.root}>
      <FeltBackground />
      <CenterPanel game={game} openSheet={openSheet} onEnd={onEnd} onUndo={onUndo} />
      {seats.map(seat => {
        const p = game.players[seat.idx];
        const wind = WINDS[playerWind(seat.idx)];
        const isDealer = seat.idx === dealer;
        const posStyle = cardStyle(seat.pos);
        return (
          <View
            key={seat.idx}
            style={[styles.card, { width: CARD_W, height: CARD_H }, posStyle]}
          >
            <PlayerCard
              player={p}
              wind={wind}
              isDealer={isDealer}
            />
          </View>
        );
      })}
      {dimmed && (
        <BlurView style={StyleSheet.absoluteFill} intensity={22} tint="dark" />
      )}
    </View>
  );
}

interface PlayerCardProps {
  player: { name: string; score: number };
  wind: string;
  isDealer: boolean;
}

function PlayerCard({ player, wind, isDealer }: PlayerCardProps) {
  return (
    <LinearGradient
      colors={isDealer ? ['#2a1f0a', '#1a1208'] : ['#1c130a', '#0d0905']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[
        styles.cardBg,
        isDealer
          ? { borderColor: M.gold, borderWidth: 1.5, shadowColor: M.gold, shadowOpacity: 0.35, shadowRadius: 12 }
          : { borderColor: `${M.gold}66`, borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.7, shadowRadius: 8 },
      ]}
    >
      {/* wind chip */}
      <LinearGradient
        colors={isDealer ? [M.goldHi, M.gold, M.goldDeep] : ['#fffaee', M.ivory, M.bone]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={styles.windChip}
      >
        <Text style={[styles.windChipText, { color: isDealer ? M.redDeep : M.ink }]}>
          {wind}
        </Text>
      </LinearGradient>

      {/* name */}
      <Text
        style={[styles.playerName, { color: isDealer ? M.goldHi : M.ivory }]}
        numberOfLines={1}
      >
        {player.name}
        {isDealer && <Text style={styles.oyaLabel}> 親</Text>}
      </Text>

      {/* score */}
      <Text
        style={[
          styles.score,
          { color: player.score < 0 ? M.redHi : isDealer ? M.goldHi : M.ivory },
        ]}
      >
        {formatNum(player.score)}
      </Text>

    </LinearGradient>
  );
}

interface CenterPanelProps {
  game: Game;
  openSheet: () => void;
  onEnd: () => void;
  onUndo: () => void;
}

function CenterPanel({ game, openSheet, onEnd, onUndo }: CenterPanelProps) {
  const total = totalKyoku(game.setup);
  const passed = game.round.wind * game.setup.n + game.round.kyoku;

  return (
    <View style={styles.centerPanel}>
      <View style={styles.centerInner}>
      {/* lacquered round disk */}
      <LinearGradient
        colors={['#2a1a08', '#0a0604']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.disk}
      >
        {/* corner marks */}
        {[
          { top: 6, left: 6, transform: [] },
          { top: 6, right: 6, transform: [{ rotate: '90deg' }] },
          { bottom: 6, right: 6, transform: [{ rotate: '180deg' }] },
          { bottom: 6, left: 6, transform: [{ rotate: '270deg' }] },
        ].map((s, i) => (
          <View key={i} style={[styles.corner, s as any]} />
        ))}
        <View style={{ alignItems: 'center', gap: 3 }}>
          <Text style={styles.diskMeta}>
            {game.setup.mode === 'tonpu' ? '東風戦' : game.setup.mode === 'sanma' ? '三麻' : '半荘戦'}
            {'  '}
            <Text style={{ color: M.gold }}>{passed + 1}/{total}</Text>
          </Text>
          <Text style={styles.diskRound}>{roundLabel(game.round, game.setup)}</Text>
          <View style={styles.diskFooter}>
            <Text style={styles.diskDetail}>
              {game.round.honba}
              <Text style={{ color: M.ivoryDim }}> 本場</Text>
            </Text>
            <Text style={{ color: M.gold, opacity: 0.5 }}>  ·  </Text>
            <Text style={styles.diskDetail}>供託 {game.round.riichiSticks}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* end-round button */}
      <Pressable onPress={openSheet}>
        <LinearGradient
          colors={[M.goldHi, M.gold, M.goldDeep]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.endRoundBtn}
        >
          <Text style={styles.endRoundBtnText}>局終了</Text>
        </LinearGradient>
      </Pressable>

      {/* small actions */}
      <View style={styles.smallActions}>
        <SmallActionBtn onPress={onUndo} style={{ flex: 1 }}>戻る</SmallActionBtn>
        <SmallActionBtn onPress={onEnd} dangerous style={{ flex: 1 }}>終了</SmallActionBtn>
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  card: { position: 'absolute' },
  cardBg: {
    flex: 1, borderRadius: 8,
    shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  windChip: {
    position: 'absolute', top: 8, left: 10,
    width: 28, height: 28, borderRadius: 4,
    alignItems: 'center', justifyContent: 'center',
  },
  windChipText: { fontFamily: F.display, fontSize: 18, lineHeight: 22 },
  playerName: {
    position: 'absolute', top: 10, left: 46, right: 12,
    fontFamily: F.serifSemiBold, fontSize: 13, letterSpacing: 0.5,
  },
  oyaLabel: { fontSize: 10, color: M.gold, letterSpacing: 2 },
  score: {
    position: 'absolute', top: 26, left: 12, right: 12,
    fontFamily: F.serifBlack, fontSize: 28, letterSpacing: -0.5,
    textAlign: 'right',
    textShadowColor: '#000', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4,
  },
  centerPanel: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center',
    zIndex: 5, pointerEvents: 'box-none' as any,
  },
  centerInner: {
    width: 160, alignItems: 'stretch', gap: 8,
  },
  disk: {
    height: 82, borderRadius: 8,
    borderWidth: 1.5, borderColor: M.gold,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.7, shadowRadius: 10, elevation: 8,
  },
  corner: {
    position: 'absolute', width: 8, height: 8,
    borderTopWidth: 1.5, borderLeftWidth: 1.5, borderColor: M.gold,
  },
  diskMeta: { fontFamily: F.serifMedium, fontSize: 10, color: M.ivoryDim, letterSpacing: 2 },
  diskRound: {
    fontFamily: F.display, fontSize: 30, color: M.gold, lineHeight: 34,
    marginBottom: -4,
    textShadowColor: `${M.gold}88`, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10,
  },
  diskFooter: { flexDirection: 'row' },
  diskDetail: { fontFamily: F.serifMedium, fontSize: 10, color: M.ivory },
  endRoundBtn: {
    paddingVertical: 10, borderRadius: 4, alignItems: 'center',
    borderTopWidth: 1, borderTopColor: '#fff0c0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6, shadowRadius: 8, elevation: 6,
  },
  endRoundBtnText: { fontFamily: F.display, fontSize: 13, color: M.ink, letterSpacing: 2 },
  smallActions: { flexDirection: 'row', gap: 6 },
});
