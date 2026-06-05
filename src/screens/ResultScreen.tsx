import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FeltBackground } from '../components/FeltBackground';
import { GoldButton, InkButton } from '../components/atoms';
import { BannerAd } from '../components/BannerAd';
import { useTabletLayout } from '../layout';
import { M, F, formatNum } from '../theme';
import { settle } from '../logic';
import { useSubscription } from '../context/SubscriptionContext';
import { useInterstitialAd } from '../hooks/useInterstitialAd';
import type { Game, SettledPlayer } from '../types';

interface Props {
  game: Game;
  onRematch: () => void;
  onChangeSetup: () => void;
  onHome: () => void;
}

export function ResultScreen({ game, onRematch, onChangeSetup, onHome }: Props) {
  const insets = useSafeAreaInsets();
  const final = settle(game);
  const { isSubscribed, openModal } = useSubscription();
  useInterstitialAd(!isSubscribed);

  return (
    <View style={styles.root}>
      <FeltBackground />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* header */}
        <View style={styles.header}>
          <Text style={styles.title}>終　局</Text>
          <Text style={styles.subtitle}>
            {game.setup.mode === 'tonpu' ? '東風戦' : game.setup.mode === 'sanma' ? '三麻' : '半荘戦'}
            ・ 結果
          </Text>
        </View>

        {/* rankings */}
        <View style={{ gap: 8, marginBottom: 24 }}>
          {final.map((p, i) => <RankRow key={i} p={p} />)}
        </View>

        {/* stats */}
        <StatsSection game={game} />

        {/* actions */}
        <View style={{ gap: 10 }}>
          <GoldButton onPress={onRematch}>もう一戦</GoldButton>
          <InkButton onPress={onChangeSetup}>新規対局</InkButton>
          <Pressable onPress={onHome} style={styles.homeLink}>
            <Text style={styles.homeLinkText}>ホームへ</Text>
          </Pressable>
          <Pressable onPress={openModal} style={styles.removeAdsLink}>
            <Text style={styles.removeAdsText}>✦ 広告を非表示にする</Text>
          </Pressable>
        </View>
      </ScrollView>
      <View style={{ paddingBottom: insets.bottom }}>
        <BannerAd />
      </View>
    </View>
  );
}

function StatsSection({ game }: { game: Game }) {
  const results = game.handResults ?? [];
  if (results.length === 0) return null;

  const total = results.length;
  const draws = results.filter(r => r.type === 'ryukyoku').length;

  return (
    <View style={styles.statsContainer}>
      <View style={styles.statsHeader}>
        <Text style={styles.statsTitle}>対局統計</Text>
        <Text style={styles.statsSummary}>全 {total} 局  ·  流局 {draws} 局</Text>
      </View>
      <View style={styles.statsTableHeader}>
        <View style={{ flex: 2 }} />
        <Text style={styles.statsColLabel}>リーチ</Text>
        <Text style={styles.statsColLabel}>和了</Text>
        <Text style={styles.statsColLabel}>放銃</Text>
      </View>
      {game.players.map((p, i) => (
        <View key={i} style={styles.statsRow}>
          <Text style={styles.statsPlayerName} numberOfLines={1}>{p.name}</Text>
          <Text style={styles.statsCell}>{results.filter(r => r.riichi.includes(i)).length}</Text>
          <Text style={styles.statsCell}>{results.filter(r => r.winners.includes(i)).length}</Text>
          <Text style={styles.statsCell}>{results.filter(r => r.dealIn === i).length}</Text>
        </View>
      ))}
    </View>
  );
}

