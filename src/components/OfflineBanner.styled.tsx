import styled from 'styled-components/native';

export const Banner = styled.View<{ $paddingTop: number }>`
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  padding-bottom: ${({ theme }) => theme.spacing.sm}px;
  padding-top: ${({ $paddingTop }) => $paddingTop}px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const BannerText = styled.Text`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 13px;
`;
