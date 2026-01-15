


import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Sparkles } from 'lucide-react-native';
import { colors, spacing, typography } from '@/constants/design';
import { scanAPI } from '@/lib/api/scan';

export default function AnalyzingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    imageUri?: string;
    ingredients?: string;
    foodName?: string;
  }>();
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    const timer = setTimeout(() => analyzeFood(), 500);
    return () => clearTimeout(timer);
  }, []);

  const analyzeFood = async () => {
    try {
      let result = null;

      if (params.imageUri) {
        // Analyze with image
        setStatus('Uploading and analyzing image...');
        console.log('📤 Analyzing with image:', params.imageUri);
        
        result = await scanAPI.scanWithImage({ 
          image: params.imageUri,
           foodName: params.foodName || 'Unknown Food'
        });
      } else if (params.ingredients) {
        // Analyze with text
        setStatus('Analyzing ingredients...');
        console.log('📤 Analyzing with text:', params.ingredients);
        
        result = await scanAPI.scanWithText({
          ingredients: params.ingredients,
          foodName: params.foodName || 'Unknown Food'
        });
      } else {
        throw new Error('No image or ingredients provided');
      }

      if (!result) {
        throw new Error('Analysis failed - no result returned');
      }

      console.log('✅ Analysis complete:', result);

      // Navigate to result screen
      router.replace({
        pathname: '/(scan)/result',
        params: {
          foodName: result.foodName || 'Unknown Food',
          isSafe: result.isSafe ? '1' : '0',
          riskLevel: result.riskLevel || 'unknown',
          warningIngredients: JSON.stringify(result.warnings || []),
          analysis: result.explanation || 'Analysis complete.',
          imageUri: params.imageUri || '',
          ingredients: result.ingredients || params.ingredients || ''
        },
      });
    } catch (error: any) {
      console.error('❌ Analysis error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      setStatus('Analysis failed. Please try again.');
      
      const errorMessage = error?.response?.data?.error 
        || error?.response?.data?.message 
        || error.message 
        || 'Failed to analyze ingredients';
      
      Alert.alert(
        'Analysis Failed', 
        errorMessage,
        [
          { text: 'OK', onPress: () => router.back() }
        ]
      );
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
    paddingHorizontal: spacing.lg,
  },
});