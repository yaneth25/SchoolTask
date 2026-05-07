import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from '../theme';

type Props = {
  title: string;
  onMenuPress: () => void;
};

export function AppHeader({ title, onMenuPress }: Props) {
  return (
    <View style={styles.row}>
      <Pressable
        onPress={onMenuPress}
        style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel="Abrir menú"
      >
        <Ionicons name="menu" size={26} color={colors.text} />
      </Pressable>
      <View style={styles.titlePill}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>
      <View style={styles.iconSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
  },
  pressed: {
    opacity: 0.85,
  },
  titlePill: {
    flex: 1,
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  title: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  iconSpacer: {
    width: 44,
    height: 44,
  },
});
