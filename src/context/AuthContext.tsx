import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, UserRole, Hospital, Donor } from '../models/user';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isLoading: boolean;
  login: (email: string, role: UserRole) => Promise<boolean>;
  signupHospital: (name: string, email: string, location: string, contact: string) => Promise<boolean>;
  signupDonor: (name: string, email: string, bloodType: any, dob: string, phone: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (email: string, selectedRole: UserRole): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockUser: User = {
      id: selectedRole === 'hospital' ? 'hosp_1' : 'donor_1',
      name: selectedRole === 'hospital' ? 'Metro Health Medical Center' : 'Tinashe Pharaoh',
      email: email,
      role: selectedRole,
    };

    setUser(mockUser);
    setRole(selectedRole);
    setIsLoading(false);
    return true;
  };

  const signupHospital = async (
    name: string,
    email: string,
    location: string,
    contact: string
  ): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockHospital: Hospital = {
      id: 'hosp_' + Date.now(),
      name,
      email,
      role: 'hospital',
      location,
      contactNumber: contact,
      licenseNumber: 'HOSP-' + Math.floor(Math.random() * 100000),
    };

    setUser(mockHospital);
    setRole('hospital');
    setIsLoading(false);
    return true;
  };

  const signupDonor = async (
    name: string,
    email: string,
    bloodType: any,
    dob: string,
    phone: string
  ): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockDonor: Donor = {
      id: 'donor_' + Date.now(),
      name,
      email,
      role: 'donor',
      bloodType,
      dateOfBirth: dob,
      phone,
      isEligible: true,
    };

    setUser(mockDonor);
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
