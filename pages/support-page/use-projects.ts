import { useQuery } from 'react-query';
import { manageDispute } from '@/helpers/http/dispute';

// This custom hook will fetch all the list of active projects of the logged in user (Client | Freelancer)
function useProjects() {
  const { data, isLoading, refetch, isRefetching } = useQuery<
    { data: []; status: boolean; refetch: any; isRefetching: boolean },
    Error
  >('my-projects', () =>
    manageDispute({ action: 'get_project', page: 1, limit: 200 })
  );
  return {
    myProjects: data?.data ? data.data : [],
    isLoading,
    refetch,
    isRefetching,
  };
}

export default useProjects;
