import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { FONTS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const MENU_ITEMS = [
  { id: 'clases', label: 'CLASES' },
  { id: 'tareas', label: 'TAREAS' },
  { id: 'notificaciones', label: 'NOTIFICACIONES' },
  { id: 'configuracion', label: 'CONFIGURACIÓN' },
  { id: 'cerrar', label: 'CERRAR SESIÓN' },
];

const DRAWER_WIDTH_RATIO = 0.72;

export default function SidebarMenu({ visible, onClose, onItemPress }) {
  const { colors } = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const drawerWidth = screenWidth * DRAWER_WIDTH_RATIO;
  const slideAnim = useRef(new Animated.Value(-drawerWidth)).current;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
    }
  }, [visible]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -drawerWidth,
      duration: 280,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !visible) {
        setMounted(false);
      }
    });
  }, [visible, drawerWidth, slideAnim]);

  const handleItemPress = (itemId) => {
    onClose();
    if (onItemPress) {
      onItemPress(itemId);
    }
  };

  if (!mounted && !visible) {
    return null;
  }

  return (
    <Modal transparent visible={mounted} animationType="none" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable
          style={[styles.overlay, { backgroundColor: colors.overlay }]}
          onPress={onClose}
        />

        <Animated.View
          style={[
            styles.drawer,
            {
              width: drawerWidth,
              backgroundColor: colors.drawer,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <View style={styles.drawerHeader}>
            <Text style={[styles.hamburger, { color: colors.iconText }]}>☰</Text>
            <Text style={[styles.menuTitle, { color: colors.text }]}>MENÚ</Text>
          </View>

          <View style={styles.menuList}>
            {MENU_ITEMS.map((item) => (
              <Pressable
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleItemPress(item.id)}
              >
                <Text style={[styles.menuItemText, { color: colors.text }]}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  drawer: {
    height: '100%',
    paddingTop: 56,
    paddingHorizontal: 28,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 36,
    gap: 14,
  },
  hamburger: {
    fontSize: 24,
    fontWeight: '700',
  },
  menuTitle: {
    fontFamily: FONTS.serif,
    fontSize: 22,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 1,
  },
  menuList: {
    gap: 28,
  },
  menuItem: {
    paddingVertical: 4,
  },
  menuItemText: {
    fontFamily: FONTS.serif,
    fontSize: 20,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
