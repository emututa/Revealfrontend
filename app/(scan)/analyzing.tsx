
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Sparkles } from 'lucide-react-native';
import { colors, spacing, typography } from '@/constants/design';
import { mockAuth, mockDb, mockStorage, mockAi } from '@/lib/auth';
import type { AnalysisResult } from '@/types';

export default function AnalyzingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    analyzeFood();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const analyzeFood = async () => {
    try {
      // Get user's health profile
      const user = await mockAuth.me();
      const profiles = await mockDb.healthProfiles.list({
        where: { userId: user.id },
        limit: 1,
      });

      if (profiles.length === 0) {
        throw new Error('Health profile not found');
      }

      const profile = profiles[0];
      const allergies = JSON.parse(profile.allergies || '[]');
      const complications = JSON.parse(profile.healthComplications || '[]');
      const pastReactions = JSON.parse(profile.pastReactions || '[]');

      let ingredientsText = '';

      // Extract ingredients from image or use manual input
      if (params.imageUri) {
        setStatus('Scanning image...');
        // Upload image to storage first
        const response = await fetch(params.imageUri as string);
        const blob = await response.blob();
        const file = new File([blob], 'ingredient-label.jpg', { type: 'image/jpeg' });
        
        const upload = await mockStorage.upload(
          file,
          `scans/${Date.now()}.jpg`
        );

        setStatus('Reading ingredients...');
        // Use AI to extract text from image
        const extraction = await mockAi.generateText({
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Extract and list all ingredients from this food label image. Only list the ingredients, nothing else.' },
                { type: 'image', image: upload.publicUrl }
              ]
            }
          ]
        });
        
        ingredientsText = extraction.text;
      } else {
        ingredientsText = params.ingredients as string;
      }

      setStatus('Analyzing ingredients...');

      // Use AI to analyze ingredients against health profile
      const prompt = `You are a food safety expert. Analyze these ingredients for potential allergens and health risks.

User's Health Profile:
- Allergies: ${allergies.join(', ') || 'None'}
- Health Complications: ${complications.join(', ') || 'None'}
- Past Reactions: ${pastReactions.join(', ') || 'None'}

Ingredients: ${ingredientsText}

Provide a detailed safety analysis. If any concerning ingredients are found, list them specifically.`;

      const { object } = await mockAi.generateObject({
        prompt,
        schema: {
          type: 'object',
          properties: {
            isSafe: { type: 'boolean' },
            warningIngredients: {
              type: 'array',
              items: { type: 'string' }
            },
            alternatives: {
              type: 'array',
              items: { type: 'string' }
            },
            analysis: { type: 'string' }
          },
          required: ['isSafe', 'warningIngredients', 'analysis']
        }
      });

      const result = object as AnalysisResult;

      // Save to database
      const checkId = `check_${Date.now()}`;
      await mockDb.foodChecks.create({
        id: checkId,
        userId: user.id,
        foodName: params.foodName as string,
        ingredients: ingredientsText,
        isSafe: result.isSafe ? '1' : '0',
        warningIngredients: JSON.stringify(result.warningIngredients),
        alternatives: JSON.stringify(result.alternatives || []),
        checkedAt: new Date().toISOString(),
        imageUrl: params.imageUri ? params.imageUri as string : undefined,
      });

      // Navigate to result screen
      router.replace({
        pathname: '/(scan)/result',
        params: {
          checkId,
          isSafe: result.isSafe ? '1' : '0',
          warningIngredients: JSON.stringify(result.warningIngredients),
          alternatives: JSON.stringify(result.alternatives || []),
          analysis: result.analysis,
          foodName: params.foodName,
        }
      });

    } catch (error) {
      console.error('Analysis failed:', error);
      setStatus('Analysis failed. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Sparkles size={64} color={colors.primary} strokeWidth={1.5} />
        </View>

        <Text style={styles.title}>Analyzing Ingredients</Text>
        <Text style={styles.status}>{status}</Text>

        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />

        <Text style={styles.subtitle}>
          We're checking the ingredients against your health profile to ensure your safety
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  status: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.lg,
  },
  loader: {
    marginVertical: spacing.xl,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
