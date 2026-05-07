import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../components/AppHeader';
import { TaskCard } from '../components/TaskCard';
import { useTasks } from '../context/TaskContext';
import type { RootStackParamList } from '../navigation/types';
import type { Task } from '../types';
import { colors, radii, spacing } from '../theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'TaskList'>;

type Props = {
  navigation: Nav;
};

export function TaskListScreen({ navigation }: Props) {
  const { tasks, deleteTask, deleteAllTasks, toggleComplete } = useTasks();
  const [menuVisible, setMenuVisible] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <AppHeader title="SECCIÓN DE TAREAS" onMenuPress={() => setMenuVisible(true)} />

      <View style={styles.submenu}>
        <Pressable
          onPress={() => navigation.navigate('AddTask')}
          style={({ pressed }) => [styles.submenuBtn, pressed && styles.pressed]}
        >
          <Text style={styles.submenuText}>Nueva tarea</Text>
        </Pressable>
        <View style={styles.submenuDivider} />
        <Pressable
          onPress={() => tasks.length > 0 && setConfirmClearAll(true)}
          style={({ pressed }) => [
            styles.submenuBtn,
            tasks.length === 0 && styles.submenuBtnDisabled,
            pressed && tasks.length > 0 && styles.pressed,
          ]}
          disabled={tasks.length === 0}
        >
          <Text
            style={[styles.submenuText, tasks.length === 0 && styles.submenuTextDisabled]}
          >
            Eliminar todas
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>
                PARECE QUE NO TIENES NINGUNA TAREA ASIGNADA
              </Text>
            </View>
            <Text style={styles.emptyHint}>ASIGNAR UNA TAREA</Text>
            <Pressable
              onPress={() => navigation.navigate('AddTask')}
              style={({ pressed }) => [styles.fab, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Agregar tarea"
            >
              <Ionicons name="add" size={34} color={colors.text} />
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            expanded={expandedId === item.id}
            onToggleExpand={() => toggleExpand(item.id)}
            onDeletePress={() => setDeleteTarget(item)}
            onToggleComplete={() => toggleComplete(item.id)}
          />
        )}
      />

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.menuOverlay} onPress={() => setMenuVisible(false)}>
          <Pressable style={styles.menuPanel} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.menuTitle}>SchoolTask</Text>
            <Text style={styles.menuBody}>
              Las opciones del menú principal estarán disponibles próximamente.
            </Text>
            <Pressable
              onPress={() => setMenuVisible(false)}
              style={({ pressed }) => [styles.menuClose, pressed && styles.pressed]}
            >
              <Text style={styles.menuCloseText}>Cerrar</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={deleteTarget !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteTarget(null)}
      >
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>¿SEGURO QUE QUIERES ELIMINAR LA TAREA?</Text>
            <Text style={styles.confirmSub}>
              Recuerda que puedes crear una tarea después.
            </Text>
            <View style={styles.confirmRow}>
              <Pressable
                onPress={() => {
                  if (deleteTarget) deleteTask(deleteTarget.id);
                  setDeleteTarget(null);
                }}
                style={({ pressed }) => [styles.confirmBtn, pressed && styles.pressed]}
              >
                <Text style={styles.confirmBtnText}>ELIMINAR</Text>
              </Pressable>
              <Pressable
                onPress={() => setDeleteTarget(null)}
                style={({ pressed }) => [styles.confirmBtn, styles.confirmBtnGhost, pressed && styles.pressed]}
              >
                <Text style={styles.confirmBtnText}>VOLVER</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={confirmClearAll}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmClearAll(false)}
      >
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>¿ELIMINAR TODAS LAS TAREAS?</Text>
            <Text style={styles.confirmSub}>Esta acción no se puede deshacer.</Text>
            <View style={styles.confirmRow}>
              <Pressable
                onPress={() => {
                  deleteAllTasks();
                  setConfirmClearAll(false);
                  setExpandedId(null);
                }}
                style={({ pressed }) => [styles.confirmBtn, pressed && styles.pressed]}
              >
                <Text style={styles.confirmBtnText}>ELIMINAR TODO</Text>
              </Pressable>
              <Pressable
                onPress={() => setConfirmClearAll(false)}
                style={({ pressed }) => [styles.confirmBtn, styles.confirmBtnGhost, pressed && styles.pressed]}
              >
                <Text style={styles.confirmBtnText}>VOLVER</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  submenu: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  submenuBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
  },
  submenuBtnDisabled: {
    opacity: 0.45,
  },
  submenuDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: colors.border,
  },
  submenuText: {
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.4,
    color: colors.text,
    textTransform: 'uppercase',
  },
  submenuTextDisabled: {
    color: colors.textMuted,
  },
  pressed: {
    opacity: 0.88,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    paddingTop: spacing.xl * 2,
    paddingHorizontal: spacing.lg,
  },
  emptyBox: {
    backgroundColor: colors.accent,
    borderRadius: radii.card,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
  },
  emptyText: {
    textAlign: 'center',
    fontWeight: '800',
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
    letterSpacing: 0.3,
  },
  emptyHint: {
    marginTop: spacing.xl,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
    color: colors.textMuted,
  },
  fab: {
    marginTop: spacing.md,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accentStrong,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  menuPanel: {
    backgroundColor: colors.surface,
    borderRadius: radii.modal,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.md,
  },
  menuBody: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
    fontWeight: '500',
    marginBottom: spacing.lg,
  },
  menuClose: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accentStrong,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuCloseText: {
    fontWeight: '800',
    fontSize: 13,
    color: colors.text,
  },
  confirmOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  confirmBox: {
    backgroundColor: colors.surface,
    borderRadius: radii.modal,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  confirmTitle: {
    fontWeight: '800',
    fontSize: 15,
    textAlign: 'center',
    color: colors.text,
    letterSpacing: 0.3,
    marginBottom: spacing.md,
  },
  confirmSub: {
    fontSize: 14,
    textAlign: 'center',
    color: colors.textMuted,
    fontWeight: '500',
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  confirmRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: colors.accentStrong,
    borderRadius: radii.button,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  confirmBtnGhost: {
    backgroundColor: colors.accent,
  },
  confirmBtnText: {
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
    color: colors.text,
  },
});
