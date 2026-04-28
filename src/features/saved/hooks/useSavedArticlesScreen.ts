import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useMemo } from 'react';
import { AppState } from 'react-native';
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from 'store';
import { lockSavedTab } from 'store/slices/authGateSlice';
import { toggleSavedArticle } from 'store/slices/savedSlice';
import type { Article } from 'types/article';
import type { SavedStackParamList } from 'types/navigation';

interface UseSavedArticlesScreenResult {
  savedArticles: Article[];
  viewArticle: (article: Article) => void;
  toggleOfflineSave: (article: Article) => void;
}

export const useSavedArticlesScreen = (
  navigation: NativeStackNavigationProp<SavedStackParamList, 'SavedArticles'>,
): UseSavedArticlesScreenResult => {
  const dispatch = useAppDispatch();
  const savedById = useAppSelector(state => state.saved.byId, shallowEqual);
  const gateStatus = useAppSelector(state => state.authGate.status);

  const savedArticles = useMemo(() => {
    const list = Object.values(savedById);
    const time = (iso: string): number => {
      const n = Date.parse(iso);
      return Number.isNaN(n) ? 0 : n;
    };
    return list.sort((a, b) => time(b.publishedAt) - time(a.publishedAt));
  }, [savedById]);

  useFocusEffect(
    useCallback(() => {
      if (gateStatus !== 'authenticated') {
        navigation.replace('SavedGate');
      }
    }, [gateStatus, navigation]),
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState !== 'active') {
        dispatch(lockSavedTab());
      }
    });

    return () => {
      subscription.remove();
    };
  }, [dispatch]);

  const viewArticle = useCallback(
    (article: Article) => {
      navigation.navigate('ArticleWebView', {article, sourceTab: 'saved'});
    },
    [navigation],
  );

  const toggleOfflineSave = useCallback(
    (article: Article) => {
      dispatch(toggleSavedArticle(article));
    },
    [dispatch],
  );

  return {savedArticles, viewArticle, toggleOfflineSave};
};
