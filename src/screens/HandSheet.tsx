import React, { useState } from 'react';
import {
  View, Text, Modal, Pressable, ScrollView,
  TextInput, StyleSheet, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WindTile, Segment, GoldButton, InkButton, Toggle } from '../components/atoms';
import { M, F, formatNum } from '../theme';
import {
  WINDS, dealerOf, roundLabel,
  applyTsumo, applyRon, applyRyukyoku, applyOverwrite, calcFuScore,
} from '../logic';
import type { Game } from '../types';

interface Props {
  game: Game;
  visible: boolean;
  onClose: () => void;
  onApply: (g: Game) => void;
}

export function HandSheet({ game, visible, onClose, onApply }: Props) {
  const [tab, setTab] = useState<'move' | 'overwrite'>(game.setup.inputMode);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={e => e.stopPropagation()}>
          <View style={styles.handle} />
          <Text style={styles.title}>{roundLabel(game.round, game.setup)} 終了</Text>
          <Text style={styles.meta}>{game.round.honba}本場 ・ 供託 {game.round.riichiSticks}</Text>
          <View style={styles.tabRow}>
            <Segment
              options={[
                { value: 'move', label: '内容入力' },
                { value: 'overwrite', label: '点数入力' },
              ]}
              value={tab}
              onChange={setTab}
            />
          </View>
          <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.tabContent}>
              {tab === 'move'
                ? <MoveTab game={game} onApply={onApply} onClose={onClose} />
                : <OverwriteTab game={game} onApply={onApply} onClose={onClose} />
              }
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── 符計算 constants ─────────────────────────────────────────

const HAN_OPTIONS = [
  { han: 1, label: '1飜' },
  { han: 2, label: '2飜' },
  { han: 3, label: '3飜' },
  { han: 4, label: '4飜' },
  { han: 5, label: '満貫' },
  { han: 6, label: '跳満' },
  { han: 8, label: '倍満' },
  { han: 11, label: '三倍満' },
  { han: 13, label: '役満' },
];

const FU_OPTIONS = [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110];

// ─── MoveTab ─────────────────────────────────────────────────

