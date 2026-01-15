import React, { ComponentType } from 'react';
import { View, StyleSheet, ScrollView, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SafeAreaOptions {
  scrollable?: boolean;
  style?: ViewStyle;
  scrollContentStyle?: ViewStyle;
}

/**
 * Higher Order Component that automatically wraps any component with SafeAreaView
 * 
 * @param Component - The component to wrap
 * @param options - Configuration options
 * 
 * @example
 * // Usage with regular components
 * const SafeAreaScreen = withSafeArea(MyScreenComponent);
 * 
 * // Usage with scrollable content
 * const ScrollableSafeAreaScreen = withSafeArea(MyScreenComponent, { scrollable: true });
 * 
 * // Usage with custom styles
 * const StyledSafeAreaScreen = withSafeArea(MyScreenComponent, { 
 *   style: { backgroundColor: 'red' } 
 * });
 */
export function withSafeArea<P extends object>(
  Component: ComponentType<P>,
  options: SafeAreaOptions = {}
) {
  const { scrollable = false, style, scrollContentStyle } = options;
  
  const WrappedComponent = (props: P) => {
    const ContainerComponent = scrollable ? ScrollView : View;
    
    return (
      <SafeAreaView style={[styles.container, style]}>
        <ContainerComponent 
          contentContainerStyle={scrollable ? [styles.scrollContent, scrollContentStyle] : undefined}
          style={scrollable ? styles.scrollView : style}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <Component {...props} />
        </ContainerComponent>
      </SafeAreaView>
    );
  };
  
  WrappedComponent.displayName = `withSafeArea(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

export default withSafeArea;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});