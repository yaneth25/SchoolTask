import { View, Text, StyleSheet, useWindowDimensions, Image } from 'react-native';

export default function SchoolTaskLogo() {
  const { width } = useWindowDimensions();
  const logoSize = Math.min(Math.max(width * 0.42, 160), 220);

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
      ]}
    >
      <Image
        source={require('../assets/logo.png')}
        style={{
          width: logoSize * 0.5,
          height: logoSize * 0.5,
          resizeMode: 'contain',
        }}
      />

      <Text style={[styles.logoTitle, { fontSize: logoSize * 0.089, marginTop: logoSize * 0.04 }]}>
        SchoolTask
      </Text>
    </View>
  );
}