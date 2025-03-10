export const queryKeys = {
  getFreelancerPortfolio: (freelancerId: string) => [
    'get-freelancer-portfolio',
    freelancerId,
  ],
  getFreelancerDetails: (freelancerId: string) => [
    'freelancerdetails',
    freelancerId,
  ],
  getFreelancerProfile: 'get-freelancer-profile',
  jobDetails: (jobPostId: string) => ['jobdetails', jobPostId],
  clientProfile: ['client-profile'],
  clientHasPaymentMethod: 'has-payment-method',
  checkCardExpiration: 'check-expiration-card',
  getUserList: (searchQuery: string, action: string) => [
    'message',
    'users',
    searchQuery,
    action,
  ],
};
