import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { M } from '../theme';

export function FeltBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* base: dark felt */}
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: M.feltDeep }]} />
      {/* top-center light (overhead lamp simulation) */}
      <LinearGradient
        colors={[`${M.feltHi}dd`, `${M.feltMid}88`, 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.65 }}
        style={StyleSheet.absoluteFill}
      />
      {/* edge vignette */}
      <LinearGradient
        colors={['rgba(0,0,0,0.5)', 'transparent', 'transparent', 'rgba(0,0,0,0.5)']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.45)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

const styles = StyleSheet.create({
});