function MoveTab({ game, onApply, onClose }: { game: Game; onApply: (g: Game) => void; onClose: () => void }) {
  const [type, setType] = useState<'tsumo' | 'ron' | 'ryukyoku'>('tsumo');
  const [winner, setWinner] = useState<number | null>(null);
  const [loser, setLoser] = useState<number | null>(null);
  const [points, setPoints] = useState(8000);
  const [koPay, setKoPay] = useState(2000);
  const [oyaPay, setOyaPay] = useState(4000);
  const [riichi, setRiichi] = useState(() => game.players.map(() => false));
  const [tenpai, setTenpai] = useState(() => game.players.map(() => false));
  const [calcMode, setCalcMode] = useState<'preset' | 'fu'>('preset');
  const [han, setHan] = useState(1);
  const [fu, setFu] = useState(30);

  const dealer = dealerOf(game.round, game.setup.n);
  const winnerIsDealer = winner === dealer;

  const canApply =
    type === 'ryukyoku' ||
    (type === 'tsumo' && winner !== null) ||
    (type === 'ron' && winner !== null && loser !== null);

  const apply = () => {
    if (!canApply) return;
    const ri = riichi.map((r, i) => (r ? i : -1)).filter(x => x >= 0);
    let newG: Game;
    if (type === 'tsumo' && winner !== null) {
      if (calcMode === 'fu') {
        const { koPay: fKo, oyaPay: fOya } = calcFuScore(han, fu, winnerIsDealer);
        newG = applyTsumo(game, winner, fKo, fOya, ri);
      } else {
        newG = applyTsumo(game, winner, koPay, winnerIsDealer ? koPay : oyaPay, ri);
      }
    } else if (type === 'ron' && winner !== null && loser !== null) {
      if (calcMode === 'fu') {
        const { ron: fRon } = calcFuScore(han, fu, winnerIsDealer);
        newG = applyRon(game, winner, loser, fRon, ri);
      } else {
        newG = applyRon(game, winner, loser, points, ri);
      }
    } else {
      newG = applyRyukyoku(game, tenpai, ri);
    }
    onApply(newG);
    onClose();
  };

  const RON_PRESETS = [1000, 2000, 3900, 5200, 8000, 12000, 16000, 24000, 32000];
  const TSUMO_PRESETS = winnerIsDealer
    ? [[1000,1000],[2000,2000],[2600,2600],[4000,4000],[6000,6000],[8000,8000]]
    : [[500,1000],[1000,2000],[1300,2600],[2000,4000],[3000,6000],[4000,8000]];

  const resetType = (t: 'tsumo' | 'ron' | 'ryukyoku') => {
    setType(t); setWinner(null); setLoser(null);
  };

  return (
    <View style={{ gap: 14 }}>
      {/* tsumo / ron / ryukyoku */}
      <View style={styles.typeRow}>
        {[
          { v: 'tsumo', l: 'ツモ' },
          { v: 'ron', l: 'ロン' },
          { v: 'ryukyoku', l: '流局' },
        ].map(t => (
          <Pressable key={t.v} onPress={() => resetType(t.v as any)} style={{ flex: 1 }}>
            <LinearGradient
              colors={type === t.v ? [M.red, M.redDeep] : ['transparent', 'transparent']}
              style={[styles.typeBtn, type !== t.v && { borderColor: `${M.gold}55`, borderWidth: 1 }]}
            >
              <Text style={[styles.typeBtnText, type !== t.v && { color: M.ivoryDim }]}>
                {t.l}
              </Text>
            </LinearGradient>
          </Pressable>
        ))}
      </View>

      {type !== 'ryukyoku' && (
        <Block label="和了">
          <PlayerPicker game={game} value={winner} onChange={setWinner} dealerIdx={dealer} disabled={null} />
        </Block>
      )}

      {type === 'ron' && (
        <Block label="放銃">
          <PlayerPicker game={game} value={loser} onChange={setLoser} dealerIdx={dealer} disabled={winner} />
        </Block>
      )}

      {/* 点数入力 — ロン */}
      {type === 'ron' && winner !== null && loser !== null && (
        <Block label="点数">
          <View style={styles.calcModeRow}>
            <PointChip active={calcMode === 'preset'} onPress={() => setCalcMode('preset')} style={{ flex: 1 }}>プリセット</PointChip>
            <PointChip active={calcMode === 'fu'} onPress={() => setCalcMode('fu')} style={{ flex: 1 }}>符計算</PointChip>
          </View>
          {calcMode === 'preset' ? (
            <>
              <View style={{ gap: 6, marginBottom: 8 }}>
                {[0, 1, 2].map(row => (
                  <View key={row} style={{ flexDirection: 'row', gap: 6 }}>
                    {RON_PRESETS.slice(row * 3, row * 3 + 3).map(p => (
                      <PointChip key={p} active={points === p} onPress={() => setPoints(p)} style={{ flex: 1 }}>
                        {formatNum(p)}
                      </PointChip>
                    ))}
                  </View>
                ))}
              </View>
              <TextInput
                value={String(points)}
                onChangeText={t => setPoints(parseInt(t, 10) || 0)}
                keyboardType="number-pad"
                style={styles.bigInput}
              />
            </>
          ) : (
            <FuCalcSection
              han={han} setHan={setHan}
              fu={fu} setFu={setFu}
              type="ron" winnerIsDealer={winnerIsDealer}
            />
          )}
        </Block>
      )}

      {/* 点数入力 — ツモ */}
      {type === 'tsumo' && winner !== null && (
        <Block label={winnerIsDealer ? '点数（オール）' : '点数（子/親）'}>
          <View style={styles.calcModeRow}>
            <PointChip active={calcMode === 'preset'} onPress={() => setCalcMode('preset')} style={{ flex: 1 }}>プリセット</PointChip>
            <PointChip active={calcMode === 'fu'} onPress={() => setCalcMode('fu')} style={{ flex: 1 }}>符計算</PointChip>
          </View>
          {calcMode === 'preset' ? (
            <View style={{ gap: 6 }}>
              {[0, 1].map(row => (
                <View key={row} style={{ flexDirection: 'row', gap: 6 }}>
                  {TSUMO_PRESETS.slice(row * 3, row * 3 + 3).map((p, i) => (
                    <PointChip
                      key={i}
                      active={koPay === p[0] && oyaPay === p[1]}
                      onPress={() => { setKoPay(p[0]); setOyaPay(p[1]); }}
                      style={{ flex: 1 }}
                    >
                      {winnerIsDealer ? formatNum(p[0]) : `${formatNum(p[0])}/${formatNum(p[1])}`}
                    </PointChip>
                  ))}
                </View>
              ))}
            </View>
          ) : (
            <FuCalcSection
              han={han} setHan={setHan}
              fu={fu} setFu={setFu}
              type="tsumo" winnerIsDealer={winnerIsDealer}
            />
          )}
        </Block>
      )}

      {type === 'ryukyoku' && (
        <Block label="テンパイ">
          {game.players.map((p, i) => (
            <CheckRow
              key={i} player={p} idx={i} dealer={dealer} n={game.setup.n}
              checked={tenpai[i]}
              onChange={v => { const a = [...tenpai]; a[i] = v; setTenpai(a); }}
            />
          ))}
        </Block>
      )}

      <Block label="リーチ（今局）">
        {game.players.map((p, i) => (
          <CheckRow
            key={i} player={p} idx={i} dealer={dealer} n={game.setup.n}
            checked={riichi[i]}
            onChange={v => { const a = [...riichi]; a[i] = v; setRiichi(a); }}
          />
        ))}
      </Block>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
        <InkButton onPress={onClose} style={{ flex: 1 }}>キャンセル</InkButton>
        <GoldButton onPress={apply} disabled={!canApply} style={{ flex: 1 }}>確 定</GoldButton>
      </View>
    </View>
  );
}

