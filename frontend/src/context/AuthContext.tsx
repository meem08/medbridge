import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, UserRole, Hospital, Donor, BloodBank } from '../models/user';

const API_URL = 'http://localhost:5001/api';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  signupHospital: (name: string, email: string, location: string, contact: string) => Promise<boolean>;
  signupDonor: (name: string, email: string, bloodType: any, dob: string, phone: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (email: string, password: string, selectedRole: UserRole): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: selectedRole }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setUser(resData.data);
        setRole(selectedRole);
        setIsLoading(false);
        return true;
      } else {
        alert(resData.message || 'Login failed');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      alert('Failed to connect to backend server. Make sure the server is running on port 5001.');
    }
    setIsLoading(false);
    return false;
  };

  const signupHospital = async (
    name: string,
    email: string,
    location: string,
    contact: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: 'password123',
          role: 'hospital',
          name,
          location,
          contactNumber: contact,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setUser(resData.data);
        setRole('hospital');
        setIsLoading(false);
        return true;
      } else {
        alert(resData.message || 'Signup failed');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      alert('Failed to connect to backend server.');
    }
    setIsLoading(false);
    return false;
  };

  const signupDonor = async (
    name: string,
    email: string,
    bloodType: any,
    dob: string,
    phone: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: 'password123',
          role: 'donor',
          name,
          bloodType,
          dateOfBirth: dob,
          contactNumber: phone,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setUser(resData.data);
        setRole('donor');
        setIsLoading(false);
        return true;
      } else {
        alert(resData.message || 'Signup failed');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      alert('Failed to connect to backend server.');
    }
    setIsLoading(false);
    return false;
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
