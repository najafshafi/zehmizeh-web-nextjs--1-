"use client";
import { useQuery } from 'react-query';
import { getJobs } from '@/helpers/http/freelancer';

function useJobs(proposalStatus: string) {
  const { data, isLoading, isRefetching, refetch } = useQuery<
    { data: any; status: boolean; isRefetching: boolean; refetch: any },
    Error
  >('get-jobs', () => getJobs(proposalStatus));
  return {
    jobs: data?.data ? data.data : [],
    isLoading,
    isRefetching,
    refetch,
  };
}

export default useJobs;
