export type UserRole = 'customer' | 'admin' | 'super_admin';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  avatar?: string;
}
