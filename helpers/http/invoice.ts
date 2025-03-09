import { apiClient } from '.';

export const getInvoice = async (id: string) => {
  const r = await apiClient.get(`payment/invoice/${id}`);
  return r.data;
};
