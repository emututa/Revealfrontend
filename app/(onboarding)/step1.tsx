import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { X, Plus, Activity } from "lucide-react-native";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { colors, spacing, typography, borderRadius, shadows } from "@/constants/design";
import { useUserStore } from "@/lib/stores/userStore";
import { healthAPI } from "@/lib/api/health";

export default function OnboardingStep1() {
  const router = useRouter();
  const { user, isAuthenticated } = useUserStore();

  const [conditions, setConditions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (!isAuthenticated || !user) {
      Alert.alert(
        "Session Expired",
        "Please log in to continue building your profile.",
        [{ text: "Log In", onPress: () => router.replace("/(auth)/login") }]
      );
    }
  }, [isAuthenticated, user]);

  const addCondition = () => {
    const value = inputValue.trim();
    if (!value) return;

    if (conditions.includes(value)) {
      Alert.alert("Already Added", "This condition is already in your list.");
      return;
    }

    setConditions((prev) => [...prev, value]);
    setInputValue("");
  };

  const removeCondition = (index: number) => {
    setConditions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = async () => {
    if (conditions.length === 0) {
      Alert.alert("Action Required", "Please add at least one condition or 'None' to proceed.");
      return;
    }

    try {
      await healthAPI.updateConditions(conditions);
      router.push({
        pathname: "/(onboarding)/step2",
        params: { conditions: JSON.stringify(conditions) },
      });
    } catch (error: any) {
      console.error("Save failed:", error);
      Alert.alert("Error", "We couldn't save your profile. Please try again.");
    }
  };

  if (!isAuthenticated || !user) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressFill, { width: "33%" }]} />
        </View>
        <Text style={styles.stepText}>STEP 1 OF 3</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Activity size={28} color={colors.primary} />
            <Text style={styles.title}>Health Conditions</Text>
          </View>
          <Text style={styles.subtitle}>
            Are there any specific medical conditions or dietary requirements we should watch out for?
          </Text>

          <View style={styles.inputWrapper}>
            <Input
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="e.g. Type 1 Diabetes, Celiac"
              onSubmitEditing={addCondition}
              returnKeyType="done"
            />
            <TouchableOpacity 
              onPress={addCondition} 
              style={[styles.addIconButton, !inputValue.trim() && styles.addIconButtonDisabled]}
              disabled={!inputValue.trim()}
            >
              <Plus size={24} color={colors.background} />
            </TouchableOpacity>
          </View>

          <View style={styles.tagsContainer}>
            {conditions.map((condition, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{condition}</Text>
                <TouchableOpacity onPress={() => removeCondition(index)} style={styles.tagClose}>
                  <X size={14} color={colors.primaryDark} strokeWidth={3} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {conditions.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Add important conditions above</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          onPress={() => router.back()}
          variant="subtle"
          style={styles.backButton}
        >
          Previous
        </Button>
        <Button onPress={handleNext} style={styles.nextButton}>
          Continue
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
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  progressContainer: {
    height: 6,
    backgroundColor: colors.borderLight,
    borderRadius: 3,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
  },
  stepText: {
    ...typography.small,
    color: colors.textLight,
    fontWeight: '800',
    letterSpacing: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  addIconButton: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  addIconButtonDisabled: {
    backgroundColor: colors.textLight,
    opacity: 0.5,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryUltraLight,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  tagText: {
    ...typography.body,
    color: colors.primaryDark,
    fontWeight: '700',
    fontSize: 13,
  },
  tagClose: {
    marginLeft: spacing.xs,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    marginTop: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textLight,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.background,
    gap: spacing.md,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
    ...shadows.md,
  },
});
