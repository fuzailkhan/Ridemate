import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/theme';
import { IconButton, ScreenContainer } from '@/components/ui';
import { mockNotifications } from '@/constants/mockData';
import type { AppNotification, NotificationType } from '@/types/models';

const ICON_BY_TYPE: Record<NotificationType, keyof typeof Ionicons.glyphMap> = {
  ride_invite: 'mail-outline',
  ride_accepted: 'checkmark-circle-outline',
  ride_starting: 'time-outline',
  ride_reminder: 'alarm-outline',
  chat_message: 'chatbubble-ellipses-outline',
  rider_joined: 'person-add-outline',
  organizer_announcement: 'megaphone-outline',
  sos_alert: 'warning-outline'
};

export default function NotificationsScreen() {
  return (
    <ScreenContainer noPadding>
      <View style={styles.topBar}>
        <IconButton onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </IconButton>
        <Text style={[typography.h2, styles.topBarTitle]}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={mockNotifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <NotificationRow notification={item} />}
      />
    </ScreenContainer>
  );
}

function NotificationRow({ notification }: { notification: AppNotification }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => notification.rideId && router.push(`/ride/${notification.rideId}`)}
      style={styles.row}
    >
      <View style={[styles.iconCircle, !notification.read && styles.iconCircleUnread]}>
        <Ionicons
          name={ICON_BY_TYPE[notification.type]}
          size={16}
          color={notification.read ? colors.textSecondary : colors.accentSolid}
        />
      </View>
      <View style={styles.textColumn}>
        <Text style={[typography.bodyMedium, styles.title]} numberOfLines={1}>
          {notification.title}
        </Text>
        <Text style={[typography.caption, styles.body]} numberOfLines={2}>
          {notification.body}
        </Text>
        <Text style={[typography.caption, styles.time]}>{notification.createdAtLabel}</Text>
      </View>
      {!notification.read ? <View style={styles.unreadDot} /> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm
  },
  topBarTitle: { color: colors.textPrimary },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconCircleUnread: {
    backgroundColor: colors.accentMuted
  },
  textColumn: { flex: 1 },
  title: { color: colors.textPrimary },
  body: { color: colors.textSecondary, marginTop: 2 },
  time: { color: colors.textTertiary, marginTop: spacing.xs },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accentSolid,
    marginTop: spacing.xs
  }
});
