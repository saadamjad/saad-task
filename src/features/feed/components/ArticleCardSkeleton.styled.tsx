import styled from 'styled-components/native';

export const SkeletonRoot = styled.View`
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

export const SkeletonBar = styled.View<{ $widthPct: '30%' | '60%' | '100%' }>`
  height: 12px;
  background-color: ${({ theme }) => theme.colors.skeleton};
  border-radius: 6px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  width: ${({ $widthPct }) => $widthPct};
`;
