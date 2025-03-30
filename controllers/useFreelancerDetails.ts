import { useQuery } from "react-query";
import { queryKeys } from "@/helpers/const/queryKeys";
import { getFreelancerDetails } from "@/helpers/http/freelancer";

export function useFreelancerDetails(freelancerId: string) {
  const { data, error, refetch, isLoading, isRefetching } = useQuery(
    queryKeys.getFreelancerDetails(freelancerId),
    () =>
      getFreelancerDetails(freelancerId).catch((err) => {
        console.log("Error fetching freelancer details:", err);
        // Return null data instead of throwing to prevent query from going to error state
        return { data: null };
      }),
    {
      enabled: !!freelancerId,
      // Don't retry on error for unauthenticated users viewing profiles
      retry: false,
      // Set a lower stale time for public profile viewing
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
  return {
    freelancerData: data?.data,
    error,
    isLoading,
    refetch,
    isRefetching,
  };
}
