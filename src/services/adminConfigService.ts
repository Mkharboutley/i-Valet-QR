import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { getFirestoreInstance } from './firebase';
import { requireAuth } from './authUtils';
import { Driver, ETAConfig } from '../types/AdminConfig';

const ADMIN_CONFIG_COLLECTION = 'admin_config';
const DRIVERS_COLLECTION = 'drivers';
const ETA_CONFIG_DOC = 'eta_settings';

const getFirestore = () => getFirestoreInstance();

// Helper function to handle permission errors gracefully
const handlePermissionError = (error: any, operation: string) => {
  if (error.code === 'permission-denied') {
    console.warn(`Permission denied for ${operation}. Using fallback data.`);
    return null;
  }
  throw error;
};

// Driver Management
export {
  addDriver,
  getDrivers,
  updateDriverAvailability,
  removeDriver,
  subscribeToDrivers
} from './driverService';

// ETA Configuration
export {
  getETAConfig,
  updateETAConfig,
  subscribeToETAConfig
} from './etaConfigService';

// Keep legacy exports for backward compatibility
// This ensures existing imports continue to work
