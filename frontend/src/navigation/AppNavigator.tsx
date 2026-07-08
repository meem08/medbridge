import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Import Screens
import { SplashScreen } from '../screens/shared/SplashScreen';
import { OnboardingScreen } from '../screens/shared/OnboardingScreen';
import { ChooseRoleScreen } from '../screens/shared/ChooseRoleScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { ForgotPasswordScreen } from '../screens/shared/ForgotPasswordScreen';
import { OTPVerificationScreen } from '../screens/shared/OTPVerificationScreen';
import { HospitalMainContainer } from '../screens/hospital/HospitalMainContainer';
import { EmergencyRequestScreen } from '../screens/hospital/EmergencyRequestScreen';
import { BloodTrackingScreen } from '../screens/hospital/BloodTrackingScreen';
import { BloodInventoryScreen } from '../screens/hospital/BloodInventoryScreen';
import { HospitalNotificationsScreen } from '../screens/hospital/HospitalNotificationsScreen';
import { DonorMainContainer } from '../screens/donor/DonorMainContainer';
import { BookAppointmentScreen } from '../screens/donor/BookAppointmentScreen';
import { DonationHistoryScreen } from '../screens/donor/DonationHistoryScreen';
import { DonorNotificationsScreen } from '../screens/donor/DonorNotificationsScreen';
import { DonorHealthVerificationScreen } from '../screens/donor/DonorHealthVerificationScreen';
import { BloodBankMainContainer } from '../screens/bloodbank/BloodBankMainContainer';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  ChooseRole: undefined;
  Login: { role: 'hospital' | 'donor' | 'bloodbank' };
  SignUp: { role: 'hospital' | 'donor' | 'bloodbank' };
  ForgotPassword: any;
  OTPVerification: { emailOrPhone: string; flow: 'reset' | 'signup'; role?: 'hospital' | 'donor' | 'bloodbank' };
  HospitalMain: undefined;
  EmergencyRequest: undefined;
  BloodTracking: { requestId: string };
  BloodInventory: undefined;
  HospitalNotifications: undefined;
  DonorMain: undefined;
  BookAppointment: undefined;
  DonationHistory: undefined;
  DonorNotifications: undefined;
  DonorHealthVerification: { donationId: string };
  BloodBankMain: undefined;
};

// Web Deep Linking Configuration to update the browser address bar URL
const linking = {
  prefixes: ['http://localhost:8082', 'http://localhost:8081', 'exp://'],
  config: {
    screens: {
      Splash: '',                      // Root path maps to Splash Screen
      Onboarding: 'onboarding',
      ChooseRole: 'welcome',
      Login: {
        path: 'login',
        parse: {
          role: (role: string) =>
            role === 'hospital' || role === 'donor' || role === 'bloodbank'
              ? role
              : 'donor',
        },
      },
      SignUp: {
        path: 'signup',
        parse: {
          role: (role: string) =>
            role === 'hospital' || role === 'donor' || role === 'bloodbank'
              ? role
              : 'donor',
        },
      },
      ForgotPassword: 'forgot-password',
      OTPVerification: 'verify-otp',
      HospitalMain: 'hospital',
      EmergencyRequest: 'hospital/request',
      BloodTracking: 'hospital/tracking/:requestId',
      BloodInventory: 'hospital/inventory',
      HospitalNotifications: 'hospital/notifications',
      DonorMain: 'donor',
      BookAppointment: 'donor/book',
      DonationHistory: 'donor/history',
      DonorNotifications: 'donor/notifications',
      DonorHealthVerification: 'donor/history/:donationId',
      BloodBankMain: 'bloodbank',
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
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />

        {/* Hospital Flow Screens */}
        <Stack.Screen name="HospitalMain" component={HospitalMainContainer} />
        <Stack.Screen name="EmergencyRequest" component={EmergencyRequestScreen} />
        <Stack.Screen name="BloodTracking" component={BloodTrackingScreen} />
        <Stack.Screen name="BloodInventory" component={BloodInventoryScreen} />
        <Stack.Screen name="HospitalNotifications" component={HospitalNotificationsScreen} />

        {/* Donor Flow Screens */}
        <Stack.Screen name="DonorMain" component={DonorMainContainer} />
        <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} />
        <Stack.Screen name="DonationHistory" component={DonationHistoryScreen} />
        <Stack.Screen name="DonorNotifications" component={DonorNotificationsScreen} />
        <Stack.Screen name="DonorHealthVerification" component={DonorHealthVerificationScreen} />

        {/* Central Blood Bank Flow Screens */}
        <Stack.Screen name="BloodBankMain" component={BloodBankMainContainer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
