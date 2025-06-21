
import { getAuth, User } from 'firebase/auth';

export const getCurrentUser = (): User | null => {
  const auth = getAuth();
  const user = auth.currentUser;
  console.log('getCurrentUser called - user:', user ? { uid: user.uid, email: user.email } : null);
  console.log('Auth state ready:', auth.currentUser !== undefined);
  return user;
};

export const requireAuth = (): User => {
  const user = getCurrentUser();
  if (!user) {
    console.error('CRITICAL: Authentication check failed - user is null');
    console.log('Auth object:', getAuth());
    console.log('Current user from auth:', getAuth().currentUser);
    throw new Error('User not authenticated. Please log in to continue.');
  }
  console.log('✅ Authentication check passed for user:', { uid: user.uid, email: user.email });
  return user;
};

export const isAuthenticated = (): boolean => {
  const auth = getAuth();
  const user = auth.currentUser;
  const isAuth = !!user;
  console.log('🔍 isAuthenticated check:', {
    hasUser: isAuth,
    userUid: user?.uid,
    userEmail: user?.email,
    authReady: auth.currentUser !== undefined
  });
  return isAuth;
};

// Enhanced function to wait for auth state to be ready
export const waitForAuth = (): Promise<User | null> => {
  console.log('⏳ waitForAuth: Starting to wait for auth state...');
  return new Promise((resolve) => {
    const auth = getAuth();
    
    // If auth is already ready, resolve immediately
    if (auth.currentUser !== undefined) {
      console.log('✅ waitForAuth: Auth state already ready:', auth.currentUser ? 'User logged in' : 'No user');
      resolve(auth.currentUser);
      return;
    }
    
    console.log('⏳ waitForAuth: Setting up auth state listener...');
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log('🔄 waitForAuth: Auth state changed:', user ? { uid: user.uid, email: user.email } : 'No user');
      unsubscribe();
      resolve(user);
    });
  });
};

// Enhanced require auth that waits for auth state
export const requireAuthAsync = async (): Promise<User> => {
  console.log('🔐 requireAuthAsync: Starting async auth check...');
  const user = await waitForAuth();
  if (!user) {
    console.error('❌ requireAuthAsync: No user found after waiting');
    throw new Error('User not authenticated. Please log in to continue.');
  }
  console.log('✅ requireAuthAsync: User authenticated:', { uid: user.uid, email: user.email });
  return user;
};

// New function specifically for critical operations
export const ensureAuthenticated = async (): Promise<User> => {
  console.log('🚨 ensureAuthenticated: Critical auth check starting...');
  
  // First try immediate check
  const immediateUser = getCurrentUser();
  if (immediateUser) {
    console.log('✅ ensureAuthenticated: Immediate auth success');
    return immediateUser;
  }
  
  console.log('⚠️ ensureAuthenticated: No immediate user, waiting for auth state...');
  
  // Wait for auth state to be ready
  const user = await waitForAuth();
  if (!user) {
    console.error('❌ ensureAuthenticated: CRITICAL - No user after waiting');
    throw new Error('User not authenticated. Please log in to continue.');
  }
  
  console.log('✅ ensureAuthenticated: Success after waiting');
  return user;
};
