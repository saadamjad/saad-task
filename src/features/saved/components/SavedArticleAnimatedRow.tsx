import { ArticleCard } from 'features/feed/components/ArticleCard';
import type { JSX } from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { Article } from 'types/article';

import { RowClip } from './SavedArticleAnimatedRow.styled';

const SLIDE_OUT_DURATION_MS = 280;
const MIN_SLIDE_DISTANCE = 320;

interface Props {
  article: Article;
  viewArticle: (article: Article) => void;
  onSlideOutRemovalComplete: (article: Article) => void;
}

/**
 * Slides the row off-screen to the right with Reanimated, then dispatches removal.
 * Handles list recycling, in-flight taps, unmount, and dimension updates safely.
 */
export const SavedArticleAnimatedRow = ({
  article,
  viewArticle,
  onSlideOutRemovalComplete,
}: Props): JSX.Element => {
  const {width: windowWidth} = useWindowDimensions();
  const translateX = useSharedValue(0);
  const isAnimating = useSharedValue(0);
  const isMountedRef = useRef(true);

  const slideDistance = Math.max(windowWidth, MIN_SLIDE_DISTANCE);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      cancelAnimation(translateX);
    };
  }, [translateX]);

  useEffect(() => {
    cancelAnimation(translateX);
    translateX.value = 0;
    isAnimating.value = 0;
  }, [article.id, translateX, isAnimating]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}],
  }));

  const completeRemovalAfterAnimation = useCallback(() => {
    if (!isMountedRef.current) {
      return;
    }
    isAnimating.value = 0;
    onSlideOutRemovalComplete(article);
  }, [article, isAnimating, onSlideOutRemovalComplete]);

  const handleRemoveTap = useCallback(() => {
    if (isAnimating.value !== 0) {
      return;
    }
    if (slideDistance <= 0) {
      completeRemovalAfterAnimation();
      return;
    }

    isAnimating.value = 1;

    translateX.value = withTiming(
      slideDistance,
      {duration: SLIDE_OUT_DURATION_MS},
      finished => {
        if (finished) {
          runOnJS(completeRemovalAfterAnimation)();
        } else {
          isAnimating.value = 0;
        }
      },
    );
  }, [completeRemovalAfterAnimation, slideDistance, translateX, isAnimating]);

  return (
    <Animated.View style={animatedStyle}>
      <RowClip>
        <ArticleCard
          article={article}
          isSaved
          onPress={viewArticle}
          onToggleSave={handleRemoveTap}
        />
      </RowClip>
    </Animated.View>
  );
};
