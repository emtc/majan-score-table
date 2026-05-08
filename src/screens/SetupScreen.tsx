import React, { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, TextInput, StyleSheet, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FeltBackground } from '../components/FeltBackground';
import {
  WindTile, Segment, Toggle, NumField, GoldButton, InkButton,
  SectionHeader, SectionBox, RowToggle,
} from '../components/atoms';
import { M, F } from '../theme';
import type { Setup } from '../types';

const DEFAULT_SETUP: Omit<Setup, 'n'> = {
  mode: 'hanchan',
  players: ['', '', '', ''],
  startScore: 25000,
  returnScore: 30000,
  uma: '10-30',
  umaCustom: [20, 10, -10, -20],
  oka: true,
  tobi: false,
  tobiAmount: 10,
  yakitori: false,
  yakitoriAmount: 10,
  inputMode: 'move',
};

interface Props {
  initial?: Omit<Setup, 'n'> | null;
  onStart: (s: Omit<Setup, 'n'>) => void;
  onBack: () => void;
}

export function SetupScreen({ initial, onStart, onBack }: Props) {
  const [s, setS] = useState<Omit<Setup, 'n'>>(initial || DEFAULT_SETUP);
  const insets = useSafeAreaInsets();
  const [headerH, setHeaderH] = useState(90);

  const set = <K extends keyof typeof s>(k: K, v: typeof s[K]) =>
    setS(prev => ({ ...prev, [k]: v }));

  const n = s.mode === 'sanma' ? 3 : 4;
  const WINDS = ['東', '南', '西', '北'];

  return (
    <View style={styles.root}>
      <FeltBackground />

      {/* header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]} onLayout={e => setHeaderH(e.nativeEvent.layout.height)}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← 戻る</Text>
        </Pressable>
        <Text style={styles.headerTitle}>設定</Text>
        <View style={{ width: 56 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: headerH + 8, paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ルール */}
        <View style={styles.section}>
          <SectionHeader title="ルール" />
          <SectionBox>
            <Segment
              options={[
                { value: 'tonpu', label: '東風戦' },
                { value: 'hanchan', label: '半荘戦' },
                { value: 'sanma', label: '三麻' },
              ]}
              value={s.mode}
              onChange={v => set('mode', v as typeof s.mode)}
            />
          </SectionBox>
        </View>

        {/* プレイヤー */}
        <View style={styles.section}>
          <SectionHeader title={`プレイヤー（${n}人）`} />
          <SectionBox>
            <View style={{ gap: 10 }}>
              {Array.from({ length: n }).map((_, i) => (
                <View key={i} style={styles.playerRow}>
                  <WindTile wind={WINDS[i]} oya={i === 0} size={36} />
                  <TextInput
                    value={s.players[i] || ''}
                    onChangeText={t => {
                      const np = [...s.players]; np[i] = t; set('players', np);
                    }}
                    placeholder={`プレイヤー${i + 1}`}
                    placeholderTextColor={M.ivoryDim}
                    style={styles.playerInput}
                  />
                </View>
              ))}
            </View>
          </SectionBox>
        </View>

        {/* 持ち点・返し点 */}
        <View style={styles.section}>
          <SectionHeader title="持ち点・返し点" />
          <SectionBox>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>持ち点</Text>
                <NumField value={s.startScore} onChange={v => set('startScore', v)} step={1000} min={1000} suffix="" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>返し点</Text>
                <NumField value={s.returnScore} onChange={v => set('returnScore', v)} step={1000} min={1000} suffix="" />
              </View>
            </View>
          </SectionBox>
        </View>

        {/* ウマ */}
        <View style={styles.section}>
          <SectionHeader title="ウマ" />
          <SectionBox>
            <Segment
              options={[
                { value: '10-30', label: '10-30' },
                { value: '5-10', label: '5-10' },
                { value: 'none', label: 'なし' },
                { value: 'custom', label: '任意' },
              ]}
              value={s.uma}
              onChange={v => set('uma', v as typeof s.uma)}
            />
            {s.uma === 'custom' && (
              <View style={[styles.umaGrid, { marginTop: 12 }]}>
                {Array.from({ length: n }).map((_, i) => (
                  <View key={i} style={{ flex: 1 }}>
                    <Text style={styles.umaRankLabel}>{i + 1}位</Text>
                    <TextInput
                      value={String(s.umaCustom[i] ?? 0)}
                      onChangeText={t => {
                        const a = [...s.umaCustom];
                        a[i] = parseInt(t, 10) || 0;
                        set('umaCustom', a);
                      }}
                      keyboardType="numeric"
                      style={styles.umaInput}
                    />
                  </View>
                ))}
              </View>
            )}
          </SectionBox>
        </View>

        {/* オカ */}
        <View style={styles.section}>
          <SectionHeader title="オカ" />
          <SectionBox>
            <RowToggle
              label="オカあり"
              hint={`返し点ぶんを1位に（${(s.returnScore - s.startScore) * n / 1000} pt）`}
              value={s.oka}
              onChange={v => set('oka', v)}
            />
          </SectionBox>
        </View>

        {/* 飛び賞 */}
        <View style={styles.section}>
          <SectionHeader title="飛び賞" />
          <SectionBox>
            <RowToggle label="飛びあり" value={s.tobi} onChange={v => set('tobi', v)} />
            {s.tobi && (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.fieldLabel}>飛び賞（pt）</Text>
                <NumField value={s.tobiAmount} onChange={v => set('tobiAmount', v)} step={5} min={0} suffix="pt" />
              </View>
            )}
          </SectionBox>
        </View>

        {/* 焼き鳥 */}
        <View style={styles.section}>
          <SectionHeader title="焼き鳥" />
          <SectionBox>
            <RowToggle label="焼き鳥あり" value={s.yakitori} onChange={v => set('yakitori', v)} />
            {s.yakitori && (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.fieldLabel}>焼き鳥代（pt）</Text>
                <NumField value={s.yakitoriAmount} onChange={v => set('yakitoriAmount', v)} step={5} min={0} suffix="pt" />
              </View>
            )}
          </SectionBox>
        </View>

        {/* 入力モード */}
        <View style={styles.section}>
          <SectionHeader title="入力モード（デフォルト）" />
          <SectionBox>
            <Segment
              options={[
                { value: 'move', label: '内容入力' },
                { value: 'overwrite', label: '点数入力' },
              ]}
              value={s.inputMode}
              onChange={v => set('inputMode', v as typeof s.inputMode)}
            />
            <Text style={styles.modeHint}>
              {s.inputMode === 'move'
                ? '和了形式（ツモ・ロン・流局）から入力 — 自動計算します。'
                : `${n}人それぞれの点数を直接入力 — 手動で書き換えます。`}
            </Text>
          </SectionBox>
        </View>

        {/* actions */}
        <View style={styles.actions}>
          <InkButton onPress={onBack} style={{ flex: 1 }}>キャンセル</InkButton>
          <GoldButton
            onPress={() => {
              if (s.oka && s.returnScore < s.startScore) {
                Alert.alert(
                  '設定エラー',
                  '返し点が持ち点より少ないとオカが正しく計算できません。\n返し点 ≥ 持ち点にしてください。',
                  [{ text: 'OK' }],
                );
                return;
              }
              onStart(s);
            }}
            style={{ flex: 1 }}
          >
            対局開始
          </GoldButton>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 18, paddingBottom: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  backBtn: { padding: 6 },
  backBtnText: { fontFamily: F.serifMedium, fontSize: 13, color: M.ivory, letterSpacing: 1 },
  headerTitle: { fontFamily: F.display, fontSize: 18, color: M.gold, letterSpacing: 3 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 18 },
  section: { marginTop: 22 },
  playerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  playerInput: {
    flex: 1, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 4,
    backgroundColor: M.inkSoft, color: M.ivory,
    fontFamily: F.serifMedium, fontSize: 15,
    borderWidth: 1, borderColor: `${M.gold}33`,
    textAlign: 'center',
  },
  fieldLabel: { fontFamily: F.serif, fontSize: 11, color: M.ivoryDim, marginBottom: 6, letterSpacing: 1 },
  umaGrid: { flexDirection: 'row', gap: 8 },
  umaRankLabel: { fontFamily: F.serif, fontSize: 11, color: M.ivoryDim, textAlign: 'center', marginBottom: 4 },
  umaInput: {
    paddingVertical: 8, paddingHorizontal: 4, borderRadius: 4,
    backgroundColor: M.inkSoft, color: M.ivory,
    fontFamily: F.serifBold, fontSize: 15,
    borderWidth: 1, borderColor: `${M.gold}33`, textAlign: 'center',
  },
  modeHint: { fontFamily: F.serif, fontSize: 11, color: M.ivoryDim, marginTop: 8, lineHeight: 18 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 24 },
});
