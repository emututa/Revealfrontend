



import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/design';
import { scanAPI } from '@/lib/api/scan';

// Backend returns this structure from getScanHistory
interface HistoryScan {
  id: number;
  foodName: string;
  isSafe: boolean;
  warnings: string; // comma-separated string from backend
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
      
      // Backend already returns data in the correct format
      // Just ensure it's an array
      const dataArray = Array.isArray(historyData) ? historyData : [];
      
      // Sort by most recent first (backend uses 'scannedAt')
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
      // Use scannedAt from backend
      const timestamp = scan.scannedAt || Date.now();
      const date = new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(scan);
    });

    return groups;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Clock size={48} color={colors.primary} strokeWidth={2} />
          <Text style={styles.loadingText}>Loading your scan history...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const groupedScans = groupByDate(scans);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan History</Text>
        <Text style={styles.subtitle}>
          {scans.length} {scans.length === 1 ? 'scan' : 'scans'} recorded
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {error ? (
          <View style={styles.errorState}>
            <AlertTriangle size={64} color={colors.warning} strokeWidth={1.5} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadHistory}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : scans.length === 0 ? (
          <View style={styles.emptyState}>
            <Clock size={64} color={colors.textLight} strokeWidth={1.5} />
            <Text style={styles.emptyText}>No scans yet</Text>
            <Text style={styles.emptySubtext}>
              Your scanned foods will appear here
            </Text>
          </View>
        ) : (
          Object.entries(groupedScans).map(([date, dateScans]) => (
            <View key={date} style={styles.dateSection}>
              <Text style={styles.dateHeader}>{date}</Text>
              <View style={styles.timeline}>
                {dateScans.map((scan, index) => (
                  <TimelineItem
                    key={scan.id}
                    scan={scan}
                    isLast={index === dateScans.length - 1}
                  />
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function TimelineItem({ scan, isLast }: { scan: HistoryScan; isLast: boolean }) {
  const isSafe = scan.isSafe;
  
  // Use scannedAt from backend
  const timestamp = scan.scannedAt || Date.now();
  const time = new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Parse warnings - backend sends comma-separated string
  const warningsArray = scan.warnings 
    ? scan.warnings.split(',').map(w => w.trim()).filter(Boolean)
    : [];

  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelineIndicator}>
        <View style={[styles.timelineDot, isSafe ? styles.timelineDotSafe : styles.timelineDotWarning]}>
          {isSafe ? (
            <CheckCircle2 size={16} color={colors.success} />
          ) : (
            <AlertTriangle size={16} color={colors.warning} />
          )}
        </View>
        {!isLast && <View style={styles.timelineLine} />}
      </View>

      <View style={styles.timelineContent}>
        <View style={styles.scanCard}>
          <View style={styles.scanHeader}>
            <Text style={styles.scanFoodName}>{scan.foodName || 'Unknown Food'}</Text>
            <Text style={styles.scanTime}>{time}</Text>
          </View>

          <View style={[styles.statusBadge, isSafe ? styles.statusSafe : styles.statusWarning]}>
            <Text style={[styles.statusText, isSafe ? styles.statusTextSafe : styles.statusTextWarning]}>
              {isSafe ? '✓ Safe' : '⚠ Warning'}
            </Text>
          </View>

          {/* Show warnings if any */}
          {!isSafe && warningsArray.length > 0 && (
            <View style={styles.warningList}>
              <Text style={styles.warningTitle}>⚠ Warnings:</Text>
              {warningsArray.slice(0, 3).map((warning, idx) => (
                <Text key={idx} style={styles.warningItem}>• {warning}</Text>
              ))}
              {warningsArray.length > 3 && (
                <Text style={styles.warningMore}>+{warningsArray.length - 3} more</Text>
              )}
            </View>
          )}
        </View>
      </View>
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
    marginTop: spacing.md,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  errorState: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  errorText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.lg,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  retryButton: {
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  retryButtonText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.background,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyText: {
    ...typography.h4,
    color: colors.textSecondary,
    marginTop: spacing.lg,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.textLight,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  dateSection: {
    marginBottom: spacing.xl,
  },
  dateHeader: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.md,
  },
  timeline: {
    paddingLeft: spacing.sm,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  timelineIndicator: {
    alignItems: 'center',
    marginRight: spacing.md,
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  timelineDotSafe: {
    backgroundColor: '#DCFCE7',
  },
  timelineDotWarning: {
    backgroundColor: '#FED7AA',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.xs,
  },
  timelineContent: {
    flex: 1,
  },
  scanCard: {
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  scanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  scanFoodName: {
    ...typography.h4,
    color: colors.text,
    flex: 1,
  },
  scanTime: {
    ...typography.caption,
    color: colors.textLight,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
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
  warningList: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  warningTitle: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.warning,
    marginBottom: spacing.xs,
  },
  warningItem: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    marginBottom: 2,
  },
  warningMore: {
    ...typography.small,
    color: colors.textLight,
    marginLeft: spacing.sm,
    marginTop: spacing.xs,
  },
});