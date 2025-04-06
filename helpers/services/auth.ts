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

const isBrowser = typeof window !== "undefined";

export const saveAuthStorage = ({
  token,
  user,
}: {
  token: string;
  user: User;
}) => {
  if (isBrowser) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }
};

export const getToken = () => {
  if (!isBrowser) return null;
  return localStorage.getItem("token");
};

export const getStorageUser = () => {
  if (!isBrowser) return null;
  const usr = localStorage.getItem("user");
  return usr ? JSON.parse(usr) : null;
};

export const clearAuthStorage = () => {
  if (isBrowser) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_expiration");
  }
};

// Utility functions for testing token refresh

// Force token expiration for testing purposes
export const forceTokenExpiration = () => {
  if (isBrowser) {
    // Set token expiration to 5 seconds from now
    const expirationTime = Date.now() + 5 * 1000;
    localStorage.setItem("token_expiration", expirationTime.toString());
    console.log("Token will expire in 5 seconds");
  }
};

// Check if token is expired
export const isTokenExpired = (): boolean => {
  if (!isBrowser) return false;

  const expiration = localStorage.getItem("token_expiration");
  if (!expiration) return false;

  return Date.now() > parseInt(expiration, 10);
};

// Get time remaining until token expires (in seconds)
export const getTokenTimeRemaining = (): number | null => {
  if (!isBrowser) return null;

  const expiration = localStorage.getItem("token_expiration");
  if (!expiration) return null;

  const expirationTime = parseInt(expiration, 10);
  const timeRemaining = Math.floor((expirationTime - Date.now()) / 1000);

  return timeRemaining > 0 ? timeRemaining : 0;
};
