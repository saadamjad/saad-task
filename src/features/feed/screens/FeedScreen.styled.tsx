import { SafeAreaView } from 'react-native';
import styled from 'styled-components/native';

export const ScreenSafe = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const ScreenCenter = styled(SafeAreaView)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

export const ErrorText = styled.Text`
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  text-align: center;
`;

export const EmptyText = styled.Text`
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
`;

export const ActionButton = styled.Pressable<{ $disabled?: boolean }>`
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.accent};
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  border-radius: 8px;
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
`;

export const ActionButtonSpaced = styled(ActionButton)`
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

export const ActionButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 600;
`;

export const FooterLoader = styled.View`
  padding-vertical: ${({ theme }) => theme.spacing.lg}px;
`;

/** Inline banner when a refresh fails but cached articles are still shown. */
export const StaleFeedErrorBanner = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  margin-horizontal: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

export const StaleFeedErrorText = styled.Text`
  color: ${({ theme }) => theme.colors.error};
  text-align: center;
  font-size: 14px;
`;
