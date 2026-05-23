import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SchoolTaskLogo from '../components/SchoolTaskLogo';
import { FONTS, RADIUS } from '../constants/theme';

const MESSAGES = {
  deleted: {
    status: 'SE HA ELIMINADO LA CUENTA',
    hint: 'INICIA SESIÓN O REGÍSTRATE PARA ACCEDER',
  },
  logout: {
    status: 'SE HA CERRADO LA SESIÓN',
    hint: 'INICIA SESIÓN O REGÍSTRATE PARA ACCEDER',
  },
};

export default function AuthStatusScreen({ type = 'logout', onLogin, onRegister }) {
  const { width } = useWindowDimensions();
  const copy = MESSAGES[type] || MESSAGES.logout;
  const horizontalPad = Math.max(width * 0.065, 20);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.content, { paddingHorizontal: horizontalPad }]}>
        <SchoolTaskLogo />

        <Text style={styles.status}>{copy.status}</Text>
        <Text style={styles.hint}>{copy.hint}</Text>

        <View style={styles.buttonsRow}>
          <Pressable style={styles.actionBtn} onPress={onLogin}>
            <Text style={styles.actionBtnText}>INICIAR SESIÓN</Text>
          </Pressable>
          <Pressable style={styles.actionBtn} onPress={onRegister}>
            <Text style={styles.actionBtnText}>REGISTRARSE</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 48,
  },
  status: {
    fontFamily: FONTS.serif,
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 24,
    marginBottom: 10,
    maxWidth: 320,
  },
  hint: {
    fontFamily: FONTS.serif,
    fontSize: 13,
    fontWeight: '600',
    color: '#4A4A4A',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 36,
    maxWidth: 300,
    lineHeight: 20,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 14,
    width: '100%',
    maxWidth: 380,
    justifyContent: 'center',
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#E6D3B3',
    borderRadius: RADIUS.button,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    maxWidth: 180,
  },
  actionBtnText: {
    fontFamily: FONTS.serif,
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
});
