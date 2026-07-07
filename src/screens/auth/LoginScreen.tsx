import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { AuthBottomBar } from '../../components/AuthBottomBar';
import { useAuth } from '../../context/AuthContext';
import { validateEmail } from '../../utils/validators';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  ChooseRole: undefined;
  Login: { role: 'hospital' | 'donor' | 'bloodbank' };
  SignUp: { role: 'hospital' | 'donor' | 'bloodbank' };
  ForgotPassword: any;
  HospitalMain: undefined;
  DonorMain: undefined;
  BloodBankMain: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<any>();
  const { role } = route.params || { role: 'donor' };
  
  const { login, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = async () => {
    let isValid = true;
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (isValid) {
      const success = await login(email, role);
      if (success) {
        if (role === 'hospital') {
          navigation.replace('HospitalMain');
        } else if (role === 'bloodbank') {
          navigation.replace('BloodBankMain');
        } else {
          navigation.replace('DonorMain');
        }
      }
    }
  };

  const handleSignUpRedirect = () => {
    navigation.navigate('SignUp', { role });
  };

  const isHospital = role === 'hospital';
  const isBloodBank = role === 'bloodbank';

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={[
              styles.label, 
              isHospital ? styles.hospLabel : isBloodBank ? styles.hospLabel : styles.donorLabel
            ]}>
              {isHospital 
                ? 'HOSPITAL CLINICAL PORTAL' 
                : isBloodBank 
                ? 'CENTRAL BLOOD BANK PORTAL' 
                : 'VOLUNTEER DONOR PORTAL'
              }
            </Text>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to manage and coordinate emergency blood requests.
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Email Address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError('');
              }}
              placeholder={isHospital ? "e.g. medical@metrohealth.org" : isBloodBank ? "e.g. admin@lifecare.org" : "e.g. donor@gmail.com"}
              keyboardType="email-address"
              error={emailError}
            />

            <Input
              label="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) setPasswordError('');
              }}
              placeholder="••••••••"
              secureTextEntry
              error={passwordError}
            />

            {/* Forgot Password Link */}
            <TouchableOpacity 
              onPress={() => (navigation as any).navigate('ForgotPassword')}
              style={styles.forgotPasswordContainer}
            >
              <Text style={isHospital || isBloodBank ? styles.hospForgotText : styles.donorForgotText}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              variant={isHospital || isBloodBank ? 'primary' : 'secondary'}
              style={styles.button}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <Button
              title="Create Account"
              onPress={handleSignUpRedirect}
              variant="text"
              textStyle={isHospital || isBloodBank ? styles.hospLink : styles.donorLink}
            />
          </View>
        </ScrollView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.containerPadding,
    justifyContent: 'center',
  },
  header: {
    marginBottom: spacing.xl,
  },
  label: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    marginBottom: spacing.xs,
    fontWeight: '700',
  },
  hospLabel: {
    color: colors.primary,
  },
  donorLabel: {
    color: colors.secondary,
  },
  title: {
    ...typography.styles.headlineLg,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.styles.bodyMd,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  form: {
    marginBottom: spacing.lg,
  },
  button: {
    marginTop: spacing.md,
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
  },
  footerText: {
    ...typography.styles.bodySm,
    color: colors.textSecondary,
  },
  hospLink: {
    color: colors.primary,
  },
  donorLink: {
    color: colors.secondary,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
    paddingVertical: spacing.xs,
  },
  hospForgotText: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: colors.primary,
    fontWeight: '700',
  },
  donorForgotText: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: colors.secondary,
    fontWeight: '700',
  },
});
