import React, { useEffect, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import { useSubscription } from '../context/SubscriptionContext';

const IOS_AD_UNIT_ID = 'ca-app-pub-2989531368920692/2317173197';

let GoogleBannerAd: any = null;
let BannerAdSize: any = null;
let TestIds: any = null;
let getTrackingPermissionsAsync: any = null;
try {
  const ads = require('react-native-google-mobile-ads');
  GoogleBannerAd = ads.BannerAd;
  BannerAdSize = ads.BannerAdSize;
  TestIds = ads.TestIds;
} catch { /* Expo Go */ }
try {
  getTrackingPermissionsAsync = require('expo-tracking-transparency').getTrackingPermissionsAsync;
} catch { /* Expo Go */ }

export function BannerAd() {
  const { isSubscribed } = useSubscription();
  const [nonPersonalized, setNonPersonalized] = useState(true);

  useEffect(() => {
    if (Platform.OS !== 'ios' || !getTrackingPermissionsAsync) return;
    getTrackingPermissionsAsync().then(({ status }: { status: string }) => {
      setNonPersonalized(status !== 'granted');
    });
  }, []);

  if (isSubscribed || Platform.OS === 'web') return null;
  if (!GoogleBannerAd) {
    if (!__DEV__) return null;
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', height: 56, backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#444', borderStyle: 'dashed' }}>
        <Text style={{ color: '#666', fontSize: 11 }}>Ad placeholder (Expo Go)</Text>
      </View>
    );
  }

  const unitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : IOS_AD_UNIT_ID;

  return (
    <View style={{ alignItems: 'center', minHeight: 56 }}>
      <GoogleBannerAd
        key={`${unitId}-${nonPersonalized ? 'npa' : 'pa'}`}
        unitId={unitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: nonPersonalized }}
        onAdFailedToLoad={(err: Error) => {
          console.warn('[BannerAd] failed to load:', err?.message ?? err);
        }}
      />
    </View>
  );
}
