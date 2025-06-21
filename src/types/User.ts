
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'employee' | 'client';
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}
