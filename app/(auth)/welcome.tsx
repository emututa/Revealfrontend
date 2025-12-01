
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '@/components/ui/Button';
import { colors, spacing, typography, borderRadius } from '@/constants/design';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.backgroundSecondary, colors.background]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>R</Text>
            </View>
            <Text style={styles.brandName}>Reveal</Text>
            <Text style={styles.tagline}>AI-Powered Food Safety</Text>
          </View>

          <View style={styles.featuresContainer}>
            <Image
              source={require('@/assets/images/lpage.png')}
              style={styles.featureImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              onPress={() => router.push('/(auth)/signup')}
              size="medium"
              style={styles.primaryButton}
            >
              Get Started
            </Button>
            <Button
              onPress={() => router.push('/(auth)/login')}
              variant="outline"
              size="medium"
              style={styles.secondaryButton}
            >
              Sign In
            </Button>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <View style={styles.featureCard}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'space-between',
    paddingVertical: spacing.xxl,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: spacing.xxl,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  logoText: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.background,
  },
  brandName: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  tagline: {
    ...typography.body,
    color: colors.textSecondary,
  },
  featuresContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureImage: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.lg,
  },
  featureCard: {
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  featureTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  featureDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: spacing.md,
  },
  primaryButton: {
    width: '100%',
  },
  secondaryButton: {
    width: '100%',
  },
});
