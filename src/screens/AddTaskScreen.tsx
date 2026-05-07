import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../components/AppHeader';
import { useTasks } from '../context/TaskContext';
import type { RootStackParamList } from '../navigation/types';
import { colors, radii, spacing } from '../theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'AddTask'>;

type Props = {
  navigation: Nav;
};

export function AddTaskScreen({ navigation }: Props) {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleCreate = () => {
    const t = title.trim();
    if (!t) return;
    addTask({
      title: t,
      subject: subject.trim(),
      description: description.trim() || 'Sin descripción.',
      dueDate: dueDate.trim() || 'Sin fecha',
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <AppHeader title="ASIGNAR UNA TAREA" onMenuPress={() => navigation.goBack()} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Field label="TÍTULO" value={title} onChangeText={setTitle} />
          <Field label="MATERIA" value={subject} onChangeText={setSubject} />
          <Field
            label="DESCRIPCIÓN"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <Field
            label="FECHA DE ENTREGA"
            value={dueDate}
            onChangeText={setDueDate}
            placeholder="Ej. 15/05/2026"
          />
        </ScrollView>
        <View style={styles.footer}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [styles.btn, styles.btnGhost, pressed && styles.pressed]}
          >
            <Text style={styles.btnText}>CANCELAR</Text>
          </Pressable>
          <Pressable
            onPress={handleCreate}
            style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
            disabled={!title.trim()}
          >
            <Text style={[styles.btnText, !title.trim() && styles.btnTextDisabled]}>CREAR</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  multiline,
  placeholder,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, multiline && styles.inputMultiline]}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        multiline={multiline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  field: {
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: colors.accentDark,
    paddingVertical: spacing.sm,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
    borderBottomWidth: 2,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  btn: {
    flex: 1,
    backgroundColor: colors.accentStrong,
    borderRadius: radii.button,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnGhost: {
    backgroundColor: colors.accent,
  },
  pressed: {
    opacity: 0.88,
  },
  btnText: {
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.6,
    color: colors.text,
  },
  btnTextDisabled: {
    opacity: 0.45,
  },
});
