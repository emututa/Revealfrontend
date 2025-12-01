
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Camera, FileText, X } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/design';

export default function InputMethodScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const handleCamera = () => {
    router.push({
      pathname: '/(scan)/camera',
      params: { foodName: params.foodName }
    });
  };

  const handleManual = () => {
    router.push({
      pathname: '/(scan)/manual-input',
      params: { foodName: params.foodName }
    });
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
          <Text style={styles.stepText}>Step 2 of 2</Text>
        </View>

        <Text style={styles.title}>How do you want to add ingredients?</Text>
        <Text style={styles.subtitle}>Choose your preferred method to input the ingredient list</Text>

        <View style={styles.options}>
          <TouchableOpacity style={styles.optionCard} onPress={handleCamera} activeOpacity={0.7}>
            <View style={styles.optionIcon}>
              <Camera size={40} color={colors.primary} strokeWidth={1.5} />
            </View>
            <Text style={styles.optionTitle}>Scan with Camera</Text>
            <Text style={styles.optionDescription}>
              Take a photo of the ingredient list on the package
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionCard} onPress={handleManual} activeOpacity={0.7}>
            <View style={styles.optionIcon}>
              <FileText size={40} color={colors.primary} strokeWidth={1.5} />
            </View>
            <Text style={styles.optionTitle}>Type Manually</Text>
            <Text style={styles.optionDescription}>
              Enter the ingredients yourself
            </Text>
          </TouchableOpacity>
        </View>
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
  options: {
    gap: spacing.lg,
  },
  optionCard: {
    backgroundColor: colors.background,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.borderLight,
    alignItems: 'center',
    ...shadows.sm,
  },
  optionIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  optionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  optionDescription: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
