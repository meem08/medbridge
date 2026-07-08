import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getApiHost = () => {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    return hostUri.split(':')[0];
  }

  if (Platform.OS === 'android') {
    return '10.0.2.2';
  }

  return 'localhost';
};

export const API_URL = process.env.EXPO_PUBLIC_API_URL || `http://${getApiHost()}:5001/api`;
