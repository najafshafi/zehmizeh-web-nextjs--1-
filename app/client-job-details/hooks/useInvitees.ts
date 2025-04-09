import { useQuery } from 'react-query';
import { getInvitees } from '@/helpers/http/proposals';

/*
 * This hook will load the dashboard stats
 */
function useInvitees(formData: {
  job_id: string;
  page: number;
  limit: number;
}) {
  const { data, isLoading, refetch } = useQuery(
    ['get-invitees', formData?.page, formData?.job_id],
    () => getInvitees(formData),
    { enabled: !!formData?.job_id, keepPreviousData: true }
  );
  return {
    data: data?.data || [],
    totalResults: data?.total || 0,
    isLoading,
    refetch,
  };
}

export default useInvitees;
