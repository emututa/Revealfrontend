import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

interface SafeAreaContextType {
  isReady: boolean;
}

const SafeAreaContext = createContext<SafeAreaContextType>({ isReady: false });

interface SafeAreaProviderProps {
  children: ReactNode;
}

export function SafeAreaProvider({ children }: SafeAreaProviderProps) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SafeAreaContext.Provider value={{ isReady: true }}>
        {children}
      </SafeAreaContext.Provider>
    </SafeAreaView>
  );
}

export const useSafeArea = () => {
  const context = useContext(SafeAreaContext);
  if (!context.isReady) {
    throw new Error("useSafeArea must be used within a SafeAreaProvider");
  }
  return context;
};

export default SafeAreaProvider;
