import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FONTS, RADIUS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export default function EmptyState({ onAssignPress }) {
  const { colors, borders } = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.messageBox,
          { backgroundColor: colors.container },
          borders.thin,
        ]}
      >
        <Text style={[styles.message, { color: colors.titleText }]}>
          NO HAY CLASES ASIGNADAS
        </Text>
      </View>

      <Pressable style={styles.plusButton} onPress={onAssignPress}>
        <Feather name="plus" size={28} color={colors.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBox: {
    borderRadius: RADIUS.card,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  message: {
    fontFamily: FONTS.serif,
    fontSize: 18,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.5,
    lineHeight: 26,
  },
  plusButton: {
    position: 'absolute',
    bottom: 40,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
