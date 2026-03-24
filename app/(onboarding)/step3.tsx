import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { X, Plus, AlertCircle, FileText } from "lucide-react-native";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { colors, spacing, typography, borderRadius, shadows } from "@/constants/design";
import { useUserStore } from "@/lib/stores/userStore";
import { healthAPI } from "@/lib/api/health";

export default function OnboardingStep3() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user, isAuthenticated } = useUserStore();

  const [reactions, setReactions] = useState<{ foodName: string; medicalNotes?: string }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [medicalNotes, setMedicalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      Alert.alert("Authentication Required", "Please log in to continue.", [
        { text: "Log In", onPress: () => router.replace("/(auth)/login") },
      ]);
    }
  }, [isAuthenticated, user]);

  const addReaction = () => {
    const value = inputValue.trim();
    if (value && !reactions.some((r) => r.foodName === value)) {
      setReactions((prev) => [...prev, { foodName: value, medicalNotes }]);
      setInputValue("");
    }
  };

  const removeReaction = (index: number) => {
    setReactions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      if (reactions.length > 0) {
        await healthAPI.updateReactions(reactions);
      } else if (medicalNotes) {
        await healthAPI.updateReactions([{ foodName: "General", medicalNotes }]);
      }

      Alert.alert("Profile Complete! 🎉", "Your health profile has been successfully updated.", [
        { text: "Go to Dashboard", onPress: () => router.replace("/(tabs)") },
      ]);
    } catch (error: any) {
      console.error("Save failed:", error);
      Alert.alert("Error", "We couldn't save your reactions. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated || !user) return null;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressFill, { width: "100%" }]} />
        </View>
        <Text style={styles.stepText}>STEP 3 OF 3</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <AlertCircle size={28} color={colors.primary} />
            <Text style={styles.title}>Past Reactions</Text>
          </View>
          <Text style={styles.subtitle}>
            List any foods that have caused adverse reactions and add extra medical notes.
          </Text>

          <Text style={styles.sectionTitle}>Any Specific Food Triggers?</Text>
          <View style={styles.inputWrapper}>
            <Input
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="e.g. Fresh strawberries, Raw onions"
              onSubmitEditing={addReaction}
              returnKeyType="done"
              editable={!isSubmitting}
            />
            <TouchableOpacity
              onPress={addReaction}
              style={[styles.addIconButton, (!inputValue.trim() || isSubmitting) && styles.addIconButtonDisabled]}
              disabled={!inputValue.trim() || isSubmitting}
            >
              <Plus size={24} color={colors.background} />
            </TouchableOpacity>
          </View>

          <View style={styles.tagsContainer}>
            {reactions.map((r, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{r.foodName}</Text>
                <TouchableOpacity onPress={() => removeReaction(index)} style={styles.tagClose} disabled={isSubmitting}>
                  <X size={14} color={colors.primaryDark} strokeWidth={3} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.notesSection}>
            <View style={styles.sectionHeaderRow}>
              <FileText size={18} color={colors.primary} />
              <Text style={styles.sectionTitle}>Medical Notes</Text>
            </View>
            <View style={styles.textAreaContainer}>
              <TextInput
                style={styles.textArea}
                value={medicalNotes}
                onChangeText={setMedicalNotes}
                placeholder="Any other medical information we should know..."
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                placeholderTextColor={colors.textLight}
                editable={!isSubmitting}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button onPress={() => router.back()} variant="subtle" style={styles.backButton} disabled={isSubmitting}>
          Previous
        </Button>
        <Button onPress={handleComplete} style={styles.completeButton} disabled={isSubmitting}>
          {isSubmitting ? <ActivityIndicator size="small" color={colors.background} /> : "Finish Setup"}
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
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
  },
  stepText: {
    ...typography.small,
    color: colors.textLight,
    fontWeight: "800",
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
    flexDirection: "row",
    alignItems: "center",
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
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  addIconButton: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
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
    marginBottom: spacing.xxl,
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
    fontWeight: "700",
    fontSize: 13,
  },
  tagClose: {
    marginLeft: spacing.xs,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(255,255,255,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  notesSection: {
    marginTop: spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  textAreaContainer: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    padding: spacing.md,
    ...shadows.sm,
  },
  textArea: {
    ...typography.body,
    color: colors.text,
    minHeight: 120,
    lineHeight: 22,
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
  completeButton: {
    flex: 2,
    ...shadows.md,
  },
});
