import { useQuery } from 'react-query';
import { getUser } from 'helpers/http/auth';
import { IClientDetails } from 'helpers/types/client.type';
import { queryKeys } from 'helpers/const/queryKeys';

/* This hook will fetch client profile details */
function useClientProfile() {
  const { data, isLoading, refetch, isRefetching } = useQuery<{
    data: IClientDetails;
  }>(queryKeys.clientProfile, () => getUser());

  const refetchData = refetch;

  return {
    profileData: data?.data,
    isLoading,
    refetchData,
    isRefetching,
  };
}
export default useClientProfile;
