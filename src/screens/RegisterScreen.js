import { useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SchoolTaskLogo from '../components/SchoolTaskLogo';

const BG = '#FFFFFF';
const CARD = '#F7F3EC';
const BTN_BG = '#E6D3B3';
const BTN_BORDER = '#2F2F2F';
const INPUT_BORDER = '#C5C5C5';
const INPUT_BG = '#FFFFFF';
const BODY_TEXT = '#1E1E1E';
const ICON_BACK = '#1E1E1E';

// CORRECCIÓN: Ahora recibe las funciones de estado desde App.js en vez de 'navigation'
export default function RegisterScreen({ onRegisterSuccess, onGoToLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const horizontalPad = Math.max(width * 0.065, 20);
  const cardMaxWidth = Math.min(width - horizontalPad * 2, 402);
  const cardPaddingH = Math.max(22, Math.min(30, width * 0.07));

  const handleRegister = useCallback(() => {
    const u = username.trim();
    const e = email.trim();
    const p = password.trim();
    if (!u || !e || !p) {
      Alert.alert('Campos requeridos', 'Completa usuario, correo y contraseña.');
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
    if (!emailOk) {
      Alert.alert('Correo inválido', 'Introduce un correo electrónico válido.');
      return;
    }
    console.log('[Registro]', { usuario: u, correoElectronico: e, contrasena: p });
    
    // Al registrarse con éxito, redirige automáticamente al Login
    if (onRegisterSuccess) {
      onRegisterSuccess();
    }
  }, [username, email, password, onRegisterSuccess]);

  // CORRECCIÓN: Usa la función nativa del estado para regresar de forma segura
  const goBack = useCallback(() => {
    if (onGoToLogin) {
      onGoToLogin();
    }
  }, [onGoToLogin]);

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Volver al inicio de sesión"
          onPress={goBack}
          style={[styles.backBtn, { left: horizontalPad - 6, top: Math.max(insets.top + 6, 10) }]}
          activeOpacity={0.65}>
          <MaterialCommunityIcons name="arrow-left" size={28} color={ICON_BACK} />
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingHorizontal: horizontalPad, paddingTop: Math.max(insets.top + 44, 56) },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Text style={[styles.welcome, { fontSize: width < 360 ? 16 : 19 }]}>¡BIENVENIDO A SCHOOLTASK!</Text>

          <View style={styles.logoWrap}>
            <SchoolTaskLogo />
          </View>

          <View
            style={[
              styles.card,
              {
                width: '100%',
                maxWidth: cardMaxWidth,
                paddingHorizontal: cardPaddingH,
                paddingVertical: Math.max(24, Math.min(30, width * 0.075)),
              },
            ]}>
            <Text style={styles.cardTitle}>REGISTRARSE</Text>

            <TextInput
              style={styles.input}
              placeholder="USUARIO"
              placeholderTextColor="#9A9A9A"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TextInput
              style={styles.input}
              placeholder="CORREO"
              placeholderTextColor="#9A9A9A"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TextInput
              style={styles.input}
              placeholder="CONTRASEÑA"
              placeholderTextColor="#9A9A9A"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={[styles.primaryBtn, { marginTop: width < 360 ? 22 : 28 }]}
              activeOpacity={0.72}
              onPress={handleRegister}>
              <Text style={styles.primaryBtnText}>REGISTRARSE</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footerSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  flex: {
    flex: 1,
  },
  backBtn: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 2,
    padding: 10,
    borderRadius: 8,
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 32,
    width: '100%',
  },
  welcome: {
    fontFamily: 'Graduate_400Regular',
    color: BODY_TEXT,
    textAlign: 'center',
    letterSpacing: 0.8,
    lineHeight: 26,
    maxWidth: 340,
    marginBottom: 28,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 32,
  },
  card: {
    backgroundColor: CARD,
    alignSelf: 'center',
    borderRadius: 10,
  },
  cardTitle: {
    fontFamily: 'Graduate_400Regular',
    fontSize: 21,
    color: BODY_TEXT,
    textAlign: 'center',
    marginBottom: 22,
    letterSpacing: 2,
  },
  label: {
    fontFamily: 'Graduate_400Regular',
    fontSize: 12,
    letterSpacing: 1.2,
    color: BODY_TEXT,
    marginBottom: 8,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  labelSp: {
    marginTop: 14,
  },
  input: {
    marginBottom: 20,
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    borderRadius: 9999,
    paddingVertical: Platform.OS === 'ios' ? 16 : 12,
    paddingHorizontal: 20,
    fontFamily: 'Graduate_400Regular',
    fontSize: 14,
    letterSpacing: 0.8,
    color: BODY_TEXT,
    textAlign: 'center',
    ...(Platform.OS === 'android' && { textAlignVertical: 'center' }),
  },
  primaryBtn: {
    backgroundColor: BTN_BG,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: BTN_BORDER,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontFamily: 'Graduate_400Regular',
    fontSize: 15,
    letterSpacing: 1.8,
    color: BODY_TEXT,
  },
  footerSpacer: {
    height: 32,
  },
});
