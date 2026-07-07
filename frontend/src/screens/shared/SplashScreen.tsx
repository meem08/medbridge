import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

export const SplashScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {/* MedBridge Official Logo Image */}
        <Image
          source={{
            uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNZaXoL5h2cDiiq-I4LHX-_YAhiujl3ROYl-5hPTZAXoM3_QPZ8aVtl0FivkB07cwZLI73vlTa-9VHUluQEQQp8AeFYkKR4A-KZRlmo89O8PR_q0QURZWAUwXo7Ki1pRJlNZCt_Gc1NUV_u9kWy9yhjK6e2TY54kbtRNz5JlW4ktfPnY-YWFMvwrLpnE1V_HTwHvCs-oseZ9onHBaLZiF9jqMio7Y0by6Jld1vd9QPEYkjc2z_WFTyGWIH8GYct1_09Il7AXmkMCg',
          }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>
          MedBridge <Text style={styles.titleAccent}>AI</Text>
        </Text>
        <Text style={styles.subtitle}>Connecting Donors, Saving Lives</Text>
      </View>

      <ActivityIndicator size="small" color={colors.secondary} style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Sterile white background
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    paddingBottom: 32, // Slight upward shift
  },
  logo: {
    width: 200,
    height: 80,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.styles.headlineXl,
    fontFamily: typography.fontFamily,
    color: colors.primary, // Deep Navy (#00163b)
  },
  titleAccent: {
    color: colors.secondary, // Vibrant Red (#bb0014)
  },
  subtitle: {
    ...typography.styles.labelMd,
    fontFamily: typography.fontFamilyLabel,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textTransform: 'uppercase',
  },
  loader: {
    position: 'absolute',
    bottom: spacing.xxl,
  },
});
