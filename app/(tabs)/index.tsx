// import { Image } from 'expo-image';
// import { Platform, StyleSheet } from 'react-native';

// import { HelloWave } from '@/components/hello-wave';
// import ParallaxScrollView from '@/components/parallax-scroll-view';
// import { ThemedText } from '@/components/themed-text';
// import { ThemedView } from '@/components/themed-view';
// import { Link } from 'expo-router';

// export default function HomeScreen() {
//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
//       headerImage={
//         <Image
//           source={require('@/assets/images/partial-react-logo.png')}
//           style={styles.reactLogo}
//         />
//       }>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//         <HelloWave />
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 1: Try it</ThemedText>
//         <ThemedText>
//           Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
//           Press{' '}
//           <ThemedText type="defaultSemiBold">
//             {Platform.select({
//               ios: 'cmd + d',
//               android: 'cmd + m',
//               web: 'F12',
//             })}
//           </ThemedText>{' '}
//           to open developer tools.
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <Link href="/modal">
//           <Link.Trigger>
//             <ThemedText type="subtitle">Step 2: Explore</ThemedText>
//           </Link.Trigger>
//           <Link.Preview />
//           <Link.Menu>
//             <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
//             <Link.MenuAction
//               title="Share"
//               icon="square.and.arrow.up"
//               onPress={() => alert('Share pressed')}
//             />
//             <Link.Menu title="More" icon="ellipsis">
//               <Link.MenuAction
//                 title="Delete"
//                 icon="trash"
//                 destructive
//                 onPress={() => alert('Delete pressed')}
//               />
//             </Link.Menu>
//           </Link.Menu>
//         </Link>

//         <ThemedText>
//           {`Tap the Explore tab to learn more about what's included in this starter app.`}
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
//         <ThemedText>
//           {`When you're ready, run `}
//           <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
//           <ThemedText type="defaultSemiBold">app-example</ThemedText>.
//         </ThemedText>
//       </ThemedView>
//     </ParallaxScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: 'absolute',
//   },
// });






import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ScanLine, Clock, AlertTriangle } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/design';
import { mockAuth, mockDb } from '@/lib/auth';
import type { FoodCheck } from '@/types';

export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [recentChecks, setRecentChecks] = useState<FoodCheck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await mockAuth.me();
      setUser(currentUser);

      const checks = await mockDb.foodChecks.list({
        where: { userId: currentUser.id },
        orderBy: { checkedAt: 'desc' },
        limit: 3,
      });
      setRecentChecks(checks);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScanFood = () => {
    router.push('/(scan)/food-name');
  };

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
          <Text style={styles.greeting}>Hello, {user?.displayName || 'there'}! 👋</Text>
          <Text style={styles.subtitle}>Ready to check your food safety?</Text>
        </View>

        <TouchableOpacity style={styles.scanCard} onPress={handleScanFood} activeOpacity={0.9}>
          <View style={styles.scanIconContainer}>
            <ScanLine size={48} color={colors.primary} strokeWidth={2} />
          </View>
          <Text style={styles.scanTitle}>Scan Food Before Eating</Text>
          <Text style={styles.scanSubtitle}>Check ingredients for allergens & risks</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Checks</Text>
            {recentChecks.length > 0 && (
              <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            )}
          </View>

          {recentChecks.length === 0 ? (
            <View style={styles.emptyState}>
              <Clock size={48} color={colors.textLight} strokeWidth={1.5} />
              <Text style={styles.emptyText}>No food checks yet</Text>
              <Text style={styles.emptySubtext}>Start by scanning your first food item</Text>
            </View>
          ) : (
            <View style={styles.checksList}>
              {recentChecks.map((check) => (
                <FoodCheckCard key={check.id} check={check} />
              ))}
            </View>
          )}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>💡 Tip</Text>
          <Text style={styles.infoText}>
            Always scan food labels before eating to stay safe from allergens and ingredients that may cause reactions.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function FoodCheckCard({ check }: { check: FoodCheck }) {
  const isSafe = Number(check.isSafe) > 0;
  const warningIngredients = check.warningIngredients ? JSON.parse(check.warningIngredients) : [];

  return (
    <View style={styles.checkCard}>
      <View style={styles.checkHeader}>
        <Text style={styles.checkFoodName}>{check.foodName}</Text>
        <View style={[styles.statusBadge, isSafe ? styles.statusSafe : styles.statusWarning]}>
          <Text style={[styles.statusText, isSafe ? styles.statusTextSafe : styles.statusTextWarning]}>
            {isSafe ? '✓ Safe' : '⚠ Warning'}
          </Text>
        </View>
      </View>
      
      {!isSafe && warningIngredients.length > 0 && (
        <View style={styles.warningContainer}>
          <AlertTriangle size={14} color={colors.warning} />
          <Text style={styles.warningText}>Contains: {warningIngredients.join(', ')}</Text>
        </View>
      )}
      
      <Text style={styles.checkTime}>
        {new Date(check.checkedAt).toLocaleDateString()} at {new Date(check.checkedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
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
    marginBottom: spacing.sm,
  },
  greeting: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  scanCard: {
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    ...shadows.md,
  },
  scanIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
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
  },
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
  },
  seeAll: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptySubtext: {
    ...typography.caption,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
  checksList: {
    gap: spacing.md,
  },
  checkCard: {
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  checkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  checkFoodName: {
    ...typography.h4,
    color: colors.text,
    flex: 1,
  },
  statusBadge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  statusSafe: {
    backgroundColor: '#DCFCE7',
  },
  statusWarning: {
    backgroundColor: '#FED7AA',
  },
  statusText: {
    ...typography.caption,
    fontWeight: '600',
  },
  statusTextSafe: {
    color: colors.secondary,
  },
  statusTextWarning: {
    color: colors.warning,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  warningText: {
    ...typography.caption,
    color: colors.warning,
    flex: 1,
  },
  checkTime: {
    ...typography.small,
    color: colors.textLight,
  },
  infoCard: {
    backgroundColor: colors.backgroundTertiary,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
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
