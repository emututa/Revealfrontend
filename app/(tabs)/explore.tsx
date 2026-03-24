import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Info, ShieldAlert, Sparkles, ChevronRight, BookOpen, Apple } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/design';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', name: 'Allergens', icon: ShieldAlert, color: colors.errorLight },
  { id: '2', name: 'Safe Diets', icon: Apple, color: colors.successLight },
  { id: '3', name: 'Additives', icon: Info, color: colors.primaryUltraLight },
  { id: '4', name: 'Tips', icon: Sparkles, color: '#FEF3C7' },
];

const ARTICLES = [
  {
    id: 'a1',
    title: 'Hidden Names for Soy',
    subtitle: 'Learn how to spot soy in common processed foods.',
    category: 'Allergens',
    readTime: '4 min read',
  },
  {
    id: 'a2',
    title: 'Understanding E-Numbers',
    subtitle: 'Which food additives are safe and which to avoid.',
    category: 'Additives',
    readTime: '6 min read',
  },
  {
    id: 'a3',
    title: 'Celiac Disease Guide',
    subtitle: 'Essential tips for living a gluten-free lifestyle.',
    category: 'Safe Diets',
    readTime: '8 min read',
  },
];

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>Broaden your food safety knowledge</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.textLight} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search ingredients, articles..."
            placeholderTextColor={colors.textLight}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesGrid}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity key={category.id} style={styles.categoryItem}>
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  <category.icon size={24} color={colors.text} />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Must-Read Articles</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {ARTICLES.map((article) => (
            <TouchableOpacity key={article.id} style={styles.articleCard} activeOpacity={0.8}>
              <View style={styles.articleContent}>
                <View style={styles.articleHeader}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{article.category}</Text>
                  </View>
                  <Text style={styles.readTime}>{article.readTime}</Text>
                </View>
                <Text style={styles.articleTitle}>{article.title}</Text>
                <Text style={styles.articleSubtitle} numberOfLines={2}>
                  {article.subtitle}
                </Text>
                <View style={styles.articleFooter}>
                  <BookOpen size={14} color={colors.primary} />
                  <Text style={styles.readNow}>Read Now</Text>
                </View>
              </View>
              <View style={styles.articleImagePlaceholder}>
                <ChevronRight size={24} color={colors.textLight} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tipCard}>
          <Sparkles size={24} color={colors.background} />
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Daily Safety Tip</Text>
            <Text style={styles.tipText}>
              Always double-check "Natural Flavors" as they often contain hidden allergens like soy or dairy.
            </Text>
          </View>
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
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
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
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === 'ios' ? spacing.md : spacing.sm,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    ...typography.body,
    color: colors.text,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    fontSize: 20,
    marginBottom: spacing.lg,
  },
  viewAll: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '700',
  },
  categoriesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryItem: {
    alignItems: 'center',
    width: (width - spacing.xl * 2 - spacing.md * 3) / 4,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  categoryName: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '700',
    textAlign: 'center',
  },
  articleCard: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.xxl,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  articleContent: {
    flex: 1,
    padding: spacing.lg,
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  categoryBadge: {
    backgroundColor: colors.primaryUltraLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryDark,
    textTransform: 'uppercase',
  },
  readTime: {
    fontSize: 10,
    color: colors.textLight,
    fontWeight: '600',
  },
  articleTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: 4,
  },
  articleSubtitle: {
    ...typography.small,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  articleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  readNow: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  articleImagePlaceholder: {
    width: 60,
    backgroundColor: 'rgba(0,0,0,0.02)',
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: colors.borderLight,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: spacing.xl,
    borderRadius: borderRadius.xxl,
    alignItems: 'center',
    gap: spacing.lg,
    ...shadows.md,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    ...typography.h4,
    color: colors.background,
    marginBottom: 2,
  },
  tipText: {
    ...typography.small,
    color: colors.background,
    opacity: 0.9,
    lineHeight: 18,
  },
});
