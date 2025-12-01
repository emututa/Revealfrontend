
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react-native';
import Button from '@/components/ui/Button';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/design';

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const isSafe = params.isSafe === '1';
  const warningIngredients = params.warningIngredients ? JSON.parse(params.warningIngredients as string) : [];
  const alternatives = params.alternatives ? JSON.parse(params.alternatives as string) : [];
  const analysis = params.analysis as string;

  const handleDone = () => {
    router.push('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.container, !isSafe && styles.containerWarning]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, !isSafe && styles.iconContainerWarning]}>
            {isSafe ? (
              <CheckCircle2 size={64} color={colors.success} strokeWidth={2} />
            ) : (
              <AlertTriangle size={64} color={colors.warning} strokeWidth={2} />
            )}
          </View>

          <Text style={styles.title}>
            {isSafe ? 'Safe to Eat! ✓' : 'Warning! ⚠️'}
          </Text>

          <Text style={styles.subtitle}>
            {params.foodName}
          </Text>
        </View>

        {!isSafe && warningIngredients.length > 0 && (
          <View style={styles.warningCard}>
            <View style={styles.cardHeader}>
              <AlertTriangle size={20} color={colors.warning} />
              <Text style={styles.cardTitle}>Concerning Ingredients</Text>
            </View>
            <View style={styles.ingredientsList}>
              {warningIngredients.map((ingredient: string, index: number) => (
                <View key={index} style={styles.ingredientItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.ingredientText}>{ingredient}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.analysisCard}>
          <View style={styles.cardHeader}>
            <Info size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Analysis</Text>
          </View>
          <Text style={styles.analysisText}>{analysis}</Text>
        </View>

        {alternatives.length > 0 && (
          <View style={styles.alternativesCard}>
            <Text style={styles.cardTitle}>Suggested Alternatives</Text>
            <View style={styles.ingredientsList}>
              {alternatives.map((alt: string, index: number) => (
                <View key={index} style={styles.alternativeItem}>
                  <Text style={styles.alternativeText}>• {alt}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            {isSafe
              ? 'This food appears safe based on your health profile. However, always trust your body and consult your doctor if you have concerns.'
              : 'We recommend avoiding this food. Consider consulting your doctor about these ingredients if you have questions.'}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button onPress={handleDone} size="large" style={styles.doneButton}>
          Done
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  containerWarning: {
    backgroundColor: '#FFF7ED',
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    gap: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  iconContainerWarning: {
    backgroundColor: '#FED7AA',
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.h4,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  warningCard: {
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.warning,
    ...shadows.md,
  },
  analysisCard: {
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  alternativesCard: {
    backgroundColor: colors.backgroundTertiary,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.h4,
    color: colors.text,
  },
  ingredientsList: {
    gap: spacing.sm,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.warning,
    marginTop: 8,
  },
  ingredientText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  alternativeItem: {
    paddingVertical: spacing.xs,
  },
  alternativeText: {
    ...typography.body,
    color: colors.text,
  },
  analysisText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  infoBox: {
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
  },
  infoText: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.background,
  },
  doneButton: {
    width: '100%',
  },
});
