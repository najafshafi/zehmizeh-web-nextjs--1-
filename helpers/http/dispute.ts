import { apiClient } from './index';

export const manageDispute = (formData: any) => {
  return apiClient
    .post(`/job/manage-dispute`, formData)
    .then((res) => res.data);
};

export const postGeneralInquiry = (formData: any) => {
  return apiClient.post(`/user/inquiry/save`, formData).then((res) => res.data);
};

export const getDisputeDetails = ({ queryKey }: { queryKey: any[] }) => {
  /*
   * This is an api to get the the support details
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, id] = queryKey;
  const payload = {
    dispute_id: id,
  };
  return apiClient
    .post(`/admin/support/get-details`, payload)
    .then((res) => {
      if (res.data.status) {
        return res.data.data;
      } else {
        throw new Error(res.data.message);
      }
    })
    .catch((err) => {
      throw new Error(err);
    });
};
