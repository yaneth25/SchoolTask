import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import ConfirmModal from '../components/ConfirmModal';
import Header from '../components/Header';
import { FONTS, RADIUS } from '../constants/theme';
import { useSettings } from '../context/SettingsContext';
import { useTheme } from '../context/ThemeContext';

function SectionLabel({ children }) {
  const { colors } = useTheme();
  return (
    <Text style={[styles.sectionLabel, { color: colors.sectionLabel }]}>
      {children}
    </Text>
  );
}

function SwitchRow({ label, description, value, onValueChange }) {
  const { colors } = useTheme();

  return (
    <View style={styles.switchRow}>
      <View style={styles.switchTextCol}>
        <Text style={[styles.switchLabel, { color: colors.text }]}>{label}</Text>
        {description ? (
          <Text style={[styles.switchDescription, { color: colors.mutedText }]}>
            {description}
          </Text>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: colors.switchTrackOff,
          true: colors.switchTrackOn,
        }}
        thumbColor={colors.white}
      />
    </View>
  );
}

export default function Configuracion({
  onMenuPress,
  navigation,
  onDeleteAccount,
  onLogout,
}) {
  const { colors, isDarkMode, setDarkMode } = useTheme();
  const { settings, updateSetting } = useSettings();

  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [pendingNotificationsOff, setPendingNotificationsOff] = useState(false);

  const handleMenuPress = () => {
    if (onMenuPress) onMenuPress(navigation);
  };

  const handleNotificationsToggle = (next) => {
    if (!next && settings.notificationsEnabled) {
      setPendingNotificationsOff(true);
      setShowDeactivateModal(true);
      return;
    }
    updateSetting('notificationsEnabled', next);
  };

  const confirmDeactivateNotifications = () => {
    updateSetting('notificationsEnabled', false);
    setPendingNotificationsOff(false);
    setShowDeactivateModal(false);
  };

  const cancelDeactivateNotifications = () => {
    setPendingNotificationsOff(false);
    setShowDeactivateModal(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="CONFIGURACIÓN"
        showTitle
        showNotifications={false}
        onMenuPress={handleMenuPress}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SectionLabel>TEMA</SectionLabel>
        <View style={[styles.themeRow, { borderBottomColor: colors.border }]}>
          <Feather name="moon" size={22} color={colors.iconText} />
          <Text style={[styles.themeLabel, { color: colors.text }]}>MODO OSCURO</Text>
          <Switch
            value={isDarkMode}
            onValueChange={setDarkMode}
            trackColor={{
              false: colors.switchTrackOff,
              true: colors.switchTrackOn,
            }}
            thumbColor={colors.white}
          />
        </View>

        <SectionLabel>PREFERENCIAS DE NOTIFICACIONES</SectionLabel>
        <SwitchRow
          label="ACTIVAR NOTIFICACIONES"
          value={
            pendingNotificationsOff ? true : settings.notificationsEnabled
          }
          onValueChange={handleNotificationsToggle}
        />
        <SwitchRow
          label="VIBRACIÓN DE NOTIFICACIÓN"
          value={settings.vibrationEnabled}
          onValueChange={(v) => updateSetting('vibrationEnabled', v)}
        />

        <SectionLabel>ELEGIR QUÉ TIPO DE NOTIFICACIONES</SectionLabel>
        <SwitchRow
          label="PRÓXIMA CLASE"
          description="NOTIFICACIÓN CUANDO ESTÉ POR COMENZAR LA SIGUIENTE CLASE"
          value={settings.nextClassEnabled}
          onValueChange={(v) => updateSetting('nextClassEnabled', v)}
        />
        <SwitchRow
          label="ENTREGA DE TRABAJO"
          description="AVISOS PARA RECORDAR TAREAS O ACTIVIDADES PENDIENTES"
          value={settings.workDeliveryEnabled}
          onValueChange={(v) => updateSetting('workDeliveryEnabled', v)}
        />
        <SwitchRow
          label="FECHA LÍMITE DE ENTREGA"
          description="NOTIFICACIÓN ANTES DE QUE VENZA LA FECHA DE ENTREGA"
          value={settings.deadlineReminderEnabled}
          onValueChange={(v) => updateSetting('deadlineReminderEnabled', v)}
        />
        <SwitchRow
          label="FECHA DE ENTREGA VENCIDA"
          description="AVISO CUANDO LA FECHA LÍMITE DE UNA TAREA YA PASÓ"
          value={settings.overdueEnabled}
          onValueChange={(v) => updateSetting('overdueEnabled', v)}
        />

        <SectionLabel>CUENTA</SectionLabel>
        <View style={styles.accountRow}>
          <Pressable
            style={[styles.accountBtn, { backgroundColor: colors.accent }]}
            onPress={() => setShowDeleteModal(true)}
          >
            <Text style={[styles.accountBtnText, { color: colors.titleText }]}>
              ELIMINAR
            </Text>
          </Pressable>
          <Pressable
            style={[styles.accountBtn, { backgroundColor: colors.accent }]}
            onPress={() => setShowLogoutModal(true)}
          >
            <Text style={[styles.accountBtnText, { color: colors.titleText }]}>
              CERRAR SESIÓN
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <ConfirmModal
        visible={showDeactivateModal}
        title="¿SEGURO QUE QUIERES DESACTIVARLAS?"
        message="SI DESACTIVAS LAS NOTIFICACIONES NO RECIBIRÁS NOTIFICACIONES DE NINGÚN TIPO"
        cancelLabel="CANCELAR"
        confirmLabel="DESACTIVAR"
        onCancel={cancelDeactivateNotifications}
        onConfirm={confirmDeactivateNotifications}
      />

      <ConfirmModal
        visible={showDeleteModal}
        title="¿SEGURO QUE QUIERES ELIMINAR LA CUENTA?"
        message="SI ELIMINAS LA CUENTA PERDERÁS TODOS LOS DATOS"
        cancelLabel="CANCELAR"
        confirmLabel="ELIMINAR"
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={() => {
          setShowDeleteModal(false);
          if (onDeleteAccount) onDeleteAccount();
        }}
      />

      <ConfirmModal
        visible={showLogoutModal}
        title="¿SEGURO QUE QUIERES CERRAR LA SESIÓN?"
        message="PODRÁS INICIAR SESIÓN EN CUALQUIER MOMENTO"
        cancelLabel="CANCELAR"
        confirmLabel="CERRAR SESIÓN"
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          if (onLogout) onLogout();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontFamily: FONTS.serif,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 20,
    marginBottom: 12,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  themeLabel: {
    flex: 1,
    fontFamily: FONTS.serif,
    fontSize: 15,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    gap: 12,
  },
  switchTextCol: {
    flex: 1,
    paddingRight: 8,
  },
  switchLabel: {
    fontFamily: FONTS.serif,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  switchDescription: {
    fontFamily: FONTS.serif,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    lineHeight: 16,
  },
  accountRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 8,
    marginBottom: 24,
  },
  accountBtn: {
    flex: 1,
    borderRadius: RADIUS.button,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountBtnText: {
    fontFamily: FONTS.serif,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});
