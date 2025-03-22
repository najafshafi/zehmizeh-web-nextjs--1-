import { useQuery } from "react-query";
import { getReceivedProposals } from "@/helpers/http/client";

// This custom hook will fetch all the proposals received for all the jobs
function useProposals() {
  const { data, isLoading, isRefetching, refetch } = useQuery(
    "get-received-proposals",
    () => getReceivedProposals({ page: 1, limit: 100 })
  );
  return {
    proposals: data?.data || [],
    isLoading,
    isRefetching,
    refetch,
  };
}

export default useProposals;
