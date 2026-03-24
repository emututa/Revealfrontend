import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, AlertTriangle, CheckCircle2, ChevronRight, History, Calendar } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/design';
import { scanAPI } from '@/lib/api/scan';

interface HistoryScan {
  id: number;
  foodName: string;
  isSafe: boolean;
  warnings: string; 
  scannedAt: string; 
}

export default function HistoryScreen() {
  const [scans, setScans] = useState<HistoryScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setError(null);
      const historyData = await scanAPI.getHistory();
      const dataArray = Array.isArray(historyData) ? historyData : [];
      const sortedScans = dataArray.sort((a: any, b: any) => {
        const dateA = new Date(a.scannedAt || a.createdAt || Date.now()).getTime();
        const dateB = new Date(b.scannedAt || b.createdAt || Date.now()).getTime();
        return dateB - dateA;
      });
      setScans(sortedScans);
    } catch (err) {
      console.error('Failed to load history:', err);
      setError('Failed to load scan history. Pull to refresh to try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

  const groupByDate = (scans: HistoryScan[]) => {
    const groups: Record<string, HistoryScan[]> = {};
    scans.forEach(scan => {
      const timestamp = scan.scannedAt || Date.now();
      const date = new Date(timestamp).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(scan);
    });
    return groups;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Fetching your history...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const groupedScans = groupByDate(scans);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>History</Text>
            <Text style={styles.subtitle}>{scans.length} scans recorded</Text>
          </View>
          <View style={styles.historyIcon}>
            <History size={24} color={colors.primary} />
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {error ? (
          <View style={styles.errorState}>
            <AlertTriangle size={48} color={colors.warning} strokeWidth={2} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadHistory}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : scans.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Clock size={40} color={colors.textLight} />
            </View>
            <Text style={styles.emptyTitle}>No Scans Yet</Text>
            <Text style={styles.emptyText}>Items you scan will appear here for quick reference.</Text>
          </View>
        ) : (
          Object.entries(groupedScans).map(([date, dateScans]) => (
            <View key={date} style={styles.dateSection}>
              <View style={styles.dateHeaderContainer}>
                <Calendar size={14} color={colors.textLight} />
                <Text style={styles.dateHeaderText}>{date}</Text>
              </View>
              {dateScans.map((scan) => (
                <HistoryCard key={scan.id} scan={scan} />
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function HistoryCard({ scan }: { scan: HistoryScan }) {
  const isSafe = scan.isSafe;
  const time = new Date(scan.scannedAt || Date.now()).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const warnings = scan.warnings 
    ? scan.warnings.split(',').map(w => w.trim()).filter(Boolean)
    : [];

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
      <View style={[styles.statusIndicator, { backgroundColor: isSafe ? colors.success : colors.warning }]} />
      <View style={styles.cardContent}>
        <View style={styles.cardMain}>
          <View style={styles.cardHeader}>
            <Text style={styles.foodName} numberOfLines={1}>{scan.foodName || 'Unknown Food'}</Text>
            <Text style={styles.timeText}>{time}</Text>
          </View>
          
          <View style={styles.cardFooter}>
             <View style={[styles.badge, isSafe ? styles.badgeSafe : styles.badgeWarning]}>
               {isSafe ? <CheckCircle2 size={12} color={colors.success} /> : <AlertTriangle size={12} color={colors.warning} />}
               <Text style={[styles.badgeText, isSafe ? styles.badgeTextSafe : styles.badgeTextWarning]}>
                 {isSafe ? 'Verified Safe' : 'Warning'}
               </Text>
             </View>
             {warnings.length > 0 && (
               <Text style={styles.warningCount}>
                 {warnings.length} alert{warnings.length > 1 ? 's' : ''}
               </Text>
             )}
          </View>
        </View>
        <ChevronRight size={18} color={colors.textLight} />
      </View>
    </TouchableOpacity>
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
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.text,
    fontSize: 28,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  historyIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.primaryUltraLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  dateSection: {
    marginBottom: spacing.xl,
  },
  dateHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
    opacity: 0.8,
  },
  dateHeaderText: {
    ...typography.small,
    color: colors.textSecondary,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  statusIndicator: {
    width: 6,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardMain: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  foodName: {
    ...typography.bodyLarge,
    color: colors.text,
    fontWeight: '700',
    flex: 1,
    marginRight: spacing.sm,
  },
  timeText: {
    ...typography.caption,
    color: colors.textLight,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeSafe: {
    backgroundColor: '#DCFCE7',
  },
  badgeWarning: {
    backgroundColor: '#FEF3C7',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  badgeTextSafe: {
    color: colors.success,
  },
  badgeTextWarning: {
    color: colors.warning,
  },
  warningCount: {
    ...typography.caption,
    color: colors.error,
    fontWeight: '600',
  },
  errorState: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    gap: spacing.md,
  },
  errorText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  retryButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  retryButtonText: {
    color: colors.background,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    gap: spacing.sm,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 30,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});