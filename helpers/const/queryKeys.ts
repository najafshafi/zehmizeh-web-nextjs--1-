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
  jobDetails: (jobPostId) => ['jobdetails', jobPostId],
  clientProfile: ['client-profile'],
  clientHasPaymentMethod: 'has-payment-method',
  checkCardExpiration: 'check-expiration-card',
  getUserList: (searchQuery, action) => [
    'message',
    'users',
    searchQuery,
    action,
  ],
};
