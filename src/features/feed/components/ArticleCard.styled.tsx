import { Pressable } from 'react-native';
import styled from 'styled-components/native';

export const Container = styled.View`
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

export const Category = styled.Text`
  color: ${({ theme }) => theme.colors.accent};
  font-size: 12px;
  font-weight: 700;
`;

export const ReadTime = styled.Text`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 12px;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 16px;
  line-height: 22px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

export const SaveButton = styled(Pressable)<{ $saved?: boolean }>`
  border-width: 1px;
  border-color: ${({ $saved, theme }) =>
    $saved ? theme.colors.pinkLace : theme.colors.accent};
  border-radius: 8px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  background-color: ${({ $saved, theme }) =>
    $saved ? theme.colors.pinkLace : 'transparent'};
`;

export const SaveButtonText = styled.Text<{ $saved?: boolean }>`
  color: ${({ $saved, theme }) =>
    $saved ? theme.colors.removeOfflineText : theme.colors.textPrimary};
  font-weight: 600;
`;
