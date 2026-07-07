import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, spacing, typography } from '../theme';
import { RequestStatus } from '../models/bloodRequest';

interface ProgressStepsProps {
  currentStatus: RequestStatus;
}

const STEPS = [
  { id: 'pending', label: 'Requested' },
  { id: 'matching', label: 'AI Match' },
  { id: 'matched', label: 'Matched' },
  { id: 'in-transit', label: 'Transit' },
  { id: 'delivered', label: 'Delivered' },
];

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStatus }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Active step index determination
  const getActiveIndex = (): number => {
    switch (currentStatus) {
      case 'pending':
        return 0;
      case 'matching':
        return 1;
      case 'matched':
        return 2;
      case 'in-transit':
        return 3;
      case 'delivered':
        return 4;
      case 'cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const activeIndex = getActiveIndex();

  useEffect(() => {
    if (activeIndex !== -1 && activeIndex < STEPS.length - 1) {
      // Pulsing animation for the active step
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1.0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [activeIndex]);

  return (
    <View style={styles.container}>
      <View style={styles.stepsWrapper}>
        {STEPS.map((step, index) => {
          const isCompleted = index < activeIndex;
          const isActive = index === activeIndex;
          const isLast = index === STEPS.length - 1;

          // Compute circle colors (v2 Navy vs. Red hierarchy)
          let circleBgColor = colors.border;
          let circleBorderColor = colors.border;
          if (isCompleted) {
            circleBgColor = colors.primary; // Deep Navy for completed
            circleBorderColor = colors.primary;
          } else if (isActive) {
            circleBgColor = colors.secondary; // Vibrant Red for active matching
            circleBorderColor = colors.secondaryDark;
          }

          return (
            <React.Fragment key={step.id}>
              {/* Step Circle */}
              <View style={styles.stepContainer}>
                {isActive ? (
                  <Animated.View
                    style={[
                      styles.circlePulse,
                      {
                        transform: [{ scale: pulseAnim }],
                        borderColor: colors.secondary,
                      },
                    ]}
                  />
                ) : null}
                <View
                  style={[
                    styles.circle,
                    {
                      backgroundColor: circleBgColor,
                      borderColor: circleBorderColor,
                    },
                  ]}
                >
                  <Text style={[styles.circleText, isCompleted || isActive ? styles.activeText : null]}>
                    {index + 1}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    isActive && styles.activeStepLabel,
                    isCompleted && styles.completedStepLabel,
                  ]}
                  numberOfLines={1}
                >
                  {step.label}
                </Text>
              </View>

              {/* Connecting Line */}
              {!isLast ? (
                <View
                  style={[
                    styles.connector,
                    index < activeIndex ? styles.connectorCompleted : null,
                  ]}
                />
              ) : null}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    width: '100%',
  },
  stepsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepContainer: {
    alignItems: 'center',
    position: 'relative',
    width: 60,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    backgroundColor: colors.border,
  },
  circlePulse: {
    position: 'absolute',
    top: 0,
    left: 16, // Center aligned inside the 60px container
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    opacity: 0.4,
    zIndex: 1,
  },
  circleText: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    fontSize: 11,
    color: colors.textSecondary,
  },
  activeText: {
    color: colors.textLight,
  },
  stepLabel: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    fontSize: 9,
    marginTop: spacing.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  activeStepLabel: {
    color: colors.secondary,
    fontWeight: '700',
  },
  completedStepLabel: {
    color: colors.primary,
  },
  connector: {
    flex: 1,
    height: 3,
    backgroundColor: colors.border,
    marginTop: -16, // Align horizontally with the center of the circles
    zIndex: 1,
    marginHorizontal: -15, // Overlap slightly with the circles
  },
  connectorCompleted: {
    backgroundColor: colors.primary, // Navy for completed sections
  },
});
