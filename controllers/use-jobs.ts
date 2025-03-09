import { useQuery } from 'react-query';
import { getMyJobs } from 'helpers/http/post-job';

function useMyJobs(job_status: string, keyword: string, freelancerId: string) {
  const { data, isLoading, refetch, isRefetching } = useQuery<
    { data: []; status: boolean; refetch: any; isRefetching: boolean },
    Error
  >('my-jobs', () => getMyJobs(job_status, keyword, freelancerId));
  return {
    myJobs: data?.data ? data.data : [],
    isLoading,
    refetch,
    isRefetching,
  };
}

export default useMyJobs;
