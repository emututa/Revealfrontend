import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle2, AlertTriangle, Info, ArrowLeft, RefreshCcw } from 'lucide-react-native';
import Button from '@/components/ui/Button';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/design';

const { width } = Dimensions.get('window');

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const isSafe = params.isSafe === '1';
  const warningIngredients = params.warningIngredients ? JSON.parse(params.warningIngredients as string) : [];
  const analysis = params.analysis as string;
  const foodName = params.foodName as string || 'Unknown Food';

  const handleDone = () => {
    router.push('/(tabs)');
  };

  const handleRescan = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analysis Result</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.resultHeader}>
          <View style={[styles.iconContainer, isSafe ? styles.iconSafe : styles.iconUnsafe]}>
            {isSafe ? (
              <CheckCircle2 size={64} color={colors.success} strokeWidth={2.5} />
            ) : (
              <AlertTriangle size={64} color={colors.error} strokeWidth={2.5} />
            )}
          </View>

          <View style={[styles.statusBadge, isSafe ? styles.badgeSafe : styles.badgeUnsafe]}>
            <Text style={[styles.statusText, isSafe ? styles.textSafe : styles.textUnsafe]}>
              {isSafe ? 'VERIFIED SAFE' : 'POTENTIAL RISK'}
            </Text>
          </View>

          <Text style={styles.foodNameText}>{foodName}</Text>
        </View>

        {!isSafe && warningIngredients.length > 0 && (
          <View style={styles.warningCard}>
            <View style={styles.cardHeader}>
              <AlertTriangle size={20} color={colors.error} />
              <Text style={[styles.cardTitle, { color: colors.error }]}>Restricted Ingredients</Text>
            </View>
            <View style={styles.ingredientsList}>
              {warningIngredients.map((ingredient: string, index: number) => (
                <View key={index} style={styles.ingredientItem}>
                  <View style={[styles.bullet, { backgroundColor: colors.error }]} />
                  <Text style={styles.ingredientText}>{ingredient}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.analysisCard}>
          <View style={styles.cardHeader}>
            <Info size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Expert Analysis</Text>
          </View>
          <Text style={styles.analysisText}>{analysis}</Text>
        </View>

        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>
            This analysis is AI-generated based on provided labels. Always consult medical professionals for severe allergies.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          onPress={handleDone} 
          size="large" 
          style={styles.primaryButton}
        >
          Back to Home
        </Button>
        <Button 
          onPress={handleRescan} 
          variant="subtle" 
          size="medium"
          style={styles.secondaryButton}
        >
          Check Another Food
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
  header: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h4,
    color: colors.textSecondary,
    fontWeight: '700',
    fontSize: 16,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.xl,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 130,
    height: 130,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    ...shadows.md,
  },
  iconSafe: {
    backgroundColor: colors.primaryUltraLight,
  },
  iconUnsafe: {
    backgroundColor: '#FEF2F2', // Red 50
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.sm,
  },
  badgeSafe: {
    backgroundColor: colors.success,
  },
  badgeUnsafe: {
    backgroundColor: colors.error,
  },
  statusText: {
    ...typography.small,
    color: colors.background,
    letterSpacing: 1,
  },
  textSafe: { color: colors.background },
  textUnsafe: { color: colors.background },
  foodNameText: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  warningCard: {
    backgroundColor: '#FFF1F2',
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: '#FECACA',
    ...shadows.sm,
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
    fontSize: 18,
  },
  ingredientsList: {
    gap: spacing.sm,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  ingredientText: {
    ...typography.body,
    fontWeight: '700',
    color: colors.text,
  },
  analysisCard: {
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  analysisText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  disclaimerBox: {
    paddingHorizontal: spacing.md,
  },
  disclaimerText: {
    ...typography.caption,
    color: colors.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.background,
    gap: spacing.sm,
  },
  primaryButton: {
    width: '100%',
    ...shadows.md,
  },
  secondaryButton: {
    width: '100%',
  },
});
