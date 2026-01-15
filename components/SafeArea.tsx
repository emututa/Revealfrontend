// SafeArea utilities for automatic SafeAreaView wrapping
export { default as SafeAreaWrapper } from "./SafeAreaWrapper";
export {
  default as SafeAreaLayout,
  createSafeAreaLayout,
} from "./SafeAreaLayout";
export { default as withSafeArea } from "./withSafeArea";
export { SafeAreaProvider } from "./providers/SafeAreaProvider";
export { useSafeArea } from "@/hooks/useSafeArea";

// Re-export commonly used utilities for convenience
export { default as SafeAreaView } from "react-native-safe-area-context";
