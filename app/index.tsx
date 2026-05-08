import React, { useState, useCallback } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { HomeScreen } from '../src/screens/HomeScreen';
import { SetupScreen } from '../src/screens/SetupScreen';
import { TableScreen } from '../src/screens/TableScreen';
import { HandSheet } from '../src/screens/HandSheet';
import { ResultScreen } from '../src/screens/ResultScreen';
import { buildGame, snapshotGame, restoreGame } from '../src/logic';
import type { Game, Setup } from '../src/types';

type Screen = 'home' | 'setup' | 'table' | 'result';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [game, setGame] = useState<Game | null>(null);
  const [lastSetup, setLastSetup] = useState<Omit<Setup, 'n'> | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const startNew = useCallback(() => setScreen('setup'), []);

  const onStart = useCallback((setup: Omit<Setup, 'n'>) => {
    setLastSetup(setup);
    setGame(buildGame(setup as Setup));
    setScreen('table');
  }, []);

  const applyAndCheck = useCallback((newG: Game) => {
    const snap = snapshotGame(game!);
    const committed: Game = { ...newG, history: [...(game!.history ?? []), snap] };
    setGame(committed);
    if (committed.finished) {
      setTimeout(() => setScreen('result'), 200);
    }
  }, [game]);

  const undo = useCallback(() => {
    if (!game || !game.history?.length) return;
    const last = game.history[game.history.length - 1];
    setGame({ ...restoreGame(game, last), history: game.history.slice(0, -1), finished: false });
  }, [game]);

  const endNow = useCallback(() => {
    Alert.alert('終了確認', 'この一戦を終了しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '終了', style: 'destructive',
        onPress: () => {
          setGame(g => g ? { ...g, finished: true } : g);
          setScreen('result');
        },
      },
    ]);
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <View style={styles.root}>
        {screen === 'home' && (
          <HomeScreen
            onNew={startNew}
          />
        )}
        {screen === 'setup' && (
          <SetupScreen
            initial={lastSetup}
            onStart={onStart}
            onBack={() => setScreen('home')}
          />
        )}
        {screen === 'table' && game && (
          <>
            <TableScreen
              game={game}
              openSheet={() => setSheetOpen(true)}
              onUndo={undo}
              onEnd={endNow}
              dimmed={sheetOpen}
            />
            <HandSheet
              game={game}
              visible={sheetOpen}
              onClose={() => setSheetOpen(false)}
              onApply={applyAndCheck}
            />
          </>
        )}
        {screen === 'result' && game && (
          <ResultScreen
            game={game}
            onRematch={() => { setGame(buildGame(lastSetup as Setup)); setScreen('table'); }}
            onChangeSetup={() => setScreen('setup')}
            onHome={() => setScreen('home')}
          />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0d3a2a' },
});