// ─── FuCalcSection ───────────────────────────────────────────

function FuCalcSection({
  han, setHan, fu, setFu, type, winnerIsDealer,
}: {
  han: number;
  setHan: (h: number) => void;
  fu: number;
  setFu: (f: number) => void;
  type: 'ron' | 'tsumo';
  winnerIsDealer: boolean;
}) {
  const showFu = han <= 4;
  const result = calcFuScore(han, fu, winnerIsDealer);

  return (
    <View style={{ gap: 8 }}>
      <Text style={styles.fuSubLabel}>飜数</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {HAN_OPTIONS.map(opt => (
          <PointChip key={opt.han} active={han === opt.han} onPress={() => setHan(opt.han)} style={{ minWidth: 52 }}>
            {opt.label}
          </PointChip>
        ))}
      </View>

      {showFu && (
        <>
          <Text style={styles.fuSubLabel}>符数</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {FU_OPTIONS.map(f => (
              <PointChip key={f} active={fu === f} onPress={() => setFu(f)} style={{ minWidth: 44 }}>
                {String(f)}
              </PointChip>
            ))}
          </View>
        </>
      )}

      <View style={styles.fuResultBox}>
        {type === 'ron' && (
          <Text style={styles.fuResultText}>ロン　{formatNum(result.ron)}点</Text>
        )}
        {type === 'tsumo' && winnerIsDealer && (
          <Text style={styles.fuResultText}>ツモ　全員 {formatNum(result.koPay)}点</Text>
        )}
        {type === 'tsumo' && !winnerIsDealer && (
          <Text style={styles.fuResultText}>子 {formatNum(result.koPay)} / 親 {formatNum(result.oyaPay)}点</Text>
        )}
      </View>
    </View>
  );
}

// ─── OverwriteTab ────────────────────────────────────────────

