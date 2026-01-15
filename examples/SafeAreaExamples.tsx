// Examples of how to use SafeArea utilities without changing existing code

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  SafeAreaWrapper,
  withSafeArea,
  useSafeArea,
} from "@/components/SafeArea";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Example 1: Using SafeAreaWrapper as a drop-in replacement
function Example1_WrapperComponent() {
  return (
    <SafeAreaWrapper style={styles.container} scrollable={true}>
      <View style={styles.content}>
        <Text style={styles.title}>Example 1: SafeAreaWrapper</Text>
        <Text>Just wrap your existing content with SafeAreaWrapper</Text>
      </View>
    </SafeAreaWrapper>
  );
}

// Example 2: Using withSafeArea HOC
function Example2_OriginalComponent() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Example 2: withSafeArea HOC</Text>
        <Text>Your original component stays unchanged</Text>
        <Text>
          Only the export changes: export default withSafeArea(YourComponent)
        </Text>
      </View>
    </View>
  );
}

// To use Example 2, simply export it like this:
// export default withSafeArea(Example2_OriginalComponent);

// Example 3: Using the useSafeArea hook
function Example3_HookComponent() {
  const { top, bottom, applyStyles } = useSafeArea();

  return (
    <View style={[styles.container, applyStyles({ paddingTop: top + 20 })]}>
      <View style={styles.content}>
        <Text style={styles.title}>Example 3: useSafeArea Hook</Text>
        <Text>Apply safe area insets programmatically</Text>
        <Text>Top inset: {top}px</Text>
        <Text>Bottom inset: {bottom}px</Text>
      </View>
    </View>
  );
}

// Example 4: Global SafeAreaProvider usage
function Example4_ProviderComponent() {
  // This component is automatically wrapped by SafeAreaProvider
  // from your app's root layout
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Example 4: SafeAreaProvider</Text>
        <Text>All components in the provider are automatically wrapped</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
});

// MIGRATION GUIDE - How to implement without changing your existing code:

/**
 *
 * STEP 1: Choose your preferred method
 *
 * METHOD A - SafeAreaWrapper (Easiest - Drop-in replacement):
 * Replace <SafeAreaView> with <SafeAreaWrapper>
 *
 * METHOD B - withSafeArea HOC (Cleanest - No structural changes):
 * Export your component with withSafeArea
 * export default withSafeArea(YourComponent);
 *
 * METHOD C - SafeAreaProvider (Global - Set and forget):
 * Wrap your root layout with SafeAreaProvider
 *
 * METHOD D - useSafeArea Hook (Most flexible):
 * Use the hook to programmatically apply safe areas
 *
 *
 * STEP 2: Implementation examples
 *
 * Before (your current code):
 * export default function MyScreen() {
 *   return (
 *     <SafeAreaView style={styles.container}>
 *       <ScrollView contentContainerStyle={styles.content}>
 *         <Text>My content</Text>
 *       </ScrollView>
 *     </SafeAreaView>
 *   );
 * }
 *
 * After (using SafeAreaWrapper):
 * export default function MyScreen() {
 *   return (
 *     <SafeAreaWrapper style={styles.container} scrollable={true}>
 *       <Text>My content</Text>
 *     </SafeAreaWrapper>
 *   );
 * }
 *
 * After (using withSafeArea):
 * function MyScreen() {
 *   return (
 *     <View style={styles.container}>
 *       <ScrollView contentContainerStyle={styles.content}>
 *         <Text>My content</Text>
 *       </ScrollView>
 *     </View>
 *   );
 * }
 * export default withSafeArea(MyScreen, { scrollable: true });
 *
 */
