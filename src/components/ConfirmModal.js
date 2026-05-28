import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { FONTS, RADIUS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export default function ConfirmModal({
  visible,
  title,
  message,
  cancelLabel = 'CANCELAR',
  confirmLabel = 'CONFIRMAR',
  onCancel,
  onConfirm,
}) {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.box, { backgroundColor: colors.modalBackground }]}>
          <Text style={[styles.title, { color: colors.titleText }]}>{title}</Text>
          {message ? (
            <Text style={[styles.message, { color: colors.titleText }]}>{message}</Text>
          ) : null}

          <View style={styles.buttonsRow}>
            <Pressable
              style={[styles.button, { backgroundColor: colors.modalButtonBg }]}
              onPress={onCancel}
            >
              <Text style={[styles.buttonText, { color: colors.titleText }]}>
                {cancelLabel}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.button, { backgroundColor: colors.modalButtonBg }]}
              onPress={onConfirm}
            >
              <Text style={[styles.buttonText, { color: colors.titleText }]}>
                {confirmLabel}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  box: {
    width: '100%',
    maxWidth: 340,
    borderRadius: RADIUS.modal,
    paddingVertical: 28,
    paddingHorizontal: 22,
    alignItems: 'center',
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 12,
  },
  message: {
    fontFamily: FONTS.serif,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
    lineHeight: 18,
    marginBottom: 22,
    paddingHorizontal: 4,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    borderRadius: RADIUS.pill,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    maxWidth: 150,
  },
  buttonText: {
    fontFamily: FONTS.serif,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});
