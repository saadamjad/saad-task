import React from 'react';
import { SkeletonBar, SkeletonRoot } from './ArticleCardSkeleton.styled';

export const ArticleCardSkeleton = (): React.JSX.Element => {
  return (
    <SkeletonRoot testID="article-skeleton">
      <SkeletonBar $widthPct="30%" />
      <SkeletonBar $widthPct="100%" />
      <SkeletonBar $widthPct="60%" />
    </SkeletonRoot>
  );
};
