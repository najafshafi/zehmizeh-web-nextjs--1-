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

export const saveAuthStorage = ({
  token,
  user,
}: {
  token: string;
  user: any;
}) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const getToken = () => {
  return localStorage.getItem('token');
};
export const getStorageUser = () => {
  const usr = localStorage.getItem('user');
  return usr ? JSON.parse(localStorage.getItem('user')) : null;
};
