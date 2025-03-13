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

import { IFreelancerDetails } from '@/helpers/types/freelancer.type';
import { IClientDetails } from '@/helpers/types/client.type';

type User = IFreelancerDetails & IClientDetails;

const isBrowser = typeof window !== 'undefined';

export const saveAuthStorage = ({
  token,
  user,
}: {
  token: string;
  user: User;
}) => {
  if (isBrowser) {
    try {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Error saving auth storage:', error);
    }
  }
};

export const getToken = (): string | null => {
  if (isBrowser) {
    try {
      return localStorage.getItem('token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }
  return null;
};

export const getStorageUser = (): User | null => {
  if (isBrowser) {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting user from storage:', error);
      return null;
    }
  }
  return null;
};

export const clearAuthStorage = () => {
  if (isBrowser) {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error clearing auth storage:', error);
    }
  }
};
