
import { getCurrentUser, isAuthenticated, ensureAuthenticated } from '../../services/authUtils';
import { getUserRole, isAdmin } from '../../services/userRoleUtils';

export const checkAuthentication = () => {
  return isAuthenticated();
};

export const getCurrentAuthUser = () => {
  return getCurrentUser();
};

export const ensureUserAuthenticated = async () => {
  return ensureAuthenticated();
};

export const checkUserRole = async () => {
  return getUserRole();
};

export const checkAdminStatus = async () => {
  return isAdmin();
};
