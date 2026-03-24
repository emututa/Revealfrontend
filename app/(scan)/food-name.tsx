import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
} from '@/constants/design';

export default function FoodNameScreen() {
  const router = useRouter();
  const [foodName, setFoodName] = useState('');

  const handleNext = () => {
    if (foodName.trim()) {
      router.push({
        pathname: '/(scan)/input-method',
        params: { foodName: foodName.trim() },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.closeButton}
          >
            <X size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Food Check</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Scrollable Content */}
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>Step 1 of 2</Text>
          </View>

          <Text style={styles.title}>What food are you checking?</Text>
          <Text style={styles.subtitle}>
            Enter the name of the food you're about to eat
          </Text>

          <Input
            value={foodName}
            onChangeText={setFoodName}
            placeholder="e.g., Granola Bar, Pasta Sauce"
            autoFocus
            onSubmitEditing={handleNext}
            returnKeyType="next"
          />

          <View style={styles.examples}>
            <Text style={styles.examplesTitle}>Examples:</Text>

            <TouchableOpacity
              onPress={() => setFoodName('Chocolate Chip Cookies')}
            >
              <Text style={styles.exampleItem}>
                • Chocolate Chip Cookies
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setFoodName('Almond Milk')}>
              <Text style={styles.exampleItem}>• Almond Milk</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setFoodName('Protein Bar')}>
              <Text style={styles.exampleItem}>• Protein Bar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Footer */}
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboard: {
    flex: 1,
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
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
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
  examples: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  examplesTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  exampleItem: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
    marginVertical: spacing.xs,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.background,
  },
  nextButton: {
    width: '100%',
    ...shadows.md,
  },
});