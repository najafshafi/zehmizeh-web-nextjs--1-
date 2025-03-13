import { apiClient } from './index';
import { chatType } from '@/store/redux/slices/talkjs.interface';

export const getSkills = (query: string) => {
  return apiClient.get(`/general/skills/list?q=${query}`).then((r) => r.data);
};

export const getSkillsCategory = (query: string) => {
  return apiClient.get(`/category/list?q=${query}`).then((r) => r.data);
};

export const getCategoriesApi = async (keyword = '') => {
  const { data } = await apiClient.get(`/category/list?keyword=${keyword}`);
  return data;
};

export const getSkillsApi = async (keyword = '') => {
  const { data } = await apiClient.get(`/skill/list?keyword=${keyword}`);
  return data;
};

export const getLanguages = (query: string) => {
  return apiClient.get(`/general/languages/list?q=${query}`).then((r) => r.data);
};

export const getCountries = (keyword: string) => {
  return apiClient
    .get(`/country/get?keyword=${keyword}`)
    .then((r) => r.data)
    .catch((error) => {
      throw error;
    });
};

export const getCountriesWithoutSearch = (keyword: string) => {
  return apiClient.get(`/general/country?keyword=${keyword}`).then((r) => r.data);
};

export const getStates = (countryCode: string) => {
  return apiClient.get(`/general/country?countryCode=${countryCode}`).then((r) => r.data);
};

export const getUserGroups = (action) => {
  return apiClient.post(`/user/manage-group`, { action }).then((r) => r.data);
};

export const generateAwsUrl = (data: { folder: string; file_name: string; content_type: string }) => {
  return apiClient.post('/general/image/upload', data).then((r) => r.data);
};

export const getHomeCounts = () => {
  return apiClient.get('/home/count/get').then((r) => r.data);
};

export const getPaymentFees = () => {
  return apiClient.get('/payment/get-fees').then((r) => r.data);
};

export const talkJsFetchMyConversation = (signal: AbortSignal) => {
  return apiClient.post('/talk-js/get-conversation', {}, { signal }).then((r) => r.data);
};

export const talkJsCreateNewThread = (data) => {
  return apiClient.post('/talk-js/new-thread', data).then((r) => r.data);
};

export const talkJsFetchSingleConversation = (conversationId: string) => {
  if (!conversationId) throw Error('Conversation id is required');
  return apiClient.post('/talk-js/single-conversation', { conversationId }).then((r) => r.data);
};

export const talkJSAccessTokenApi = async () => {
  const r = await apiClient.post('/talk-js/create-token');
  return r.data;
};

export const checkCardExpiration = async () => {
  try {
    const r = await apiClient.post('/payment/manage-card', {
      action: 'check_expiration_card',
    });
    return r.data;
  } catch (error) {
    return error.response.data;
  }
};

export const deleteFileFromStorage = (fileUrl: string) => {
  apiClient
    .post('/general/image/delete', { fileUrl })
    .then((res) => {
      if (!res.data.status) {
        throw new Error(res.data.message);
      }
      return res.data;
    })
    .catch((err) => err.message);
};

export const GETSTRIPEKEYHANDLER = () => {
  const KEYS = {
    LIVE: 'pk_live_51L3oMuCJ6McpLFC2juXrzmucghjmt6syjqYor6nOCtG7K4P5ZPblmH1XyR9I5NjDzyb3YB4Q7s016Mr3uAqBpHrs00dcOYK1Vs',
    TEST: 'pk_test_51L3oMuCJ6McpLFC2lFoHaRU2hkCyjaoyev3oREV5ue8Y0wO3Xwpf3aY2vueWFslfoWUkev4eV8E4yIhCRknpyeFb00yWAMVuZo',
  };
  switch (window.location.origin) {
    case 'https://beta.zehmizeh.com':
      return KEYS.TEST;
    case 'https://www.zehmizeh.com':
      return KEYS.LIVE;
    default:
      return KEYS.TEST;
  }
};

export const SEARCH_FREELANCER_INITIAL_FILTERS = {
  account_type: [],
  skills: [],
  categories: [],
  languages: [],
  rating: [],
  hourly_rate: {},
  location: [],
  freelancerFilters: [],
  hasPortfolio: [],
};

export const SEARCH_CLIENT_INITIAL_FILTERS = {
  job_type: [],
  skills: [],
  categories: [],
  languages: [],
  fixed_budget: [],
  hourly_rate: [],
  job_status: [],
};

export const getDefaultParameter = (type: string) => {
  const SEARCH_FREELANCER_INITIAL_FILTERS = {
    account_type: [],
    skills: [],
    categories: [],
    languages: [],
    rating: [],
    hourly_rate: {},
    location: [],
    freelancerFilters: [],
    hasPortfolio: [],
  };

  const SEARCH_CLIENT_INITIAL_FILTERS = {
    job_type: [],
    skills: [],
    categories: [],
    languages: [],
    fixed_budget: [],
    hourly_rate: [],
    job_status: [],
  };

  return type === 'jobs' ? SEARCH_CLIENT_INITIAL_FILTERS : SEARCH_FREELANCER_INITIAL_FILTERS;
};

export const chatTypeSolidColor = (response: chatType) => {
  const colors = {
    invite: '#9F1E9F',
    proposal: '#3D3DE7',
    job: '#37CF6A',
  };

  return colors[response];
};

export const chatOnUserHoverOrActiveColor = (response: chatType) => {
  const colors = {
    invite: 'rgba(159, 30, 159, 0.1)',
    proposal: 'rgba(61, 61, 231, 0.1)',
    job: 'rgba(55, 207, 106, 0.1)',
  };

  return colors[response];
};
