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
import { useRouter, useLocalSearchParams } from "expo-router";
import { X, Plus, Heart } from "lucide-react-native";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { colors, spacing, typography, borderRadius, shadows } from "@/constants/design";
import { useUserStore } from "@/lib/stores/userStore";
import { healthAPI } from "@/lib/api/health";

export default function OnboardingStep2() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user, isAuthenticated } = useUserStore();

  const [allergies, setAllergies] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const commonAllergies = ["Peanuts", "Milk", "Eggs", "Wheat", "Soy", "Fish", "Shellfish"];

  useEffect(() => {
    if (!isAuthenticated || !user) {
      Alert.alert("Session Expired", "Please log in again.", [
        { text: "Log In", onPress: () => router.replace("/(auth)/login") },
      ]);
    }
  }, [isAuthenticated, user]);

  const toggleAllergy = (allergy: string) => {
    setAllergies((prev) =>
      prev.includes(allergy)
        ? prev.filter((a) => a !== allergy)
        : [...prev, allergy]
    );
  };

  const addCustomAllergy = () => {
    const value = inputValue.trim();
    if (value && !allergies.includes(value)) {
      setAllergies((prev) => [...prev, value]);
      setInputValue("");
    }
  };

  const handleNext = async () => {
    try {
      await healthAPI.updateAllergies(allergies);
      router.push({
        pathname: "/(onboarding)/step3",
        params: {
          conditions: params.conditions,
          allergies: JSON.stringify(allergies),
        },
      });
    } catch (error) {
      console.error("Save failed:", error);
      Alert.alert("Error", "Could not save allergies. Please try again.");
    }
  };

  if (!isAuthenticated || !user) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressFill, { width: "66%" }]} />
        </View>
        <Text style={styles.stepText}>STEP 2 OF 3</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Heart size={28} color={colors.primary} />
            <Text style={styles.title}>Food Allergies</Text>
          </View>
          <Text style={styles.subtitle}>
            Select common allergies or add your own specific triggers.
          </Text>

          <Text style={styles.sectionTitle}>Common Allergies</Text>
          <View style={styles.commonAllergies}>
            {commonAllergies.map((allergy) => (
              <TouchableOpacity
                key={allergy}
                onPress={() => toggleAllergy(allergy)}
                style={[
                  styles.allergyChip,
                  allergies.includes(allergy) && styles.allergyChipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.allergyChipText,
                    allergies.includes(allergy) && styles.allergyChipTextSelected,
                  ]}
                >
                  {allergy}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Custom Allergy</Text>
          <View style={styles.inputWrapper}>
            <Input
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="e.g. Strawberries, Sesame"
              onSubmitEditing={addCustomAllergy}
              returnKeyType="done"
            />
            <TouchableOpacity 
              onPress={addCustomAllergy} 
              style={[styles.addIconButton, !inputValue.trim() && styles.addIconButtonDisabled]}
              disabled={!inputValue.trim()}
            >
              <Plus size={24} color={colors.background} />
            </TouchableOpacity>
          </View>

          <View style={styles.tagsContainer}>
            {allergies.map((allergy, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{allergy}</Text>
                <TouchableOpacity onPress={() => toggleAllergy(allergy)} style={styles.tagClose}>
                  <X size={14} color={colors.primaryDark} strokeWidth={3} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
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
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    fontSize: 16,
    marginBottom: spacing.md,
  },
  commonAllergies: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  allergyChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
  },
  allergyChipSelected: {
    backgroundColor: colors.primaryUltraLight,
    borderColor: colors.primaryLight,
  },
  allergyChipText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  allergyChipTextSelected: {
    color: colors.primaryDark,
    fontWeight: '700',
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
    marginBottom: spacing.xl,
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
