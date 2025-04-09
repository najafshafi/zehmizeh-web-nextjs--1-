import { useQuery } from 'react-query';
import { getFreelancerDashboardStats } from '@/helpers/http/freelancer';

function useDashboardStats() {
  const { data, isLoading } = useQuery<{ data: any; status: boolean }, Error>(
    'get-dashboard-stats',
    () => getFreelancerDashboardStats()
  );
  return {
    dashboardStats: data?.data ? data.data : [],
    isLoading,
  };
}

export default useDashboardStats;
