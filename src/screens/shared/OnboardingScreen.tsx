import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
} from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { Button } from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Onboarding: undefined;
  ChooseRole: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Onboarding'>;

interface OnboardingSlide {
  title: string;
  description: string;
  renderIllustration: () => React.ReactNode;
}

export const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activePage, setActivePage] = useState(0);
  const [containerWidth, setContainerWidth] = useState(Dimensions.get('window').width);
  const scrollRef = useRef<ScrollView>(null);

  const isWide = containerWidth > 768;

  const handleLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0 && width !== containerWidth) {
      setContainerWidth(width);
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const page = Math.round(event.nativeEvent.contentOffset.x / containerWidth);
    if (page !== activePage) {
      setActivePage(page);
    }
  };

  const handleNext = () => {
    if (activePage < slides.length - 1) {
      scrollRef.current?.scrollTo({
        x: (activePage + 1) * containerWidth,
        animated: true,
      });
    } else {
      navigation.replace('ChooseRole');
    }
  };

  const slides: OnboardingSlide[] = [
    {
      title: 'Connecting Donors',
      description: 'MedBridge AI matches rare blood types and schedules appointments to optimize local community reserves.',
      renderIllustration: () => (
        <View style={styles.illustration}>
          <View style={styles.radialBackdrop} />
          {/* Map Connections representation */}
          <View style={[styles.node, styles.centerNode]}>
            <View style={styles.heartLine} />
          </View>
          <View style={[styles.node, styles.donorNode1]} />
          <View style={[styles.node, styles.donorNode2]} />
          <View style={[styles.node, styles.hospNode]} />
          {/* Connection Lines */}
          <View style={[styles.line, styles.line1]} />
          <View style={[styles.line, styles.line2]} />
          <View style={[styles.line, styles.line3]} />
        </View>
      ),
    },
    {
      title: 'AI-Powered Matching',
      description: 'Our real-time neural coordinator processes incoming hospital requests and identifies compatible matches instantly.',
      renderIllustration: () => (
        <View style={styles.illustration}>
          <View style={styles.radialBackdrop} />
          {/* Glowing Neural Grid */}
          <View style={styles.gridContainer}>
            <View style={styles.gridRow}>
              <View style={styles.gridDot} />
              <View style={[styles.gridDot, styles.dotGlow]} />
              <View style={styles.gridDot} />
            </View>
            <View style={styles.gridRow}>
              <View style={[styles.gridDot, styles.dotGlow]} />
              <View style={[styles.largeCircle, styles.glowPulse]} />
              <View style={[styles.gridDot, styles.dotGlow]} />
            </View>
            <View style={styles.gridRow}>
              <View style={styles.gridDot} />
              <View style={[styles.gridDot, styles.dotGlow]} />
              <View style={styles.gridDot} />
            </View>
          </View>
        </View>
      ),
    },
    {
      title: 'Cold-Chain Delivery',
      description: 'Emergency orders are tracked with direct temperature sensors and GPS telemetry from dispatch to transfusion.',
      renderIllustration: () => (
        <View style={styles.illustration}>
          <View style={styles.radialBackdrop} />
          {/* Temperature compliant shipping box illustration */}
          <View style={styles.shippingBox}>
            <View style={styles.boxHinge} />
            <View style={styles.thermometerContainer}>
              <Text style={styles.tempText}>4.2°C</Text>
              <View style={styles.tempCheckCircle} />
            </View>
          </View>
        </View>
      ),
    },
  ];

  return (
    <SafeAreaView style={styles.container} onLayout={handleLayout}>
      {/* Skip Button */}
      <View style={styles.header}>
        <Button
          title="Skip"
          onPress={() => navigation.replace('ChooseRole')}
          variant="text"
          textStyle={styles.skipText}
        />
      </View>

      {/* Slider Carousel */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.carousel}
      >
        {slides.map((slide, index) => (
          <View key={index} style={[styles.slide, { width: containerWidth }, isWide ? styles.slideWide : null]}>
            {/* Slide Illustration */}
            <View style={styles.illustrationContainer}>{slide.renderIllustration()}</View>

            {/* Slide Texts */}
            <View style={[styles.textContainer, isWide ? styles.textContainerWide : null]}>
              <Text style={styles.slideTitle}>{slide.title}</Text>
              <Text style={styles.slideDesc}>{slide.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Footer Controls */}
      <View style={[styles.footer, isWide ? styles.footerWide : null]}>
        {/* Page Dots Indicator */}
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                activePage === index ? styles.dotActive : null,
              ]}
            />
          ))}
        </View>

        {/* Action Button */}
        <Button
          title={activePage === slides.length - 1 ? 'Get Started' : 'Next Stage'}
          onPress={handleNext}
          variant="primary"
          style={[styles.actionButton, isWide ? styles.actionButtonWide : null]}
        />
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
    height: 48,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: spacing.containerPadding,
  },
  skipText: {
    color: colors.textSecondary,
    textDecorationLine: 'none',
  },
  carousel: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.containerPadding,
  },
  slideWide: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.xl * 2,
  },
  illustrationContainer: {
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  illustration: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  radialBackdrop: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(0, 46, 93, 0.03)',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  textContainerWide: {
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: spacing.xl * 2,
  },
  slideTitle: {
    ...typography.styles.headlineMd,
    fontFamily: typography.fontFamily,
    color: colors.primary,
    fontWeight: '700',
    textAlign: 'center',
  },
  slideDesc: {
    ...typography.styles.bodyMd,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: spacing.containerPadding,
    paddingBottom: spacing.lg,
    alignItems: 'center',
  },
  footerWide: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl * 2,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 20,
  },
  actionButton: {
    width: '100%',
  },
  actionButtonWide: {
    maxWidth: 240,
  },

  // Slide 1 Custom Shapes
  node: {
    width: 24,
    height: 24,
    borderRadius: 12,
    position: 'absolute',
    borderWidth: 2,
    zIndex: 3,
  },
  centerNode: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    borderColor: colors.textLight,
    top: 80,
    left: 80,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 6px rgba(187, 0, 20, 0.3)',
      },
      default: {
        shadowColor: colors.secondary,
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 3,
      },
    }),
  },
  heartLine: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.textLight,
    transform: [{ rotate: '45deg' }],
    borderTopLeftRadius: 0,
    marginTop: 4,
  },
  donorNode1: {
    backgroundColor: colors.primary,
    borderColor: colors.textLight,
    top: 40,
    left: 30,
  },
  donorNode2: {
    backgroundColor: colors.primary,
    borderColor: colors.textLight,
    top: 130,
    left: 40,
  },
  hospNode: {
    backgroundColor: colors.primary,
    borderColor: colors.textLight,
    top: 90,
    left: 140,
  },
  line: {
    position: 'absolute',
    height: 2,
    backgroundColor: colors.border,
    zIndex: 1,
  },
  line1: {
    width: 70,
    transform: [{ rotate: '45deg' }],
    top: 65,
    left: 45,
  },
  line2: {
    width: 70,
    transform: [{ rotate: '-35deg' }],
    top: 115,
    left: 45,
  },
  line3: {
    width: 60,
    transform: [{ rotate: '15deg' }],
    top: 98,
    left: 95,
  },

  // Slide 2 Custom Shapes
  gridContainer: {
    gap: spacing.md,
    alignItems: 'center',
  },
  gridRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  gridDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.border,
  },
  dotGlow: {
    backgroundColor: 'rgba(0, 46, 93, 0.2)',
  },
  largeCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    borderColor: colors.border,
    borderWidth: 2,
    ...Platform.select({
      web: {
        boxShadow: '0px 6px 10px rgba(0, 22, 59, 0.3)',
      },
      default: {
        shadowColor: colors.primary,
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 4,
      },
    }),
  },
  glowPulse: {
    backgroundColor: colors.primary,
  },

  // Slide 3 Custom Shapes
  shippingBox: {
    width: 90,
    height: 80,
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.sm,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primaryDark,
  },
  boxHinge: {
    position: 'absolute',
    top: -6,
    width: 96,
    height: 12,
    backgroundColor: colors.primaryDark,
    borderRadius: 3,
  },
  thermometerContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: spacing.borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tempText: {
    ...typography.styles.labelSm,
    fontSize: 10,
    color: colors.primary,
    fontWeight: '700',
  },
  tempCheckCircle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.status.success,
  },
});
