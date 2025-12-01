

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { X } from "lucide-react-native";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { colors, spacing, typography, borderRadius } from "@/constants/design";

export default function OnboardingStep1() {
  const router = useRouter();
  const [complications, setComplications] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const addComplication = () => {
    if (inputValue.trim()) {
      setComplications([...complications, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeComplication = (index: number) => {
    setComplications(complications.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    router.push({
      pathname: "/(onboarding)/step2",
      params: { complications: JSON.stringify(complications) },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "33%" }]} />
          </View>
          <Text style={styles.stepText}>Step 1 of 3</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Health Conditions</Text>
          <Text style={styles.subtitle}>
            Do you have any health complications we should know about? (e.g.,
            diabetes, celiac disease, etc.)
          </Text>

          <View style={styles.inputContainer}>
            <Input
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="Enter a health condition and add"
              onSubmitEditing={addComplication}
              multiline
              style={styles.textArea}
            />
            <Button
              onPress={addComplication}
              variant="outline"
              style={styles.addButton}
            >
              Add
            </Button>
          </View>

          <View style={styles.tagsContainer}>
            {complications.map((complication, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{complication}</Text>
                <TouchableOpacity onPress={() => removeComplication(index)}>
                  <X size={16} color={colors.text} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {complications.length === 0 && (
            <Text style={styles.emptyText}>No conditions added yet</Text>
          )}
        </View>

        <View style={styles.footer}>
          <Button
            onPress={() => router.back()}
            variant="ghost"
            size="medium"
            style={styles.backButton}
          >
            Back
          </Button>
          <Button onPress={handleNext} size="medium" style={styles.nextButton}>
            Next
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.borderLight,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
  },
  stepText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
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
    lineHeight: 24,
  },
  inputContainer: {
    flexDirection: "column",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  textArea: {
    minHeight: 30,
    maxHeight: 150,
    textAlignVertical: "top",
    paddingTop: spacing.md,
  },
  addButton: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.backgroundTertiary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  tagText: {
    ...typography.body,
    color: colors.text,
  },
  emptyText: {
    ...typography.body,
    color: colors.textLight,
    textAlign: "center",
    marginTop: spacing.xl,
  },
  footer: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
});
