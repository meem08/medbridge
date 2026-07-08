import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { Button } from '../../components/Button';
import { AuthBottomBar } from '../../components/AuthBottomBar';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
  ChooseRole: undefined;
  Login: { role: 'hospital' | 'donor' | 'bloodbank' };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'ChooseRole'>;

export const ChooseRoleScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedRole, setSelectedRole] = useState<'hospital' | 'donor' | 'bloodbank' | null>(null);

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('ChooseRole');
    }
  };

  const handleContinue = () => {
    if (selectedRole) {
      navigation.navigate('Login', { role: selectedRole });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heroAccent} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <View style={styles.headerText}>
              <Text style={styles.label}>MEDIBRIDGE AI PORTAL</Text>
              <Text style={styles.title}>Choose Your Role</Text>
              <Text style={styles.subtitle}>
                Select your account type to access specialized emergency coordination tools.
              </Text>
            </View>
          </View>

          <View style={styles.cardsContainer}>
            <Pressable
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
            </Pressable>

            <Pressable
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
            </Pressable>

            <Pressable
              onPress={() => setSelectedRole('bloodbank')}
              style={[
                styles.roleCard,
                selectedRole === 'bloodbank' ? styles.selectedCardBloodBank : null,
              ]}
            >
              <View style={styles.iconWrapper}>
                <View style={styles.bloodBankIconJar} />
              </View>
              <Text style={styles.cardTitle}>Central Blood Bank</Text>
              <Text style={styles.cardDesc}>
                Oversee regional blood supply, match pending hospital dispatches, and coordinate donor slots.
              </Text>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Button
              title="Continue"
              onPress={handleContinue}
              disabled={!selectedRole}
              variant={selectedRole === 'donor' ? 'secondary' : 'primary'}
              style={styles.button}
            />
          </View>
        </View>
      </ScrollView>
      <AuthBottomBar activeTab="security" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 170,
    backgroundColor: 'rgba(0, 22, 59, 0.04)',
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.containerPadding,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  header: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  headerText: {
    flex: 1,
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
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
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
  selectedCardBloodBank: {
    borderColor: colors.primary,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
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
  bloodBankIconJar: {
    width: 18,
    height: 22,
    borderWidth: 2.5,
    borderColor: colors.primary,
    borderRadius: 4,
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
