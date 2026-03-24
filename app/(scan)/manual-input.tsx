import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { X, FileText } from 'lucide-react-native';
import Button from '@/components/ui/Button';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/design';

export default function ManualInputScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [ingredients, setIngredients] = useState('');

  const handleAnalyze = () => {
    if (ingredients.trim()) {
      router.push({
        pathname: '/(scan)/analyzing',
        params: {
          foodName: params.foodName,
          ingredients: ingredients.trim(),
        }
      });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manual Input</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>Step 2 of 2</Text>
        </View>

        <Text style={styles.title}>Enter Ingredients</Text>
        <Text style={styles.subtitle}>
          Type or paste the ingredient list from the package
        </Text>

        <View style={styles.textAreaContainer}>
          <TextInput
            style={styles.textArea}
            value={ingredients}
            onChangeText={setIngredients}
            placeholder="e.g., Wheat flour, sugar, vegetable oil, cocoa powder, baking soda, salt, natural flavors..."
            multiline
            numberOfLines={10}
            textAlignVertical="top"
            placeholderTextColor={colors.textLight}
            autoFocus
          />
        </View>

        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <FileText size={18} color={colors.primary} />
            <Text style={styles.tipTitle}>Helpful Tip</Text>
          </View>
          <Text style={styles.tipText}>
            Include all ingredients listed on the package for the most accurate analysis. Don't worry about punctuation.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          onPress={handleAnalyze}
          disabled={!ingredients.trim()}
          size="large"
          style={styles.analyzeButton}
        >
          Analyze Ingredients
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h4,
    color: colors.text,
    fontWeight: '700',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  stepIndicator: {
    backgroundColor: colors.primaryUltraLight,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  stepText: {
    ...typography.small,
    color: colors.primaryDark,
    fontSize: 10,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  textAreaContainer: {
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  textArea: {
    ...typography.body,
    fontWeight: '500',
    color: colors.text,
    minHeight: 200,
    lineHeight: 22,
  },
  tipCard: {
    backgroundColor: colors.primaryUltraLight,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  tipTitle: {
    ...typography.h4,
    color: colors.text,
    fontSize: 16,
  },
  tipText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.background,
  },
  analyzeButton: {
    width: '100%',
    ...shadows.md,
  },
});
