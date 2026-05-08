import { useEffect } from 'react';
import { Platform } from 'react-native';

const IOS_INTERSTITIAL_ID = 'ca-app-pub-2989531368920692/4807605164';

let InterstitialAd: any = null;
let AdEventType: any = null;
let TestIds: any = null;
try {
  const ads = require('react-native-google-mobile-ads');
  InterstitialAd = ads.InterstitialAd;
  AdEventType = ads.AdEventType;
  TestIds = ads.TestIds;
} catch {
  // Expo Go / web
}

export function useInterstitialAd(enabled: boolean) {
  useEffect(() => {
    if (!enabled || !InterstitialAd || Platform.OS === 'web') return;

    const unitId = __DEV__ ? TestIds.INTERSTITIAL : IOS_INTERSTITIAL_ID;
    const ad = InterstitialAd.createForAdRequest(unitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    const unsubscribe = ad.addAdEventListener(AdEventType.LOADED, () => {
      ad.show();
    });

    ad.load();

    return () => {
      unsubscribe();
    };
  }, [enabled]);
}
