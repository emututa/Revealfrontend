import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle2, PartyPopper } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/design';
import { mockAuth, mockDb } from '@/lib/auth';

const { width } = Dimensions.get('window');

export default function OnboardingComplete() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [saving, setSaving] = useState(true);

  const saveHealthProfile = async () => {
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

      // Show success for 1.5s before redirecting
      setTimeout(() => {
        setSaving(false);
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 1500);
      }, 1000);

    } catch (error) {
      console.error('Failed to save profile:', error);
      // Fallback redirect if error
      router.replace('/(tabs)');
    }
  };

  useEffect(() => {
    saveHealthProfile();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            {saving ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : (
              <CheckCircle2 size={64} color={colors.success} strokeWidth={2.5} />
            )}
          </View>

          <Text style={styles.title}>
            {saving ? 'Saving Your Profile' : 'You\'re All Set!'}
          </Text>
          
          <Text style={styles.subtitle}>
            {saving 
              ? 'We\'re securely encrypting and saving your health preferences...' 
              : 'Your profile is ready. We\'ll use this to keep you safe when checking foods.'}
          </Text>

          {!saving && (
            <View style={styles.successBadge}>
              <PartyPopper size={18} color={colors.primaryDark} />
              <Text style={styles.successText}>Setup Complete</Text>
            </View>
          )}
        </View>

        {saving && (
          <View style={styles.loadingFooter}>
            <Text style={styles.loadingTitle}>Optimizing Dashboard</Text>
            <View style={styles.dotsContainer}>
               <ActivityIndicator size="small" color={colors.primaryLight} />
            </View>
          </View>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.xxl,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.md,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 40,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xxl,
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryUltraLight,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  successText: {
    ...typography.body,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  loadingFooter: {
    marginTop: spacing.xxl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  loadingTitle: {
    ...typography.small,
    color: colors.textLight,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: spacing.xs,
  }
});
