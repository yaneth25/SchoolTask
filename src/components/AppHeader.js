import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Plus } from 'lucide-react-native';
import { FONTS, RADIUS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export function AppHeader({ titlePill, onMenuPress, showListAdd, onAddPress }) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Menú"
        onPress={onMenuPress}
        style={({ pressed }) => [
          styles.menuButton,
          { backgroundColor: colors.headerPill },
          pressed && styles.pressed,
        ]}
      >
        <Text style={[styles.menuIcon, { color: colors.iconText }]}>☰</Text>
      </Pressable>

      <View style={styles.center}>
        {titlePill ? (
          <View style={[styles.titlePill, { backgroundColor: colors.headerPill }]}>
            <Text style={[styles.titlePillText, { color: colors.titleText }]}>
              {titlePill}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.rightSlot}>
        {showListAdd ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Asignar tarea"
            onPress={onAddPress}
            style={({ pressed }) => [styles.iconHit, pressed && styles.pressed]}
          >
            <Plus size={28} color={colors.iconText} strokeWidth={2.5} />
          </Pressable>
        ) : (
          <View style={styles.iconHit} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    minHeight: 52,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.menuButton,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    fontSize: 22,
    fontWeight: '700',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  titlePill: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: RADIUS.pill,
    maxWidth: '100%',
  },
  titlePillText: {
    fontFamily: FONTS.serif,
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.6,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  rightSlot: {
    width: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  iconHit: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
});
