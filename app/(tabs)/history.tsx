

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/design';
import { mockAuth, mockDb } from '@/lib/auth';
import type { FoodCheck } from '@/types';

export default function HistoryScreen() {
  const [checks, setChecks] = useState<FoodCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const user = await mockAuth.me();
      const allChecks = await mockDb.foodChecks.list({
        where: { userId: user.id },
        orderBy: { checkedAt: 'desc' },
        limit: 100,
      });
      setChecks(allChecks);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

  const groupByDate = (checks: FoodCheck[]) => {
    const groups: Record<string, FoodCheck[]> = {};
    
    checks.forEach(check => {
      const date = new Date(check.checkedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(check);
    });

    return groups;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const groupedChecks = groupByDate(checks);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Food History</Text>
        <Text style={styles.subtitle}>Your complete food safety log</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {checks.length === 0 ? (
          <View style={styles.emptyState}>
            <Clock size={64} color={colors.textLight} strokeWidth={1.5} />
            <Text style={styles.emptyText}>No food checks yet</Text>
            <Text style={styles.emptySubtext}>
              Your scanned foods will appear here
            </Text>
          </View>
        ) : (
          Object.entries(groupedChecks).map(([date, dateChecks]) => (
            <View key={date} style={styles.dateSection}>
              <Text style={styles.dateHeader}>{date}</Text>
              <View style={styles.timeline}>
                {dateChecks.map((check, index) => (
                  <TimelineItem
                    key={check.id}
                    check={check}
                    isLast={index === dateChecks.length - 1}
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

function TimelineItem({ check, isLast }: { check: FoodCheck; isLast: boolean }) {
  const isSafe = Number(check.isSafe) > 0;
  const warningIngredients = check.warningIngredients ? JSON.parse(check.warningIngredients) : [];
  const time = new Date(check.checkedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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
        <View style={styles.checkCard}>
          <View style={styles.checkHeader}>
            <Text style={styles.checkFoodName}>{check.foodName}</Text>
            <Text style={styles.checkTime}>{time}</Text>
          </View>

          <View style={[styles.statusBadge, isSafe ? styles.statusSafe : styles.statusWarning]}>
            <Text style={[styles.statusText, isSafe ? styles.statusTextSafe : styles.statusTextWarning]}>
              {isSafe ? '✓ Safe' : '⚠ Warning'}
            </Text>
          </View>

          {!isSafe && warningIngredients.length > 0 && (
            <View style={styles.warningList}>
              <Text style={styles.warningTitle}>Concerning ingredients:</Text>
              {warningIngredients.slice(0, 2).map((ingredient: string, idx: number) => (
                <Text key={idx} style={styles.warningItem}>• {ingredient}</Text>
              ))}
              {warningIngredients.length > 2 && (
                <Text style={styles.warningMore}>+{warningIngredients.length - 2} more</Text>
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
  checkTime: {
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
  },
  warningMore: {
    ...typography.small,
    color: colors.textLight,
    marginLeft: spacing.sm,
    marginTop: spacing.xs,
  },
});
