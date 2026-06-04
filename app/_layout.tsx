import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import {
  NotoSerifJP_400Regular,
  NotoSerifJP_500Medium,
  NotoSerifJP_600SemiBold,
  NotoSerifJP_700Bold,
  NotoSerifJP_900Black,
} from '@expo-google-fonts/noto-serif-jp';
import {
  ShipporiMincho_700Bold,
  ShipporiMincho_800ExtraBold,
} from '@expo-google-fonts/shippori-mincho';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { SubscriptionProvider } from '../src/context/SubscriptionContext';
import { SubscriptionModal } from '../src/screens/SubscriptionModal';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    NotoSerifJP_400Regular,
    NotoSerifJP_500Medium,
    NotoSerifJP_600SemiBold,
    NotoSerifJP_700Bold,
    NotoSerifJP_900Black,
    ShipporiMincho_700Bold,
    ShipporiMincho_800ExtraBold,
  });

  // iOS: ATT のあとに AdMob 初期化。Android: AdMob のみ初期化。
  // いずれも完了するまでメイン UI を出さない（初回広告リクエストより前に initialize する）
  const [startupReady, setStartupReady] = useState(Platform.OS === 'web');

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (!loaded) return;
    if (Platform.OS === 'web') {
      setStartupReady(true);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        if (Platform.OS === 'ios') {
          await requestTrackingPermissionsAsync();
        }
        const mobileAds = require('react-native-google-mobile-ads').default;
        await mobileAds().initialize();
      } catch (e) {
        console.warn('Mobile Ads startup:', e);
      }
      if (!cancelled) setStartupReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [loaded]);

  useEffect(() => {
    if (loaded && startupReady) SplashScreen.hideAsync();
  }, [loaded, startupReady]);

  if (!loaded || !startupReady) return null;

  return (
    <SubscriptionProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
      <SubscriptionModal />
    </SubscriptionProvider>
  );
}
