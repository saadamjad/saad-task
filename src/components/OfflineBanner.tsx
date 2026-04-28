import NetInfo from '@react-native-community/netinfo';
import type {JSX} from 'react';
import {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {styles} from './OfflineBanner.styles';

/**
 * Single NetInfo subscription for the whole app. Shown when the device has no network connection.
 */
export const OfflineBanner = (): JSX.Element | null => {
  const insets = useSafeAreaInsets();
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    NetInfo.fetch().then(state => {
      if (!cancelled) {
        setIsConnected(Boolean(state.isConnected));
      }
    });

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(Boolean(state.isConnected));
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  if (isConnected !== false) {
    return null;
  }

  return (
    <View style={[styles.banner, {paddingTop: Math.max(insets.top, 8)}]}>
      <Text style={styles.text}>You are offline. Saved articles are still available.</Text>
    </View>
  );
};
