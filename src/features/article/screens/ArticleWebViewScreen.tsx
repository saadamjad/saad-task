import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useRef, useState} from 'react';
import {Alert, Linking, Pressable, Share, Text, View} from 'react-native';
import WebView from 'react-native-webview';
import {styles} from './ArticleWebViewScreen.styles';
import type {FeedStackParamList, SavedStackParamList} from 'types/navigation';

type Props =
  | NativeStackScreenProps<FeedStackParamList, 'ArticleWebView'>
  | NativeStackScreenProps<SavedStackParamList, 'ArticleWebView'>;

export const ArticleWebViewScreen = ({navigation, route}: Props): React.JSX.Element => {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const {article} = route.params;

  const onShare = useCallback(async (): Promise<void> => {
    try {
      await Share.share({message: article.link});
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

  const onNavigationStateChange = useCallback((state: {canGoBack: boolean}) => {
    setCanGoBack(state.canGoBack);
  }, []);

  const onWebViewError = useCallback(() => {
    setLoadError(true);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={onBack}
          style={styles.button}>
          <Text style={styles.buttonText}>Back</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Share article link"
          onPress={onShare}
          style={styles.button}>
          <Text style={styles.buttonText}>Share</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open in browser"
          onPress={openInBrowser}
          style={styles.button}>
          <Text style={styles.buttonText}>Browser</Text>
        </Pressable>
      </View>
      {loadError ? (
        <View style={styles.errorBanner} accessibilityRole="alert">
          <Text style={styles.errorText}>
            Unable to load this page. Check your connection or open in Browser.
          </Text>
        </View>
      ) : null}
      <WebView
        ref={webViewRef}
        source={{uri: article.link}}
        startInLoadingState
        onNavigationStateChange={onNavigationStateChange}
        onError={onWebViewError}
      />
    </View>
  );
};
