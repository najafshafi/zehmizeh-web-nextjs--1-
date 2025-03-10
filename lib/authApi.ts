// import { apiClient } from './apiClient';
import { apiClient } from "@/helpers/http/index";

export const getUser = () => apiClient.get('/user/get');
export const logoutApi = () => apiClient.post('/auth/logout');