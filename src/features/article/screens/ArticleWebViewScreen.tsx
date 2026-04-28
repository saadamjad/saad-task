import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useRef, useState } from 'react';
import type WebView from 'react-native-webview';
import { Alert, Linking, Share } from 'react-native';
import type { FeedStackParamList, SavedStackParamList } from 'types/navigation';
import {
  ArticleWebView,
  ErrorBanner,
  ErrorBannerText,
  Root,
  Toolbar,
  ToolbarButton,
  ToolbarButtonText,
} from './ArticleWebViewScreen.styled';

type Props =
  | NativeStackScreenProps<FeedStackParamList, 'ArticleWebView'>
  | NativeStackScreenProps<SavedStackParamList, 'ArticleWebView'>;

export const ArticleWebViewScreen = ({
  navigation,
  route,
}: Props): React.JSX.Element => {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const { article } = route.params;

  const onShare = useCallback(async (): Promise<void> => {
    try {
      await Share.share({ message: article.link });
    } catch {
      Alert.alert('Unable to share', 'Please try again.');
    }
  }, [article.link]);

  const openInBrowser = useCallback(async (): Promise<void> => {
    const supported = await Linking.canOpenURL(article.link);
    if (!supported) {
      Alert.alert('Invalid URL', 'This article link cannot be opened.');
      return;
    }
    await Linking.openURL(article.link);
  }, [article.link]);

  const onBack = useCallback((): void => {
    if (canGoBack) {
      webViewRef.current?.goBack();
      return;
    }
    navigation.goBack();
  }, [canGoBack, navigation]);

  const onNavigationStateChange = useCallback((state: { canGoBack: boolean }) => {
    setCanGoBack(state.canGoBack);
  }, []);

  const onWebViewError = useCallback(() => {
    setLoadError(true);
  }, []);

  return (
    <Root>
      <Toolbar>
        <ToolbarButton accessibilityRole="button" accessibilityLabel="Go back" onPress={onBack}>
          <ToolbarButtonText>Back</ToolbarButtonText>
        </ToolbarButton>
        <ToolbarButton accessibilityRole="button" accessibilityLabel="Share article link" onPress={onShare}>
          <ToolbarButtonText>Share</ToolbarButtonText>
        </ToolbarButton>
        <ToolbarButton
          accessibilityRole="button"
          accessibilityLabel="Open in browser"
          onPress={openInBrowser}>
          <ToolbarButtonText>Browser</ToolbarButtonText>
        </ToolbarButton>
      </Toolbar>
      {loadError ? (
        <ErrorBanner accessibilityRole="alert">
          <ErrorBannerText>
            Unable to load this page. Check your connection or open in Browser.
          </ErrorBannerText>
        </ErrorBanner>
      ) : null}
      <ArticleWebView
        ref={webViewRef}
        source={{ uri: article.link }}
        startInLoadingState
        onNavigationStateChange={onNavigationStateChange}
        onError={onWebViewError}
      />
    </Root>
  );
};
