import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Import Screens
import { SplashScreen } from '../screens/shared/SplashScreen';
import { OnboardingScreen } from '../screens/shared/OnboardingScreen';
import { ChooseRoleScreen } from '../screens/shared/ChooseRoleScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { HospitalMainContainer } from '../screens/hospital/HospitalMainContainer';
import { EmergencyRequestScreen } from '../screens/hospital/EmergencyRequestScreen';
import { BloodTrackingScreen } from '../screens/hospital/BloodTrackingScreen';
import { BloodInventoryScreen } from '../screens/hospital/BloodInventoryScreen';
import { DonorMainContainer } from '../screens/donor/DonorMainContainer';
import { BookAppointmentScreen } from '../screens/donor/BookAppointmentScreen';
import { DonationHistoryScreen } from '../screens/donor/DonationHistoryScreen';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  ChooseRole: undefined;
  Login: { role: 'hospital' | 'donor' };
  SignUp: { role: 'hospital' | 'donor' };
  HospitalMain: undefined;
  EmergencyRequest: undefined;
  BloodTracking: { requestId: string };
  BloodInventory: undefined;
  DonorMain: undefined;
  BookAppointment: undefined;
  DonationHistory: undefined;
};

// Web Deep Linking Configuration to update the browser address bar URL
const linking = {
  prefixes: ['http://localhost:8082', 'http://localhost:8081', 'exp://'],
  config: {
    screens: {
      Splash: '',                      // Root path maps to Splash Screen
      Onboarding: 'onboarding',
      ChooseRole: 'welcome',
      Login: 'login',
      SignUp: 'signup',
      HospitalMain: 'hospital',
      EmergencyRequest: 'hospital/request',
      BloodTracking: 'hospital/tracking/:requestId',
      BloodInventory: 'hospital/inventory',
      DonorMain: 'donor',
      BookAppointment: 'donor/book',
      DonationHistory: 'donor/history',
    },
  },
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#f8f9ff' }, // v2 Background
        }}
      >
        {/* Shared / Auth Screens */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="ChooseRole" component={ChooseRoleScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />

        {/* Hospital Flow Screens */}
        <Stack.Screen name="HospitalMain" component={HospitalMainContainer} />
        <Stack.Screen name="EmergencyRequest" component={EmergencyRequestScreen} />
        <Stack.Screen name="BloodTracking" component={BloodTrackingScreen} />
        <Stack.Screen name="BloodInventory" component={BloodInventoryScreen} />

        {/* Donor Flow Screens */}
        <Stack.Screen name="DonorMain" component={DonorMainContainer} />
        <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} />
        <Stack.Screen name="DonationHistory" component={DonationHistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
