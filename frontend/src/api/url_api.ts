import { getOrCreateGuestId, getAuthToken } from '../utils/auth_utils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_V1 = `${API_BASE_URL}/api/v1`;

const getHeaders = (extraHeaders: Record<string, string> = {}) => {
  const token = getAuthToken();
  const guestId = getOrCreateGuestId();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-guest-id': guestId,
    ...extraHeaders,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

export const shortenUrl = async (longUrl: string, customAlias?: string) => {
  const guestId = getOrCreateGuestId();
  const body: { longUrl: string; customAlias?: string; guestId: string } = {
    longUrl,
    guestId,
  };

  if (customAlias && customAlias.trim()) {
    body.customAlias = customAlias.trim();
  }

  const res = await fetch(`${API_V1}/url/shorten`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to shorten URL');
  }

  return res.json();
};

export const getStats = async (shortCode: string) => {
  const res = await fetch(`${API_V1}/url/stats/${shortCode}`, {
    headers: getHeaders(),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to fetch stats');
  }

  return res.json();
};

export const getAllUrls = async () => {
  const res = await fetch(`${API_V1}/url/getAllUrls`, {
    headers: getHeaders(),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to fetch all URLs');
  }

  return res.json();
};

export const deleteUrl = async (shortCode: string) => {
  const res = await fetch(`${API_V1}/url/${shortCode}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to delete URL');
  }

  return res.json();
};

export const getStatsSummary = async () => {
  const res = await fetch(`${API_V1}/url/stats/summary`, {
    headers: getHeaders(),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to fetch stats summary');
  }

  return res.json();
};

// Auth API Calls
export const registerApi = async (name: string, email: string, password: string) => {
  const guestId = getOrCreateGuestId();
  const res = await fetch(`${API_V1}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, guestId }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Registration failed');
  }

  return res.json();
};

export const loginApi = async (email: string, password: string) => {
  const guestId = getOrCreateGuestId();
  const res = await fetch(`${API_V1}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, guestId }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Login failed');
  }

  return res.json();
};

export const getMeApi = async () => {
  const res = await fetch(`${API_V1}/auth/me`, {
    headers: getHeaders(),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to fetch user profile');
  }

  return res.json();
};

export const updateProfileApi = async (profileData: {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}) => {
  const res = await fetch(`${API_V1}/auth/profile`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(profileData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to update profile');
  }

  return res.json();
};
