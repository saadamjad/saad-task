import { SafeAreaView, TextInput } from 'react-native';
import styled from 'styled-components/native';

export const ScreenSafe = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

export const Card = styled.View`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.card};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 20px;
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

export const Subtitle = styled.Text`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

export const InfoText = styled.Text`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const PinInput = styled(TextInput)`
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.textPrimary};
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

export const SubmitButton = styled.Pressable<{ $disabled?: boolean }>`
  background-color: ${({ theme }) => theme.colors.accent};
  border-radius: 8px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  align-items: center;
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
`;

export const SubmitButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 700;
`;

export const ErrorText = styled.Text`
  color: ${({ theme }) => theme.colors.error};
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;
