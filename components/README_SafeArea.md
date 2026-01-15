# SafeArea Utilities

This directory contains utilities for automatically wrapping your React Native components with SafeAreaView, without changing your existing code.

## Quick Start

### Option 1: SafeAreaWrapper (Recommended for drop-in replacement)

Replace your existing `<SafeAreaView>` with `<SafeAreaWrapper>`:

```tsx
// Before
import { SafeAreaView } from "react-native-safe-area-context";

<SafeAreaView style={styles.container}>
  <ScrollView contentContainerStyle={styles.content}>
    <Text>Your content</Text>
  </ScrollView>
</SafeAreaView>;

// After
import { SafeAreaWrapper } from "@/components/SafeArea";

<SafeAreaWrapper style={styles.container} scrollable={true}>
  <Text>Your content</Text>
</SafeAreaWrapper>;
```

### Option 2: withSafeArea HOC (Cleanest approach)

Wrap your component export with `withSafeArea`:

```tsx
// Before
export default function MyScreen() {
  return (
    <View style={styles.container}>
      <Text>Your content</Text>
    </View>
  );
}

// After
import { withSafeArea } from "@/components/SafeArea";

function MyScreen() {
  return (
    <View style={styles.container}>
      <Text>Your content</Text>
    </View>
  );
}

export default withSafeArea(MyScreen, { scrollable: true });
```

### Option 3: useSafeArea Hook (Most flexible)

Use the hook to programmatically apply safe area insets:

```tsx
import { useSafeArea } from "@/components/SafeArea";

function MyScreen() {
  const { top, bottom, applyStyles } = useSafeArea();

  return (
    <View style={[styles.container, applyStyles({ paddingTop: top + 20 })]}>
      <Text>Your content</Text>
    </View>
  );
}
```

### Option 4: SafeAreaProvider (Global solution)

Wrap your app root with SafeAreaProvider:

```tsx
// In your app layout
import { SafeAreaProvider } from "@/components/SafeArea";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack>{/* your screens */}</Stack>
    </SafeAreaProvider>
  );
}
```

## Available Components

### SafeAreaWrapper

- Drop-in replacement for SafeAreaView
- Supports both scrollable and non-scrollable content
- Configurable styling

### withSafeArea (HOC)

- Higher-order component for clean integration
- Preserves component props and behavior
- Supports scrollable content option

### useSafeArea (Hook)

- Provides safe area insets
- Utility functions for applying styles
- Maximum flexibility

### SafeAreaLayout

- Layout component for screen wrappers
- Integration with Expo Router

### SafeAreaProvider

- Global context provider
- Automatic wrapping for all children

## Migration Guide

1. **Identify your current SafeAreaView usage**
2. **Choose one of the options above**
3. **Replace your imports and usage**
4. **Test on devices with different safe areas**

No need to change your component logic or styling - just the wrapper!

## Files Created

- `SafeAreaWrapper.tsx` - Drop-in SafeAreaView replacement
- `withSafeArea.tsx` - Higher-order component for automatic wrapping
- `useSafeArea.tsx` - Hook for programmatic safe area handling
- `SafeAreaLayout.tsx` - Layout wrapper for Expo Router
- `SafeAreaProvider.tsx` - Global context provider
- `SafeArea.tsx` - Central export file
- `SafeAreaExamples.tsx` - Comprehensive usage examples
