export const getToken = () => localStorage.getItem('token');
export const saveAuthStorage = ({ token, user }: { token: string; user: any }) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};