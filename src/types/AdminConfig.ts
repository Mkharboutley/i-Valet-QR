
import { Timestamp } from 'firebase/firestore';

export interface Driver {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ETAConfig {
  defaultETA: number; // Changed from 'defaultDeliveryTimeMinutes' to 'defaultETA'
  preAlertMarginMinutes: number;
  updatedAt: Timestamp;
  updatedBy: string;
}

export interface AdminConfig {
  etaConfig: ETAConfig;
  drivers: Driver[];
}
