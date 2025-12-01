import { Stack } from 'expo-router';

export default function ScanLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="food-name" />
      <Stack.Screen name="input-method" />
      <Stack.Screen name="camera" />
      <Stack.Screen name="manual-input" />
      <Stack.Screen name="analyzing" />
      <Stack.Screen name="result" />
    </Stack>
  );
}
