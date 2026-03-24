import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Heart, AlertCircle, FileText, LogOut, Edit, ChevronRight, ShieldCheck, Settings } from 'lucide-react-native';
import Button from '@/components/ui/Button';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/design';
import { userAPI } from '@/lib/api/user';
import { authAPI } from '@/lib/api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  healthConditions: string[];
  allergicFoods: string[];
  foodReactions: Array<{
    food: string;
    notes: string;
  }>;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const profileData = await userAPI.getProfile();
      setProfile(profileData);
    } catch (err: any) {
      console.error('Failed to load profile:', err);
      setError(err.response?.data?.error || 'Failed to load profile');
      if (err.response?.status === 401) {
        await AsyncStorage.removeItem('token');
        router.replace('/(auth)/welcome');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await authAPI.logout();
            } finally {
              await AsyncStorage.removeItem('token');
              router.replace('/(auth)/welcome');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading your profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <AlertCircle size={48} color={colors.error} />
          <Text style={styles.errorText}>{error || 'Profile not found'}</Text>
          <Button onPress={loadProfile} variant="primary" size="large">
            Try Again
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {profile.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <TouchableOpacity style={styles.editBadge}>
              <Edit size={14} color={colors.background} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{profile.name || 'User'}</Text>
          <Text style={styles.userEmail}>{profile.email}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ShieldCheck size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Shield Profile</Text>
          </View>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(onboarding)/step1')}>
            <View style={[styles.menuIcon, { backgroundColor: colors.primaryUltraLight }]}>
              <ActivityIcon color={colors.primaryDark} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Health Conditions</Text>
              <Text style={styles.menuSubtitle}>{profile.healthConditions.length || 'None'} added</Text>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(onboarding)/step2')}>
            <View style={[styles.menuIcon, { backgroundColor: '#F0FDF4' }]}>
              <Heart size={20} color={colors.success} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Food Allergies</Text>
              <Text style={styles.menuSubtitle}>{profile.allergicFoods.length || 'None'} active</Text>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(onboarding)/step3')}>
            <View style={[styles.menuIcon, { backgroundColor: '#FFF7ED' }]}>
              <FileText size={20} color={colors.warning} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Past Reactions</Text>
              <Text style={styles.menuSubtitle}>{profile.foodReactions.length || 'No'} logged events</Text>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Settings size={20} color={colors.textSecondary} />
            <Text style={styles.sectionTitle}>App Preferences</Text>
          </View>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: colors.backgroundSecondary }]}>
              <Settings size={20} color={colors.textSecondary} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Notification Settings</Text>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        <View style={styles.actions}>
          <Button
            onPress={handleLogout}
            variant="subtle"
            size="large"
            style={styles.logoutButton}
          >
            <LogOut size={20} color={colors.error} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </Button>
        </View>

        <View style={styles.footer}>
          <Text style={styles.versionText}>Reveal App v1.2.0</Text>
          <Text style={styles.copyrightText}>Helping you eat with confidence.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ActivityIcon({ color }: { color: string }) {
  return (
    <View style={{ width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: color }} />
      <View style={{ position: 'absolute', width: 2, height: 8, backgroundColor: color, top: 2 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    backgroundColor: colors.background,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.background,
  },
  editBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: colors.primaryDark,
    borderWidth: 3,
    borderColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  userName: {
    ...typography.h2,
    color: colors.text,
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  userEmail: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    ...typography.small,
    color: colors.textSecondary,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    gap: spacing.md,
    ...shadows.sm,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '700',
  },
  menuSubtitle: {
    ...typography.caption,
    color: colors.textLight,
    marginTop: 2,
  },
  actions: {
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    borderColor: colors.errorLight,
    backgroundColor: '#FEF2F2',
  },
  logoutText: {
    ...typography.body,
    color: colors.error,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
    opacity: 0.5,
  },
  versionText: {
    ...typography.caption,
    color: colors.textLight,
    fontWeight: '700',
  },
  copyrightText: {
    ...typography.small,
    color: colors.textLight,
    marginTop: 2,
  },
});
