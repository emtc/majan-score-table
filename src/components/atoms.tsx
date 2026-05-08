import React from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { M, F, formatNum } from '../theme';

// ─── WindTile ────────────────────────────────────────────────

interface WindTileProps {
  wind: string;
  oya?: boolean;
  size?: number;
  dim?: boolean;
}

export function WindTile({ wind, oya = false, size = 56, dim = false }: WindTileProps) {
  const h = Math.round(size * 1.18);
  const fontSize = Math.round(size * 0.62);
  const borderRadius = Math.round(size * 0.12);
  const colors: [string, string, string] = oya
    ? [M.goldHi, M.gold, M.goldDeep]
    : ['#fffaee', M.ivory, M.bone];

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={[
        { width: size, height: h, borderRadius, alignItems: 'center', justifyContent: 'center' },
        oya
          ? { borderWidth: 1, borderColor: M.goldDeep, shadowColor: M.gold, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 6 }
          : { borderWidth: 1, borderColor: '#8a7a55', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 6, elevation: 4 },
        dim && { opacity: 0.55 },
      ]}
    >
      <Text style={{
        fontFamily: F.display,
        fontSize,
        color: oya ? M.redDeep : M.ink,
        lineHeight: fontSize * 1.1,
      }}>
        {wind}
      </Text>
    </LinearGradient>
  );
}

// ─── Seal ────────────────────────────────────────────────────

interface SealProps {
  children: string;
  size?: number;
  style?: ViewStyle;
}

export function Seal({ children, size = 44, style }: SealProps) {
  return (
    <LinearGradient
      colors={[M.redHi, M.red, M.redDeep]}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={[
        {
          width: size, height: size, borderRadius: 4,
          alignItems: 'center', justifyContent: 'center',
          borderWidth: 1.5, borderColor: '#2c0a04',
        },
        style,
      ]}
    >
      <Text style={{ fontFamily: F.display, fontSize: Math.round(size * 0.42), color: '#fef0e3' }}>
        {children}
      </Text>
    </LinearGradient>
  );
}

// ─── GoldButton ──────────────────────────────────────────────

interface GoldButtonProps {
  children: string;
  onPress: () => void;
  disabled?: boolean;
  small?: boolean;
  style?: ViewStyle;
}

export function GoldButton({ children, onPress, disabled, small, style }: GoldButtonProps) {
  const colors: [string, string, string] = disabled
    ? ['#6a5a3a', '#3a2e18', '#3a2e18']
    : [M.goldHi, M.gold, M.goldDeep];
  return (
    <Pressable onPress={disabled ? undefined : onPress} style={style}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.goldBtn,
          small && styles.goldBtnSmall,
          disabled && { opacity: 0.7 },
        ]}
      >
        <Text style={[styles.goldBtnText, small && styles.goldBtnTextSmall, disabled && { color: '#a89a78' }]} numberOfLines={1} adjustsFontSizeToFit>
          {children}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

// ─── InkButton ───────────────────────────────────────────────

interface InkButtonProps {
  children: string;
  onPress: () => void;
  small?: boolean;
  style?: ViewStyle;
  dim?: boolean;
}

export function InkButton({ children, onPress, small, style, dim }: InkButtonProps) {
  return (
    <Pressable onPress={onPress} style={style}>
      <LinearGradient
        colors={['#2c1f12', '#1a1208']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.inkBtn,
          small && styles.inkBtnSmall,
          dim && { opacity: 0.7 },
        ]}
      >
        <Text style={[styles.inkBtnText, small && styles.inkBtnTextSmall]} numberOfLines={1} adjustsFontSizeToFit>
          {children}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

// ─── SmallActionBtn ──────────────────────────────────────────

interface SmallActionBtnProps {
  children: string;
  onPress: () => void;
  dangerous?: boolean;
  style?: ViewStyle;
}

export function SmallActionBtn({ children, onPress, dangerous, style }: SmallActionBtnProps) {
  const colors: [string, string] = dangerous ? [M.red, M.redDeep] : ['#2c1f12', '#1a1208'];
  return (
    <Pressable onPress={onPress} style={style}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.smallBtn, dangerous && { borderColor: 'transparent' }, { alignSelf: 'stretch' }]}
      >
        <Text style={[styles.smallBtnText, dangerous && { color: '#fef0e3' }]}>
          {children}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

// ─── Segment ─────────────────────────────────────────────────

interface SegmentOption<T> {
  value: T;
  label: string;
}

interface SegmentProps<T> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (v: T) => void;
}

