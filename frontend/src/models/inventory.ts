import { BloodType } from './user';

export interface BloodInventoryItem {
  bloodType: BloodType;
  units: number;
  minRequired: number; // Threshold below which inventory is flagged as 'low'
  lastUpdated: string;
}

export type BloodInventory = Record<BloodType, BloodInventoryItem>;
