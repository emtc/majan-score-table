import { Platform, useWindowDimensions } from 'react-native';

/** iPad / 大画面向けの UI スケール */
export function useTabletLayout() {
  const { width, height } = useWindowDimensions();
  const shortSide = Math.min(width, height);
  const isTablet =
    (Platform.OS === 'ios' && Platform.isPad) || shortSide >= 600;
  const scale = isTablet ? Math.min(1.65, 0.4 + shortSide / 480) : 1;
  return { isTablet, scale, width };
}
