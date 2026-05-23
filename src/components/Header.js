import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FONTS, RADIUS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export default function Header({
  title,
  showTitle = true,
  showNotifications = true,
  titleLarge = false,
  onMenuPress,
  onNotificationsPress,
}) {
  const { colors, borders } = useTheme();

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={onMenuPress}
        style={[
          styles.iconButton,
          { backgroundColor: colors.headerPill },
          borders.thin,
        ]}
        hitSlop={12}
      >
        <Text style={[styles.menuIcon, { color: colors.iconText }]}>☰</Text>
      </Pressable>

      {showTitle && title ? (
        <View
          style={[
            styles.titleContainer,
            titleLarge && styles.titleContainerLarge,
            { backgroundColor: colors.headerPill },
            borders.thin,
          ]}
        >
          <Text
            style={[
              styles.title,
              titleLarge && styles.titleLarge,
              { color: colors.titleText },
            ]}
            numberOfLines={2}
          >
            {title}
          </Text>
        </View>
      ) : (
        <View style={styles.titleSpacer} />
      )}

      {showNotifications ? (
        <Pressable
          onPress={onNotificationsPress}
          style={[
            styles.iconButton,
            { backgroundColor: colors.headerPill },
            borders.thin,
          ]}
          hitSlop={12}
        >
          <Feather name="bell" size={22} color={colors.iconText} />
        </Pressable>
      ) : (
        <View style={styles.iconPlaceholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.icon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 24,
  },
  iconPlaceholder: {
    width: 44,
    height: 44,
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: 12,
    borderRadius: RADIUS.card,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  titleContainerLarge: {
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  titleSpacer: {
    flex: 1,
    marginHorizontal: 12,
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: 15,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontWeight: '700',
    textAlign: 'center',
  },
  titleLarge: {
    fontSize: 20,
    letterSpacing: 0.8,
    lineHeight: 26,
  },
});
