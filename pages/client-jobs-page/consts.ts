export const TABS = [
  {
    id: 1,
    label: 'All',
    key: 'all',
  },
  {
    id: 0,
    label: 'Projects in Progress',
    key: 'active',
  },
  {
    id: 3,
    label: 'Posted Projects',
    key: 'prospects',
  },
  {
    id: 2,
    label: 'Drafts',
    key: 'draft',
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
};
