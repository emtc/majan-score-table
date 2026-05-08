import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FeltBackground } from '../components/FeltBackground';
import { GoldButton } from '../components/atoms';
import { BannerAd } from '../components/BannerAd';
import { ScorePanelSvg } from '../components/ScorePanelSvg';
import { M, F } from '../theme';
interface Props {
  onNew: () => void;
}

function GoldDivider() {
  return (
    <View style={styles.divider}>
      <LinearGradient
        colors={['rgba(212,166,74,0)', 'rgba(212,166,74,0.75)']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.dividerLine}
      />
      <LinearGradient
        colors={['#fff8e0', '#d4a64a', '#7a5510']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.dividerDiamond}
      />
      <LinearGradient
        colors={['rgba(212,166,74,0.75)', 'rgba(212,166,74,0)']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.dividerLine}
      />
    </View>
  );
}

export function HomeScreen({ onNew }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      <FeltBackground />
      <View style={[styles.inner, { paddingTop: insets.top + 44, paddingBottom: Math.max(insets.bottom + 32, 40) }]}>
        {/* title block */}
        <View style={styles.titleBlock}>
          <GoldDivider />
          <Text style={styles.subLabel}>MAHJONG　SCORE</Text>
          <View style={styles.kanjiRow}>
            <Text style={styles.kanjiLarge}>麻</Text>
            <Text style={styles.kanjiLarge}>雀</Text>
          </View>
          <View style={styles.kanjiRow}>
            <Text style={styles.kanjiLarge}>点</Text>
            <Text style={styles.kanjiLarge}>数</Text>
            <Text style={styles.kanjiLarge}>卓</Text>
          </View>
          <GoldDivider />
        </View>

        {/* score panel */}
        <ScorePanelSvg size={260} />

        {/* buttons */}
        <View style={styles.buttons}>
          <GoldButton onPress={onNew} style={styles.mainBtn}>
            対局開始
          </GoldButton>
          <Text style={styles.hint}>スマホを卓上に置いて各プレイヤーの点数を共有できます</Text>
          <BannerAd />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  inner: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'space-between',
  },
  titleBlock: { alignItems: 'center', gap: 0 },
  subLabel: { fontFamily: F.displayBold, fontSize: 10, color: M.gold, letterSpacing: 4, marginTop: 14, marginBottom: 8 },
  kanjiRow: { flexDirection: 'row', gap: 4, marginBottom: 4 },
  kanjiLarge: {
    fontFamily: F.display, fontSize: 64, color: M.ivory,
    lineHeight: 80,
    textShadowColor: '#000', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4,
  },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 4 },
  dividerLine: { width: 72, height: 1 },
  dividerDiamond: {
    width: 9, height: 9,
    transform: [{ rotate: '45deg' }],
    shadowColor: M.gold, shadowOpacity: 0.6, shadowRadius: 4, shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
  buttons: { width: '100%', paddingHorizontal: 28, gap: 16 },
  mainBtn: { width: '100%' },
  hint: {
    fontFamily: F.serif, fontSize: 11, color: M.ivoryDim,
    textAlign: 'center', letterSpacing: 1, marginTop: 6, opacity: 0.6,
    lineHeight: 18,
  },
});