function OverwriteTab({ game, onApply, onClose }: { game: Game; onApply: (g: Game) => void; onClose: () => void }) {
  const [scores, setScores] = useState(() => game.players.map(p => p.score));
  const [renchan, setRenchan] = useState(false);
  const dealer = dealerOf(game.round, game.setup.n);
  const expected = game.setup.startScore * game.setup.n;

  const apply = () => {
    const total = scores.reduce((a, b) => a + b, 0);
    if (total !== expected) {
      const diff = total - expected;
      Alert.alert(
        '合計が合いません',
        `合計 ${formatNum(total)}点（${diff > 0 ? '+' : ''}${formatNum(diff)}点）`,
        [{ text: 'OK' }],
      );
      return;
    }
    onApply(applyOverwrite(game, scores, renchan));
    onClose();
  };

  return (
    <View style={{ gap: 10 }}>
      {game.players.map((p, i) => (
        <View key={i} style={styles.overwriteRow}>
          <WindTile
            wind={WINDS[(i - dealer + game.setup.n) % game.setup.n]}
            oya={i === dealer}
            size={36}
          />
          <Text style={styles.overwriteName}>{p.name}</Text>
          <TextInput
            value={String(scores[i])}
            onChangeText={t => {
              const a = [...scores]; a[i] = parseInt(t, 10) || 0; setScores(a);
            }}
            keyboardType="number-pad"
            style={[styles.bigInput, { width: 130, textAlign: 'right' }]}
          />
        </View>
      ))}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 }}>
        <Text style={{ fontFamily: F.serifSemiBold, fontSize: 13, color: M.ivory }}>親が連荘</Text>
        <Toggle value={renchan} onChange={setRenchan} />
      </View>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
        <InkButton onPress={onClose} style={{ flex: 1 }}>キャンセル</InkButton>
        <GoldButton onPress={apply} style={{ flex: 1 }}>確 定</GoldButton>
      </View>
    </View>
  );
}

// ─── Sub-components ──────────────────────────────────────────

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={styles.blockLabel}>{label}</Text>
      {children}
    </View>
  );
}

