import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { BloodProvider } from './src/context/BloodContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider style={styles.safeArea}>
      <AuthProvider>
        <BloodProvider>
          <View style={styles.outerContainer}>
            <View style={styles.appContainer}>
              <AppNavigator />
            </View>
          </View>
          <StatusBar style="dark" />
        </BloodProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f6fa', // Light background matching standard web apps
  },
  outerContainer: {
    flex: 1,
    backgroundColor: '#f4f6fa', // Soft off-white desktop gutters (replaces the dark slate)
    justifyContent: 'center',
    alignItems: 'center',
  },
  appContainer: {
    width: '100%',
    height: '100%',
    // Lock to exact mobile wireframe dimensions
    maxWidth: Platform.OS === 'web' ? 390 : undefined,
    maxHeight: Platform.OS === 'web' ? 884 : undefined,
    backgroundColor: '#f8f9ff', // Pale blue/white background
    
    ...Platform.select({
      web: {
        borderWidth: 1,
        borderColor: '#e5eeff', // Soft light-gray border
        borderRadius: 24, // Rounded frame container
        overflow: 'hidden',
        boxShadow: '0px 8px 24px rgba(0, 22, 59, 0.06)',
      },
      default: {},
    }),
  },
});
