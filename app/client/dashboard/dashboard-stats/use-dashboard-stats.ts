import { useQuery } from "react-query";
import { getClientDashboardStats } from "@/helpers/http/client";

// Define a proper interface for dashboard stats data
export interface DashboardStats {
  donejob?: number;
  totalHired?: number;
  ratings?: {
    average?: number;
    count?: number;
  };
  total_jobs?: number;
  total_hires?: number;
  total_active_jobs?: number;
  total_completed_jobs?: number;
}

// This will fetch the dashboard counts like: totalk jobs, total hires, ratings
function useDashboardStats() {
  const { data, isLoading } = useQuery<
    { data: DashboardStats; status: boolean },
    Error
  >("get-client-dashboard-stats", () => getClientDashboardStats());
  return {
    dashboardStats: data?.data ? data.data : ({} as DashboardStats),
    isLoading,
  };
}

export default useDashboardStats;
