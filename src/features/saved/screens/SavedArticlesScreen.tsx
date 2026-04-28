import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlashList } from '@shopify/flash-list';
import { ArticleCard } from 'features/feed/components/ArticleCard';
import { useSavedArticlesScreen } from 'features/saved/hooks/useSavedArticlesScreen';
import type { JSX } from 'react';
import { useCallback } from 'react';
import { SafeAreaView, Text } from 'react-native';
import type { Article } from 'types/article';
import type { SavedStackParamList } from 'types/navigation';
import { styles } from './SavedArticlesScreen.styles';

type Props = NativeStackScreenProps<SavedStackParamList, 'SavedArticles'>;

export const SavedArticlesScreen = ({navigation}: Props): JSX.Element => {

  const {savedArticles, viewArticle, toggleOfflineSave} = useSavedArticlesScreen(navigation);

  const renderSavedArticle = useCallback(
    ({item}: {item: Article}) => (
      <ArticleCard
        article={item}
        isSaved
        onPress={viewArticle}
        onToggleSave={toggleOfflineSave}
      />
    ),
    [toggleOfflineSave, viewArticle],
  );

  if (savedArticles.length === 0) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.emptyText}>No offline articles saved yet.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlashList
        data={savedArticles}
        estimatedItemSize={160}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={renderSavedArticle}
      />
    </SafeAreaView>
  );
};
