import { ErrorBoundary } from '~/components/error-boundary/error-boundary';
import '../global.css';

import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useHydration } from '~/store/root-store';
import { LoadingScreen } from '~/components/loading-screen';

export default function Layout() {
  const hasHydrated = useHydration();
  if (!hasHydrated) {
    return <LoadingScreen />;
  }
  return
  <ErrorBoundary>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack />;
    </GestureHandlerRootView>
  </ErrorBoundary>
}
