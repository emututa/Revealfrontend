import React from "react";
import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SafeAreaLayoutProps {
  children: React.ReactNode;
}

export default function SafeAreaLayout({ children }: SafeAreaLayoutProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

// Layout wrapper component for easy integration
export function createSafeAreaLayout(Component: React.ComponentType) {
  return function SafeAreaLayoutWrapper(props: any) {
    return (
      <SafeAreaLayout>
        <Component {...props} />
      </SafeAreaLayout>
    );
  };
}
