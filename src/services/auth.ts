import Cookies from 'js-cookie';

/**
 * Check if the user is currently logged in
 * @returns {boolean} True if the user is logged in, false otherwise
 */
export const isLoggedIn = (): boolean => {
  const authToken = Cookies.get('authToken');
  const loggedInCookie = Cookies.get('isLoggedIn');
  return authToken != null && loggedInCookie === 'true';
};

/**
 * Get the current user's auth token
 * @returns {string|null} The auth token or null if not logged in
 */
export const getAuthToken = (): string | null => {
  return Cookies.get('authToken') || null;
};

/**
 * Get the current user's information from localStorage
 * @returns {object|null} The user object or null if not logged in
 */
export const getCurrentUser = (): any => {
  if (!isLoggedIn()) return null;

  const userData = localStorage.getItem('user');
  if (!userData) return null;

  try {
    return JSON.parse(userData);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

export const getCurrentUserId = (): string | null => {
  const user = getCurrentUser();
  return user ? user.id : null;
};

/**
 * Log the user out by removing cookies and localStorage data
 */
export const logout = (): void => {
  // Clear cookies
  Cookies.remove('authToken');
  Cookies.remove('isLoggedIn');

  // Clear localStorage
  localStorage.removeItem('user');

  // Trigger storage event to update header
  window.dispatchEvent(new Event('storage'));
};
