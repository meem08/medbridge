import React, { createContext, useState, useContext, ReactNode } from 'react';
import { BloodRequest, UrgencyLevel, RequestStatus } from '../models/bloodRequest';
import { BloodType } from '../models/user';
import { BloodInventory } from '../models/inventory';

interface BloodContextType {
  inventory: BloodInventory;
  requests: BloodRequest[];
  createBloodRequest: (
    bloodType: BloodType,
    units: number,
    urgency: UrgencyLevel,
    deliveryLocation: string,
    notes?: string
  ) => Promise<string>;
  updateRequestStatus: (requestId: string, status: RequestStatus) => void;
  triggerMockDeliveryFlow: (requestId: string) => void;
}

const BloodContext = createContext<BloodContextType | undefined>(undefined);

// Initial Mock Inventory
const initialInventory: BloodInventory = {
  'O+': { bloodType: 'O+', units: 0, minRequired: 15, lastUpdated: new Date().toISOString() },
  'O-': { bloodType: 'O-', units: 0, minRequired: 10, lastUpdated: new Date().toISOString() },
  'A+': { bloodType: 'A+', units: 0, minRequired: 15, lastUpdated: new Date().toISOString() },
  'A-': { bloodType: 'A-', units: 0, minRequired: 10, lastUpdated: new Date().toISOString() },
  'B+': { bloodType: 'B+', units: 0, minRequired: 10, lastUpdated: new Date().toISOString() },
  'B-': { bloodType: 'B-', units: 0, minRequired: 8, lastUpdated: new Date().toISOString() },
  'AB+': { bloodType: 'AB+', units: 0, minRequired: 8, lastUpdated: new Date().toISOString() },
  'AB-': { bloodType: 'AB-', units: 0, minRequired: 5, lastUpdated: new Date().toISOString() },
};

// Initial Mock Requests
const initialRequests: BloodRequest[] = [];

const API_URL = 'http://localhost:5001/api';

export const BloodProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [inventory, setInventory] = useState<BloodInventory>(initialInventory);
  const [requests, setRequests] = useState<BloodRequest[]>(initialRequests);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchInventory = async () => {
    try {
      const response = await fetch(`${API_URL}/inventory`);
      const resData = await response.json();
      if (resData.success && resData.data) {
        const invObj = {} as BloodInventory;
        resData.data.forEach((item: any) => {
          invObj[item.bloodType as BloodType] = {
            bloodType: item.bloodType as BloodType,
            units: item.units,
            minRequired: item.minRequired,
            lastUpdated: new Date().toISOString(),
          };
        });
        setInventory(invObj);
      }
    } catch (err) {
      console.error('Error fetching inventory:', err);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await fetch(`${API_URL}/requests`);
      const resData = await response.json();
      if (resData.success && resData.data) {
        const mapped = resData.data.map((req: any) => ({
          id: req.id,
          hospitalId: 'hosp_1',
          hospitalName: req.hospitalName,
          bloodType: req.bloodType as BloodType,
          units: req.units,
          urgency: req.urgency as UrgencyLevel,
          status: req.status as RequestStatus,
          createdAt: req.createdAt,
          deliveryLocation: req.location,
          eta: req.eta || undefined,
          notes: req.explanation || undefined,
        }));
        setRequests(mapped);
      }
    } catch (err) {
      console.error('Error fetching requests:', err);
    }
  };

  React.useEffect(() => {
    fetchInventory();
    fetchRequests();
  }, []);

  const createBloodRequest = async (
    bloodType: BloodType,
    units: number,
    urgency: UrgencyLevel,
    deliveryLocation: string,
    notes?: string
  ): Promise<string> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bloodType,
          units,
          urgency,
          hospitalName: 'Metro Health Medical Center',
          location: deliveryLocation,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        await fetchRequests();
        await fetchInventory();
        setIsLoading(false);
        return resData.data.id;
      }
    } catch (err) {
      console.error('Error creating blood request:', err);
    }
    setIsLoading(false);
    return 'req_' + Date.now();
  };

  const updateRequestStatus = async (requestId: string, status: RequestStatus) => {
    try {
      const response = await fetch(`${API_URL}/requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const resData = await response.json();
      if (resData.success) {
        await fetchRequests();
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const triggerMockDeliveryFlow = async (requestId: string) => {
    try {
      // 1. Shift to matching locally first
      setRequests((prev) =>
        prev.map((req) => (req.id === requestId ? { ...req, status: 'matching' as RequestStatus } : req))
      );

      // 2. Call backend AI matchmaker
      const response = await fetch(`${API_URL}/ai/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId }),
      });

      const resData = await response.json();
      if (resData.success) {
        await fetchRequests();
        await fetchInventory();
      }
    } catch (err) {
      console.error('Error triggering AI match flow:', err);
    }
  };

  return (
    <BloodContext.Provider
      value={{
        inventory,
        requests,
        createBloodRequest,
        updateRequestStatus,
        triggerMockDeliveryFlow,
      }}
    >
      {children}
    </BloodContext.Provider>
  );
};

export const useBlood = () => {
  const context = useContext(BloodContext);
  if (context === undefined) {
    throw new Error('useBlood must be used within a BloodProvider');
  }
  return context;
};
