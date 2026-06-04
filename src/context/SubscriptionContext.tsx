import React, {
  createContext, useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import { Alert, Platform } from 'react-native';

export const SUBSCRIPTION_SKU = 'com.emtc.mahjongscore.adfree.monthly';
export const LIFETIME_SKU = 'com.emtc.mahjongscore.adfree.lifetime';

// react-native-iap uses NitroModules which are unavailable in Expo Go.
// Wrap the require in a try-catch so the app can still launch for UI testing.
let iap: typeof import('react-native-iap') | null = null;
try {
  iap = require('react-native-iap');
} catch {
  // Expo Go / web: IAP not available
}

interface ContextValue {
  isSubscribed: boolean;
  loading: boolean;
  modalVisible: boolean;
  openModal: () => void;
  closeModal: () => void;
  purchase: (plan: 'subscription' | 'lifetime') => Promise<void>;
  restore: () => Promise<void>;
}

const SubscriptionContext = createContext<ContextValue>({
  isSubscribed: false,
  loading: false,
  modalVisible: false,
  openModal: () => {},
  closeModal: () => {},
  purchase: async () => {},
  restore: async () => {},
});

export const useSubscription = () => useContext(SubscriptionContext);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const updateRef = useRef<any>(null);
  const errorRef = useRef<any>(null);

  useEffect(() => {
    if (Platform.OS === 'web' || !iap) return;

    const setup = async () => {
      try {
        await iap!.initConnection();

        const purchases = await iap!.getAvailablePurchases();
        setIsSubscribed(purchases.some(p => p.productId === SUBSCRIPTION_SKU || p.productId === LIFETIME_SKU));

        updateRef.current = iap!.purchaseUpdatedListener(purchase => {
          if (purchase.productId === SUBSCRIPTION_SKU || purchase.productId === LIFETIME_SKU) {
            setIsSubscribed(true);
            setLoading(false);
            setModalVisible(false);
          }
        });

        errorRef.current = iap!.purchaseErrorListener((error: any) => {
          setLoading(false);
          const code = error.code ?? '';
          if (code !== 'UserCancelled' && code !== 'E_USER_CANCELLED') {
            Alert.alert('購入エラー', error.message ?? '購入に失敗しました');
          }
        });
      } catch (e) {
        console.warn('IAP setup error:', e);
      }
    };

    setup();

    return () => {
      updateRef.current?.remove();
      errorRef.current?.remove();
      iap!.endConnection();
    };
  }, []);

  const purchase = useCallback(async (plan: 'subscription' | 'lifetime') => {
    if (Platform.OS === 'web' || !iap) return;
    setLoading(true);
    const sku = plan === 'lifetime' ? LIFETIME_SKU : SUBSCRIPTION_SKU;
    const type = plan === 'lifetime' ? 'inapp' : 'subs';
    try {
      await (iap! as any).requestPurchase({
        request: {
          apple: { sku },
          google: { skus: [sku] },
        },
        type,
      });
    } catch (e: any) {
      setLoading(false);
      const code = e.code ?? '';
      if (code !== 'UserCancelled' && code !== 'E_USER_CANCELLED') {
        Alert.alert('購入エラー', e.message ?? '購入に失敗しました');
      }
    }
  }, []);

  const restore = useCallback(async () => {
    if (Platform.OS === 'web' || !iap) return;
    setLoading(true);
    try {
      const purchases = await iap!.getAvailablePurchases();
      const active = purchases.some(p => p.productId === SUBSCRIPTION_SKU || p.productId === LIFETIME_SKU);
      setIsSubscribed(active);
      Alert.alert(
        '購入の復元',
        active
          ? 'サブスクリプションを復元しました。'
          : '有効なサブスクリプションが見つかりませんでした。',
      );
    } catch (e: any) {
      Alert.alert('エラー', e.message ?? '復元に失敗しました');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <SubscriptionContext.Provider value={{
      isSubscribed,
      loading,
      modalVisible,
      openModal: () => setModalVisible(true),
      closeModal: () => setModalVisible(false),
      purchase,
      restore,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}
