import { BloodType } from './user';

export type UrgencyLevel = 'critical' | 'urgent' | 'normal';
export type RequestStatus = 'pending' | 'matching' | 'matched' | 'in-transit' | 'delivered' | 'cancelled';

export interface BloodRequest {
  id: string;
  hospitalId: string;
  hospitalName: string;
  bloodType: BloodType;
  units: number;
  urgency: UrgencyLevel;
  status: RequestStatus;
  createdAt: string;
  matchedDonorId?: string;
  matchedDonorName?: string;
  eta?: string; // Estimated time of arrival (e.g. '15 mins')
  deliveryLocation: string;
  notes?: string;
}
