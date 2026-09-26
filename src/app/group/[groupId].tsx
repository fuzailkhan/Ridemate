import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '@/theme';
import { IconButton, ScreenContainer } from '@/components/ui';
import { RideCard } from '@/components/ride';
import { mockGroups, mockRides } from '@/constants/mockData';

export default function GroupDetailScreen() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const group = useMemo(
    () => mockGroups.find((g) => g.id === groupId) ?? mockGroups[0],
    [groupId]
  );
  const groupRides = mockRides.slice(0, 2);

  return (
    <ScreenContainer scroll noPadding>
      <View style={styles.topBar}>
        <IconButton onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </IconButton>
        <Text style={[typography.h2, styles.topBarTitle]} numberOfLines={1}>
          {group.name}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.body}>
        <View style={styles.headerRow}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="account-group" size={26} color={colors.accentSolid} />
          </View>
          <View style={styles.flexShrink}>
            <Text style={[typography.h2, styles.groupName]} numberOfLines={1}>
              {group.name}
            </Text>
            <Text style={[typography.caption, styles.groupMeta]}>
              {group.memberCount} members · {group.lastActivityLabel}
            </Text>
          </View>
        </View>

        <Text style={[typography.captionMedium, styles.sectionLabel]}>UPCOMING RIDES</Text>
        {groupRides.map((ride) => (
          <RideCard key={ride.id} ride={ride} onPress={() => router.push(`/ride/${ride.id}`)} />
        ))}
      </View>
    </ScreenContainer>
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
  topBarTitle: { color: colors.textPrimary, flex: 1, textAlign: 'center', marginHorizontal: spacing.sm },
  body: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: radii.xl,
    backgroundColor: colors.accentMuted,
    alignItems: 'center',
    justifyContent: 'center'
  },
  flexShrink: { flexShrink: 1 },
  groupName: { color: colors.textPrimary },
  groupMeta: { color: colors.textSecondary, marginTop: 2 },
  sectionLabel: { color: colors.textTertiary, marginBottom: spacing.md }
});
