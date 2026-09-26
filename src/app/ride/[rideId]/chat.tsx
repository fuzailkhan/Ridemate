import React, { useMemo, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '@/theme';
import { IconButton, ScreenContainer } from '@/components/ui';
import { mockChatMessages, mockRides } from '@/constants/mockData';
import { mockCurrentUser } from '@/constants/mockData';

export default function RideChatScreen() {
  const { rideId } = useLocalSearchParams<{ rideId: string }>();
  const ride = useMemo(() => mockRides.find((r) => r.id === rideId) ?? mockRides[0], [rideId]);
  const [draft, setDraft] = useState('');
  const messages = mockChatMessages.filter((m) => m.rideId === ride.id);

  return (
    <ScreenContainer noPadding>
      <View style={styles.topBar}>
        <IconButton onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </IconButton>
        <View style={styles.topBarCenter}>
          <Text style={[typography.h2, styles.topBarTitle]} numberOfLines={1}>
            {ride.title}
          </Text>
          <Text style={[typography.caption, styles.topBarSubtitle]}>{ride.currentRiderCount} riders</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            if (item.type === 'system') {
              return (
                <View style={styles.systemRow}>
                  <Text style={[typography.caption, styles.systemText]}>{item.text}</Text>
                </View>
              );
            }
            const isMine = item.senderId === mockCurrentUser.uid;
            return (
              <View style={[styles.bubbleRow, isMine ? styles.bubbleRowMine : styles.bubbleRowTheirs]}>
                {!isMine ? (
                  <Text style={[typography.captionMedium, styles.senderName]}>{item.senderName}</Text>
                ) : null}
                <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleTheirs]}>
                  <Text style={[typography.body, isMine ? styles.bubbleTextMine : styles.bubbleTextTheirs]}>
                    {item.text}
                  </Text>
                </View>
                <Text style={[typography.caption, styles.timestamp]}>{item.createdAtLabel}</Text>
              </View>
            );
          }}
        />

        <View style={styles.inputRow}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Message the ride..."
            placeholderTextColor={colors.textTertiary}
            style={styles.input}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={() => setDraft('')}>
            <Ionicons name="send" size={16} color={colors.textInverse} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle
  },
  topBarCenter: { flex: 1, alignItems: 'center' },
  topBarTitle: { color: colors.textPrimary },
  topBarSubtitle: { color: colors.textSecondary, marginTop: 2 },
  listContent: { padding: spacing.lg, gap: spacing.sm },
  systemRow: { alignItems: 'center', marginVertical: spacing.sm },
  systemText: { color: colors.textTertiary },
  bubbleRow: { maxWidth: '78%', marginBottom: spacing.sm },
  bubbleRowMine: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  bubbleRowTheirs: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  senderName: { color: colors.textSecondary, marginBottom: spacing.xxs },
  bubble: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radii.lg },
  bubbleMine: { backgroundColor: colors.accentSolid, borderBottomRightRadius: radii.sm },
  bubbleTheirs: { backgroundColor: colors.surfaceElevated, borderBottomLeftRadius: radii.sm },
  bubbleTextMine: { color: colors.textInverse },
  bubbleTextTheirs: { color: colors.textPrimary },
  timestamp: { color: colors.textTertiary, marginTop: spacing.xxs },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle
  },
  input: {
    flex: 1,
    maxHeight: 100,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 15
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accentSolid,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
