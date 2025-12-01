
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Heart, AlertCircle, FileText, LogOut } from 'lucide-react-native';
import Button from '@/components/ui/Button';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/design';
import { mockAuth, mockDb } from '@/lib/auth';
import type { HealthProfile } from '@/types';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<HealthProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const currentUser = await mockAuth.me();
      setUser(currentUser);

      const profiles = await mockDb.healthProfiles.list({
        where: { userId: currentUser.id },
        limit: 1,
      });

      if (profiles.length > 0) {
        setProfile(profiles[0]);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
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
            await mockAuth.logout();
            router.replace('/(auth)/welcome');
          }
        }
      ]
    );
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

  const allergies = profile ? JSON.parse(profile.allergies || '[]') : [];
  const complications = profile ? JSON.parse(profile.healthComplications || '[]') : [];
  const pastReactions = profile ? JSON.parse(profile.pastReactions || '[]') : [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user?.displayName?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.displayName || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Profile</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Heart size={20} color={colors.primary} />
              <Text style={styles.infoTitle}>Allergies ({allergies.length})</Text>
            </View>
            {allergies.length > 0 ? (
              <View style={styles.tagsList}>
                {allergies.map((allergy: string, index: number) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{allergy}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.emptyText}>No allergies listed</Text>
            )}
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <AlertCircle size={20} color={colors.primary} />
              <Text style={styles.infoTitle}>Health Conditions ({complications.length})</Text>
            </View>
            {complications.length > 0 ? (
              <View style={styles.tagsList}>
                {complications.map((condition: string, index: number) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{condition}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.emptyText}>No conditions listed</Text>
            )}
          </View>

          {pastReactions.length > 0 && (
            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <FileText size={20} color={colors.primary} />
                <Text style={styles.infoTitle}>Past Reactions ({pastReactions.length})</Text>
              </View>
              <View style={styles.tagsList}>
                {pastReactions.map((reaction: string, index: number) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{reaction}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {profile?.medicalNotes && (
            <View style={styles.notesCard}>
              <Text style={styles.notesTitle}>Medical Notes</Text>
              <Text style={styles.notesText}>{profile.medicalNotes}</Text>
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
            Logout
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
  },
  notesCard: {
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  notesTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  notesText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  actions: {
    gap: spacing.md,
  },
  logoutButton: {
    borderColor: colors.error,
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
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
