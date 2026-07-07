import { RequestStatus, UrgencyLevel } from '../models/bloodRequest';

/**
 * Formats a Date object or ISO string into a human-readable format.
 * Example: "Oct 12, 2026 at 14:32"
 */
export const formatDate = (dateInput: Date | string): string => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return 'Invalid Date';

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };
  return date.toLocaleDateString('en-US', options);
};

/**
 * Maps urgency levels to localized display titles.
 */
export const formatUrgency = (urgency: UrgencyLevel): string => {
  switch (urgency) {
    case 'critical':
      return 'CRITICAL URGENT';
    case 'urgent':
      return 'URGENT';
    case 'normal':
      return 'NORMAL ROUTINE';
    default:
      return urgency;
  }
};

/**
 * Maps request status to localized display titles.
 */
export const formatStatus = (status: RequestStatus): string => {
  switch (status) {
    case 'pending':
      return 'Pending AI Matching';
    case 'matching':
      return 'Matching Donors';
    case 'matched':
      return 'Donor Matched';
    case 'in-transit':
      return 'In Transit';
    case 'delivered':
      return 'Delivered';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
};
