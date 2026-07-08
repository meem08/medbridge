import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, UserRole, Hospital, Donor, BloodBank } from '../models/user';
import { API_URL } from '../utils/api';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  signupHospital: (name: string, email: string, password: string, location: string, contact: string) => Promise<boolean>;
  signupDonor: (name: string, email: string, password: string, bloodType: any, dob: string, phone: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (email: string, password: string, selectedRole: UserRole): Promise<boolean> => {
    setIsLoading(true);

    const demoUserMap: Record<UserRole, { name: string }> = {
      bloodbank: { name: 'Central Blood Bank' },
      hospital: { name: 'Metro Health' },
      donor: { name: 'Demo Donor' },
    };

    const demoUser = {
      id: `guest-${selectedRole}`,
      email: email || `${selectedRole}@example.com`,
      name: demoUserMap[selectedRole].name,
      role: selectedRole,
    };

    setUser(demoUser as User);
    setRole(selectedRole);
    setIsLoading(false);
    return true;
  };

  const signupHospital = async (
    name: string,
    email: string,
    password: string,
    location: string,
    contact: string
  ): Promise<boolean> => {
    setIsLoading(true);
    const hospitalUser = {
      id: 'guest-hospital',
      email: email || 'hospital@example.com',
      name: name || 'Hospital User',
      role: 'hospital',
    };
    setUser(hospitalUser as User);
    setRole('hospital');
    setIsLoading(false);
    return true;
  };

  const signupDonor = async (
    name: string,
    email: string,
    password: string,
    bloodType: any,
    dob: string,
    phone: string
  ): Promise<boolean> => {
    setIsLoading(true);
    const donorUser = {
      id: 'guest-donor',
      email: email || 'donor@example.com',
      name: name || 'Donor User',
      role: 'donor',
    };
    setUser(donorUser as User);
    setRole('donor');
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isLoading,
        login,
        signupHospital,
        signupDonor,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
