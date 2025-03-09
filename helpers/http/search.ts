import { apiClient } from './index';

export const search = (type: string, body: any) => {
  const searchType = type == 'freelancers' ? 'freelancer' : 'jobs';
  return apiClient.post(`/${searchType}/search`, body).then((res) => res.data);
};

export const toggleBookmarkPost = (job_id: string) => {
  return apiClient.post('/bookmark/post', { job_id }).then((res) => res.data);
};

export const toggleBookmarkUser = (user_id: string) => {
  return apiClient.post('/bookmark/user', { user_id }).then((res) => res.data);
};

export const getRecommendedFreelancers = (body: any) => {
  return apiClient
    .post(`/freelancer/recommended`, body)
    .then((res) => res.data);
};
