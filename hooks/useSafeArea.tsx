import { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SafeAreaStyle {
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
}

/**
 * Hook for automatic SafeArea integration
 *
 * @returns Safe area insets and utility functions
 *
 * @example
 * const { top, bottom, left, right, applyStyles } = useSafeArea();
 *
 * const style = applyStyles({
 *   paddingTop: top,
 *   paddingBottom: bottom + 20,
 * });
 */
export function useSafeArea() {
  const insets = useSafeAreaInsets();

  const applyStyles = (styles: SafeAreaStyle) => {
    return {
      paddingTop:
        styles.paddingTop !== undefined ? styles.paddingTop : insets.top,
      paddingBottom:
        styles.paddingBottom !== undefined
          ? styles.paddingBottom
          : insets.bottom,
      paddingLeft:
        styles.paddingLeft !== undefined ? styles.paddingLeft : insets.left,
      paddingRight:
        styles.paddingRight !== undefined ? styles.paddingRight : insets.right,
    };
  };

  const getContainerStyle = (additionalStyles = {}) => {
    return {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      ...additionalStyles,
    };
  };

  return {
    top: insets.top,
    bottom: insets.bottom,
    left: insets.left,
    right: insets.right,
    applyStyles,
    getContainerStyle,
  };
}

export default useSafeArea;
