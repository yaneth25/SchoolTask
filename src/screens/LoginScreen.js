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
import { SafeAreaView } from 'react-native-safe-area-context';
import SchoolTaskLogo from '../components/SchoolTaskLogo';
import { openPasswordRecovery } from '../../config/externalLinks';

const BG = '#FFFFFF';
const CARD = '#F7F3EC';
const BTN_BG = '#E6D3B3';
const BTN_BORDER = '#2F2F2F';
const INPUT_BORDER = '#C5C5C5';
const INPUT_BG = '#FFFFFF';
const BODY_TEXT = '#1E1E1E';

export default function LoginScreen({ onLoginSuccess, onGoToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { width } = useWindowDimensions();

  const horizontalPad = Math.max(width * 0.065, 20);
  const cardMaxWidth = Math.min(width - horizontalPad * 2, 402);
  const cardPaddingH = Math.max(22, Math.min(30, width * 0.07));

  const handleLogin = useCallback(() => {
    const emailTrim = email.trim();
    const passTrim = password.trim();
    if (!emailTrim || !passTrim) {
      Alert.alert('Campos requeridos', 'Completa el correo y la contraseña.');
      return;
    }
    console.log('[Login]', {
      correoElectronico: emailTrim,
      contrasena: passTrim,
    });

    // CORRECCIÓN: Da acceso a la app llamando la función que viene de App.js
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  }, [email, password, onLoginSuccess]);

  // CORRECCIÓN: Reemplazado navigation por onGoToRegister
  const goRegister = useCallback(() => {
    if (onGoToRegister) {
      onGoToRegister();
    }
  }, [onGoToRegister]);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingHorizontal: horizontalPad }]}
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
                borderRadius: 10,
                width: '100%',
                maxWidth: cardMaxWidth,
                paddingHorizontal: cardPaddingH,
                paddingVertical: Math.max(24, Math.min(30, width * 0.075)),
              },
            ]}>
            <Text style={styles.cardLine1}>¿YA TIENES UNA CUENTA?</Text>
            <Text style={[styles.cardLine2, { marginBottom: width < 360 ? 18 : 24 }]}>INICIA SESIÓN</Text>

            <TextInput
              style={styles.input}
              placeholder="CORREO ELECTRÓNICO"
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
              onPress={handleLogin}>
              <Text style={styles.primaryBtnText}>INICIAR SESIÓN</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.footer, { paddingHorizontal: width * 0.02 }]}>
            <View style={styles.footerRow}>
              <Text style={styles.footerMuted}>¿NO TIENES UNA CUENTA? </Text>
              <TouchableOpacity onPress={goRegister} activeOpacity={0.7} hitSlop={8}>
                <Text style={styles.link}>REGISTRARSE</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.footerRow, styles.footerSpacer]}>
              <Text style={styles.footerMuted}>¿OLVIDASTE LA CONTRASEÑA? </Text>
              <TouchableOpacity onPress={() => openPasswordRecovery()} activeOpacity={0.7} hitSlop={8}>
                <Text style={styles.link}>RECUPERAR CONTRASEÑA</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Mantén aquí abajo tus estilos actuales (styles = StyleSheet.create...) intactos tal como los tenías.


const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 40,
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
  },
  cardLine1: {
    fontFamily: 'Graduate_400Regular',
    fontSize: 15,
    color: BODY_TEXT,
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  cardLine2: {
    fontFamily: 'Graduate_400Regular',
    fontSize: 20,
    color: BODY_TEXT,
    textAlign: 'center',
    letterSpacing: 1,
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
  footer: {
    marginTop: 36,
    alignItems: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 380,
    paddingHorizontal: 4,
  },
  footerSpacer: {
    marginTop: 18,
  },
  footerMuted: {
    fontFamily: 'Graduate_400Regular',
    fontSize: 12,
    color: BODY_TEXT,
    letterSpacing: 0.35,
    textAlign: 'center',
  },
  link: {
    fontFamily: 'Graduate_400Regular',
    fontSize: 12,
    color: BODY_TEXT,
    textDecorationLine: 'underline',
    letterSpacing: 0.35,
  },
});
