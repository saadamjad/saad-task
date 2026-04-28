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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  category: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  readTime: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  saveButton: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 8,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  savedButton: {
    backgroundColor: colors.accent,
  },
  saveButtonText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
});
