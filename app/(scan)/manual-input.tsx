
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { X } from 'lucide-react-native';
import Button from '@/components/ui/Button';
import { colors, spacing, typography, borderRadius } from '@/constants/design';

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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manual Input</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
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
            numberOfLines={12}
            textAlignVertical="top"
            placeholderTextColor={colors.textLight}
            autoFocus
          />
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 Tip</Text>
          <Text style={styles.tipText}>
            Include all ingredients listed on the package for the most accurate analysis
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
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  closeButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    ...typography.h4,
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  textAreaContainer: {
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  textArea: {
    ...typography.body,
    color: colors.text,
    minHeight: 200,
  },
  tipCard: {
    backgroundColor: colors.backgroundTertiary,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  tipTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  tipText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  analyzeButton: {
    width: '100%',
  },
});
