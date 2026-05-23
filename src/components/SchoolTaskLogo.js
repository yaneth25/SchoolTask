import { View, StyleSheet, useWindowDimensions, Image } from 'react-native';

const logoSource = require('../../assets/Logo.png');

export default function SchoolTaskLogo() {
  const { width } = useWindowDimensions();
  const logoSize = Math.min(Math.max(width * 0.70, 260), 400);

  return (
    <View style={styles.container}>
      <Image 
        source={logoSource} 
        style={[styles.logo, { width: logoSize, height: logoSize }]} 
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    // IMPORTANTE: Definir una altura fija o dejarlo en 0 
    // evita que este contenedor empuje lo que esté abajo
    height: 180, 
  },
  logo: {
    // Al usar 'absolute', la imagen flota y ya no empuja los demás elementos
    position: 'absolute',
    zIndex: 1,
  },
});
