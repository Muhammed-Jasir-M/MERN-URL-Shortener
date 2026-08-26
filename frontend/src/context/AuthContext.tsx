import React, { useState, useEffect } from 'react';
import type { User } from '../types/types';
import { getMeApi, loginApi, registerApi, updateProfileApi } from '../api/url_api';
import { getAuthToken, setAuthToken, removeAuthToken } from '../utils/auth_utils';
import { AuthContext } from './AuthContextObject';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const userData = await getMeApi();
          setUser(userData);
        } catch (err) {
          console.error('Failed to load user profile:', err);
          removeAuthToken();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const openProfileModal = () => {
    setProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setProfileModalOpen(false);
  };

  const login = async (email: string, pass: string) => {
    const res = await loginApi(email, pass);
    setAuthToken(res.token);
    setUser(res.user);
    closeAuthModal();
  };

  const register = async (name: string, email: string, pass: string) => {
    const res = await registerApi(name, email, pass);
    setAuthToken(res.token);
    setUser(res.user);
    closeAuthModal();
  };

  const updateUserProfile = async (data: { name?: string; email?: string; currentPassword?: string; newPassword?: string }) => {
    const updatedUser = await updateProfileApi(data);
    setUser({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt,
    });
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authModalOpen,
        authMode,
        profileModalOpen,
        openAuthModal,
        closeAuthModal,
        openProfileModal,
        closeProfileModal,
        login,
        register,
        updateUserProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
