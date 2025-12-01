
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Shield } from 'lucide-react-native';
import Button from '@/components/ui/Button';
import { colors, spacing, typography, borderRadius } from '@/constants/design';

export default function OnboardingIntro() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Shield size={64} color={colors.primary} strokeWidth={1.5} />
          </View>
          <Text style={styles.title}>Let's Set Up Your Health Profile</Text>
          <Text style={styles.subtitle}>
            We'll ask a few questions to help keep you safe. 
          </Text>
        </View>

        <View style={styles.features}>
          <FeatureItem number="1" text="Health conditions & complications" />
          <FeatureItem number="2" text="Food allergies & intolerances" />
          <FeatureItem number="3" text="Past food reactions" />
        </View>

        <Button
          onPress={() => router.push('/(onboarding)/step1')}
          size="medium"
          style={styles.startButton}
        >
          Get Started
        </Button>
      </View>
    </SafeAreaView>
  );
}

function FeatureItem({ number, text }: { number: string; text: string }) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.numberBadge}>
        <Text style={styles.numberText}>{number}</Text>
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
    paddingVertical: spacing.xxl,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  features: {
    gap: spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  numberBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  numberText: {
    ...typography.body,
    fontWeight: '700',
    color: colors.background,
  },
  featureText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  startButton: {
    width: '100%',
  },
});
