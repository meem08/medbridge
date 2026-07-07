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
  'O+': { bloodType: 'O+', units: 42, minRequired: 15, lastUpdated: new Date().toISOString() },
  'O-': { bloodType: 'O-', units: 4, minRequired: 10, lastUpdated: new Date().toISOString() }, // LOW
  'A+': { bloodType: 'A+', units: 28, minRequired: 15, lastUpdated: new Date().toISOString() },
  'A-': { bloodType: 'A-', units: 9, minRequired: 10, lastUpdated: new Date().toISOString() },  // LOW
  'B+': { bloodType: 'B+', units: 19, minRequired: 10, lastUpdated: new Date().toISOString() },
  'B-': { bloodType: 'B-', units: 12, minRequired: 8, lastUpdated: new Date().toISOString() },
  'AB+': { bloodType: 'AB+', units: 15, minRequired: 8, lastUpdated: new Date().toISOString() },
  'AB-': { bloodType: 'AB-', units: 2, minRequired: 5, lastUpdated: new Date().toISOString() },  // LOW
};

// Initial Mock Requests
const initialRequests: BloodRequest[] = [
  {
    id: 'req_1',
    hospitalId: 'hosp_1',
    hospitalName: 'St. Jude Hospital',
    bloodType: 'O-',
    units: 5,
    urgency: 'critical',
    status: 'in-transit',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    matchedDonorName: 'Sarah Jenkins',
    matchedDonorId: 'donor_2',
    eta: '12 mins',
    deliveryLocation: 'St. Jude ER Department, Wing B',
    notes: 'Emergency traffic accident victim, massive transfusion protocol initiated.',
  },
  {
    id: 'req_2',
    hospitalId: 'hosp_1',
    hospitalName: 'St. Jude Hospital',
    bloodType: 'A+',
    units: 3,
    urgency: 'normal',
    status: 'delivered',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    matchedDonorName: 'David Lee',
    matchedDonorId: 'donor_3',
    deliveryLocation: 'St. Jude Blood Bank',
    notes: 'Restocking safety buffer.',
  },
];

export const BloodProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [inventory, setInventory] = useState<BloodInventory>(initialInventory);
  const [requests, setRequests] = useState<BloodRequest[]>(initialRequests);

  const createBloodRequest = async (
    bloodType: BloodType,
    units: number,
    urgency: UrgencyLevel,
    deliveryLocation: string,
    notes?: string
  ): Promise<string> => {
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    const requestId = 'req_' + Date.now();
    const newRequest: BloodRequest = {
      id: requestId,
      hospitalId: 'hosp_1',
      hospitalName: 'Metro Health Medical Center',
      bloodType,
      units,
      urgency,
      status: 'pending',
      createdAt: new Date().toISOString(),
      deliveryLocation,
      notes,
    };

    setRequests((prev) => [newRequest, ...prev]);

    // Also deduct units from local inventory if it's hospital side or adjust state
    setInventory((prev: BloodInventory) => {
      const currentItem = prev[bloodType];
      const newUnits = Math.max(0, currentItem.units - units);
      return {
        ...prev,
        [bloodType]: {
          ...currentItem,
          units: newUnits,
          lastUpdated: new Date().toISOString(),
        },
      };
    });

    return requestId;
  };

  const updateRequestStatus = (requestId: string, status: RequestStatus) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status } : req))
    );
  };

  // Helper function to mock the AI matching and transit pipeline automatically
  const triggerMockDeliveryFlow = (requestId: string) => {
    const donorNames = ['Robert Chen', 'Grace Hopper', 'Alan Turing', 'Ada Lovelace'];
    const selectedDonor = donorNames[Math.floor(Math.random() * donorNames.length)];

    // Step 1: Shift to matching immediately
    updateRequestStatus(requestId, 'matching');

    // Step 2: Shift to matched after 3 seconds
    setTimeout(() => {
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId
            ? {
                ...req,
                status: 'matched',
                matchedDonorId: 'donor_mock_' + Math.floor(Math.random() * 100),
                matchedDonorName: selectedDonor,
                eta: '25 mins',
              }
            : req
        )
      );
    }, 3000);

    // Step 3: Shift to in-transit after 6 seconds
    setTimeout(() => {
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId
            ? {
                ...req,
                status: 'in-transit',
                eta: '18 mins',
              }
            : req
        )
      );
    }, 6000);

    // Step 4: Shift to delivered after 12 seconds
    setTimeout(() => {
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId
            ? {
                ...req,
                status: 'delivered',
                eta: undefined,
              }
            : req
        )
      );
    }, 12000);
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
