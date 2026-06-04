import React, { useState } from 'react';
import {
  ActivityIndicator, Linking, Modal, Pressable, StyleSheet, Text, View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { F, M } from '../theme';
import { useSubscription } from '../context/SubscriptionContext';

const PRIVACY_URL = 'https://emtc.github.io/majan-score-table/privacy-policy.html';
const EULA_URL = 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';

type Plan = 'lifetime' | 'subscription';

const PLANS: { id: Plan; label: string; price: string; note: string; recommended?: boolean }[] = [
  { id: 'lifetime',     label: '買い切りプラン',   price: '¥980',       note: '一度の購入で永久に有効', recommended: true },
  { id: 'subscription', label: '月額プラン',       price: '¥250 / 月', note: 'いつでもキャンセル可能' },
];

export function SubscriptionModal() {
  const { modalVisible, closeModal, purchase, restore, loading } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<Plan>('lifetime');

  const handlePurchase = () => purchase(selectedPlan);

  const isSubscriptionSelected = selectedPlan === 'subscription';

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

          {/* plan cards */}
          <View style={styles.planCards}>
            {PLANS.map(plan => {
              const isSelected = selectedPlan === plan.id;
              return (
                <Pressable
                  key={plan.id}
                  onPress={() => setSelectedPlan(plan.id)}
                  style={[styles.planCard, isSelected && styles.planCardSelected]}
                >
                  {plan.recommended && (
                    <View style={styles.recommendedBadge}>
                      <Text style={styles.recommendedText}>★ おすすめ</Text>
                    </View>
                  )}
                  <Text style={[styles.planLabel, isSelected && styles.planLabelSelected]}>
                    {plan.label}
                  </Text>
                  <Text style={[styles.planPrice, isSelected && styles.planPriceSelected]}>
                    {plan.price}
                  </Text>
                  <Text style={styles.planNote}>{plan.note}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* shared benefits */}
          <View style={styles.benefitList}>
            {[
              'アプリ上の広告はすべて非表示',
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

          <Pressable onPress={handlePurchase} disabled={loading} style={styles.purchaseBtn}>
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
            {isSubscriptionSelected && '次回更新日の24時間前までキャンセルできます。'}
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
    marginTop: 12, marginBottom: 24,
  },
  title: {
    fontFamily: F.serifBold, fontSize: 20, color: M.ivory,
    letterSpacing: 2, marginBottom: 20,
  },
  planCards: { width: '100%', gap: 10, marginBottom: 24 },
  planCard: {
    width: '100%', padding: 16, borderRadius: 8,
    borderWidth: 1.5, borderColor: `${M.gold}33`,
    backgroundColor: '#1a1007',
  },
  planCardSelected: {
    borderColor: M.gold,
    backgroundColor: '#221508',
  },
  recommendedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: `${M.gold}22`,
    borderWidth: 1, borderColor: `${M.gold}66`,
    borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2,
    marginBottom: 8,
  },
  recommendedText: {
    fontFamily: F.serifMedium, fontSize: 10, color: M.gold, letterSpacing: 1,
  },
  planLabel: {
    fontFamily: F.serifBold, fontSize: 15, color: M.ivoryDim, letterSpacing: 1,
  },
  planLabelSelected: { color: M.ivory },
  planPrice: {
    fontFamily: F.display, fontSize: 22, color: M.ivoryDim,
    marginTop: 4, letterSpacing: 1,
  },
  planPriceSelected: { color: M.goldHi },
  planNote: {
    fontFamily: F.serif, fontSize: 11, color: M.ivoryDim,
    opacity: 0.6, marginTop: 4, letterSpacing: 0.5,
  },
  benefitList: { width: '100%', gap: 12, marginBottom: 24 },
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
    minHeight: 32,
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
