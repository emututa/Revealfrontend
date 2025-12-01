

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle2 } from 'lucide-react-native';
import { colors, spacing, typography } from '@/constants/design';
import { mockAuth, mockDb } from '@/lib/auth';

export default function OnboardingComplete() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [saving, setSaving] = useState(false);

  const saveHealthProfile = async () => {
    setSaving(true);
    try {
      const user = await mockAuth.me();
      
      const complications = params.complications ? JSON.parse(params.complications as string) : [];
      const allergies = params.allergies ? JSON.parse(params.allergies as string) : [];
      const pastReactions = params.pastReactions ? JSON.parse(params.pastReactions as string) : [];
      
      await mockDb.healthProfiles.create({
        id: `profile_${Date.now()}`,
        userId: user.id,
        healthComplications: JSON.stringify(complications),
        allergies: JSON.stringify(allergies),
        pastReactions: JSON.stringify(pastReactions),
        medicalNotes: (params.medicalNotes as string) || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      router.replace('/(tabs)');
    } catch (error) {
      console.error('Failed to save profile:', error);
      setSaving(false);
    }
  };

  useEffect(() => {
    saveHealthProfile();
  }, [saveHealthProfile]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <CheckCircle2 size={80} color={colors.primary} strokeWidth={1.5} />
        </View>

        <Text style={styles.title}>Profile Created!</Text>
        <Text style={styles.subtitle}>
          Your health profile has been securely saved. We'll use this information to keep you safe.
        </Text>

        {saving && (
          <Text style={styles.savingText}>Setting up your dashboard...</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  savingText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
});
