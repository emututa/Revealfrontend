
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { X } from 'lucide-react-native';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { colors, spacing, typography, borderRadius } from '@/constants/design';

export default function OnboardingStep3() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [pastReactions, setPastReactions] = useState<string[]>([]);
  const [medicalNotes, setMedicalNotes] = useState('');
  const [inputValue, setInputValue] = useState('');

  const addReaction = () => {
    if (inputValue.trim()) {
      setPastReactions([...pastReactions, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeReaction = (index: number) => {
    setPastReactions(pastReactions.filter((_, i) => i !== index));
  };

  const handleComplete = () => {
    router.push({
      pathname: '/(onboarding)/complete',
      params: {
        complications: params.complications,
        allergies: params.allergies,
        pastReactions: JSON.stringify(pastReactions),
        medicalNotes
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '100%' }]} />
          </View>
          <Text style={styles.stepText}>Step 3 of 3</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Past Reactions & Notes</Text>
          <Text style={styles.subtitle}>
            Tell us about any foods that have caused reactions in the past, and any additional medical notes.
          </Text>

          <Text style={styles.sectionTitle}>Foods That Caused Reactions</Text>
          <View style={styles.inputContainer}>
            <Input
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="e.g., shellfish, strawberries"
              onSubmitEditing={addReaction}
              style={styles.textArea}
            />
            <Button onPress={addReaction} variant="outline" style={styles.addButton}>
              Add
            </Button>
          </View>

          <View style={styles.tagsContainer}>
            {pastReactions.map((reaction, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{reaction}</Text>
                <TouchableOpacity onPress={() => removeReaction(index)}>
                  <X size={16} color={colors.text} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Additional Medical Notes</Text>
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
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            onPress={() => router.back()}
            variant="ghost"
            size="large"
            style={styles.backButton}
          >
            Back
          </Button>
          {/* <Button
            onPress={handleComplete}
            size="medium"
            style={styles.completeButton}
          >
            Complete
          </Button> */}

             <Button
              onPress={handleComplete}
              size="medium"
              style={styles.completeButton}
            >
                Complete
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
    height: '100%',
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
  sectionTitle: {
    ...typography.h4,
     fontSize: 18,
    color: colors.text,
    marginBottom: spacing.md,
    // marginTop: spacing.xs,
  },
  inputContainer: {
    flexDirection: "column",
    gap: spacing.sm,
    marginBottom: spacing.lg,
    // flexDirection: 'row',
    // gap: spacing.sm,
    // alignItems: 'flex-end',
    // marginBottom: spacing.lg,
  },
  addButton: {
    // marginBottom: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
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
  textAreaContainer: {
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  
    // ...typography.body,
    // color: colors.text,
    // minHeight: 120,
     textArea: {
    minHeight: 30,
    maxHeight: 150,
    textAlignVertical: "top",
    paddingTop: spacing.md,
  },
  
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  backButton: {
    flex: 1,
  },
  completeButton: {
    flex: 2,
  },
});
