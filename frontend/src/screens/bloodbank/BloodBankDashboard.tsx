import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

interface RegionalRequest {
  id: string;
  bloodType: string;
  units: number;
  hospital: string;
  urgency: 'urgent' | 'routine';
  time: string;
  status: 'matching' | 'reserved' | 'complete';
}

export const BloodBankDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation();

  const handleLogout = () => {
    logout();
    navigation.getParent()?.navigate('ChooseRole');
  };

  const [requests, setRequests] = useState<RegionalRequest[]>([
    {
      id: 'REQ-1234',
      bloodType: 'O+',
      units: 4,
      hospital: 'City Hospital',
      urgency: 'urgent',
      time: 'Today, 09:00 AM',
      status: 'matching',
    },
    {
      id: 'REQ-1233',
      bloodType: 'A+',
      units: 2,
      hospital: 'Survive Hospital',
      urgency: 'routine',
      time: 'Today, 07:00 AM',
      status: 'reserved',
    },
    {
      id: 'REQ-1232',
      bloodType: 'B+',
      units: 3,
      hospital: 'Metro Hospital',
      urgency: 'urgent',
      time: 'Yesterday, 10:00 AM',
      status: 'complete',
    },
  ]);

  const handleAddRequest = () => {
    Alert.alert('Simulate Request', 'Enter details for matching algorithm simulated dispatcher...', [
      {
        text: 'Dispatch O-',
        onPress: () => {
          const newReq: RegionalRequest = {
            id: 'REQ-' + Math.floor(Math.random() * 10000),
            bloodType: 'O-',
            units: 3,
            hospital: 'Central General Hospital',
            urgency: 'urgent',
            time: 'Just now',
            status: 'matching',
          };
          setRequests((prev) => [newReq, ...prev]);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const renderRequestItem = ({ item }: { item: RegionalRequest }) => {
    return (
      <Card style={styles.requestCard}>
        <View style={styles.cardLeft}>
          <View style={styles.iconCircle}>
            <Ionicons name="flask-outline" size={20} color={colors.primary} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.requestTitle}>{item.id} - {item.bloodType} {item.units} Units</Text>
            <Text style={styles.requestSub}>{item.hospital} - {item.urgency.toUpperCase()}</Text>
            <Text style={styles.requestTime}>{item.time}</Text>
          </View>
        </View>

        {/* Status Badge */}
        <View style={[styles.statusBadge, styles[`statusBadge_${item.status}`]]}>
          <Text style={[styles.statusBadgeText, styles[`statusBadgeText_${item.status}`]]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>COORDINATION CORE</Text>
          <Text style={styles.headerName} numberOfLines={1}>
            {user?.name || 'LifeCare Blood Bank'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => (navigation as any).navigate('HospitalNotifications')}
            style={styles.notifBtn}
          >
            <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
            <View style={styles.notifBadge}>
              <Text style={styles.notifBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Welcome Section */}
        <Card style={styles.heroCard} navyHeaderLine={false}>
          <View style={styles.heroText}>
            <Text style={styles.heroLabel}>Good Morning,</Text>
            <Text style={styles.heroTitle}>LifeCare Blood Bank</Text>
            <Text style={styles.heroDesc}>
              Here is your vital overview for today. High demand for O- and A+ reported in your region.
            </Text>
          </View>
        </Card>

        {/* Stats Bento Grid */}
        <View style={styles.grid}>
          {/* Total Stock */}
          <View style={styles.gridCard}>
            <View style={styles.gridCardLeft}>
              <Text style={styles.gridLabel}>Total Stock</Text>
              <Text style={styles.gridValue}>1,246</Text>
              <Text style={styles.gridSub}>All Blood Types</Text>
            </View>
            <View style={styles.gridIconWrapper}>
              <Ionicons name="cube-outline" size={20} color={colors.secondary} />
            </View>
          </View>

          {/* Pending Requests */}
          <View style={styles.gridCard}>
            <View style={styles.gridCardLeft}>
              <Text style={styles.gridLabel}>Pending Requests</Text>
              <Text style={styles.gridValue}>12</Text>
              <Text style={[styles.gridSub, { color: colors.secondary, fontWeight: '700' }]}>Need Response</Text>
            </View>
            <View style={styles.gridIconWrapper}>
              <Ionicons name="hourglass-outline" size={20} color={colors.secondary} />
            </View>
          </View>

          {/* Low Stock Alerts */}
          <View style={styles.gridCard}>
            <View style={styles.gridCardLeft}>
              <Text style={styles.gridLabel}>Low Stock Alerts</Text>
              <Text style={[styles.gridValue, { color: colors.secondary }]}>5</Text>
              <Text style={[styles.gridSub, { color: colors.secondary, fontWeight: '700' }]}>Need Attention</Text>
            </View>
            <View style={styles.gridIconWrapper}>
              <Ionicons name="warning-outline" size={20} color={colors.secondary} />
            </View>
          </View>

          {/* Completed Donations */}
          <View style={styles.gridCard}>
            <View style={styles.gridCardLeft}>
              <Text style={styles.gridLabel}>Today's Donations</Text>
              <Text style={styles.gridValue}>8</Text>
              <Text style={styles.gridSub}>Completed</Text>
            </View>
            <View style={styles.gridIconWrapper}>
              <Ionicons name="heart-outline" size={20} color={colors.secondary} />
            </View>
          </View>
        </View>

        {/* Recent Requests Section */}
        <View style={styles.requestsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Requests</Text>
            <TouchableOpacity onPress={() => Alert.alert('History Log', 'Redirecting to central dispatch archives...')}>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={requests}
            renderItem={renderRequestItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.listContainer}
          />
        </View>

        {/* Chat Bot Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => Alert.alert('Chat Bot', 'Initializing MedBridge AI Neural Coordinator assistant...')}
          style={styles.chatBotBtn}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.secondary} />
          <Text style={styles.chatBotText}>AI Chat Coordinator</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Floating Add Request Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleAddRequest}
        style={styles.fab}
      >
        <Ionicons name="add" size={28} color={colors.textLight} />
      </TouchableOpacity>
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
  headerLabel: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  headerName: {
    ...typography.styles.headlineMd,
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: '700',
    maxWidth: 180,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  notifBtn: {
    position: 'relative',
    padding: 4,
  },
  notifBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.secondary,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifBadgeText: {
    color: colors.textLight,
    fontSize: 9,
    fontWeight: '700',
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
  heroCard: {
    backgroundColor: colors.secondary, // Red card
    borderWidth: 0,
    marginBottom: spacing.md,
  },
  heroText: {
    paddingVertical: spacing.xs,
  },
  heroLabel: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  heroTitle: {
    ...typography.styles.headlineLg,
    fontSize: 26,
    color: colors.textLight,
    fontWeight: '800',
    marginTop: 2,
  },
  heroDesc: {
    ...typography.styles.bodySm,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: spacing.sm,
    lineHeight: 18,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  gridCard: {
    width: '47.5%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.borderRadius.sm,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 100,
  },
  gridCardLeft: {
    flex: 1,
    justifyContent: 'space-between',
  },
  gridLabel: {
    ...typography.styles.labelSm,
    fontSize: 9,
    fontFamily: typography.fontFamilyLabel,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  gridValue: {
    ...typography.styles.headlineLg,
    fontSize: 24,
    color: colors.primary,
    fontWeight: '800',
  },
  gridSub: {
    ...typography.styles.bodySm,
    fontSize: 9,
    color: colors.textMuted,
  },
  gridIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: 'rgba(187, 0, 20, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestsSection: {
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.styles.headlineMd,
    fontSize: 18,
    color: colors.primary,
    fontWeight: '700',
  },
  viewAllText: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: colors.primary,
    fontWeight: '700',
  },
  listContainer: {
    gap: spacing.sm,
  },
  requestCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: 0,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 22, 59, 0.04)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTextContainer: {
    flex: 1,
  },
  requestTitle: {
    ...typography.styles.labelSm,
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 13,
  },
  requestSub: {
    ...typography.styles.bodySm,
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  requestTime: {
    ...typography.styles.bodySm,
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: spacing.borderRadius.sm,
  },
  statusBadgeText: {
    ...typography.styles.labelSm,
    fontSize: 9,
    fontFamily: typography.fontFamilyLabel,
    fontWeight: '700',
  },
  statusBadge_matching: {
    backgroundColor: 'rgba(187, 0, 20, 0.08)',
  },
  statusBadgeText_matching: {
    color: colors.secondary,
  },
  statusBadge_reserved: {
    backgroundColor: 'rgba(0, 22, 59, 0.08)',
  },
  statusBadgeText_reserved: {
    color: colors.primary,
  },
  statusBadge_complete: {
    backgroundColor: '#eff6ff',
  },
  statusBadgeText_complete: {
    color: colors.primary,
  },
  chatBotBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.borderRadius.sm,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  chatBotText: {
    ...typography.styles.labelSm,
    fontFamily: typography.fontFamilyLabel,
    color: colors.secondary,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
});
