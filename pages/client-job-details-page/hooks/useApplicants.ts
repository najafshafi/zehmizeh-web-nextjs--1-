import { useQuery } from "react-query";
import { getApplicantsDetails } from "@/helpers/http/proposals";

/*
 * This hook will load the dashboard stats
 */
function useApplicants(formData: {
  job_id: string;
  page: number;
  limit: number;
  sorting: string;
  proposalStatus: string;
}) {
  const { data, isLoading, refetch } = useQuery(
    ["get-job-applicant", formData],
    () => getApplicantsDetails(formData),
    { enabled: !!formData?.job_id, keepPreviousData: true }
  );
  return {
    data: data?.data || [],
    totalResults: data?.total || 0,
    isLoading,
    refetch,
  };
}

export default useApplicants;
