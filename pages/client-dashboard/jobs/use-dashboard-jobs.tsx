import { useQuery } from "react-query";
import { getDashboardJobs } from "@/helpers/http/client";

// This custom hook fetches the Jobs which are in progress, prospects, drafts and also templates for client dashboard
function useDashboardJobs(action: string) {
  const { data, isLoading, isRefetching, refetch } = useQuery<
    { data: any; status: boolean; isRefetching: boolean; refetch: any },
    Error
  >("get-client-dashboard-jobs", () => getDashboardJobs(action));

  return {
    jobs: data?.data ? data.data : [],
    isLoading,
    isRefetching,
    refetch,
  };
}

export default useDashboardJobs;