function RankRow({ p }: { p: SettledPlayer }) {
  const { scale } = useTabletLayout();
  const isFirst = p.rank === 1;
  return (
    <LinearGradient
      colors={isFirst ? ['#2a1f0a', '#1a1208'] : ['#1c130a', '#0d0905']}
      start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
      style={[styles.rankRow, isFirst && { borderColor: M.gold, borderWidth: 1.5 }]}
    >
      {/* badge */}
      <LinearGradient
        colors={isFirst ? [M.goldHi, M.gold, M.goldDeep] : ['#3a2c18', '#1a1208']}
        start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }}
        style={styles.rankBadge}
      >
        <Text style={[styles.rankNum, { color: isFirst ? M.redDeep : M.ivoryDim }]}>
          {p.rank}
        </Text>
        <Text style={[styles.rankSuffix, { color: isFirst ? M.redDeep : M.ivoryDim }]}>位</Text>
      </LinearGradient>

      {/* info */}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Text style={[styles.rankName, { color: isFirst ? M.goldHi : M.ivory, flex: 1 }]} numberOfLines={1}>
            {p.name}
          </Text>
          <Text style={[styles.rankScore, { fontSize: Math.round(12 * scale), color: isFirst ? M.goldHi : M.ivoryDim }]}>
            {formatNum(p.score)}点
          </Text>
        </View>
        <Text style={styles.rankDetail}>
          {'素点 '}{p.raw >= 0 ? '+' : ''}{p.raw.toFixed(1)}
          {p.uma !== 0 && `　ウマ ${p.uma > 0 ? '+' : ''}${p.uma}`}
          {p.oka !== 0 && `　オカ +${p.oka}`}
          {p.tobi !== 0 && `　飛ばし ${p.tobi > 0 ? '+' : ''}${p.tobi}`}
          {p.yakitori !== 0 && `　焼き鳥 ${p.yakitori > 0 ? '+' : ''}${p.yakitori}`}
        </Text>
      </View>

      {/* total */}
      <Text
        style={[
          styles.rankTotal,
          {
            fontSize: Math.round(26 * scale),
            width: Math.round(90 * scale),
            color: p.total >= 0 ? (isFirst ? M.goldHi : M.green) : M.redHi,
          },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {p.total >= 0 ? '+' : ''}{p.total.toFixed(1)}
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 18 },
  header: { alignItems: 'center', marginBottom: 20 },
  title: {
    fontFamily: F.display, fontSize: 26, color: M.gold, letterSpacing: 6,
    textShadowColor: `${M.gold}55`, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 14,
  },
  subtitle: { fontFamily: F.serif, fontSize: 11, color: M.ivoryDim, marginTop: 4, letterSpacing: 4 },
  rankRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14, borderRadius: 6,
    borderWidth: 1, borderColor: `${M.gold}66`,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4, shadowRadius: 4, elevation: 4,
  },
  rankBadge: {
    width: 44, height: 44, borderRadius: 4,
    flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center',
    paddingBottom: 4,
    borderWidth: 1, borderColor: `${M.gold}55`,
  },
  rankNum: { fontFamily: F.display, fontSize: 22 },
  rankSuffix: { fontFamily: F.display, fontSize: 9, marginBottom: 2, marginLeft: 1 },
  rankName: { fontFamily: F.serifBold, fontSize: 16 },
  rankScore: { fontFamily: F.serif, fontSize: 12, marginLeft: 8 },
  rankDetail: { fontFamily: F.serif, fontSize: 11, color: M.ivoryDim, marginTop: 3 },
  rankTotal: { fontFamily: F.display, fontSize: 26, letterSpacing: -0.5, width: 90, textAlign: 'right' },
  statsContainer: {
    marginBottom: 28,
    borderRadius: 6,
    borderWidth: 1, borderColor: `${M.gold}44`,
    overflow: 'hidden',
  },
  statsHeader: {
    flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between',
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: 'rgba(255,210,100,0.06)',
    borderBottomWidth: 1, borderBottomColor: `${M.gold}33`,
  },
  statsTitle: { fontFamily: F.display, fontSize: 13, color: M.gold, letterSpacing: 3 },
  statsSummary: { fontFamily: F.serif, fontSize: 11, color: M.ivoryDim },
  statsTableHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 6,
    borderBottomWidth: 1, borderBottomColor: `${M.gold}22`,
  },
  statsColLabel: { flex: 1, fontFamily: F.serifMedium, fontSize: 10, color: M.gold, textAlign: 'center', letterSpacing: 1 },
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 8,
    borderBottomWidth: 1, borderBottomColor: `${M.gold}18`,
  },
  statsPlayerName: { flex: 2, fontFamily: F.serifSemiBold, fontSize: 13, color: M.ivory },
  statsCell: { flex: 1, fontFamily: F.serifBold, fontSize: 14, color: M.ivoryDim, textAlign: 'center' },
  homeLink: { alignItems: 'center', paddingVertical: 10 },
  homeLinkText: { fontFamily: F.serif, fontSize: 15, color: M.ivory, letterSpacing: 4, opacity: 0.75 },
  removeAdsLink: { alignItems: 'center', paddingVertical: 8 },
  removeAdsText: { fontFamily: F.serifMedium, fontSize: 14, color: M.gold, letterSpacing: 2, opacity: 0.9 },
});
