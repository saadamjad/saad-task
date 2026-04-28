import React from 'react';
import { View } from 'react-native';
import { styles } from './ArticleCardSkeleton.styles';

export const ArticleCardSkeleton = (): React.JSX.Element => {
  return (
    <View style={styles.container} testID="article-skeleton">
      <View style={[styles.bar, styles.short]} />
      <View style={[styles.bar, styles.long]} />
      <View style={[styles.bar, styles.medium]} />
    </View>
  );
};
