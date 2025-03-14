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

const isBrowser = typeof window !== 'undefined';

export const saveAuthStorage = ({
  token,
  user,
}: {
  token: string;
  user: User;
}) => {
  if (isBrowser) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export const getToken = () => {
  if (!isBrowser) return null;
  return localStorage.getItem('token');
};

export const getStorageUser = () => {
  if (!isBrowser) return null;
  const usr = localStorage.getItem('user');
  return usr ? JSON.parse(usr) : null;
};
