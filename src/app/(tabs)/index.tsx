import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '@/theme';
import { Button, ScreenContainer } from '@/components/ui';
import { RideCard } from '@/components/ride';
import { useRides } from '@/hooks/useRides';

const FILTERS = ['Nearby', 'This weekend', 'Long distance', 'Beginner friendly'] as const;

export default function DiscoverRidesScreen() {
  const { rides: allRides, loading } = useRides();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>('Nearby');

  const rides = useMemo(() => {
    if (!query.trim()) return allRides;
    const q = query.trim().toLowerCase();
    return allRides.filter((r) => r.title.toLowerCase().includes(q));
  }, [allRides, query]);

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={[typography.h1, styles.headerTitle]}>Discover Rides</Text>
        <Text style={[typography.body, styles.headerSubtitle]}>Find your next adventure</Text>
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color={colors.textTertiary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search rides, places, groups..."
          placeholderTextColor={colors.textTertiary}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={FILTERS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.filterRow}
        renderItem={({ item }) => {
          const active = item === activeFilter;
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveFilter(item)}
              style={[styles.filterChip, active && styles.filterChipActive]}
            >
              <Text style={[typography.captionMedium, active ? styles.filterTextActive : styles.filterText]}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.accentSolid} size="large" />
        </View>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <RideCard ride={item} onPress={() => router.push(`/ride/${item.id}`)} />
          )}
          ListEmptyComponent={
            <Text style={[typography.body, styles.emptyText]}>
              {query.trim() ? `No rides match "${query}" yet.` : 'No public rides yet — be the first to create one.'}
            </Text>
          }
        />
      )}

      <View style={styles.ctaWrap}>
        <Button label="+  Create a ride" onPress={() => router.push('/ride/create')} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    marginBottom: spacing.md
  },
  headerTitle: {
    color: colors.textPrimary
  },
  headerSubtitle: {
    color: colors.textSecondary,
    marginTop: 2
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    height: 46,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15
  },
  filterRow: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    paddingBottom: spacing.md
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  filterChipActive: {
    backgroundColor: colors.accentMuted,
    borderColor: colors.accentSolid
  },
  filterText: {
    color: colors.textSecondary
  },
  filterTextActive: {
    color: colors.accentSolid
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xxl
  },
  ctaWrap: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg
  }
});
