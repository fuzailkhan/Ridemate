import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '@/theme';
import { Card, ScreenContainer } from '@/components/ui';
import { mockGroups } from '@/constants/mockData';

export default function GroupsScreen() {
  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={[typography.h1, styles.headerTitle]}>Groups</Text>
        <Text style={[typography.body, styles.headerSubtitle]}>Your riding communities</Text>
      </View>

      <FlatList
        data={mockGroups}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.85} onPress={() => router.push(`/group/${item.id}`)}>
            <Card style={styles.groupCard}>
              <View style={styles.groupIcon}>
                <MaterialCommunityIcons name="account-group" size={22} color={colors.accentSolid} />
              </View>
              <View style={styles.groupInfo}>
                <Text style={[typography.bodyMedium, styles.groupName]} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={[typography.caption, styles.groupMeta]}>
                  {item.memberCount} members · {item.lastActivityLabel}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </Card>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="account-group-outline" size={36} color={colors.textTertiary} />
            <Text style={[typography.h2, styles.emptyTitle]}>No groups yet</Text>
            <Text style={[typography.body, styles.emptySubtitle]}>
              Join a ride to get added to its group automatically.
            </Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md
  },
  headerTitle: {
    color: colors.textPrimary
  },
  headerSubtitle: {
    color: colors.textSecondary,
    marginTop: 2
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl
  },
  groupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md
  },
  groupIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.lg,
    backgroundColor: colors.accentMuted,
    alignItems: 'center',
    justifyContent: 'center'
  },
  groupInfo: {
    flex: 1
  },
  groupName: {
    color: colors.textPrimary
  },
  groupMeta: {
    color: colors.textSecondary,
    marginTop: 2
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: spacing.xxxl,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm
  },
  emptyTitle: {
    color: colors.textPrimary,
    marginTop: spacing.xs
  },
  emptySubtitle: {
    color: colors.textSecondary,
    textAlign: 'center'
  }
});
