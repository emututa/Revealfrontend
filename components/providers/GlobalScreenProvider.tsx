import React, { createContext, useContext, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface GlobalScreenContextType {
  isWrapped: boolean;
}

const GlobalScreenContext = createContext<GlobalScreenContextType>({ isWrapped: false });

interface GlobalScreenProviderProps {
  children: ReactNode;
}

/**
 * GlobalScreenProvider - Automatically wraps all screen content with SafeAreaView
 * 
 * This provider should be placed at the app root level to ensure all screens
 * are automatically wrapped in SafeAreaView without modifying individual screens.
 */
export function GlobalScreenProvider({ children }: GlobalScreenProviderProps) {
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <GlobalScreenContext.Provider value={{ isWrapped: true }}>
        <View style={styles.contentContainer}>
          {children}
        </View>
      </GlobalScreenContext.Provider>
    </SafeAreaView>
  );
}

export const useGlobalScreen = () => {
  const context = useContext(GlobalScreenContext);
  return context;
};

export default GlobalScreenProvider;

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    flex: 1,
  },
});