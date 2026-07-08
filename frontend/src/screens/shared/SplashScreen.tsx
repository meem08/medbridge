import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, Platform, Pressable } from 'react-native';
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
    if (Platform.OS !== 'web') {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        navigation.navigate('Onboarding');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigation]);

  const handleContinue = () => {
    navigation.navigate('Onboarding');
  };

  return (
    <Pressable style={styles.container} onPress={handleContinue}>
      <Image
        source={require('../../../assets/splash-icon.png')}
        style={styles.backgroundImage}
        resizeMode="contain"
      />
      <View style={styles.overlay} />
      <View style={styles.blueTint} />
      <View style={styles.redTint} />
      <View style={styles.whiteTint} />
      <View style={styles.content}>
        <Text style={styles.title}>MedBridge</Text>
        <Text style={styles.subtitle}>Connecting donors, saving lives</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Press Enter to continue</Text>
        </View>
      </View>

      <ActivityIndicator size="small" color={colors.textLight} style={styles.loader} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  blueTint: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: '60%',
    backgroundColor: 'rgba(0, 86, 179, 0.14)',
  },
  redTint: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '42%',
    backgroundColor: 'rgba(200, 31, 39, 0.12)',
  },
  whiteTint: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '24%',
    backgroundColor: 'rgba(255,255,255,0.20)',
  },
  content: {
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.containerPadding,
    paddingBottom: 88,
    flex: 1,
    width: '100%',
  },
  title: {
    ...typography.styles.headlineXl,
    fontFamily: typography.fontFamily,
    color: '#8d0010',
    fontWeight: '900',
    letterSpacing: 0.8,
    fontSize: 34,
    textAlign: 'center',
    marginBottom: spacing.xs,
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    ...typography.styles.labelMd,
    fontFamily: typography.fontFamilyLabel,
    color: '#8d0010',
    marginTop: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    opacity: 0.95,
    fontSize: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.16)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  badge: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.95)',
    shadowColor: '#0a3d91',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 4,
  },
  badgeText: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: '#0f4fa3',
    fontWeight: '900',
    letterSpacing: 1,
    fontSize: 13,
  },
  loader: {
    position: 'absolute',
    bottom: spacing.xxl,
    zIndex: 2,
  },
});
