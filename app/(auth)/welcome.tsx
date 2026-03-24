
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
        colors={[colors.primaryUltraLight, colors.background, colors.background]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.topSection}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>R</Text>
              </View>
              <Text style={styles.brandName}>Reveal</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>AI FOOD SAFETY</Text>
              </View>
            </View>
          </View>

          <View style={styles.middleSection}>
            <Text style={styles.mainTitle}>Eat with Confidence,{"\n"}Every Single Bite.</Text>
            <Text style={styles.description}>
              Instantly identify allergens, additives, and nutritional risks with our advanced AI scanning technology.
            </Text>
            <View style={styles.imageWrapper}>
              <Image
                source={require('@/assets/images/lpage.png')}
                style={styles.featureImage}
                resizeMode="contain"
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              onPress={() => router.push('/(auth)/signup')}
              size="large"
              style={styles.primaryButton}
            >
              Start for Free
            </Button>
            <Button
              onPress={() => router.push('/(auth)/login')}
              variant="subtle"
              size="large"
              style={styles.secondaryButton}
            >
              Sign In to Account
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
    paddingBottom: spacing.xxl,
    paddingTop: spacing.xl,
  },
  topSection: {
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textOnPrimary,
  },
  brandName: {
    ...typography.h2,
    color: colors.text,
    fontSize: 28,
  },
  badge: {
    backgroundColor: colors.primaryUltraLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  badgeText: {
    ...typography.small,
    color: colors.primaryDark,
    fontSize: 10,
  },
  middleSection: {
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  mainTitle: {
    ...typography.h1,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  imageWrapper: {
    width: '100%',
    height: 240,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  featureImage: {
    width: '100%',
    height: '100%',
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

