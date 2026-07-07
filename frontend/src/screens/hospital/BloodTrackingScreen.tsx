import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { ProgressSteps } from '../../components/ProgressSteps';
import { useBlood } from '../../context/BloodContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { formatDate } from '../../utils/formatters';

export const BloodTrackingScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { requestId } = route.params;
  const { requests } = useBlood();

  const request = requests.find((r) => r.id === requestId);

  if (!request) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Request not found.</Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  const getStatusMessage = () => {
    switch (request.status) {
      case 'pending':
        return {
          title: 'Request Initialized',
          desc: 'Connecting with AI regional coordinator. Scanning local and community donor databases for matches.',
        };
      case 'matching':
        return {
          title: 'AI Database Scan',
          desc: 'Calculating compatibility algorithms. Scanning volunteer blood donor network...',
        };
      case 'matched':
        return {
          title: 'Donor Matched & Confirmed',
          desc: `Compatible units identified! Donor: ${request.matchedDonorName || 'N/A'}. Preparing blood package at central repository.`,
        };
      case 'in-transit':
        return {
          title: 'Courier Dispatched',
          desc: `Emergency courier has taken custody of the package. ETA: ${request.eta || 'N/A'}. Temperature monitoring: ACTIVE.`,
        };
      case 'delivered':
        return {
          title: 'Delivery Complete',
          desc: 'Units received and scanned at ER desk. Cold chain logs validated. Coordination cycle completed.',
        };
      case 'cancelled':
        return {
          title: 'Request Cancelled',
          desc: 'This request was retracted by clinical command.',
        };
      default:
        return { title: 'Unknown', desc: '' };
    }
  };

  const statusMsg = getStatusMessage();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Match & Tracking</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Core Request Specs Card */}
        <Card style={styles.specsCard} isLowStock={request.urgency === 'critical'} navyHeaderLine={true}>
          <View style={styles.specsHeader}>
            <View>
              <Text style={styles.bloodType}>{request.bloodType} Emergency Order</Text>
              <Text style={styles.createdDate}>Placed on {formatDate(request.createdAt)}</Text>
            </View>
            <Badge type={request.urgency} />
          </View>

          <View style={styles.specsBody}>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Units Needed</Text>
              <Text style={styles.specValue}>{request.units} Bags</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Location</Text>
              <Text style={styles.specValue}>{request.deliveryLocation}</Text>
            </View>
            {request.matchedDonorName ? (
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Donor Match</Text>
                <Text style={styles.specValue}>{request.matchedDonorName}</Text>
              </View>
            ) : null}
            {request.notes ? (
              <View style={[styles.specRow, styles.notesRow]}>
                <Text style={styles.specLabel}>Notes</Text>
                <Text style={styles.notesValue}>{request.notes}</Text>
              </View>
            ) : null}
          </View>
        </Card>

        {/* Real-time Visual Progress Indicator */}
        <Card style={styles.progressCard}>
          <Text style={styles.sectionTitle}>Real-time Progress Tracker</Text>
          <ProgressSteps currentStatus={request.status} />
        </Card>

        {/* Stage Description Panel */}
        <Card style={styles.statusPanel}>
          <View style={styles.pulseContainer}>
            {request.status !== 'delivered' && request.status !== 'cancelled' ? (
              <View style={styles.pulseIndicator} />
            ) : null}
            <Text style={styles.statusPanelTitle}>{statusMsg.title}</Text>
          </View>
          <Text style={styles.statusPanelDesc}>{statusMsg.desc}</Text>

          {request.eta ? (
            <View style={styles.etaContainer}>
              <Text style={styles.etaLabel}>ESTIMATED DELIVERY</Text>
              <Text style={styles.etaValue}>{request.eta}</Text>
            </View>
          ) : null}
        </Card>

        <Button
          title="Return to Dashboard"
          onPress={() => navigation.goBack()}
          variant="primary" // Deep Navy return button
          style={styles.closeBtn}
        />
      </ScrollView>
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
    gap: spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.containerPadding,
  },
  errorText: {
    ...typography.styles.headlineMd,
    color: colors.secondary,
    marginBottom: spacing.md,
  },
  specsCard: {
    marginBottom: 0,
  },
  specsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm,
  },
  bloodType: {
    ...typography.styles.headlineMd,
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  createdDate: {
    ...typography.styles.bodySm,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
  specsBody: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs / 2,
  },
  specLabel: {
    ...typography.styles.bodySm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  specValue: {
    ...typography.styles.bodySm,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  notesRow: {
    flexDirection: 'column',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginTop: spacing.xs,
  },
  notesValue: {
    ...typography.styles.bodySm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  progressCard: {
    marginBottom: 0,
  },
  sectionTitle: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  statusPanel: {
    borderColor: colors.border,
    marginBottom: 0,
    backgroundColor: colors.surface,
  },
  pulseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pulseIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.secondary, // Red pulsing dot
  },
  statusPanelTitle: {
    ...typography.styles.headlineMd,
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  statusPanelDesc: {
    ...typography.styles.bodySm,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  etaContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  etaLabel: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: colors.textSecondary,
  },
  etaValue: {
    ...typography.styles.headlineXl,
    color: colors.secondary, // Red ETA
    fontSize: 28,
    marginTop: spacing.xs,
  },
  closeBtn: {
    width: '100%',
    marginTop: spacing.sm,
  },
});
