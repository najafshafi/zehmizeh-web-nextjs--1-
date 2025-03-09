import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const client = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});