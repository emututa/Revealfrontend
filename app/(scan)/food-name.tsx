
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { colors, spacing, typography, borderRadius } from '@/constants/design';

export default function FoodNameScreen() {
  const router = useRouter();
  const [foodName, setFoodName] = useState('');

  const handleNext = () => {
    if (foodName.trim()) {
      router.push({
        pathname: '/(scan)/input-method',
        params: { foodName: foodName.trim() }
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Food Check</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>Step 1 of 2</Text>
        </View>

        <Text style={styles.title}>What food are you checking?</Text>
        <Text style={styles.subtitle}>Enter the name of the food you're about to eat</Text>

        <Input
          value={foodName}
          onChangeText={setFoodName}
          placeholder="e.g., Granola Bar, Pasta Sauce"
          autoFocus
          onSubmitEditing={handleNext}
        />

        <View style={styles.examples}>
          <Text style={styles.examplesTitle}>Examples:</Text>
          <TouchableOpacity onPress={() => setFoodName('Chocolate Chip Cookies')}>
            <Text style={styles.exampleItem}>• Chocolate Chip Cookies</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFoodName('Almond Milk')}>
            <Text style={styles.exampleItem}>• Almond Milk</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFoodName('Protein Bar')}>
            <Text style={styles.exampleItem}>• Protein Bar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          onPress={handleNext}
          disabled={!foodName.trim()}
          size="large"
          style={styles.nextButton}
        >
          Next
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
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  stepIndicator: {
    marginBottom: spacing.lg,
  },
  stepText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
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
  examples: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
  },
  examplesTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  exampleItem: {
    ...typography.body,
    color: colors.primary,
    marginVertical: spacing.xs,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  nextButton: {
    width: '100%',
  },
});
