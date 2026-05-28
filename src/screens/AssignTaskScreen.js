import React, { useState, useEffect, useMemo } from 'react';
import {
  Alert,
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
import { DESCRIPTION_MAX_LENGTH, RADIUS, SPACING } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useTasks } from '../context/TasksContext';

const SHORT_FIELD_MAX_LENGTH = 50;

function createThemedStyles(colors) {
  return StyleSheet.create({
    safe: { flex: 1 },
    flex: { flex: 1 },
    inner: { flex: 1, paddingHorizontal: SPACING.screenHorizontal, paddingTop: 8 },
    scrollContent: { paddingTop: 24, paddingBottom: 16 },
    formBlock: { gap: 22 },
    field: { gap: 6 },
    label: {
      color: colors.text,
      fontWeight: '800',
      fontSize: 13,
      textTransform: 'uppercase',
    },
    inputWrapper: { position: 'relative' },
    input: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
      paddingVertical: 6,
      paddingRight: 45,
    },
    inputMultiline: { minHeight: 96, paddingBottom: 22 },
    descriptionWrap: { position: 'relative', minHeight: 100 },
    underline: {
      height: 2,
      backgroundColor: colors.text,
      opacity: 0.85,
      marginTop: 2,
    },
    counter: {
      position: 'absolute',
      right: 0,
      bottom: 6,
      color: colors.mutedText,
      fontSize: 10,
      fontWeight: '700',
    },
    actionsRow: { flexDirection: 'row', gap: 12, paddingVertical: 16 },
    actionPill: {
      flex: 1,
      backgroundColor: colors.accent,
      borderRadius: RADIUS.pill,
      paddingVertical: 16,
      alignItems: 'center',
    },
    actionText: { color: colors.text, fontWeight: '800', fontSize: 13 },
  });
}

function LabeledField({ label, children, styles }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

export default function AssignTaskScreen({ onMenuPress, onCancel, onSubmit, taskToEdit }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createThemedStyles(colors), [colors]);
  const { addTask, updateTask } = useTasks();

  const isEditing = !!taskToEdit;

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (isEditing && taskToEdit) {
      setTitle(taskToEdit.title || '');
      setSubject(taskToEdit.subject || '');
      setDescription((taskToEdit.description || '').substring(0, DESCRIPTION_MAX_LENGTH));
      setDueDate(taskToEdit.dueDate || '');
    } else {
      setTitle('');
      setSubject('');
      setDescription('');
      setDueDate('');
    }
  }, [isEditing, taskToEdit]);

  const titleCounter = `${title.length}/${SHORT_FIELD_MAX_LENGTH}`;
  const subjectCounter = `${subject.length}/${SHORT_FIELD_MAX_LENGTH}`;
  const descriptionCounter = `${description.length}/${DESCRIPTION_MAX_LENGTH}`;

  const handleDateChange = (text) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    let formatted = cleaned;
    if (cleaned.length >= 2) {
      const day = parseInt(cleaned.slice(0, 2), 10);
      if (day > 31) return;
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    if (cleaned.length >= 4) {
      const month = parseInt(cleaned.slice(2, 4), 10);
      if (month > 12) return;
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 6)}`;
    }
    setDueDate(formatted.slice(0, 8));
  };

  const handleDescriptionChange = (text) => {
    setDescription(text.substring(0, DESCRIPTION_MAX_LENGTH));
  };

  const handleSave = () => {
    const trimmedTitle = title.trim();
    const trimmedSubject = subject.trim();
    const trimmedDescription = description.trim().substring(0, DESCRIPTION_MAX_LENGTH);
    const trimmedDue = dueDate.trim();

    if (!trimmedTitle || !trimmedSubject || !trimmedDescription || !trimmedDue) {
      Alert.alert('Faltan datos', 'Completa todos los campos.');
      return;
    }

    const dateParts = trimmedDue.split('/');
    if (dateParts.length === 3) {
      if (parseInt(dateParts[2], 10) < 26) {
        Alert.alert('Fecha inválida', 'Año mínimo: 2026.');
        return;
      }
    }

    const taskData = {
      title: trimmedTitle,
      subject: trimmedSubject,
      description: trimmedDescription,
      dueDate: trimmedDue,
    };

    if (onSubmit) {
      onSubmit(taskData);
    } else {
      if (isEditing) {
        if (updateTask) updateTask({ ...taskData, id: taskToEdit.id });
      } else {
        if (addTask) addTask(taskData);
      }
    }

    if (onCancel) {
      onCancel();
    }
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.inner}>
          <AppHeader
            titlePill={isEditing ? 'EDITAR TAREA' : 'ASIGNAR UNA TAREA'}
            onMenuPress={onMenuPress}
            showListAdd={false}
          />
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.formBlock}>
              <LabeledField label="TÍTULO:" styles={styles}>
                <View style={styles.inputWrapper}>
                  <TextInput
                    value={title}
                    onChangeText={setTitle}
                    style={styles.input}
                    maxLength={SHORT_FIELD_MAX_LENGTH}
                  />
                  <Text style={styles.counter}>{titleCounter}</Text>
                </View>
                <View style={styles.underline} />
              </LabeledField>

              <LabeledField label="MATERIA:" styles={styles}>
                <View style={styles.inputWrapper}>
                  <TextInput
                    value={subject}
                    onChangeText={setSubject}
                    style={styles.input}
                    maxLength={SHORT_FIELD_MAX_LENGTH}
                  />
                  <Text style={styles.counter}>{subjectCounter}</Text>
                </View>
                <View style={styles.underline} />
              </LabeledField>

              <LabeledField label="DESCRIPCIÓN:" styles={styles}>
                <View style={styles.descriptionWrap}>
                  <TextInput
                    value={description}
                    onChangeText={handleDescriptionChange}
                    style={[styles.input, styles.inputMultiline]}
                    multiline
                    maxLength={DESCRIPTION_MAX_LENGTH}
                  />
                  <Text style={styles.counter}>{descriptionCounter}</Text>
                </View>
                <View style={styles.underline} />
              </LabeledField>

              <LabeledField label="FECHA DE ENTREGA:" styles={styles}>
                <TextInput
                  value={dueDate}
                  onChangeText={handleDateChange}
                  style={styles.input}
                  placeholder="DD/MM/AA"
                  keyboardType="numeric"
                  maxLength={8}
                />
                <View style={styles.underline} />
              </LabeledField>
            </View>
          </ScrollView>

          <View style={styles.actionsRow}>
            <Pressable onPress={onCancel} style={styles.actionPill}>
              <Text style={styles.actionText}>CANCELAR</Text>
            </Pressable>
            <Pressable onPress={handleSave} style={styles.actionPill}>
              <Text style={styles.actionText}>
                {isEditing ? 'GUARDAR CAMBIOS' : 'CREAR'}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
