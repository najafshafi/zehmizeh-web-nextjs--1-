import { useQuery } from 'react-query';
import { getUser } from 'helpers/http/auth';
import { getToken } from 'helpers/services/auth';
import { queryKeys } from 'helpers/const/queryKeys';

function useProfile() {
  const { data, isLoading, refetch, isRefetching } = useQuery(
    queryKeys.getFreelancerProfile,
    () => getUser(),
    {
      enabled: !!getToken(),
    }
  );
  return {
    profileData: data?.data || null,
    isLoading,
    refetch,
    isRefetching,
  };
}

export default useProfile;
