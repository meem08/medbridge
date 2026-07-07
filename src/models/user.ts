export type UserRole = 'donor' | 'hospital' | 'bloodbank';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface Hospital extends User {
  role: 'hospital';
  location: string;
  contactNumber: string;
  licenseNumber: string;
}

export type BloodType = 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-';

export interface Donor extends User {
  role: 'donor';
  bloodType: BloodType;
  dateOfBirth: string;
  phone: string;
  lastDonationDate?: string;
  isEligible: boolean;
}

export interface BloodBank extends User {
  role: 'bloodbank';
  facilityCode: string;
  region: string;
}
