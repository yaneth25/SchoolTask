import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FONTS, RADIUS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { formatTimeRange } from '../utils/time';

export default function ClassCard({
  item,
  statusLabel,
  onPress,
  onEdit,
  onDelete,
}) {
  const { colors, borders } = useTheme();
  const isRecess = item.isRecess;

  return (
    <Pressable
      style={styles.wrapper}
      onPress={() => !isRecess && onPress?.(item)}
      disabled={isRecess}
    >
      <View style={styles.pillsRow}>
        <View
          style={[
            styles.timePill,
            { backgroundColor: colors.headerPill },
            borders.thin,
          ]}
        >
          <Text style={[styles.timePillText, { color: colors.titleText }]}>
            {formatTimeRange(item.startTime, item.endTime)}
          </Text>
        </View>

        {!isRecess && statusLabel ? (
          <View
            style={[
              styles.statusPill,
              { backgroundColor: colors.statusPill },
              borders.thin,
            ]}
          >
            <Text style={[styles.statusPillText, { color: colors.white }]}>
              {statusLabel}
            </Text>
          </View>
        ) : null}
      </View>

      <View
        style={[
          styles.card,
          isRecess && styles.recessCard,
          { backgroundColor: colors.container },
          borders.thin,
        ]}
      >
        {isRecess ? (
          <Text style={[styles.recessTitle, { color: colors.titleText }]}>
            {item.subject}
          </Text>
        ) : (
          <>
            <Text
              style={[styles.subject, { color: colors.titleText }]}
              numberOfLines={3}
            >
              {item.subject}
            </Text>
            <View
              style={[styles.separator, { backgroundColor: colors.titleText }]}
            />
            <Text
              style={[styles.teacher, { color: colors.titleText }]}
              numberOfLines={2}
            >
              {item.teacher}
            </Text>
          </>
        )}

        <View style={styles.actions}>
          <Pressable
            onPress={() => onEdit(item)}
            hitSlop={8}
            style={styles.actionButton}
          >
            <Feather name="edit-2" size={18} color={colors.iconText} />
          </Pressable>
          <Pressable
            onPress={() => onDelete(item)}
            hitSlop={8}
            style={styles.actionButton}
          >
            <Feather name="trash-2" size={18} color={colors.iconText} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 28,
    alignItems: 'center',
  },
  pillsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 4,
    marginBottom: -14,
    zIndex: 1,
  },
  timePill: {
    borderRadius: RADIUS.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
    maxWidth: '48%',
  },
  timePillText: {
    fontFamily: FONTS.serif,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  statusPill: {
    borderRadius: RADIUS.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
    maxWidth: '48%',
  },
  statusPillText: {
    fontFamily: FONTS.serif,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  card: {
    width: '100%',
    borderRadius: RADIUS.card,
    paddingTop: 28,
    paddingBottom: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    minHeight: 140,
  },
  recessCard: {
    minHeight: 100,
    justifyContent: 'center',
    paddingTop: 24,
  },
  subject: {
    fontFamily: FONTS.serif,
    fontSize: 18,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.5,
    paddingHorizontal: 8,
  },
  separator: {
    width: '90%',
    height: 1,
    marginVertical: 12,
  },
  teacher: {
    fontFamily: FONTS.serif,
    fontSize: 14,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: '600',
    paddingHorizontal: 8,
  },
  recessTitle: {
    fontFamily: FONTS.serif,
    fontSize: 26,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: 10,
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
});
