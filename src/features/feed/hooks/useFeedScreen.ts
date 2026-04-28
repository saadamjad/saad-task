import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useMemo } from 'react';
import { shallowEqual } from 'react-redux';
import type { RootState } from 'store';
import { useAppDispatch, useAppSelector } from 'store';
import { clearFeedError, fetchFeed, loadMore } from 'store/slices/feedSlice';
import { toggleSavedArticle } from 'store/slices/savedSlice';
import type { Article } from 'types/article';
import type { FeedStackParamList } from 'types/navigation';

interface UseFeedScreenResult {
  feedState: RootState['feed'];
  savedById: Record<string, Article>;
  /** Stable snapshot for FlashList `extraData` so rows re-render when saved state changes. */
  savedArticlesDigest: string;
  visibleArticles: Article[];
  retryFeedLoad: () => void;
  viewArticle: (article: Article) => void;
  toggleOfflineSave: (article: Article) => void;
  loadMoreArticles: () => void;
}

export const useFeedScreen = (
  navigation: NativeStackNavigationProp<FeedStackParamList, 'FeedHome'>,
): UseFeedScreenResult => {
  const dispatch = useAppDispatch();
  const feedState = useAppSelector(state => state.feed);
  const savedById = useAppSelector(state => state.saved.byId, shallowEqual);

  const savedArticlesDigest = useMemo(
    () => Object.keys(savedById).sort().join('|'),
    [savedById],
  );

  const visibleArticles = useMemo(
    () => feedState.allArticles.slice(0, feedState.visibleCount),
    [feedState.allArticles, feedState.visibleCount],
  );

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  const retryFeedLoad = useCallback(() => {
    dispatch(clearFeedError());
    dispatch(fetchFeed());
  }, [dispatch]);

  const viewArticle = useCallback(
    (article: Article) => {
      navigation.navigate('ArticleWebView', {article, sourceTab: 'feed'});
    },
    [navigation],
  );

  const toggleOfflineSave = useCallback(
    (article: Article) => {
      dispatch(toggleSavedArticle(article));
    },
    [dispatch],
  );

  const loadMoreArticles = useCallback(() => {
    dispatch(loadMore());
  }, [dispatch]);

  return {
    feedState,
    savedById,
    savedArticlesDigest,
    visibleArticles,
    retryFeedLoad,
    viewArticle,
    toggleOfflineSave,
    loadMoreArticles,
  };
};
