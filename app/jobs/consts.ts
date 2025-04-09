export const TABS = [
  {
    id: 0,
    label: 'Work in Progress',
    key: 'active',
  },
  {
    id: 1,
    label: 'All Projects',
    key: 'all_jobs',
  },
  {
    id: 2,
    label: 'Saved',
    key: 'saved',
  },
  {
    id: 3,
    label: 'Sent Proposals',
    key: 'applied_job',
  },
  {
    id: 4,
    label: 'Closed',
    key: 'closed',
  },
];

export const JOBS_STATUS = {
  pending: {
    color: 'yellow',
  },
  prospects: {
    color: 'yellow',
  },
  denied: {
    color: 'darkPink',
  },
  declined: {
    color: 'darkPink',
  },
  accepted: {
    color: 'green',
  },
  canceled: {
    color: 'red',
  },
  read: {
    color: 'blue',
  },
  active: {
    color: 'blue',
  },
  closed: {
    color: 'green',
  },
  draft: {
    color: 'gray',
  },
  deleted: {
    color: 'darkPink',
  },
  awarded: {
    color: 'darkPink',
  },
};
