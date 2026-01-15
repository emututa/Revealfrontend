import React from "react";
import { View, StyleSheet, ScrollView, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
  scrollContentStyle?: ViewStyle;
}

export default function SafeAreaWrapper({
  children,
  style,
  scrollable = false,
  scrollContentStyle,
}: SafeAreaWrapperProps) {
  const ContainerComponent = scrollable ? ScrollView : View;

  return (
    <SafeAreaView style={[styles.container, style]}>
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
    </SafeAreaView>
  );
}

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
