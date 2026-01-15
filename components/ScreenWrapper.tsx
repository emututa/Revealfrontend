import React from "react";
import { View, StyleSheet, ScrollView, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
  scrollContentStyle?: ViewStyle;
  enableSafeArea?: boolean;
}

/**
 * ScreenWrapper - Automatically wraps screen content with SafeAreaView
 *
 * This component ensures all screen content is properly wrapped in SafeAreaView
 * without requiring changes to individual screen components.
 */
export default function ScreenWrapper({
  children,
  style,
  scrollable = false,
  scrollContentStyle,
  enableSafeArea = true,
}: ScreenWrapperProps) {
  const ContainerComponent = scrollable ? ScrollView : View;

  const Wrapper = enableSafeArea ? SafeAreaView : View;

  return (
    <Wrapper style={[styles.container, style]}>
      <ContainerComponent
        contentContainerStyle={
          scrollable ? [styles.scrollContent, scrollContentStyle] : undefined
        }
        style={scrollable ? styles.scrollView : style}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {children}
      </ContainerComponent>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});

// Hook for auto-detecting if screen should be scrollable
export function useAutoScroll(children: React.ReactNode): boolean {
  // Simple heuristic: if content might overflow, make it scrollable
  // You can customize this logic based on your app's needs
  return true; // Default to scrollable for most screens
}

// Auto-wrapper component for screens
export function wrapScreenWithSafeArea<T extends object>(
  ScreenComponent: React.ComponentType<T>,
  options: {
    scrollable?: boolean;
    style?: ViewStyle;
    scrollContentStyle?: ViewStyle;
  } = {}
) {
  return function SafeAreaScreen(props: T) {
    return (
      <ScreenWrapper
        scrollable={options.scrollable ?? true}
        style={options.style}
        scrollContentStyle={options.scrollContentStyle}
      >
        <ScreenComponent {...props} />
      </ScreenWrapper>
    );
  };
}
