import { createContext } from 'react';
import type { User } from '../types/types';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  authModalOpen: boolean;
  authMode: 'login' | 'register';
  profileModalOpen: boolean;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  updateUserProfile: (data: { name?: string; email?: string; currentPassword?: string; newPassword?: string }) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
