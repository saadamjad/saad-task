import {StyleSheet} from 'react-native';
import {colors, spacing} from 'theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bar: {
    height: 12,
    backgroundColor: colors.skeleton,
    borderRadius: 6,
    marginBottom: spacing.sm,
  },
  short: {width: '30%'},
  medium: {width: '60%'},
  long: {width: '100%'},
});
