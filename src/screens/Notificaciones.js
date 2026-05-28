import { Feather } from '@expo/vector-icons';
import { useMemo, useRef } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Header from '../components/Header';
import NotificationCard from '../components/NotificationCard';
import { FONTS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationsContext';
import {
  formatNotificationSection,
  formatDateKey,
} from '../utils/notificationHelpers';

function AnimatedBell({ onPress, bellColor }) {
  const rotate = useRef(new Animated.Value(0)).current;

  const shake = () => {
    rotate.setValue(0);
    Animated.sequence([
      Animated.timing(rotate, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(rotate, {
        toValue: -1,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(rotate, {
        toValue: 0.6,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.timing(rotate, {
        toValue: -0.6,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.timing(rotate, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start();
    if (onPress) onPress();
  };

  const spin = rotate.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-18deg', '0deg', '18deg'],
  });

  return (
    <Pressable onPress={shake} accessibilityRole="button">
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Feather name="bell" size={72} color={bellColor} />
      </Animated.View>
    </Pressable>
  );
}

export default function Notificaciones({ onMenuPress, navigation }) {
  const { colors } = useTheme();
  const { notifications, now, dismissNotification, dismissAll } =
    useNotifications();

  const handleMenuPress = () => {
    if (onMenuPress) {
      onMenuPress(navigation);
    }
  };

  const sections = useMemo(() => {
    const grouped = new Map();

    notifications.forEach((item) => {
      const key = formatDateKey(item.sectionDate);
      if (!grouped.has(key)) {
        grouped.set(key, {
          key,
          date: item.sectionDate,
          label: formatNotificationSection(item.sectionDate, now),
          items: [],
        });
      }
      grouped.get(key).items.push(item);
    });

    return Array.from(grouped.values()).sort(
      (a, b) => b.date.getTime() - a.date.getTime(),
    );
  }, [notifications, now]);

  const isEmpty = notifications.length === 0;

  if (isEmpty) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header
          title="NOTIFICACIONES"
          showTitle
          showNotifications={false}
          onMenuPress={handleMenuPress}
        />
        <View style={styles.emptyWrap}>
          <AnimatedBell bellColor={colors.iconText} />
          <Text style={[styles.emptyText, { color: colors.titleText }]}>
            No hay notificaciones
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="NOTIFICACIONES"
        showTitle
        showNotifications={false}
        onMenuPress={handleMenuPress}
      />

      <View style={styles.toolbar}>
        <Pressable onPress={dismissAll} hitSlop={12}>
          <Text style={[styles.borrarText, { color: colors.titleText }]}>BORRAR</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {sections.map((section) => (
          <View key={section.key} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.titleText }]}>
              {section.label}
            </Text>
            {section.items.map((item) => (
              <NotificationCard
                key={item.id}
                item={item}
                onDismiss={dismissNotification}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontFamily: FONTS.serif,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 28,
    textAlign: 'center',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 28,
    paddingBottom: 4,
  },
  borrarText: {
    fontFamily: FONTS.serif,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: FONTS.serif,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
});
