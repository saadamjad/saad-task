import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlashList } from '@shopify/flash-list';
import { ArticleCard } from 'features/feed/components/ArticleCard';
import { ArticleCardSkeleton } from 'features/feed/components/ArticleCardSkeleton';
import { useFeedScreen } from 'features/feed/hooks/useFeedScreen';
import type { JSX } from 'react';
import { useCallback } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, Text, View } from 'react-native';
import { colors } from 'theme';
import type { Article } from 'types/article';
import type { FeedStackParamList } from 'types/navigation';
import { styles } from './FeedScreen.styles';

type Props = NativeStackScreenProps<FeedStackParamList, 'FeedHome'>;

export const FeedScreen = ({navigation}: Props): JSX.Element => {
  const {
    feedState,
    savedById,
    visibleArticles,
    retryFeedLoad,
    viewArticle,
    toggleOfflineSave,
    loadMoreArticles,
  } = useFeedScreen(navigation);

  const renderArticle = useCallback(
    ({item}: {item: Article}) => (
      <ArticleCard
        article={item}
        isSaved={Boolean(savedById[item.id])}
        onPress={viewArticle}
        onToggleSave={toggleOfflineSave}
      />
    ),
    [savedById, toggleOfflineSave, viewArticle],
  );

  if (feedState.loading) {
    return (
      <SafeAreaView style={styles.container}>
        <FlashList
          data={[1, 2, 3, 4]}
          renderItem={() => <ArticleCardSkeleton />}
          estimatedItemSize={120}
          keyExtractor={item => String(item)}
        />
      </SafeAreaView>
    );
  }

  if (feedState.error) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>{feedState.error}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Retry loading feed after error"
          disabled={feedState.loading}
          onPress={retryFeedLoad}
          style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Retry</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (visibleArticles.length === 0) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.emptyText}>No articles found right now.</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Retry loading feed"
          onPress={retryFeedLoad}
          style={[styles.actionButton, styles.emptyRetrySpacing]}
          disabled={feedState.loading}>
          <Text style={styles.actionButtonText}>Refresh</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlashList
        contentContainerStyle={styles.listContent}
        data={visibleArticles}
        extraData={savedById}
        estimatedItemSize={160}
        keyExtractor={item => item.id}
        onEndReached={loadMoreArticles}
        onEndReachedThreshold={0.6}
        renderItem={renderArticle}
        ListFooterComponent={
          feedState.visibleCount < feedState.allArticles.length ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator color={colors.accent} />
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};
