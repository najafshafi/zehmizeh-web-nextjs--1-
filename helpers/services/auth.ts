/**
 * This represents some generic auth provider API, like Firebase.
 */
const fakeAuth = {
  isAuthenticated: false,
  signin(callback: VoidFunction) {
    this.isAuthenticated = true;
    setTimeout(callback, 100);
  },
  signout(callback: VoidFunction) {
    this.isAuthenticated = false;
    setTimeout(callback, 100);
  },
};

export { fakeAuth };

interface User {
  id: string;
  email: string;
  [key: string]: any;
}

// Safe check for browser environment
const isBrowser = () => typeof window !== "undefined";

export const saveAuthStorage = ({
  token,
  user,
}: {
  token: string;
  user: User;
}) => {
  if (!isBrowser()) return;

  try {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.error("Error saving auth data to localStorage:", error);
  }
};

export const getToken = (): string | null => {
  if (!isBrowser()) return null;

  try {
    return localStorage.getItem("token");
  } catch (error) {
    console.error("Error getting token from localStorage:", error);
    return null;
  }
};

export const getStorageUser = (): User | null => {
  if (!isBrowser()) return null;

  try {
    const usr = localStorage.getItem("user");
    return usr ? JSON.parse(usr) : null;
  } catch (error) {
    console.error("Error getting user from localStorage:", error);
    return null;
  }
};

export const clearAuthStorage = () => {
  if (!isBrowser()) return;

  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_expiration");
  } catch (error) {
    console.error("Error clearing auth storage:", error);
  }
};

// Utility functions for testing token refresh

// Force token expiration for testing purposes
export const forceTokenExpiration = () => {
  if (!isBrowser()) return;

  try {
    // Set token expiration to 5 seconds from now
    const expirationTime = Date.now() + 5 * 1000;
    localStorage.setItem("token_expiration", expirationTime.toString());
    console.log("Token will expire in 5 seconds");
  } catch (error) {
    console.error("Error forcing token expiration:", error);
  }
};

// Check if token is expired
export const isTokenExpired = (): boolean => {
  if (!isBrowser()) return false;

  try {
    const expiration = localStorage.getItem("token_expiration");
    if (!expiration) return false;

    return Date.now() > parseInt(expiration, 10);
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return false;
  }
};

// Get time remaining until token expires (in seconds)
export const getTokenTimeRemaining = (): number | null => {
  if (!isBrowser()) return null;

  try {
    const expiration = localStorage.getItem("token_expiration");
    if (!expiration) return null;

    const expirationTime = parseInt(expiration, 10);
    const timeRemaining = Math.floor((expirationTime - Date.now()) / 1000);

    return timeRemaining > 0 ? timeRemaining : 0;
  } catch (error) {
    console.error("Error getting token time remaining:", error);
    return null;
  }
};
