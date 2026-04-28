import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlashList } from '@shopify/flash-list';
import { ArticleCard } from 'features/feed/components/ArticleCard';
import { ArticleCardSkeleton } from 'features/feed/components/ArticleCardSkeleton';
import { useFeedScreen } from 'features/feed/hooks/useFeedScreen';
import type { JSX } from 'react';
import { useCallback, useMemo } from 'react';
import { ActivityIndicator, RefreshControl } from 'react-native';
import { useTheme } from 'styled-components/native';
import type { Article } from 'types/article';
import type { FeedStackParamList } from 'types/navigation';
import {
  ActionButton,
  ActionButtonSpaced,
  ActionButtonText,
  EmptyText,
  ErrorText,
  FooterLoader,
  ScreenCenter,
  ScreenSafe,
  StaleFeedErrorBanner,
  StaleFeedErrorText,
} from './FeedScreen.styled';

const FEED_ESTIMATED_ROW_SIZE = 160;
const SKELETON_ESTIMATED_ROW_SIZE = 120;

type Props = NativeStackScreenProps<FeedStackParamList, 'FeedHome'>;

export const FeedScreen = ({ navigation }: Props): JSX.Element => {
  const theme = useTheme();
  const {
    feedState,
    savedById,
    savedArticlesDigest,
    visibleArticles,
    retryFeedLoad,
    viewArticle,
    toggleOfflineSave,
    loadMoreArticles,
  } = useFeedScreen(navigation);

  const hasArticles = feedState.allArticles.length > 0;
  const showInitialSkeleton = feedState.loading && !hasArticles;

  const listContentStyle = useMemo(
    () => ({ padding: theme.spacing.lg }),
    [theme.spacing.lg],
  );

  const renderArticle = useCallback(
    ({ item }: { item: Article }) => (
      <ArticleCard
        article={item}
        isSaved={Boolean(savedById[item.id])}
        onPress={viewArticle}
        onToggleSave={toggleOfflineSave}
      />
    ),
    [savedById, toggleOfflineSave, viewArticle],
  );

  const refreshControlEl = useMemo(
    () => (
      <RefreshControl
        refreshing={feedState.loading && hasArticles}
        onRefresh={retryFeedLoad}
        tintColor={theme.colors.accent}
        colors={[theme.colors.accent]}
        progressBackgroundColor={theme.colors.surface}
      />
    ),
    [
      feedState.loading,
      hasArticles,
      retryFeedLoad,
      theme.colors.accent,
      theme.colors.surface,
    ],
  );

  const staleErrorBanner =
    feedState.error && hasArticles ? (
      <StaleFeedErrorBanner accessibilityRole="alert">
        <StaleFeedErrorText>{feedState.error}</StaleFeedErrorText>
      </StaleFeedErrorBanner>
    ) : null;

  if (showInitialSkeleton) {
    return (
      <ScreenSafe>
        <FlashList
          data={[1, 2, 3, 4]}
          renderItem={() => <ArticleCardSkeleton />}
          estimatedItemSize={SKELETON_ESTIMATED_ROW_SIZE}
          keyExtractor={item => String(item)}
        />
      </ScreenSafe>
    );
  }

  if (feedState.error && !hasArticles) {
    return (
      <ScreenCenter>
        <ErrorText>{feedState.error}</ErrorText>
        <ActionButton
          accessibilityRole="button"
          accessibilityLabel="Retry loading feed after error"
          disabled={feedState.loading}
          $disabled={feedState.loading}
          onPress={retryFeedLoad}>
          <ActionButtonText>Retry</ActionButtonText>
        </ActionButton>
      </ScreenCenter>
    );
  }

  if (!hasArticles) {
    return (
      <ScreenCenter>
        <EmptyText>No articles found right now.</EmptyText>
        <ActionButtonSpaced
          accessibilityRole="button"
          accessibilityLabel="Retry loading feed"
          disabled={feedState.loading}
          $disabled={feedState.loading}
          onPress={retryFeedLoad}>
          <ActionButtonText>Refresh</ActionButtonText>
        </ActionButtonSpaced>
      </ScreenCenter>
    );
  }

  return (
    <ScreenSafe>
      <FlashList
        contentContainerStyle={listContentStyle}
        data={visibleArticles}
        extraData={savedArticlesDigest}
        estimatedItemSize={FEED_ESTIMATED_ROW_SIZE}
        keyExtractor={item => item.id}
        onEndReached={loadMoreArticles}
        onEndReachedThreshold={0.6}
        refreshControl={refreshControlEl}
        renderItem={renderArticle}
        ListHeaderComponent={staleErrorBanner}
        ListFooterComponent={
          feedState.visibleCount < feedState.allArticles.length ? (
            <FooterLoader>
              <ActivityIndicator color={theme.colors.accent} />
            </FooterLoader>
          ) : null
        }
      />
    </ScreenSafe>
  );
};
