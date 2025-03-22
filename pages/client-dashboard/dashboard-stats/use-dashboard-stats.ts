import { useQuery } from "react-query";
import { getClientDashboardStats } from "@/helpers/http/client";

// This will fetch the dashboard counts like: totalk jobs, total hires, ratings
function useDashboardStats() {
  const { data, isLoading } = useQuery<{ data: any; status: boolean }, Error>(
    "get-client-dashboard-stats",
    () => getClientDashboardStats()
  );
  return {
    dashboardStats: data?.data ? data.data : [],
    isLoading,
  };
}

export default useDashboardStats;