function PlayerPicker({
  game, value, onChange, dealerIdx, disabled,
}: {
  game: Game;
  value: number | null;
  onChange: (i: number) => void;
  dealerIdx: number;
  disabled: number | null;
}) {
  return (
    <View style={styles.pickerGrid}>
      {game.players.map((p, i) => {
        const wind = WINDS[(i - dealerIdx + game.setup.n) % game.setup.n];
        const active = i === value;
        const dim = i === disabled;
        return (
          <Pressable
            key={i}
            onPress={() => !dim && onChange(i)}
            style={{ flex: 1 }}
            disabled={dim}
          >
            <LinearGradient
              colors={active ? [M.goldHi, M.gold, M.goldDeep] : ['#2c1f12', '#1a1208']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={[styles.pickerBtn, dim && { opacity: 0.4 }]}
            >
              <Text style={[styles.pickerWind, { color: active ? M.redDeep : i === dealerIdx ? M.gold : M.ivoryDim }]}>
                {wind}
              </Text>
              <Text style={[styles.pickerName, { color: active ? M.ink : M.ivory }]} numberOfLines={1}>
                {p.name}
              </Text>
            </LinearGradient>
          </Pressable>
        );
      })}
    </View>
  );
}

function CheckRow({
  player, idx, dealer, n, checked, onChange,
}: {
  player: { name: string };
  idx: number;
  dealer: number;
  n: number;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const wind = WINDS[(idx - dealer + n) % n];
  return (
    <Pressable onPress={() => onChange(!checked)}>
      <LinearGradient
        colors={checked ? [M.feltHi, M.feltMid] : ['#2c1f12', '#1a1208']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.checkRow, checked && { borderColor: M.gold }]}
      >
        <View style={[styles.checkbox, checked && { backgroundColor: M.gold }]}>
          {checked && <Text style={{ color: M.ink, fontWeight: '800', fontSize: 14 }}>✓</Text>}
        </View>
        <Text style={[styles.checkWind, { color: idx === dealer ? M.gold : M.ivoryDim }]}>{wind}</Text>
        <Text style={styles.checkName}>{player.name}</Text>
      </LinearGradient>
    </Pressable>
  );
}

function PointChip({ active, onPress, children, style }: { active: boolean; onPress: () => void; children: string; style?: any }) {
  return (
    <Pressable onPress={onPress} style={style}>
      <LinearGradient
        colors={active ? [M.gold, M.goldDeep] : ['#2c1f12', '#1a1208']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.pointChip, !active && { borderWidth: 1, borderColor: `${M.gold}55` }]}
      >
        <Text style={[styles.pointChipText, { color: active ? M.ink : M.ivory }]}>{children}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#120a05',
    borderTopLeftRadius: 16, borderTopRightRadius: 16,
    borderTopWidth: 1, borderColor: `${M.gold}66`,
    maxHeight: '90%',
    shadowColor: '#000', shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.8, shadowRadius: 20, elevation: 20,
  },
  handle: {
    width: 50, height: 4, borderRadius: 2,
    backgroundColor: M.gold, opacity: 0.5, alignSelf: 'center', marginTop: 8,
  },
  title: {
    fontFamily: F.display, fontSize: 18, color: M.gold, letterSpacing: 4,
    textAlign: 'center', marginTop: 8,
  },
  meta: {
    fontFamily: F.serif, fontSize: 11, color: M.ivoryDim,
    textAlign: 'center', marginTop: 2, marginBottom: 12,
  },
  tabRow: { paddingHorizontal: 18, marginBottom: 4 },
  scroll: { flexGrow: 0 },
  tabContent: { padding: 18, paddingBottom: 36 },
  typeRow: { flexDirection: 'row', gap: 6 },
  typeBtn: { padding: 12, borderRadius: 4, alignItems: 'center' },
  typeBtnText: { fontFamily: F.display, fontSize: 15, color: '#fef0e3', letterSpacing: 2 },
  blockLabel: { fontFamily: F.serifMedium, fontSize: 11, color: M.gold, letterSpacing: 4 },
  calcModeRow: { flexDirection: 'row', gap: 6 },
  fuSubLabel: { fontFamily: F.serifMedium, fontSize: 10, color: M.ivoryDim, letterSpacing: 3 },
  fuResultBox: {
    backgroundColor: 'rgba(0,0,0,0.35)', padding: 14, borderRadius: 8,
    borderWidth: 1, borderColor: `${M.gold}44`, alignItems: 'center', marginTop: 2,
  },
  fuResultText: { fontFamily: F.display, fontSize: 20, color: M.gold, letterSpacing: 2 },
  pickerGrid: { flexDirection: 'row', gap: 6 },
  pickerBtn: { padding: 10, borderRadius: 4, alignItems: 'center', gap: 2, borderWidth: 1, borderColor: `${M.gold}55` },
  pickerWind: { fontFamily: F.display, fontSize: 13, fontWeight: '800' },
  pickerName: { fontFamily: F.serifSemiBold, fontSize: 11, maxWidth: 60 },
  checkRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 10, borderRadius: 4, borderWidth: 1, borderColor: `${M.gold}33`,
  },
  checkbox: {
    width: 22, height: 22, borderRadius: 3,
    borderWidth: 1.5, borderColor: M.gold,
    alignItems: 'center', justifyContent: 'center',
  },
  checkWind: { fontFamily: F.display, fontSize: 13, minWidth: 18 },
  checkName: { fontFamily: F.serifSemiBold, fontSize: 14, color: M.ivory, flex: 1 },
  presetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  pointChip: { paddingVertical: 12, paddingHorizontal: 8, borderRadius: 4, alignItems: 'center' },
  pointChipText: { fontFamily: F.serifBold, fontSize: 12 },
  bigInput: {
    paddingVertical: 12, paddingHorizontal: 12, borderRadius: 4,
    backgroundColor: M.inkSoft, color: M.gold, textAlign: 'center',
    fontFamily: F.serifBold, fontSize: 18,
    borderWidth: 1, borderColor: `${M.gold}55`,
  },
  overwriteRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  overwriteName: { flex: 1, fontFamily: F.serifSemiBold, fontSize: 14, color: M.ivory },
});
