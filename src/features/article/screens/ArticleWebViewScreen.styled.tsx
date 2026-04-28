import WebView from 'react-native-webview';
import styled from 'styled-components/native';

export const ArticleWebView = styled(WebView)`
  flex: 1;
`;

export const Root = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Toolbar = styled.View`
  flex-direction: row;
  justify-content: space-around;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
`;

export const ToolbarButton = styled.Pressable`
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.accent};
  border-radius: 8px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
`;

export const ToolbarButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 700;
`;

export const ErrorBanner = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

export const ErrorBannerText = styled.Text`
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  font-size: 14px;
`;
