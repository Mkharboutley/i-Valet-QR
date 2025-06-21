
import {
  doc,
  getDoc,
  setDoc,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { getFirestoreInstance } from './firebase';
import { requireAuth } from './authUtils';
import { ETAConfig } from '../types/AdminConfig';

const ADMIN_CONFIG_COLLECTION = 'admin_config';
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

// ETA Configuration Functions
export const getETAConfig = async (): Promise<ETAConfig> => {
  try {
    const user = requireAuth();
    const db = getFirestore();
    const configRef = doc(db, ADMIN_CONFIG_COLLECTION, ETA_CONFIG_DOC);
    
    const docSnap = await getDoc(configRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as ETAConfig;
    } else {
      // Return default config if none exists
      const defaultConfig: ETAConfig = {
        defaultETA: 10, // Changed from 'defaultDeliveryTimeMinutes' to 'defaultETA'
        preAlertMarginMinutes: 3,
        updatedAt: Timestamp.now(),
        updatedBy: user.uid
      };
      
      // Try to save default config, but don't fail if permission denied
      try {
        await setDoc(configRef, defaultConfig);
      } catch (saveError: any) {
        if (saveError.code === 'permission-denied') {
          console.warn('Cannot save default ETA config due to permissions. Using local default.');
        } else {
          throw saveError;
        }
      }
      
      return defaultConfig;
    }
  } catch (error: any) {
    console.error('Error getting ETA config:', error);
    const fallback = handlePermissionError(error, 'getting ETA config');
    if (fallback === null) {
      // Return default config as fallback for permission errors
      const user = requireAuth();
      return {
        defaultETA: 10, // Changed from 'defaultDeliveryTimeMinutes' to 'defaultETA'
        preAlertMarginMinutes: 3,
        updatedAt: Timestamp.now(),
        updatedBy: user.uid
      };
    }
    throw error;
  }
};

export const updateETAConfig = async (config: Omit<ETAConfig, 'updatedAt' | 'updatedBy'>): Promise<void> => {
  try {
    const user = requireAuth();
    const db = getFirestore();
    const configRef = doc(db, ADMIN_CONFIG_COLLECTION, ETA_CONFIG_DOC);
    
    const updateData: ETAConfig = {
      ...config,
      updatedAt: Timestamp.now(),
      updatedBy: user.uid
    };
    
    await setDoc(configRef, updateData);
    console.log('ETA config updated:', updateData);
  } catch (error: any) {
    console.error('Error updating ETA config:', error);
    if (error.code === 'permission-denied') {
      throw new Error('You do not have permission to update ETA configuration. Please contact your administrator.');
    }
    throw error;
  }
};

// Real-time subscription for ETA config changes
export const subscribeToETAConfig = (callback: (config: ETAConfig) => void) => {
  try {
    const db = getFirestore();
    const configRef = doc(db, ADMIN_CONFIG_COLLECTION, ETA_CONFIG_DOC);
    
    return onSnapshot(
      configRef, 
      (doc) => {
        if (doc.exists()) {
          callback(doc.data() as ETAConfig);
        }
      },
      (error: any) => {
        console.warn('ETA config subscription error:', error);
        if (error.code === 'permission-denied') {
          console.warn('Permission denied for ETA config subscription. Falling back to default.');
          // Provide fallback data
          callback({
            defaultETA: 10, // Changed from 'defaultDeliveryTimeMinutes' to 'defaultETA'
            preAlertMarginMinutes: 3,
            updatedAt: Timestamp.now(),
            updatedBy: 'system'
          });
        }
      }
    );
  } catch (error) {
    console.error('Error setting up ETA config subscription:', error);
    // Return a no-op unsubscribe function
    return () => {};
  }
};
