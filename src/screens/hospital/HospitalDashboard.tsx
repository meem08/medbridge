import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useBlood } from '../../context/BloodContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BloodRequest } from '../../models/bloodRequest';
import { formatDate } from '../../utils/formatters';
import { BloodInventoryItem } from '../../models/inventory';

type HospitalParamList = {
  HospitalDashboard: undefined;
  EmergencyRequest: undefined;
  BloodTracking: { requestId: string };
  BloodInventory: undefined;
  ChooseRole: undefined;
};

type NavigationProp = StackNavigationProp<HospitalParamList, 'HospitalDashboard'>;

export const HospitalDashboard: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, logout } = useAuth();
  const { requests, inventory } = useBlood();

  const handleLogout = () => {
    logout();
    navigation.getParent()?.navigate('ChooseRole');
  };

  // Find low stock blood types
  const lowStockItems = (Object.values(inventory) as BloodInventoryItem[]).filter(
    (item) => item.units < item.minRequired
  );

  const activeRequests = requests.filter(
    (req) => req.status !== 'delivered' && req.status !== 'cancelled'
  );

  const renderRequestItem = ({ item }: { item: BloodRequest }) => {
    const isCritical = item.urgency === 'critical';

    return (
      <Card
        isLowStock={isCritical}
        onPress={() => navigation.navigate('BloodTracking', { requestId: item.id })}
        style={styles.requestCard}
      >
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.bloodTitle}>{item.bloodType} Emergency Order</Text>
            <Text style={styles.requestMeta}>
              {item.units} Units • {formatDate(item.createdAt)}
            </Text>
          </View>
          <Badge type={item.status} />
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.locationText} numberOfLines={1}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} /> {item.deliveryLocation}
          </Text>
          {item.eta ? (
            <Text style={styles.etaText}>ETA: {item.eta}</Text>
          ) : (
            <Text style={styles.etaText}>Awaiting Match</Text>
          )}
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Clinical Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>CLINICAL PORTAL</Text>
          <Text style={styles.hospitalName} numberOfLines={1}>
            {user?.name || 'Metro Health Medical Center'}
          </Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Low Inventory Alert Card (Vibrant Red Border) */}
        {lowStockItems.length > 0 ? (
          <Card style={styles.alertCard} isLowStock={true}>
            <Text style={styles.alertTitle}>
              <Ionicons name="alert-circle-outline" size={18} color={colors.secondary} /> STOCK LEVEL WARNING
            </Text>
            <Text style={styles.alertDesc}>
              {lowStockItems.length} blood types are currently below emergency safety thresholds:
            </Text>
            <View style={styles.lowStockBadges}>
              {lowStockItems.map((item) => (
                <View key={item.bloodType} style={styles.alertPill}>
                  <Text style={styles.alertPillText}>
                    {item.bloodType}: {item.units} units
                  </Text>
                </View>
              ))}
            </View>
            <Button
              title="Manage Inventory"
              onPress={() => navigation.navigate('BloodInventory')}
              variant="outline"
              style={styles.alertBtn}
            />
          </Card>
        ) : null}

        {/* Immediate Emergency Action Area */}
        <View style={styles.actionContainer}>
          <Text style={styles.sectionTitle}>Emergency Dispatch</Text>
          <Button
            title="Initiate Emergency Request"
            onPress={() => navigation.navigate('EmergencyRequest')}
            variant="emergency" // Red Emergency Button
            style={styles.emergencyBtn}
          />
        </View>

        {/* Active Coordination Requests Queue */}
        <View style={styles.queueContainer}>
          <View style={styles.queueHeader}>
            <Text style={styles.sectionTitle}>Active Coordination</Text>
            <Text style={styles.activeCount}>{activeRequests.length} Running</Text>
          </View>

          {activeRequests.length === 0 ? (
            <Card style={styles.emptyCard} navyHeaderLine={true}>
              <Text style={styles.emptyText}>No active emergency requests.</Text>
              <Text style={styles.emptySub}>All requests are completed or fulfilled.</Text>
            </Card>
          ) : (
            <FlatList
              data={activeRequests}
              renderItem={renderRequestItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.listContainer}
            />
          )}
        </View>
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
    paddingHorizontal: spacing.containerPadding,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  welcomeText: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  hospitalName: {
    ...typography.styles.headlineMd,
    fontSize: 20,
    color: colors.textPrimary,
    fontWeight: '700',
    maxWidth: 240,
  },
  logoutBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  logoutText: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: colors.secondary,
    fontWeight: '700',
  },
  scrollContent: {
    padding: spacing.containerPadding,
  },
  alertCard: {
    borderColor: colors.secondary,
  },
  alertTitle: {
    ...typography.styles.headlineMd,
    fontSize: 18,
    color: colors.secondary,
    fontWeight: '700',
  },
  alertDesc: {
    ...typography.styles.bodySm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  lowStockBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginVertical: spacing.md,
  },
  alertPill: {
    backgroundColor: 'rgba(187, 0, 20, 0.08)',
    borderRadius: spacing.borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  alertPillText: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: colors.secondary,
    fontWeight: '700',
  },
  alertBtn: {
    height: 40,
    marginTop: spacing.xs,
  },
  actionContainer: {
    marginVertical: spacing.md,
  },
  sectionTitle: {
    ...typography.styles.headlineMd,
    fontSize: 20,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  emergencyBtn: {
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 8px rgba(187, 0, 20, 0.15)',
      },
      default: {
        shadowColor: colors.secondary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 3,
      },
    }),
  },
  queueContainer: {
    marginTop: spacing.sm,
  },
  queueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  activeCount: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: colors.primary,
    backgroundColor: 'rgba(0, 22, 59, 0.08)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: spacing.borderRadius.full,
    fontWeight: '700',
  },
  listContainer: {
    gap: spacing.sm,
  },
  requestCard: {
    marginBottom: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bloodTitle: {
    ...typography.styles.headlineMd,
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  requestMeta: {
    ...typography.styles.bodySm,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  locationText: {
    ...typography.styles.bodySm,
    color: colors.textSecondary,
    flex: 1,
    marginRight: spacing.sm,
  },
  etaText: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: colors.secondary,
    fontWeight: '700',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    ...typography.styles.headlineMd,
    fontSize: 18,
    color: colors.textSecondary,
  },
  emptySub: {
    ...typography.styles.bodySm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
