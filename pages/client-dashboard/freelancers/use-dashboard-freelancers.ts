import { useQuery } from "react-query";
import { getDashboardFreelancers } from "@/helpers/http/client";

// This will fetch the freelancers list for client dashboard: Saved users || Current hires
function useDashboardFreelancers(action: string) {
  const { data, isLoading, isRefetching, refetch } = useQuery<
    { data: any; status: boolean; isRefetching: boolean; refetch: any },
    Error
  >("get-client-dashboard-freelancers", () => getDashboardFreelancers(action));

  return {
    freelancers: data?.data ? data.data : [],
    isLoading,
    isRefetching,
    refetch,
  };
}

export default useDashboardFreelancers;
