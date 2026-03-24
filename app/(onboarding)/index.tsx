import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Shield, CheckCircle2, Heart, PlusCircle } from 'lucide-react-native';
import Button from '@/components/ui/Button';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/design';

const { width } = Dimensions.get('window');

export default function OnboardingIntro() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Shield size={56} color={colors.primary} strokeWidth={2} />
          </View>
          <Text style={styles.title}>Let's Personalized Your Experience</Text>
          <Text style={styles.subtitle}>
            We'll ask a few quick questions to build your unique health profile and keep you safe.
          </Text>
        </View>

        <View style={styles.features}>
          <FeatureItem 
            icon={<PlusCircle size={22} color={colors.primary} />} 
            text="Health conditions & requirements" 
          />
          <FeatureItem 
            icon={<Heart size={22} color={colors.primary} />} 
            text="Food allergies & intolerances" 
          />
          <FeatureItem 
            icon={<CheckCircle2 size={22} color={colors.primary} />} 
            text="Past reactions & sensitivity" 
          />
        </View>

        <View style={styles.footer}>
          <Button
            onPress={() => router.push('/(onboarding)/step1')}
            size="large"
            style={styles.startButton}
          >
            Build My Profile
          </Button>
          <Text style={styles.footerHint}>Takes less than 2 minutes</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

function FeatureItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.iconWrapper}>
        {icon}
      </View>
      <Text style={styles.featureText}>{text}</Text>
    </View>
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
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: colors.primaryUltraLight,
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
    lineHeight: 26,
  },
  features: {
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    ...shadows.sm,
  },
  featureText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    gap: spacing.md,
  },
  startButton: {
    width: '100%',
    ...shadows.md,
  },
  footerHint: {
    ...typography.caption,
    color: colors.textLight,
    fontWeight: '600',
  },
});
