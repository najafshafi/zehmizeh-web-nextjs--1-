import { IPortFolio } from 'helpers/types/portfolio.type';
import { apiClient } from './index';

const API_MANAGE_PORTFOLIO_URL = '/portfolio/manage-portfolio';

export const getPortfolio = () => {
  return apiClient
    .post(API_MANAGE_PORTFOLIO_URL, {
      action: 'get_portfolio',
    })
    .then((r) => r.data);
};

export const getFreelancerPortfolio: (
  freelancerId: string
) => Promise<{ data: IPortFolio[] }> = (freelancerId) => {
  return apiClient
    .post(API_MANAGE_PORTFOLIO_URL, {
      action: 'get_freelancer_portfolio',
      freelancer_user_id: freelancerId,
    })
    .then((r) => r.data);
};

export const getPortfolioDetails = (portfolio_id: number) => {
  return apiClient
    .post(API_MANAGE_PORTFOLIO_URL, {
      action: 'get_portfolio_detail',
      portfolio_id,
    })
    .then((r) => r.data);
};

export const deletePortfolio = (formData: any) => {
  return apiClient.post(API_MANAGE_PORTFOLIO_URL, formData).then((r) => r.data);
};

export const addEditPortfolio = (formData: any) => {
  return apiClient.post(API_MANAGE_PORTFOLIO_URL, formData).then((r) => r.data);
};
