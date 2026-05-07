import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Task } from '../types';
import { colors, radii, spacing } from '../theme';

type Props = {
  task: Task;
  expanded: boolean;
  onToggleExpand: () => void;
  onDeletePress: () => void;
  onToggleComplete: () => void;
};

export function TaskCard({
  task,
  expanded,
  onToggleExpand,
  onDeletePress,
  onToggleComplete,
}: Props) {
  return (
    <View style={[styles.card, task.completed && styles.cardCompleted]}>
      <View style={styles.main}>
        <Text
          style={[styles.taskTitle, task.completed && styles.taskTitleDone]}
          numberOfLines={expanded ? undefined : 2}
        >
          {task.title}
        </Text>
        {task.subject ? (
          <Text style={styles.subject} numberOfLines={1}>
            {task.subject}
          </Text>
        ) : null}
        <Text style={styles.dueLabel}>FECHA DE ENTREGA</Text>
        <Text style={styles.dueValue}>{task.dueDate}</Text>
        {expanded ? (
          <Text style={styles.description}>{task.description}</Text>
        ) : null}
      </View>
      <View style={styles.actions}>
        <Pressable
          onPress={onDeletePress}
          style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Eliminar tarea"
        >
          <Ionicons name="close" size={22} color={colors.text} />
        </Pressable>
        <Pressable
          onPress={onToggleComplete}
          style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel={task.completed ? 'Marcar pendiente' : 'Marcar completada'}
        >
          <Ionicons
            name={task.completed ? 'checkbox' : 'square-outline'}
            size={22}
            color={colors.text}
          />
        </Pressable>
        <Pressable
          onPress={onToggleExpand}
          style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel={expanded ? 'Contraer descripción' : 'Ampliar descripción'}
        >
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={22}
            color={colors.text}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.accent,
    borderRadius: radii.card,
    paddingVertical: spacing.md,
    paddingLeft: spacing.md + 2,
    paddingRight: spacing.xs,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardCompleted: {
    opacity: 0.72,
  },
  main: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  taskTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  subject: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  dueLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.4,
    marginTop: 4,
  },
  dueValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  description: {
    marginTop: spacing.md,
    fontSize: 14,
    lineHeight: 21,
    color: colors.text,
    fontWeight: '500',
  },
  actions: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
