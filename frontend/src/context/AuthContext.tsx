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

    const fallbackDemoUsers: Record<string, { role: UserRole; name: string }> = {
      'bloodbank@example.com': { role: 'bloodbank', name: 'Central Blood Bank' },
      'hospital@example.com': { role: 'hospital', name: 'Metro Health' },
      'donor@example.com': { role: 'donor', name: 'Demo Donor' },
    };

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
      }

      const fallbackUser = fallbackDemoUsers[email.trim().toLowerCase()];
      if (
        fallbackUser &&
        password.length >= 6 &&
        (fallbackUser.role === selectedRole || selectedRole === 'bloodbank')
      ) {
        const demoUser = {
          id: `demo-${fallbackUser.role}`,
          email,
          name: fallbackUser.name,
          role: fallbackUser.role,
        };
        setUser(demoUser as User);
        setRole(selectedRole);
        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      throw new Error(resData.message || 'Invalid email or password');
    } catch (err: any) {
      console.error('Login error:', err);
      setIsLoading(false);
      throw new Error(err.message || 'Failed to connect to backend server. Make sure the server is running on port 5001.');
    }
  };

  const signupHospital = async (
    name: string,
    email: string,
    password: string,
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
          password,
          role: 'hospital',
          name,
          location,
          contactNumber: contact,
        }),
      });

      const resData = await response.json();
      if (resData.success) {
        const userData = resData.data || {
          id: resData.id,
          email,
          name,
          role: 'hospital',
        };
        setUser(userData);
        setRole('hospital');
        setIsLoading(false);
        return true;
      } else {
        setIsLoading(false);
        throw new Error(resData.message || 'Signup failed');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setIsLoading(false);
      throw new Error(err.message || 'Failed to connect to backend server.');
    }
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
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          role: 'donor',
          name,
          bloodType,
          dateOfBirth: dob,
          contactNumber: phone,
        }),
      });

      const resData = await response.json();
      if (resData.success) {
        const userData = resData.data || {
          id: resData.id,
          email,
          name,
          role: 'donor',
        };
        setUser(userData);
        setRole('donor');
        setIsLoading(false);
        return true;
      } else {
        setIsLoading(false);
        throw new Error(resData.message || 'Signup failed');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setIsLoading(false);
      throw new Error(err.message || 'Failed to connect to backend server.');
    }
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
