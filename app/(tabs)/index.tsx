




import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ScanLine } from 'lucide-react-native';
import {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
} from '@/constants/design';
import { userAPI } from '@/lib/api/user';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserProfile = {
  id: number;
  name: string;
  email: string;
};

export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const profile = await userAPI.getProfile();
      setUser(profile);
    } catch (error: any) {
      console.error('Failed to load user:', error);

      // Token invalid → go to auth
      if (error?.response?.status === 401) {
        await AsyncStorage.removeItem('token');
        router.replace('/(auth)/welcome');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleScanFood = () => {
    router.push('/(scan)/food-name');
  };

  const userName = user?.name || 'there';

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {userName} </Text>
          <Text style={styles.subtitle}>
            Ready to check your food safety?
          </Text>
        </View>

        <TouchableOpacity
          style={styles.scanCard}
          onPress={handleScanFood}
          activeOpacity={0.9}
        >
          <View style={styles.scanIconContainer}>
            <ScanLine size={48} color={colors.primary} strokeWidth={2} />
          </View>
          <Text style={styles.scanTitle}>Tap Here to Scan Food </Text>
          <Text style={styles.scanSubtitle}>
            Check ingredients for allergens & risks
          </Text>
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>💡 Tip</Text>
          <Text style={styles.infoText}>
            Always scan food labels before eating to stay safe from allergens
            and risky ingredients.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.xl,
  },
  header: {
    marginBottom: spacing.sm,
  },
  greeting: {
    ...typography.h2,
    color: colors.text,
    fontSize: 28,
  },
  subtitle: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  scanCard: {
    backgroundColor: colors.primaryUltraLight,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primaryLight,
    ...shadows.md,
  },
  scanIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  scanTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  scanSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    ...shadows.sm,
  },
  infoTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  infoText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});

