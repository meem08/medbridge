import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { Button } from '../../components/Button';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
  OTPVerification: { emailOrPhone: string; flow: 'reset' | 'signup'; role?: 'hospital' | 'donor' | 'bloodbank' };
  Login: { role: 'hospital' | 'donor' | 'bloodbank' };
  HospitalMain: undefined;
  DonorMain: undefined;
  BloodBankMain: undefined;
};

type OTPRouteProp = RouteProp<RootStackParamList, 'OTPVerification'>;
type NavigationProp = StackNavigationProp<RootStackParamList, 'OTPVerification'>;

export const OTPVerificationScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<OTPRouteProp>();
  const { emailOrPhone = '', flow = 'signup', role = 'donor' } = route.params || {};

  const [code, setCode] = useState<string[]>([]);
  const [timer, setTimer] = useState(20);
  const [isResendActive, setIsResendActive] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setIsResendActive(true);
    }
  }, [timer]);

  const handleKeyPress = (num: string) => {
    if (code.length < 4) {
      setCode((prev) => [...prev, num]);
    }
  };

  const handleBackspace = () => {
    setCode((prev) => prev.slice(0, -1));
  };

  const handleResend = () => {
    setTimer(20);
    setIsResendActive(false);
    setCode([]);
    if (Platform.OS === 'web') {
      alert('Code Resent: A new 4-digit verification code has been dispatched.');
    } else {
      Alert.alert('Code Resent', 'A new 4-digit verification code has been dispatched.');
    }
  };

  const handleVerify = () => {
    if (code.length < 4) {
      if (Platform.OS === 'web') {
        alert('Incomplete Code: Please enter all 4 digits of the verification code.');
      } else {
        Alert.alert('Incomplete Code', 'Please enter all 4 digits of the verification code.');
      }
      return;
    }

    const finalCode = code.join('');
    
    if (flow === 'reset') {
      if (Platform.OS === 'web') {
        alert('Success: Password has been successfully reset. Please log in with your new credentials.');
        navigation.navigate('Login', { role: role || 'donor' });
      } else {
        Alert.alert('Success', 'Password has been successfully reset. Please log in with your new credentials.', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login', { role: role || 'donor' }),
          },
        ]);
      }
    } else {
      // SignUp flow - redirect to appropriate dashboard
      if (Platform.OS === 'web') {
        alert('Account Verified: Your registration is complete.');
        if (role === 'hospital') {
          navigation.replace('HospitalMain');
        } else if (role === 'bloodbank') {
          navigation.replace('BloodBankMain');
        } else {
          navigation.replace('DonorMain');
        }
      } else {
        Alert.alert('Account Verified', 'Your registration is complete.', [
          {
            text: 'Continue',
            onPress: () => {
              if (role === 'hospital') {
                navigation.replace('HospitalMain');
              } else if (role === 'bloodbank') {
                navigation.replace('BloodBankMain');
              } else {
                navigation.replace('DonorMain');
              }
            },
          },
        ]);
      }
    }
  };

  const keypadRows = [
    [
      { label: '1', sub: '' },
      { label: '2', sub: 'abc' },
      { label: '3', sub: 'def' },
    ],
    [
      { label: '4', sub: 'ghi' },
      { label: '5', sub: 'jkl' },
      { label: '6', sub: 'mno' },
    ],
    [
      { label: '7', sub: 'pqrs' },
      { label: '8', sub: 'tuv' },
      { label: '9', sub: 'wxyz' },
    ],
    [
      { label: '*', sub: '' },
      { label: '0', sub: '+' },
      { label: '⌫', sub: '' }, // Backspace symbol
    ],
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Header Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Enter Your Verification Code</Text>
          <Text style={styles.subtitle}>
            Enter the 4-digit code sent to {emailOrPhone}
          </Text>
        </View>

        {/* OTP Input Fields */}
        <View style={styles.otpContainer}>
          {[0, 1, 2, 3].map((index) => {
            const digit = code[index];
            const isFocused = code.length === index;
            return (
              <View
                key={index}
                style={[
                  styles.otpBox,
                  isFocused ? styles.otpBoxFocused : null,
                ]}
              >
                {digit ? (
                  <Text style={styles.otpText}>{digit}</Text>
                ) : isFocused ? (
                  <View style={styles.cursor} />
                ) : null}
              </View>
            );
          })}
        </View>

        {/* Resend Timer */}
        <View style={styles.timerContainer}>
          {isResendActive ? (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendLink}>Resend Code</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.timerText}>
              Resend Code in <Text style={styles.timerHighlight}>{timer}</Text> Sec
            </Text>
          )}
        </View>

        {/* Verify Action Button */}
        <Button
          title="Verify"
          onPress={handleVerify}
          disabled={code.length < 4}
          variant="emergency" // Red brand action
          style={styles.verifyBtn}
        />
      </View>

      {/* Numeric Keypad Footer */}
      <View style={styles.keypadContainer}>
        {/* Autocomplete Suggestion */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setCode(['3', '5', '8', '7'])}
          style={styles.autocompleteBtn}
        >
          <Text style={styles.autoHeader}>From Message</Text>
          <Text style={styles.autoCode}>3587</Text>
        </TouchableOpacity>

        {/* Keypad Grid */}
        <View style={styles.keypadGrid}>
          {keypadRows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.keypadRow}>
              {row.map((btn, btnIndex) => {
                const isBackspace = btn.label === '⌫';
                return (
                  <TouchableOpacity
                    key={btnIndex}
                    activeOpacity={0.7}
                    onPress={() => {
                      if (isBackspace) {
                        handleBackspace();
                      } else {
                        handleKeyPress(btn.label);
                      }
                    }}
                    style={styles.keypadBtn}
                  >
                    <Text style={styles.keypadText}>{btn.label}</Text>
                    {btn.sub ? (
                      <Text style={styles.keypadSubText}>{btn.sub}</Text>
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </View>
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
    paddingTop: spacing.md,
  },
  titleSection: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.styles.headlineLg,
    color: colors.textPrimary,
    fontWeight: '700',
    lineHeight: 38,
  },
  subtitle: {
    ...typography.styles.bodyMd,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginVertical: spacing.lg,
  },
  otpBox: {
    flex: 1,
    height: 72,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: spacing.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpBoxFocused: {
    borderColor: colors.secondary, // Focus in Red matching wireframe
  },
  otpText: {
    ...typography.styles.headlineLg,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  cursor: {
    width: 2,
    height: 28,
    backgroundColor: colors.secondary,
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  timerText: {
    ...typography.styles.bodySm,
    color: colors.textSecondary,
  },
  timerHighlight: {
    color: colors.secondary,
    fontWeight: '600',
  },
  resendLink: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: colors.secondary,
    fontWeight: '700',
  },
  verifyBtn: {
    width: '100%',
    marginVertical: spacing.md,
  },
  keypadContainer: {
    backgroundColor: '#f4f6fa',
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingBottom: spacing.lg,
  },
  autocompleteBtn: {
    alignSelf: 'center',
    backgroundColor: '#e2e8f0',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xl * 2,
    borderRadius: spacing.borderRadius.sm,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  autoHeader: {
    ...typography.styles.labelSm,
    fontSize: 9,
    fontFamily: typography.fontFamilyLabel,
    color: colors.textSecondary,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  autoCode: {
    ...typography.styles.headlineMd,
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: '800',
    letterSpacing: 2,
  },
  keypadGrid: {
    gap: spacing.sm,
    alignSelf: 'center',
  },
  keypadRow: {
    flexDirection: 'row',
    gap: spacing.lg * 1.5,
  },
  keypadBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadText: {
    ...typography.styles.headlineMd,
    fontSize: 20,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  keypadSubText: {
    ...typography.styles.labelSm,
    fontSize: 9,
    fontFamily: typography.fontFamilyLabel,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginTop: -2,
  },
});
