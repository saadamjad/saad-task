import {StyleSheet} from 'react-native';
import {colors, spacing} from 'theme';

export const styles = StyleSheet.create({
  banner: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  text: {
    color: colors.textSecondary,
    fontSize: 13,
  },
});
