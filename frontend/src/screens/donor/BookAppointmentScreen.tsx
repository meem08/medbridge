import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { AlertModal } from '../../components/AlertModal';

const LOCATIONS = [
  'City Central Blood Bank (Main Street)',
  'St. Jude Hospital Donation Clinic',
  'Metro Health Mobiles Drive (ICU Area)',
];

const TIME_SLOTS = ['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM'];

export const BookAppointmentScreen: React.FC = () => {
  const navigation = useNavigation();

  const [location, setLocation] = useState(LOCATIONS[0]);
  const [date, setDate] = useState('2026-07-08');
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[1]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Custom alert modal config state
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    onConfirm: () => void;
  }>({
    visible: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: () => {},
  });

  const showAlert = (
    title: string,
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    onConfirm: () => void = () => {}
  ) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      type,
      onConfirm,
    });
  };

  const handleBook = () => {
    setIsSubmitting(true);
    // Simulate booking API call
    setTimeout(() => {
      setIsSubmitting(false);
      showAlert(
        'Appointment Confirmed',
        `Thank you! Your donation is scheduled at:\n\n📍 ${location}\n📅 ${date} at ${timeSlot}\n\nPlease bring a valid ID and eat a light meal beforehand.`,
        'success',
        () => navigation.goBack()
      );
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Donation</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Step 1: Location selection */}
        <Text style={styles.label}>DONATION CENTER</Text>
        <View style={styles.selectorGroup}>
          {LOCATIONS.map((loc) => {
            const isSelected = location === loc;
            return (
              <TouchableOpacity
                key={loc}
                onPress={() => setLocation(loc)}
                style={[
                  styles.optionCard,
                  isSelected ? styles.optionCardSelected : null,
                ]}
              >
                <Text
                  style={[
                    styles.optionTitle,
                    isSelected ? styles.optionTextSelected : null,
                  ]}
                >
                  {loc}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Step 2: Date input */}
        <Input
          label="Preferred Date (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
          placeholder="e.g. 2026-07-10"
        />

        {/* Step 3: Time Slot Selector */}
        <Text style={styles.label}>AVAILABLE TIME SLOTS</Text>
        <View style={styles.slotsGrid}>
          {TIME_SLOTS.map((slot) => {
            const isSelected = timeSlot === slot;
            return (
              <TouchableOpacity
                key={slot}
                onPress={() => setTimeSlot(slot)}
                style={[
                  styles.slotPill,
                  isSelected ? styles.slotPillSelected : null,
                ]}
              >
                <Text
                  style={[
                    styles.slotPillText,
                    isSelected ? styles.slotPillTextSelected : null,
                  ]}
                >
                  {slot}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Health guidelines disclosure */}
        <View style={styles.disclosureCard}>
          <Text style={styles.disclosureTitle}>Donor Health Check Reminder</Text>
          <Text style={styles.disclosureText}>
            • You must weigh at least 110 lbs (50 kg).{'\n'}
            • You must feel healthy and well on the day of donation.{'\n'}
            • Have a light meal and drink plenty of water prior to your appointment.
          </Text>
        </View>

        <View style={styles.footer}>
          <Button
            title="Confirm Donation Booking"
            onPress={handleBook}
            loading={isSubmitting}
            variant="secondary" // Red primary action button for Donors
            style={styles.submitBtn}
          />
        </View>
      </ScrollView>

      <AlertModal
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
        onConfirm={() => {
          setAlertConfig((prev) => ({ ...prev, visible: false }));
          alertConfig.onConfirm();
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  selectorGroup: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  optionCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.borderRadius.sm,
    padding: spacing.md,
  },
  optionCardSelected: {
    borderColor: colors.secondary, // Selected clinics get a Red border highlight
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  optionTitle: {
    ...typography.styles.bodyMd,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: colors.secondary,
    fontWeight: '700',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  slotPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  slotPillSelected: {
    borderColor: colors.secondary,
    backgroundColor: colors.secondary, // Selected slot highlights in Red
  },
  slotPillText: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  slotPillTextSelected: {
    color: colors.textLight,
  },
  disclosureCard: {
    backgroundColor: 'rgba(0, 46, 93, 0.04)',
    borderRadius: spacing.borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.xl,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  disclosureTitle: {
    ...typography.styles.headlineMd,
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  disclosureText: {
    ...typography.styles.bodySm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    marginBottom: spacing.xl,
  },
  submitBtn: {
    width: '100%',
  },
});