export function Segment<T>({ options, value, onChange }: SegmentProps<T>) {
  return (
    <View style={styles.segment}>
      {options.map((opt, i) => {
        const active = opt.value === value;
        return active ? (
          <Pressable key={i} onPress={() => onChange(opt.value)} style={{ flex: 1 }}>
            <LinearGradient
              colors={[M.gold, M.goldDeep]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.segOption}
            >
              <Text style={styles.segTextActive}>{opt.label}</Text>
            </LinearGradient>
          </Pressable>
        ) : (
          <Pressable key={i} onPress={() => onChange(opt.value)} style={[styles.segOption, { flex: 1 }]}>
            <Text style={styles.segTextInactive}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ─── Toggle ──────────────────────────────────────────────────

interface ToggleProps {
  value: boolean;
  onChange: (v: boolean) => void;
}

export function Toggle({ value, onChange }: ToggleProps) {
  return (
    <Pressable onPress={() => onChange(!value)}>
      <LinearGradient
        colors={value ? [M.gold, M.goldDeep] : [M.inkSoft, M.inkSoft]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.toggle}
      >
        <View style={[styles.toggleThumb, value && styles.toggleThumbOn]} />
      </LinearGradient>
    </Pressable>
  );
}

// ─── NumField ────────────────────────────────────────────────

interface NumFieldProps {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  suffix?: string;
}

export function NumField({ value, onChange, step = 1000, min = 0, suffix = '点' }: NumFieldProps) {
  return (
    <View style={styles.numField}>
      <Pressable onPress={() => onChange(Math.max(min, value - step))} style={styles.numFieldBtn}>
        <LinearGradient colors={[M.woodHi, M.woodDark]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.numFieldBtnGrad}>
          <Text style={styles.numFieldBtnText}>−</Text>
        </LinearGradient>
      </Pressable>
      <View style={styles.numFieldVal}>
        <Text style={styles.numFieldValText}>
          {formatNum(value)}<Text style={styles.numFieldSuffix}>{suffix}</Text>
        </Text>
      </View>
      <Pressable onPress={() => onChange(value + step)} style={styles.numFieldBtn}>
        <LinearGradient colors={[M.woodHi, M.woodDark]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.numFieldBtnGrad}>
          <Text style={styles.numFieldBtnText}>＋</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

// ─── SectionHeader ───────────────────────────────────────────

export function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionBar} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

// ─── SectionBox ──────────────────────────────────────────────

export function SectionBox({ children }: { children: React.ReactNode }) {
  return <View style={styles.sectionBox}>{children}</View>;
}

// ─── RowToggle ───────────────────────────────────────────────

interface RowToggleProps {
  label: string;
  hint?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

export function RowToggle({ label, hint, value, onChange }: RowToggleProps) {
  return (
    <View style={styles.rowToggle}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowToggleLabel}>{label}</Text>
        {hint ? <Text style={styles.rowToggleHint}>{hint}</Text> : null}
      </View>
      <Toggle value={value} onChange={onChange} />
    </View>
  );
}

// ─── InkInput ────────────────────────────────────────────────

interface InkInputProps {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'number-pad' | 'numeric';
  style?: TextStyle;
  textStyle?: TextStyle;
}

export function InkInput({ value, onChangeText, placeholder, keyboardType = 'default', style, textStyle }: InkInputProps) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={M.ivoryDim}
      keyboardType={keyboardType}
      style={[styles.inkInput, style, textStyle]}
    />
  );
}

// ─── StyleSheet ──────────────────────────────────────────────

const styles = StyleSheet.create({
  goldBtn: {
    paddingVertical: 14, paddingHorizontal: 24, borderRadius: 4,
    alignItems: 'center', justifyContent: 'center',
    borderTopWidth: 1, borderTopColor: '#fff0c0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5, shadowRadius: 8, elevation: 4,
  },
  goldBtnSmall: { paddingVertical: 10, paddingHorizontal: 18 },
  goldBtnText: { fontFamily: F.display, fontSize: 16, color: M.ink, letterSpacing: 2 },
  goldBtnTextSmall: { fontSize: 13 },
  inkBtn: {
    paddingVertical: 14, paddingHorizontal: 24, borderRadius: 4,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: `${M.gold}55`,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4, shadowRadius: 4, elevation: 3,
  },
  inkBtnSmall: { paddingVertical: 10, paddingHorizontal: 18 },
  inkBtnText: { fontFamily: F.displayBold, fontSize: 16, color: M.ivory, letterSpacing: 1.5 },
  inkBtnTextSmall: { fontSize: 13 },
  smallBtn: {
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 3,
    borderWidth: 1, borderColor: `${M.gold}55`,
    alignItems: 'center', justifyContent: 'center',
  },
  smallBtnText: { fontFamily: F.serifBold, fontSize: 11, color: M.ivory, letterSpacing: 3 },
  segment: {
    flexDirection: 'row', backgroundColor: M.inkSoft,
    padding: 3, borderRadius: 6,
  },
  segOption: { flex: 1, paddingVertical: 11, paddingHorizontal: 8, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  segTextActive: { fontFamily: F.displayBold, fontSize: 14, color: M.ink, letterSpacing: 0.5 },
  segTextInactive: { fontFamily: F.displayBold, fontSize: 14, color: M.ivoryDim, letterSpacing: 0.5 },
  toggle: { width: 56, height: 30, borderRadius: 999, padding: 3 },
  toggleThumb: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: M.ivoryDim,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.6, shadowRadius: 2,
  },
  toggleThumbOn: { marginLeft: 26, backgroundColor: '#fffaee' },
  numField: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  numFieldBtn: { width: 36, height: 36, borderRadius: 4, overflow: 'hidden' },
  numFieldBtnGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  numFieldBtnText: { fontFamily: F.display, fontSize: 18, color: M.ivory, textAlignVertical: 'center', includeFontPadding: false },
  numFieldVal: {
    flex: 1, paddingVertical: 8, paddingHorizontal: 4,
    backgroundColor: M.inkSoft, borderRadius: 4, alignItems: 'center',
  },
  numFieldValText: { fontFamily: F.serifBold, fontSize: 16, color: M.ivory },
  numFieldSuffix: { fontSize: 12, color: M.ivoryDim },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  sectionBar: { width: 4, height: 14, backgroundColor: M.gold, borderRadius: 1 },
  sectionTitle: { fontFamily: F.display, fontSize: 13, color: M.gold, letterSpacing: 4 },
  sectionBox: {
    backgroundColor: 'rgba(8,28,20,0.55)', padding: 14, borderRadius: 6,
    borderWidth: 1, borderColor: `${M.gold}33`,
  },
  rowToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowToggleLabel: { fontFamily: F.serifSemiBold, fontSize: 14, color: M.ivory },
  rowToggleHint: { fontFamily: F.serif, fontSize: 10.5, color: M.ivoryDim, marginTop: 2 },
  inkInput: {
    paddingVertical: 10, paddingHorizontal: 12, borderRadius: 4,
    backgroundColor: M.inkSoft, color: M.ivory,
    fontFamily: F.serifMedium, fontSize: 15,
    borderWidth: 1, borderColor: `${M.gold}33`,
  },
});
