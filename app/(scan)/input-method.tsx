

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Camera, FileText, X } from 'lucide-react-native';
import {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
} from '@/constants/design';

export default function FoodInputScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const handleCamera = () => {
    router.push({
      pathname: '/(scan)/camera',
      params: { foodName: params.foodName },
    });
  };

  const handleManual = () => {
    router.push({
      pathname: '/(scan)/manual-input',
      params: { foodName: params.foodName },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Food Safety Check</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Add Ingredients</Text>
        <Text style={styles.subtitle}>
          Choose how you want to provide the ingredient list for analysis
        </Text>

        {/* Options */}
        <View style={styles.cards}>
          <TouchableOpacity
            style={[styles.card, styles.primaryCard]}
            onPress={handleCamera}
            activeOpacity={0.85}
          >
            <View style={styles.iconWrapperPrimary}>
              <Camera size={36} color={colors.primary} strokeWidth={1.5} />
            </View>
            <Text style={styles.cardTitle}>Scan with Camera</Text>
            <Text style={styles.cardText}>
              Take a clear photo of the ingredient label on the package
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={handleManual}
            activeOpacity={0.85}
          >
            <View style={styles.iconWrapper}>
              <FileText size={36} color={colors.primary} strokeWidth={1.5} />
            </View>
            <Text style={styles.cardTitle}>Type Manually</Text>
            <Text style={styles.cardText}>
              Enter ingredients yourself if scanning is not possible
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer hint */}
        <View style={styles.tipBox}>
          <Text style={styles.tipText}>
            💡 Tip: Scanning usually gives faster and more accurate results.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ---------------- Styles ---------------- */

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
  iconButton: {
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

  cards: {
    gap: spacing.lg,
  },

  card: {
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },

  primaryCard: {
    borderColor: colors.primary,
    borderWidth: 2,
    ...shadows.md,
  },

  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },

  iconWrapperPrimary: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },

  cardTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },

  cardText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  tipBox: {
    marginTop: spacing.xl,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundTertiary,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  tipText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
