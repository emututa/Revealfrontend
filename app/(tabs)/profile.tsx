



import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Heart, AlertCircle, FileText, LogOut, Edit } from 'lucide-react-native';
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
      
      // Fetch profile from backend
      const profileData = await userAPI.getProfile();
      setProfile(profileData);
    } catch (err: any) {
      console.error('Failed to load profile:', err);
      setError(err.response?.data?.error || 'Failed to load profile');
      
      // If unauthorized, redirect to login
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
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await authAPI.logout();
              await AsyncStorage.removeItem('token');
              router.replace('/(auth)/welcome');
            } catch (error) {
              console.error('Logout error:', error);
              // Still clear local storage and redirect even if API call fails
              await AsyncStorage.removeItem('token');
              router.replace('/(auth)/welcome');
            }
          }
        }
      ]
    );
  };

  const handleEditProfile = () => {
    // Navigate to edit profile screen
    router.push('/(app)/edit-profile');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <AlertCircle size={48} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <Button onPress={loadProfile} variant="primary" size="large">
            Retry
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No profile data available</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { healthConditions, allergicFoods, foodReactions } = profile;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {profile.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{profile.name || 'User'}</Text>
          <Text style={styles.userEmail}>{profile.email}</Text>
          
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={handleEditProfile}
          >
            <Edit size={16} color={colors.primary} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Profile</Text>

          {/* Allergic Foods */}
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Heart size={20} color={colors.primary} />
              <Text style={styles.infoTitle}>
                Allergic Foods ({allergicFoods.length})
              </Text>
            </View>
            {allergicFoods.length > 0 ? (
              <View style={styles.tagsList}>
                {allergicFoods.map((food, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{food}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.emptyText}>No food allergies listed</Text>
            )}
          </View>

          {/* Health Conditions */}
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <AlertCircle size={20} color={colors.primary} />
              <Text style={styles.infoTitle}>
                Health Conditions ({healthConditions.length})
              </Text>
            </View>
            {healthConditions.length > 0 ? (
              <View style={styles.tagsList}>
                {healthConditions.map((condition, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{condition}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.emptyText}>No health conditions listed</Text>
            )}
          </View>

          {/* Past Food Reactions */}
          {foodReactions.length > 0 && (
            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <FileText size={20} color={colors.primary} />
                <Text style={styles.infoTitle}>
                  Past Food Reactions ({foodReactions.length})
                </Text>
              </View>
              <View style={styles.reactionsList}>
                {foodReactions.map((reaction, index) => (
                  <View key={index} style={styles.reactionItem}>
                    <Text style={styles.reactionFood}>{reaction.food}</Text>
                    {reaction.notes && (
                      <Text style={styles.reactionNotes}>{reaction.notes}</Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <Button
            onPress={handleLogout}
            variant="outline"
            size="large"
            style={styles.logoutButton}
          >
            <LogOut size={20} color={colors.error} />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </Button>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Reveal v1.0</Text>
          <Text style={styles.footerSubtext}>Your trusted food safety companion</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
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
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    gap: spacing.xl,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadows.md,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.background,
  },
  userName: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  userEmail: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundSecondary,
  },
  editButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  infoCard: {
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  infoTitle: {
    ...typography.h4,
    color: colors.text,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    backgroundColor: colors.backgroundTertiary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
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
    fontStyle: 'italic',
  },
  reactionsList: {
    gap: spacing.md,
  },
  reactionItem: {
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
  },
  reactionFood: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  reactionNotes: {
    ...typography.small,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  actions: {
    gap: spacing.md,
  },
  logoutButton: {
    borderColor: colors.error,
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: colors.error,
    ...typography.body,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  footerText: {
    ...typography.caption,
    color: colors.textLight,
  },
  footerSubtext: {
    ...typography.small,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
});

