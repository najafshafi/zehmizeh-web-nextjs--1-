import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { getJobDetails } from 'helpers/http/jobs';
import { isNotAllowedToSubmitReview } from 'helpers/utils/helper';
import { queryKeys } from 'helpers/const/queryKeys';

const JOB_STATUS = {
  DRAFT: 'draft',
  PROSPECTS: 'prospects',
  ACTIVE: 'active',
  DELETED: 'deleted',
};

const TABS_BY_STATUS = {
  [JOB_STATUS.DRAFT]: [
    {
      id: 0,
      label: 'Details',
      key: 'gen_details',
    },
  ],
  [JOB_STATUS.PROSPECTS]: [
    { id: 0, label: 'Proposals', key: 'applicants', hasCounts: true },
    { id: 1, label: 'Invites Sent', key: 'invitees', hasCounts: true },
    { id: 2, label: 'Project Details', key: 'gen_details' },
  ],
  [JOB_STATUS.DELETED]: [
    { id: 0, label: 'Proposals', key: 'applicants', hasCounts: true },
    { id: 1, label: 'Invites Sent', key: 'invitees' },
    { id: 2, label: 'Project Details', key: 'gen_details' },
  ],
  active_hourly: [
    { id: 0, label: 'Milestones', key: 'm_stone' },
    { id: 1, label: 'Messages', key: 'messages' },
    { id: 2, label: 'Project Details', key: 'gen_details' },
    { id: 3, label: 'Proposals', key: 'applicants' },
    { id: 4, label: 'Invites Sent', key: 'invitees' },
  ],
  closed_hourly: [
    { id: 0, label: 'Milestones', key: 'm_stone' },
    { id: 1, label: 'Messages', key: 'messages' },
    { id: 2, label: 'Project Details', key: 'gen_details' },
    { id: 3, label: 'Proposals', key: 'applicants' },
    { id: 4, label: 'Reviews', key: 'feedback' },
    { id: 5, label: 'Invites Sent', key: 'invitees' },
  ],
  active_fixed: [
    { id: 0, label: 'Milestones', key: 'm_stone' },
    { id: 1, label: 'Messages', key: 'messages' },
    { id: 2, label: 'Project Details', key: 'gen_details' },
    { id: 3, label: 'Proposals', key: 'applicants' },
    { id: 4, label: 'Invites Sent', key: 'invitees' },
  ],
  closed_fixed: [
    { id: 0, label: 'Milestones', key: 'm_stone' },
    { id: 1, label: 'Messages', key: 'messages' },
    { id: 2, label: 'Project Details', key: 'gen_details' },
    { id: 3, label: 'Proposals', key: 'applicants' },
    { id: 4, label: 'Reviews', key: 'feedback' },
    { id: 5, label: 'Invites Sent', key: 'invitees' },
  ],
  default: [{ id: 0, label: 'Project Details', key: 'gen_details' }],
};

function useJobDetails(id) {
  const { data, isLoading, refetch, isRefetching } = useQuery(queryKeys.jobDetails(id), () => getJobDetails(id), {
    keepPreviousData: false,
    enabled: !!id,
  });
  const jobStatus = data?.data?.status;
  const approvedBudgetType = data?.data?.proposal?.approved_budget?.type;

  // Not allowing to submit review if
  // 1. milestone never posted
  // 2. freelancer has never been paid
  const dontAllowToSubmitReview = isNotAllowedToSubmitReview(data?.data);

  /* Here based on the Job status and approved budget type the tabs will be displayed */

  const tabItems = useMemo(() => {
    if (jobStatus == 'active' || jobStatus == 'closed') {
      if (approvedBudgetType) {
        // Removing review tab if freelancer never got paid
        if (jobStatus == 'closed' && dontAllowToSubmitReview) {
          return TABS_BY_STATUS[`${jobStatus}_${approvedBudgetType}`].filter((tabs) => tabs.key !== 'feedback');
        }
        return TABS_BY_STATUS[`${jobStatus}_${approvedBudgetType}`];
      }
    } else if (jobStatus == 'drafts' || jobStatus == 'prospects' || jobStatus == 'deleted') {
      return TABS_BY_STATUS[jobStatus];
    }
    return TABS_BY_STATUS['default'];
  }, [jobStatus, approvedBudgetType, dontAllowToSubmitReview]);
  return {
    jobdetails: data?.data,
    isLoading,
    refetch,
    isRefetching,
    tabItems,
  };
}
export default useJobDetails;

// [draft, prospects, active]
