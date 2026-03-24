import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Sparkles } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius } from '@/constants/design';
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
        setStatus('Scanning label image...');
        result = await scanAPI.scanWithImage({ 
          image: params.imageUri,
          foodName: params.foodName || 'Unknown Food'
        });
      } else if (params.ingredients) {
        setStatus('Analyzing ingredients...');
        result = await scanAPI.scanWithText({
          ingredients: params.ingredients,
          foodName: params.foodName || 'Unknown Food'
        });
      } else {
        throw new Error('No data provided for analysis');
      }

      if (!result) throw new Error('Analysis failed');

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
      console.error('Analysis error:', error);
      setStatus('Something went wrong');
      
      const errorMessage = error?.response?.data?.error 
        || error.message 
        || 'Failed to analyze ingredients';
      
      Alert.alert(
        'Analysis Failed', 
        errorMessage,
        [{ text: 'Go Back', onPress: () => router.back() }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Sparkles size={48} color={colors.primary} strokeWidth={2} />
        </View>

        <Text style={styles.title}>Analyzing Your Food</Text>
        <Text style={styles.status}>{status}</Text>

        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.subtitle}>
            We're cross-referencing ingredients with your health profile to ensure everything is safe for you.
          </Text>
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: colors.primaryUltraLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  status: {
    ...typography.bodyLarge,
    color: colors.primaryDark,
    fontWeight: '700',
    marginBottom: spacing.xxl,
  },
  loaderContainer: {
    height: 60,
    justifyContent: 'center',
  },
  infoCard: {
    marginTop: spacing.xxxl,
    padding: spacing.lg,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    width: '100%',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});