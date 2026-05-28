import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { FONTS, RADIUS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export default function NotificationCard({ item, onDismiss, onRemoved }) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    return () => {
      opacity.stopAnimation();
    };
  }, [opacity]);

  const handleDismiss = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        onDismiss(item.id);
        if (onRemoved) onRemoved(item.id);
      }
    });
  };

  return (
    <Animated.View
      style={[
        styles.card,
        { opacity, backgroundColor: colors.container },
      ]}
    >
      <Pressable
        onPress={handleDismiss}
        style={styles.closeButton}
        hitSlop={10}
        accessibilityLabel="Eliminar notificación"
      >
        <Text style={[styles.closeText, { color: colors.titleText }]}>×</Text>
      </Pressable>

      <Text style={[styles.title, { color: colors.titleText }]}>{item.title}</Text>
      {item.description ? (
        <Text style={[styles.description, { color: colors.mutedText }]}>
          {item.description}
        </Text>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.card,
    paddingVertical: 18,
    paddingHorizontal: 20,
    paddingRight: 36,
    marginBottom: 14,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 12,
    padding: 4,
    zIndex: 1,
  },
  closeText: {
    fontFamily: FONTS.serif,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 22,
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: 15,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  description: {
    fontFamily: FONTS.serif,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
    lineHeight: 18,
  },
});
