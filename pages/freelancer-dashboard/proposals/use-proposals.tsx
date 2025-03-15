"use client";
import { useQuery } from 'react-query';
import { getProposals } from '@/helpers/http/freelancer';

function useProposals(proposalStatus: string) {
  const { data, isLoading, isRefetching } = useQuery<
    { data: any; status: boolean; isRefetching: boolean },
    Error
  >('get-proposals', () => getProposals(proposalStatus));
  return {
    proposals: data?.data ? data.data : [],
    isLoading,
    isRefetching,
  };
}

export default useProposals;
