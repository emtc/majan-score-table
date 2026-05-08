import React, { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
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

  if (isSubscribed || Platform.OS === 'web' || !GoogleBannerAd) return null;

  const unitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : IOS_AD_UNIT_ID;

  return (
    <View>
      <GoogleBannerAd
        unitId={unitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: nonPersonalized }}
      />
    </View>
  );
}
