import React, { memo, useCallback } from 'react';
import { Pressable } from 'react-native';
import type { Article } from 'types/article';
import {
  Category,
  Container,
  HeaderRow,
  ReadTime,
  SaveButton,
  SaveButtonText,
  Title,
} from './ArticleCard.styled';

interface Props {
  article: Article;
  isSaved: boolean;
  onPress: (article: Article) => void;
  onToggleSave: (article: Article) => void;
}

const arePropsEqual = (prev: Props, next: Props): boolean => {
  return (
    prev.isSaved === next.isSaved &&
    prev.onPress === next.onPress &&
    prev.onToggleSave === next.onToggleSave &&
    prev.article.id === next.article.id &&
    prev.article.title === next.article.title &&
    prev.article.link === next.article.link &&
    prev.article.category === next.article.category &&
    prev.article.summary === next.article.summary &&
    prev.article.readTimeMinutes === next.article.readTimeMinutes
  );
};

const ArticleCardComponent = ({
  article,
  isSaved,
  onPress,
  onToggleSave,
}: Props): React.JSX.Element => {
  const offlineLabel = isSaved ? 'Remove offline article' : 'Save offline';

  const handleOpenArticle = useCallback(() => {
    onPress(article);
  }, [article, onPress]);

  const handleToggleSave = useCallback(() => {
    onToggleSave(article);
  }, [article, onToggleSave]);

  return (
    <Container testID={`article-card-${article.id}`}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open article: ${article.title}`}
        hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
        onPress={handleOpenArticle}>
        <HeaderRow>
          <Category>{article.category}</Category>
          <ReadTime>{article.readTimeMinutes} min read</ReadTime>
        </HeaderRow>
        <Title>{article.title}</Title>
      </Pressable>
      <SaveButton
        accessibilityRole="button"
        accessibilityLabel={`${offlineLabel}: ${article.title}`}
        accessibilityHint={
          isSaved
            ? 'Removes this article from offline storage'
            : 'Saves this article for offline reading'
        }
        accessibilityState={{ selected: isSaved }}
        $saved={isSaved}
        onPress={handleToggleSave}
        testID={`article-save-${article.id}`}>
        <SaveButtonText $saved={isSaved}>{offlineLabel}</SaveButtonText>
      </SaveButton>
    </Container>
  );
};

export const ArticleCard = memo(ArticleCardComponent, arePropsEqual);
