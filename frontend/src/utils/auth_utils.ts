// Guest ID generator to associate guest links to current browser
export const getOrCreateGuestId = (): string => {
  let guestId = localStorage.getItem('sniplink_guest_id');
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('sniplink_guest_id', guestId);
  }
  return guestId;
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('sniplink_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('sniplink_token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('sniplink_token');
};
