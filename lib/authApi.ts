import { apiClient } from './apiClient';

export const getUser = () => apiClient.get('/user/get');
export const editUser = (data: any) => apiClient.patch('/user/edit', data);
export const logoutApi = () => apiClient.post('/auth/logout');