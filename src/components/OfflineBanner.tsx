import NetInfo from '@react-native-community/netinfo';
import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Banner, BannerText } from './OfflineBanner.styled';

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
    <Banner $paddingTop={Math.max(insets.top, 8)}>
      <BannerText>You are offline. Saved articles are still available.</BannerText>
    </Banner>
  );
};
