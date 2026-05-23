import { Feather } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Animated, FlatList, Pressable, StyleSheet, View } from 'react-native';
import ClassCard from '../components/ClassCard';
import EmptyState from '../components/EmptyState';
import Header from '../components/Header';
import { useClasses } from '../context/ClassesContext';
import { useTheme } from '../context/ThemeContext';
import { getSchoolDayTitle } from '../utils/dayHelpers';
import { buildDaySchedule } from '../utils/schedule';
import { getClassStatus, getNowMinutes } from '../utils/time';

function AnimatedClassRow({ item, statusLabel, onAssignPress, onEditClass, onDeleteClass }) {
  const opacity = useRef(new Animated.Value(1)).current;

  const handleDelete = () => {
    Alert.alert(
      'Eliminar',
      '¿Estás seguro de que deseas eliminar este elemento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            Animated.timing(opacity, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }).start(({ finished }) => {
              if (finished) onDeleteClass(item.id);
            });
          },
        },
      ],
    );
  };

  return (
    <Animated.View style={{ opacity }}>
      <ClassCard
        item={item}
        statusLabel={statusLabel}
        onPress={onAssignPress}
        onEdit={onEditClass}
        onDelete={handleDelete}
      />
    </Animated.View>
  );
}

export default function ScheduleScreen({
  navigation,
  onMenuPress,
  onAssignPress,
  onEditClass,
  onDeleteClass,
}) {
  const { classes } = useClasses();
  const { colors } = useTheme();
  const [now, setNow] = useState(new Date());
  const dayTitle = getSchoolDayTitle(now);
  const dayKey = dayTitle;

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const scheduleItems = useMemo(
    () => buildDaySchedule(classes, dayKey),
    [classes, dayKey],
  );

  const { currentId, nextId } = useMemo(() => {
    return getClassStatus(scheduleItems, getNowMinutes(now));
  }, [scheduleItems, now]);

  const getStatusLabel = (item) => {
    if (item.isRecess) return null;
    if (item.id === currentId) return 'CLASE ACTUAL';
    if (item.id === nextId) return 'SIGUIENTE CLASE';
    return null;
  };

  const handleMenuPress = () => {
    if (onMenuPress) {
      onMenuPress(navigation);
    }
  };

  const handleNotifications = () => {
    if (navigation?.navigate) {
      const state = navigation.getState?.();
      const current = state?.routes?.[state.index]?.name;
      if (current !== 'Notificaciones') {
        navigation.navigate('Notificaciones');
      }
    }
  };

  if (scheduleItems.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header
          showTitle={false}
          onMenuPress={handleMenuPress}
          onNotificationsPress={handleNotifications}
        />
        <EmptyState onAssignPress={onAssignPress} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title={dayTitle}
        showTitle
        onMenuPress={handleMenuPress}
        onNotificationsPress={handleNotifications}
      />

      <FlatList
        data={scheduleItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <AnimatedClassRow
            item={item}
            statusLabel={getStatusLabel(item)}
            onAssignPress={onAssignPress}
            onEditClass={onEditClass}
            onDeleteClass={onDeleteClass}
          />
        )}
      />

      <Pressable style={styles.fab} onPress={onAssignPress}>
        <Feather name="plus" size={28} color={colors.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 48,
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
