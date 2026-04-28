import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlashList } from '@shopify/flash-list';
import { SavedArticleAnimatedRow } from 'features/saved/components/SavedArticleAnimatedRow';
import { useSavedArticlesScreen } from 'features/saved/hooks/useSavedArticlesScreen';
import type { JSX } from 'react';
import { useCallback, useMemo } from 'react';
import { useTheme } from 'styled-components/native';
import { useAppDispatch } from 'store';
import { toggleSavedArticle } from 'store/slices/savedSlice';
import type { Article } from 'types/article';
import type { SavedStackParamList } from 'types/navigation';
import { CenterSafe, EmptyText, ListSafe } from './SavedArticlesScreen.styled';

type Props = NativeStackScreenProps<SavedStackParamList, 'SavedArticles'>;

export const SavedArticlesScreen = ({ navigation }: Props): JSX.Element => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { savedArticles, viewArticle } = useSavedArticlesScreen(navigation);

  const removeSavedArticleAfterSlideOut = useCallback(
    (article: Article) => {
      dispatch(toggleSavedArticle(article));
    },
    [dispatch],
  );

  const renderSavedArticle = useCallback(
    ({ item }: { item: Article }) => (
      <SavedArticleAnimatedRow
        article={item}
        viewArticle={viewArticle}
        onSlideOutRemovalComplete={removeSavedArticleAfterSlideOut}
      />
    ),
    [removeSavedArticleAfterSlideOut, viewArticle],
  );

  const listContentStyle = useMemo(
    () => ({ padding: theme.spacing.lg }),
    [theme.spacing.lg],
  );

  if (savedArticles.length === 0) {
    return (
      <CenterSafe>
        <EmptyText>No offline articles saved yet.</EmptyText>
      </CenterSafe>
    );
  }

  return (
    <ListSafe>
      <FlashList
        data={savedArticles}
        estimatedItemSize={160}
        keyExtractor={item => item.id}
        contentContainerStyle={listContentStyle}
        renderItem={renderSavedArticle}
      />
    </ListSafe>
  );
};
