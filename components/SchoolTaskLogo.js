import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const DARK_RING = '#1E1E1E';
const ICON_COLOR = '#1E1E1E';

export default function SchoolTaskLogo() {
  const { width } = useWindowDimensions();
  const logoSize = Math.min(Math.max(width * 0.42, 160), 220);
  const iconSize = logoSize * 0.39;

  return (
    <View
      style={[
        styles.ring,
        {
          width: logoSize,
          height: logoSize,
          borderRadius: logoSize / 2,
          paddingHorizontal: logoSize * 0.07,
          paddingVertical: logoSize * 0.07,
        },
      ]}>
      <MaterialCommunityIcons name="book-clock-outline" size={iconSize} color={ICON_COLOR} />
      <Text style={[styles.logoTitle, { fontSize: logoSize * 0.089, marginTop: logoSize * 0.04 }]}>
        SchoolTask
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    borderWidth: 3,
    borderColor: DARK_RING,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTitle: {
    fontFamily: 'Graduate_400Regular',
    color: ICON_COLOR,
    textAlign: 'center',
    letterSpacing: 0.6,
  },
});
