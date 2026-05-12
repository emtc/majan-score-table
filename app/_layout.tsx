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

  // ATT 許可ダイアログの完了を待つ（iOS のみ）
  // 広告 SDK がデータ収集を始める前に許可を得るため、
  // 許可が解決するまでスプラッシュ画面を維持しアプリをレンダリングしない
  const [attReady, setAttReady] = useState(Platform.OS !== 'ios');

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (!loaded || Platform.OS !== 'ios') return;
    requestTrackingPermissionsAsync().finally(() => {
      setAttReady(true);
    });
  }, [loaded]);

  useEffect(() => {
    if (loaded && attReady) SplashScreen.hideAsync();
  }, [loaded, attReady]);

  if (!loaded || !attReady) return null;

  return (
    <SubscriptionProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
      <SubscriptionModal />
    </SubscriptionProvider>
  );
}
