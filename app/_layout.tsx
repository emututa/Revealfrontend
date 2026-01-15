
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFrameworkReady } from "@/hooks/useFrameworkReady";
import { GlobalScreenProvider } from "@/components/providers/GlobalScreenProvider";

export default function RootLayout() {
  useFrameworkReady();

  return (
    <GlobalScreenProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </GlobalScreenProvider>
  );
}
