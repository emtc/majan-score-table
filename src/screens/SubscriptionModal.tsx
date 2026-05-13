import React from 'react';
import {
  ActivityIndicator, Linking, Modal, Pressable, StyleSheet, Text, View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { F, M } from '../theme';
import { useSubscription } from '../context/SubscriptionContext';

const PRIVACY_URL = 'https://emtc.github.io/majan-score-table/privacy-policy.html';
const EULA_URL = 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';

export function SubscriptionModal() {
  const { modalVisible, closeModal, purchase, restore, loading } = useSubscription();

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="slide"
      onRequestClose={closeModal}
    >
      <BlurView intensity={30} tint="dark" style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={closeModal} />
        <Pressable style={styles.sheet} onPress={e => e.stopPropagation()}>

          <View style={styles.handle} />

          <Text style={styles.title}>広告を非表示にする</Text>
          <Text style={styles.subtitle}>月額 250円（税込・自動更新）</Text>

          <View style={styles.benefitList}>
            {[
              'アプリ上の広告はすべて非表示',
              'いつでもキャンセル可能',
              '購入はすべての端末で有効',
            ].map((text, i) => (
              <View key={i} style={styles.benefitRow}>
                <LinearGradient
                  colors={[M.goldHi, M.gold]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={styles.checkCircle}
                >
                  <Text style={styles.checkMark}>✓</Text>
                </LinearGradient>
                <Text style={styles.benefitText}>{text}</Text>
              </View>
            ))}
          </View>

          <Pressable onPress={purchase} disabled={loading} style={styles.purchaseBtn}>
            <LinearGradient
              colors={loading ? ['#6a5a3a', '#3a2e18', '#3a2e18'] : [M.goldHi, M.gold, M.goldDeep]}
              start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
              style={styles.purchaseBtnInner}
            >
              {loading
                ? <ActivityIndicator color={M.ink} />
                : <Text style={styles.purchaseBtnText}>購入する</Text>
              }
            </LinearGradient>
          </Pressable>

          <Pressable onPress={restore} disabled={loading} style={styles.restoreBtn}>
            <Text style={styles.restoreBtnText}>購入を復元する</Text>
          </Pressable>

          <Pressable onPress={closeModal} style={styles.cancelBtn}>
            <Text style={styles.cancelBtnText}>キャンセル</Text>
          </Pressable>

          <Text style={styles.legal}>
            購入はApple IDに課金されます。{'\n'}
            次回更新日の24時間前までキャンセルできます。
          </Text>

          <View style={styles.legalLinks}>
            <Pressable onPress={() => Linking.openURL(PRIVACY_URL)}>
              <Text style={styles.legalLink}>プライバシーポリシー</Text>
            </Pressable>
            <Text style={styles.legalLinkSep}>　|　</Text>
            <Pressable onPress={() => Linking.openURL(EULA_URL)}>
              <Text style={styles.legalLink}>利用規約</Text>
            </Pressable>
          </View>

        </Pressable>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#120a05',
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    borderTopWidth: 1, borderColor: `${M.gold}44`,
    paddingHorizontal: 28, paddingBottom: 40,
    alignItems: 'center',
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: M.gold, opacity: 0.3,
    marginTop: 12, marginBottom: 28,
  },
  title: {
    fontFamily: F.serifBold, fontSize: 20, color: M.ivory,
    letterSpacing: 2, marginBottom: 8,
  },
  subtitle: {
    fontFamily: F.serif, fontSize: 13, color: M.gold,
    letterSpacing: 1, marginBottom: 24,
  },
  benefitList: { width: '100%', gap: 14, marginBottom: 28 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkCircle: {
    width: 22, height: 22, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center',
  },
  checkMark: { color: M.ink, fontSize: 12, fontWeight: '800' },
  benefitText: {
    fontFamily: F.serif, fontSize: 14, color: M.ivory, flex: 1,
  },
  purchaseBtn: { width: '100%', marginBottom: 12 },
  purchaseBtnInner: {
    paddingVertical: 15, borderRadius: 4,
    alignItems: 'center', justifyContent: 'center',
    borderTopWidth: 1, borderTopColor: '#fff0c0',
    minHeight: 52,
  },
  purchaseBtnText: {
    fontFamily: F.display, fontSize: 16, color: M.ink, letterSpacing: 3,
  },
  restoreBtn: { paddingVertical: 12 },
  restoreBtnText: {
    fontFamily: F.serif, fontSize: 13, color: M.ivoryDim,
    letterSpacing: 1, textDecorationLine: 'underline',
  },
  cancelBtn: { paddingVertical: 8 },
  cancelBtnText: {
    fontFamily: F.serif, fontSize: 12, color: M.ivoryDim, opacity: 0.4, letterSpacing: 2,
  },
  legal: {
    fontFamily: F.serif, fontSize: 10, color: M.ivoryDim,
    opacity: 0.35, textAlign: 'center', lineHeight: 16, marginTop: 20,
  },
  legalLinks: {
    flexDirection: 'row', alignItems: 'center', marginTop: 10,
  },
  legalLink: {
    fontFamily: F.serif, fontSize: 11, color: M.ivoryDim,
    textDecorationLine: 'underline', opacity: 0.6,
  },
  legalLinkSep: {
    fontFamily: F.serif, fontSize: 11, color: M.ivoryDim, opacity: 0.3,
  },
});
