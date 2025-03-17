import { useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { getJobDetails } from '@/helpers/http/jobs';
import { isNotAllowedToSubmitReview } from '@/helpers/utils/helper';
import { queryKeys } from '@/helpers/const/queryKeys';
import { useAuth } from '@/helpers/contexts/auth-context';
import { useNavigate } from 'react-router-dom';
import useLocationSearch from '@/helpers/hooks/useSearchLocation';

const JOB_STATUS = {
  DRAFT: 'draft',
  PROSPECTS: 'prospects',
  ACTIVE: 'active',
};

const TABS_BY_STATUS = {
  [JOB_STATUS.PROSPECTS]: [
    { id: 0, label: 'Proposal Sent', key: 'proposal_sent' },
    { id: 1, label: 'Project Details', key: 'gen_details' },
  ],
  active_hourly: [
    { id: 0, label: 'Milestones', key: 'm_stone' },
    { id: 1, label: 'Messages', key: 'messages' },
    { id: 2, label: 'Project Details', key: 'gen_details' },
  ],
  active_fixed: [
    { id: 0, label: 'Milestones', key: 'm_stone' },
    { id: 1, label: 'Messages', key: 'messages' },
    { id: 2, label: 'Project Details', key: 'gen_details' },
  ],
  closed_hourly: [
    { id: 0, label: 'Milestones', key: 'm_stone' },
    { id: 1, label: 'Messages', key: 'messages' },
    { id: 2, label: 'Project Details', key: 'gen_details' },
    { id: 3, label: 'Reviews', key: 'feedback' },
  ],
  closed_fixed: [
    { id: 0, label: 'Milestones', key: 'm_stone' },
    { id: 1, label: 'Messages', key: 'messages' },
    { id: 2, label: 'Project Details', key: 'gen_details' },
    { id: 3, label: 'Reviews', key: 'feedback' },
  ],
  default: [{ id: 0, label: 'Project Details', key: 'gen_details' }],
};

function useJobDetails(id) {
  const params = useLocationSearch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading, refetch, isRefetching } = useQuery(queryKeys.jobDetails(id), () => getJobDetails(id), {
    enabled: !!id,
  });

  // If user is trying to open other version of job then redirect to correct job
  // 1. freelancer id doesn't match with current user id
  // 2. have refJobId
  // 3. user came to page by clicking on email link
  useEffect(() => {
    if (data?._freelancer_user_id !== user?.user_id && data?.next_job_id && params?.user_source === 'email') {
      navigate(`/job-details/${data.next_job_id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, params?.source, user?.user_id]);

  // Not allowing to submit review if
  // 1. milestone never posted
  // 2. freelancer has never been paid
  const dontAllowToSubmitReview = isNotAllowedToSubmitReview(data?.data);

  const jobStatus = data?.data?.status;
  const proposalStatus = data?.data?.proposal?.status;
  const approvedBudgetType = data?.data?.proposal?.approved_budget?.type;
  const tabItems = useMemo(() => {
    if (proposalStatus) {
      if (approvedBudgetType) {
        // Removing review tab if freelancer never got paid
        if (jobStatus == 'closed' && dontAllowToSubmitReview) {
          return TABS_BY_STATUS[`${jobStatus}_${approvedBudgetType}`].filter((tabs) => tabs.key !== 'feedback');
        }
        return TABS_BY_STATUS[`${jobStatus}_${approvedBudgetType}`];
      }
      return TABS_BY_STATUS[JOB_STATUS.PROSPECTS];
    }
    return TABS_BY_STATUS['default'];
  }, [proposalStatus, approvedBudgetType, jobStatus, dontAllowToSubmitReview]);

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
