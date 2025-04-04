import { useQuery } from "react-query";
import { getDashboardFreelancers } from "@/helpers/http/client";

// Define a proper interface for freelancer data
export interface FreelancerData {
  id?: number;
  user_id?: string;
  name?: string;
  profile_picture?: string;
  job_title?: string;
  hourly_rate?: number;
  skills?: string[];
  ratings?: number;
  is_favorite?: boolean;
  status?: string;
  // Add other fields as needed based on the actual response
}

// This will fetch the freelancers list for client dashboard: Saved users || Current hires
function useDashboardFreelancers(action: string) {
  const { data, isLoading, isRefetching, refetch } = useQuery<
    { data: FreelancerData[]; status: boolean },
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
