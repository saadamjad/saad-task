import React, {memo} from 'react';
import {Pressable, Text, View} from 'react-native';
import type {Article} from 'types/article';
import {styles} from './ArticleCard.styles';

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

const ArticleCardComponent = ({article, isSaved, onPress, onToggleSave}: Props): React.JSX.Element => {
  const offlineLabel = isSaved ? 'Remove Offline' : 'Save Offline';

  return (
    <View style={styles.container} testID={`article-card-${article.id}`}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open article: ${article.title}`}
        hitSlop={{top: 4, bottom: 4, left: 4, right: 4}}
        onPress={() => onPress(article)}>
        <View style={styles.headerRow}>
          <Text style={styles.category}>{article.category}</Text>
          <Text style={styles.readTime}>{article.readTimeMinutes} min read</Text>
        </View>
        <Text style={styles.title}>{article.title}</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${offlineLabel} — ${article.title}`}
        accessibilityState={{selected: isSaved}}
        style={[styles.saveButton, isSaved ? styles.savedButton : undefined]}
        onPress={() => onToggleSave(article)}
        testID={`article-save-${article.id}`}>
        <Text style={styles.saveButtonText}>{offlineLabel}</Text>
      </Pressable>
    </View>
  );
};

export const ArticleCard = memo(ArticleCardComponent, arePropsEqual);
