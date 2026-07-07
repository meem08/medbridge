import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { AuthBottomBar } from '../../components/AuthBottomBar';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
  Login: { role: 'hospital' | 'donor' | 'bloodbank' };
  OTPVerification: { emailOrPhone: string; flow: 'reset' | 'signup' };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async () => {
    if (!identifier.trim()) {
      setError('Please enter your email or phone number');
      return;
    }

    setIsLoading(true);
    // Simulate sending OTP delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);

    navigation.navigate('OTPVerification', {
      emailOrPhone: identifier,
      flow: 'reset',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Enter email or Phone number registered to account to continue
          </Text>

          <View style={styles.form}>
            <Input
              label="Email or Phone Number"
              value={identifier}
              onChangeText={(text) => {
                setIdentifier(text);
                if (error) setError('');
              }}
              placeholder="Modiehi@medical.org"
              error={error}
            />

            <Button
              title="Send Code"
              onPress={handleSendCode}
              loading={isLoading}
              variant="secondary" // Red action button
              style={styles.button}
            />
          </View>
        </View>
      </KeyboardAvoidingView>

      <AuthBottomBar activeTab="security" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.containerPadding,
    paddingTop: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.containerPadding,
    justifyContent: 'center',
  },
  formContainer: {
    width: '100%',
    paddingBottom: 40,
  },
  title: {
    ...typography.styles.headlineLg,
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.styles.bodyMd,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  form: {
    gap: spacing.lg,
  },
  button: {
    width: '100%',
    marginTop: spacing.sm,
  },
});
