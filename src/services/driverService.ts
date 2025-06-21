
import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { getFirestoreInstance } from './firebase';
import { requireAuth } from './authUtils';
import { Driver } from '../types/AdminConfig';

const DRIVERS_COLLECTION = 'drivers';

const getFirestore = () => getFirestoreInstance();

// Helper function to handle permission errors gracefully
const handlePermissionError = (error: any, operation: string) => {
  if (error.code === 'permission-denied') {
    console.warn(`Permission denied for ${operation}. Using fallback data.`);
    return null;
  }
  throw error;
};

// Driver Management Functions
export const addDriver = async (driverData: Omit<Driver, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const user = requireAuth();
    const db = getFirestore();
    const driversRef = collection(db, DRIVERS_COLLECTION);
    
    const newDriver = {
      ...driverData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    const docRef = await addDoc(driversRef, newDriver);
    console.log('Driver added with ID:', docRef.id);
    return docRef.id;
  } catch (error: any) {
    console.error('Error adding driver:', error);
    if (error.code === 'permission-denied') {
      throw new Error('You do not have permission to add drivers. Please contact your administrator.');
    }
    throw error;
  }
};

export const getDrivers = async (): Promise<Driver[]> => {
  try {
    const user = requireAuth();
    const db = getFirestore();
    const driversRef = collection(db, DRIVERS_COLLECTION);
    
    const querySnapshot = await getDocs(driversRef);
    const drivers: Driver[] = [];
    
    querySnapshot.forEach((doc) => {
      drivers.push({
        id: doc.id,
        ...doc.data()
      } as Driver);
    });
    
    console.log('Retrieved drivers:', drivers.length);
    return drivers;
  } catch (error: any) {
    console.error('Error getting drivers:', error);
    const fallback = handlePermissionError(error, 'getting drivers');
    if (fallback === null) {
      // Return empty array as fallback for permission errors
      return [];
    }
    throw error;
  }
};

export const updateDriverAvailability = async (driverId: string, isActive: boolean): Promise<void> => {
  try {
    const user = requireAuth();
    const db = getFirestore();
    const driverRef = doc(db, DRIVERS_COLLECTION, driverId);
    
    await updateDoc(driverRef, {
      isActive,
      updatedAt: Timestamp.now()
    });
    
    console.log('Driver availability updated:', driverId, isActive);
  } catch (error: any) {
    console.error('Error updating driver availability:', error);
    if (error.code === 'permission-denied') {
      throw new Error('You do not have permission to update driver availability. Please contact your administrator.');
    }
    throw error;
  }
};

export const removeDriver = async (driverId: string): Promise<void> => {
  try {
    const user = requireAuth();
    const db = getFirestore();
    const driverRef = doc(db, DRIVERS_COLLECTION, driverId);
    
    await deleteDoc(driverRef);
    console.log('Driver removed:', driverId);
  } catch (error: any) {
    console.error('Error removing driver:', error);
    if (error.code === 'permission-denied') {
      throw new Error('You do not have permission to remove drivers. Please contact your administrator.');
    }
    throw error;
  }
};

// Real-time subscription for drivers changes
export const subscribeToDrivers = (callback: (drivers: Driver[]) => void) => {
  try {
    const db = getFirestore();
    const driversRef = collection(db, DRIVERS_COLLECTION);
    
    return onSnapshot(
      driversRef, 
      (querySnapshot) => {
        const drivers: Driver[] = [];
        querySnapshot.forEach((doc) => {
          drivers.push({
            id: doc.id,
            ...doc.data()
          } as Driver);
        });
        callback(drivers);
      },
      (error: any) => {
        console.warn('Drivers subscription error:', error);
        if (error.code === 'permission-denied') {
          console.warn('Permission denied for drivers subscription. Falling back to empty list.');
          // Provide fallback data
          callback([]);
        }
      }
    );
  } catch (error) {
    console.error('Error setting up drivers subscription:', error);
    // Return a no-op unsubscribe function
    return () => {};
  }
};
