import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useBlood } from '../../context/BloodContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BloodType } from '../../models/user';
import { UrgencyLevel } from '../../models/bloodRequest';

type HospitalParamList = {
  HospitalDashboard: undefined;
  BloodTracking: { requestId: string };
};

type NavigationProp = StackNavigationProp<HospitalParamList, 'HospitalDashboard'>;

const BLOOD_TYPES: BloodType[] = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
const URGENCY_LEVELS: { value: UrgencyLevel; label: string; color: string }[] = [
  { value: 'critical', label: 'CRITICAL', color: colors.status.critical },
  { value: 'urgent', label: 'URGENT', color: colors.status.urgent },
  { value: 'normal', label: 'NORMAL', color: colors.status.normal },
];

export const EmergencyRequestScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { createBloodRequest, triggerMockDeliveryFlow } = useBlood();

  const [bloodType, setBloodType] = useState<BloodType | null>(null);
  const [units, setUnits] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('critical');
  const [location, setLocation] = useState('Metro Health ICU, Building D, Floor 2');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};

    if (!bloodType) newErrors.bloodType = 'Please select a blood type';
    
    const parsedUnits = parseInt(units, 10);
    if (isNaN(parsedUnits) || parsedUnits <= 0) {
      newErrors.units = 'Please enter a valid number of units';
    }

    if (!location.trim()) {
      newErrors.location = 'Please specify a delivery location';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const requestId = await createBloodRequest(
        bloodType!,
        parsedUnits,
        urgency,
        location,
        notes
      );

      // Trigger the mock delivery background lifecycle animation
      triggerMockDeliveryFlow(requestId);

      // Navigate to tracking
      navigation.replace('BloodTracking', { requestId });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Dispatch</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.label}>BLOOD TYPE REQUIRED</Text>
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
            label="Units Requested"
            value={units}
            onChangeText={(text) => {
              setUnits(text.replace(/[^0-9]/g, ''));
              if (errors.units) setErrors((prev) => ({ ...prev, units: '' }));
            }}
            placeholder="e.g. 5"
            keyboardType="number-pad"
            error={errors.units}
          />

          <Text style={styles.label}>URGENCY TIER</Text>
          <View style={styles.urgencySelector}>
            {URGENCY_LEVELS.map((level) => {
              const isSelected = urgency === level.value;
              return (
                <TouchableOpacity
                  key={level.value}
                  onPress={() => setUrgency(level.value)}
                  style={[
                    styles.urgencyOption,
                    isSelected ? { borderColor: level.color, backgroundColor: level.color } : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.urgencyText,
                      isSelected ? styles.urgencyTextSelected : { color: level.color },
                    ]}
                  >
                    {level.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Input
            label="Specific Delivery Location"
            value={location}
            onChangeText={(text) => {
              setLocation(text);
              if (errors.location) setErrors((prev) => ({ ...prev, location: '' }));
            }}
            placeholder="e.g. ICU Wing A, Bed 4"
            error={errors.location}
          />

          <Input
            label="Clinical Notes / Details"
            value={notes}
            onChangeText={setNotes}
            placeholder="e.g. Patient undergoing emergency surgery, O negative required immediately."
            containerStyle={styles.notesContainer}
          />

          <View style={styles.footer}>
            <Button
              title={urgency === 'critical' ? 'Dispatch Emergency Order' : 'Place Request'}
              onPress={handleSubmit}
              loading={isSubmitting}
              variant={urgency === 'critical' ? 'emergency' : 'primary'} // Navy for standard, Red for emergency
              style={styles.submitBtn}
            />
            <Button
              title="Cancel"
              onPress={() => navigation.goBack()}
              variant="outline"
              style={styles.cancelBtn}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.gutter,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    paddingVertical: spacing.xs,
    width: 60,
  },
  backText: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: colors.primary,
    fontWeight: '700',
  },
  headerTitle: {
    ...typography.styles.headlineMd,
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  placeholder: {
    width: 60,
  },
  scrollContent: {
    padding: spacing.containerPadding,
  },
  label: {
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
    borderRadius: spacing.borderRadius.sm, // 4px / 0.25rem
    borderWidth: 1.5,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  bloodOptionSelected: {
    borderColor: colors.primary, // Highlight selected in Navy
    backgroundColor: colors.primary,
  },
  bloodOptionText: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: colors.textPrimary,
    fontWeight: '700',
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
  urgencySelector: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  urgencyOption: {
    flex: 1,
    height: 48,
    borderRadius: spacing.borderRadius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  urgencyText: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    fontWeight: '700',
  },
  urgencyTextSelected: {
    color: colors.textLight,
  },
  notesContainer: {
    marginBottom: spacing.xl,
  },
  footer: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  submitBtn: {
    width: '100%',
  },
  cancelBtn: {
    width: '100%',
  },
});
