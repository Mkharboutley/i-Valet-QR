
import { getCurrentUser } from './authUtils';

export const getUserRole = async (): Promise<'admin' | 'user' | null> => {
  try {
    const user = getCurrentUser();
    if (!user) return null;
    
    // First, try to get role from custom claims
    const idTokenResult = await user.getIdTokenResult();
    const role = idTokenResult.claims.role as string;
    
    if (role === 'admin') {
      return 'admin';
    }
    
    // Fallback: Check if email indicates admin status
    const adminEmails = ['admin@ivalet.com']; // Add more admin emails here as needed
    if (adminEmails.includes(user.email || '')) {
      console.log('User identified as admin via email:', user.email);
      return 'admin';
    }
    
    // Default to user role
    return 'user';
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'user'; // Default to user role on error
  }
};

export const isAdmin = async (): Promise<boolean> => {
  const role = await getUserRole();
  return role === 'admin';
};
