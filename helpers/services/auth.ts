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

import { store } from '@/store/store';

export const getToken = (): string | null => {
  // First check Redux store
  const state = store.getState();
  if (state.auth.token) {
    return state.auth.token;
  }

  // Fallback to localStorage
  const token = localStorage.getItem('token');
  if (token) {
    // Sync with Redux store
    store.dispatch({ type: 'auth/setToken', payload: token });
    return token;
  }

  return null;
};

export const saveAuthStorage = ({ token, user }: { token: string; user: any }) => {
  // Save to localStorage
  if (token) {
    localStorage.setItem('token', token);
  }
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Sync with Redux store
  store.dispatch({ type: 'auth/setToken', payload: token });
  store.dispatch({ type: 'auth/setUser', payload: user });
};

export const clearAuthStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  store.dispatch({ type: 'auth/clearAuth' });
};

export const getStorageUser = () => {
  const usr = localStorage.getItem('user');
  return usr ? JSON.parse(localStorage.getItem('user')) : null;
};
