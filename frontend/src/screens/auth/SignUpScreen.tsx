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
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BloodType } from '../../models/user';

type RootStackParamList = {
  Login: { role: 'hospital' | 'donor' | 'bloodbank' };
  OTPVerification: { emailOrPhone: string; flow: 'reset' | 'signup'; role: 'hospital' | 'donor' | 'bloodbank' };
  HospitalMain: undefined;
  DonorMain: undefined;
  BloodBankMain: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const BLOOD_TYPES: BloodType[] = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

export const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<any>();
  const { role } = route.params || { role: 'donor' };
  const { signupHospital, signupDonor, isLoading } = useAuth();

  // Shared form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Hospital-specific fields
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');

  // Donor-specific fields
  const [bloodType, setBloodType] = useState<BloodType | null>(null);
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSignUp = async () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.includes('@')) newErrors.email = 'Valid email is required';
    if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    const isHospital = role === 'hospital';
    const isBloodBank = role === 'bloodbank';

    if (isHospital) {
      if (!location.trim()) newErrors.location = 'Location is required';
      if (!contact.trim()) newErrors.contact = 'Contact number is required';
    } else if (isBloodBank) {
      // Blood bank shared fields
    } else {
      if (!bloodType) newErrors.bloodType = 'Blood type selection is required';
      if (!dob.trim()) newErrors.dob = 'Date of birth is required';
      if (!phone.trim()) newErrors.phone = 'Phone number is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    let success = false;

    if (isHospital) {
      success = await signupHospital(name, email, location, contact);
    } else if (isBloodBank) {
      // Mock blood bank setup in Context
      success = await signupHospital(name, email, 'Central Depot', '555-0199');
    } else {
      success = await signupDonor(name, email, bloodType, dob, phone);
    }

    if (success) {
      (navigation as any).navigate('OTPVerification', {
        emailOrPhone: email,
        flow: 'signup',
        role,
      });
    }
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
                ? 'HOSPITAL CLINICAL ENROLLMENT' 
                : isBloodBank 
                ? 'CENTRAL BLOOD BANK ENROLLMENT' 
                : 'VOLUNTEER DONOR REGISTRATION'
              }
            </Text>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Set up your profile to start coordinating life-saving assets.
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label={isHospital ? "Hospital Name" : "Full Name"}
              value={name}
              onChangeText={setName}
              placeholder={isHospital ? "e.g. Metro General Hospital" : "e.g. Tinashe Pharaoh"}
              error={errors.name}
            />

            <Input
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="e.g. coordinator@medibridge.org"
              keyboardType="email-address"
              error={errors.email}
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              error={errors.password}
            />

            {isHospital ? (
              <>
                <Input
                  label="Delivery / Facility Location"
                  value={location}
                  onChangeText={setLocation}
                  placeholder="e.g. Building C, Room 404, Main St."
                  error={errors.location}
                />
                <Input
                  label="Direct Contact Number"
                  value={contact}
                  onChangeText={setContact}
                  placeholder="e.g. (555) 019-2834"
                  keyboardType="phone-pad"
                  error={errors.contact}
                />
              </>
            ) : (
              <>
                <Text style={styles.selectLabel}>BLOOD TYPE</Text>
                <View style={styles.bloodSelector}>
                  {BLOOD_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type}
                      onPress={() => setBloodType(type)}
                      style={[
                        styles.bloodOption,
                        bloodType === type ? styles.bloodOptionSelected : null,
                      ]}
                    >
                      <Text
                        style={[
                          styles.bloodOptionText,
                          bloodType === type ? styles.bloodOptionTextSelected : null,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.bloodType ? <Text style={styles.errorText}>{errors.bloodType}</Text> : null}

                <Input
                  label="Date of Birth"
                  value={dob}
                  onChangeText={setDob}
                  placeholder="e.g. YYYY-MM-DD"
                  error={errors.dob}
                />

                <Input
                  label="Mobile Number"
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="e.g. (555) 012-3456"
                  keyboardType="phone-pad"
                  error={errors.phone}
                />
              </>
            )}

            <Button
              title="Register Account"
              onPress={handleSignUp}
              loading={isLoading}
              variant={isHospital || isBloodBank ? 'primary' : 'secondary'}
              style={styles.button}
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
    marginBottom: spacing.lg,
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
  selectLabel: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  bloodSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  bloodOption: {
    width: 50,
    height: 48,
    borderRadius: spacing.borderRadius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  bloodOptionSelected: {
    borderColor: colors.secondary, // Highlight donor selected blood type in Red
    backgroundColor: colors.secondary,
  },
  bloodOptionText: {
    ...typography.styles.labelMd,
    color: colors.textPrimary,
  },
  bloodOptionTextSelected: {
    color: colors.textLight,
  },
  errorText: {
    ...typography.styles.labelSm,
    color: colors.secondary,
    marginBottom: spacing.md,
    marginTop: -spacing.xs,
  },
  button: {
    marginTop: spacing.md,
    width: '100%',
  },
});
