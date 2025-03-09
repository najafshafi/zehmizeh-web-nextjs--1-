export type TViewFreelancerProfilePathParams = {
  freelancerId: string;
  tabkey: string;
};

export type TFreelancerProfileSettingsPathParams = {
  tabkey: string;
};

export type TClientProfilePathParams = {
  clientId: string;
};

export type TEditJobTemplatePathParams = {
  id: string;
  type: 'job' | 'template' | 'create';
};
