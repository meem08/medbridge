import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { Button } from '../../components/Button';
import { AuthBottomBar } from '../../components/AuthBottomBar';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  ChooseRole: undefined;
  Login: { role: 'hospital' | 'donor' };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'ChooseRole'>;

export const ChooseRoleScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedRole, setSelectedRole] = useState<'hospital' | 'donor' | null>(null);

  const handleContinue = () => {
    if (selectedRole) {
      navigation.navigate('Login', { role: selectedRole });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.label}>MEDIBRIDGE AI PORTAL</Text>
          <Text style={styles.title}>Choose Your Role</Text>
          <Text style={styles.subtitle}>
            Select your account type to access specialized emergency coordination tools.
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          {/* Hospital Staff Card */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setSelectedRole('hospital')}
            style={[
              styles.roleCard,
              selectedRole === 'hospital' ? styles.selectedCardHospital : null,
            ]}
          >
            <View style={styles.iconWrapper}>
              <View style={styles.hospitalIconCross} />
              <View style={styles.hospitalIconCircle} />
            </View>
            <Text style={styles.cardTitle}>Hospital Staff</Text>
            <Text style={styles.cardDesc}>
              Request blood units, track AI match delivery updates, and manage clinical inventory.
            </Text>
          </TouchableOpacity>

          {/* Blood Donor Card */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setSelectedRole('donor')}
            style={[
              styles.roleCard,
              selectedRole === 'donor' ? styles.selectedCardDonor : null,
            ]}
          >
            <View style={styles.iconWrapper}>
              <View style={styles.donorIconDrop} />
            </View>
            <Text style={styles.cardTitle}>Blood Donor</Text>
            <Text style={styles.cardDesc}>
              Schedule appointments, review history, and view active emergency requests.
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Button
            title="Continue"
            onPress={handleContinue}
            disabled={!selectedRole}
            variant={selectedRole === 'hospital' ? 'primary' : 'secondary'}
            style={styles.button}
          />
        </View>
      </View>
      <AuthBottomBar activeTab="security" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.containerPadding,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: spacing.lg,
  },
  label: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: colors.secondary,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.styles.headlineLg,
    fontFamily: typography.fontFamily,
    color: colors.primary,
  },
  subtitle: {
    ...typography.styles.bodyMd,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  cardsContainer: {
    marginVertical: spacing.lg,
    gap: spacing.md,
  },
  roleCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.borderRadius.sm,
    padding: spacing.md,
    position: 'relative',
  },
  selectedCardHospital: {
    borderColor: colors.primary,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  selectedCardDonor: {
    borderColor: colors.secondary,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 6,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  hospitalIconCross: {
    width: 24,
    height: 6,
    backgroundColor: colors.primary,
    position: 'absolute',
    borderRadius: 2,
  },
  hospitalIconCircle: {
    width: 6,
    height: 24,
    backgroundColor: colors.primary,
    position: 'absolute',
    borderRadius: 2,
  },
  donorIconDrop: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.secondary,
    transform: [{ rotate: '45deg' }],
    borderTopLeftRadius: 0,
  },
  cardTitle: {
    ...typography.styles.headlineMd,
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  cardDesc: {
    ...typography.styles.bodySm,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  footer: {
    marginBottom: spacing.md,
  },
  button: {
    width: '100%',
  },
});
