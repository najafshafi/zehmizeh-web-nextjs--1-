import { useEffect, useMemo } from "react";
import { useQuery } from "react-query"; // Changed back to react-query
import { getJobDetails } from "@/helpers/http/jobs";
import { isNotAllowedToSubmitReview } from "@/helpers/utils/helper";
import { queryKeys } from "@/helpers/const/queryKeys";
import { useAuth } from "@/helpers/contexts/auth-context";
import { useRouter, useSearchParams } from "next/navigation"; 

// Define TypeScript types
interface TabItem {
  id: number;
  label: string;
  key: string;
}

interface JobDetailsResponse {
  _freelancer_user_id?: string;
  next_job_id?: string;
  data: {
    status: string;
    proposal?: {
      status?: string;
      approved_budget?: {
        type?: string;
      };
    };
  };
}

// Job status enum
const JOB_STATUS = {
  DRAFT: "draft",
  PROSPECTS: "prospects",
  ACTIVE: "active",
} as const;

// Tabs configuration
const TABS_BY_STATUS: Record<string, TabItem[]> = {
  [JOB_STATUS.PROSPECTS]: [
    { id: 0, label: "Proposal Sent", key: "proposal_sent" },
    { id: 1, label: "Project Details", key: "gen_details" },
  ],
  active_hourly: [
    { id: 0, label: "Milestones", key: "m_stone" },
    { id: 1, label: "Messages", key: "messages" },
    { id: 2, label: "Project Details", key: "gen_details" },
  ],
  active_fixed: [
    { id: 0, label: "Milestones", key: "m_stone" },
    { id: 1, label: "Messages", key: "messages" },
    { id: 2, label: "Project Details", key: "gen_details" },
  ],
  closed_hourly: [
    { id: 0, label: "Milestones", key: "m_stone" },
    { id: 1, label: "Messages", key: "messages" },
    { id: 2, label: "Project Details", key: "gen_details" },
    { id: 3, label: "Reviews", key: "feedback" },
  ],
  closed_fixed: [
    { id: 0, label: "Milestones", key: "m_stone" },
    { id: 1, label: "Messages", key: "messages" },
    { id: 2, label: "Project Details", key: "gen_details" },
    { id: 3, label: "Reviews", key: "feedback" },
  ],
  default: [{ id: 0, label: "Project Details", key: "gen_details" }],
};

function useJobDetails(id: string | undefined) {
  const searchParams = useSearchParams(); // Replaced useLocationSearch
  const router = useRouter(); // Replaced useNavigate
  const { user } = useAuth();

  const { data, isLoading, refetch, isRefetching } = useQuery(
    id ? queryKeys.jobDetails(id) : ["jobdetails"],
    () => getJobDetails(id as string),
    {
      enabled: !!id,
    }
  );

  // Type assertion for data
  const jobData = data as JobDetailsResponse | undefined;

  useEffect(() => {
    if (
      jobData?._freelancer_user_id !== user?.user_id &&
      jobData?.next_job_id &&
      searchParams?.get("user_source") === "email"
    ) {
      router.push(`/job-details/${jobData.next_job_id}`);
    }
  }, [jobData, searchParams, user?.user_id, router]);

  const dontAllowToSubmitReview = isNotAllowedToSubmitReview(jobData?.data);
  const jobStatus = jobData?.data?.status;
  const proposalStatus = jobData?.data?.proposal?.status;
  const approvedBudgetType = jobData?.data?.proposal?.approved_budget?.type;

  const tabItems = useMemo(() => {
    if (proposalStatus) {
      if (approvedBudgetType) {
        if (jobStatus === "closed" && dontAllowToSubmitReview) {
          return TABS_BY_STATUS[`${jobStatus}_${approvedBudgetType}`].filter(
            (tabs) => tabs.key !== "feedback"
          );
        }
        return TABS_BY_STATUS[`${jobStatus}_${approvedBudgetType}`];
      }
      return TABS_BY_STATUS[JOB_STATUS.PROSPECTS];
    }
    return TABS_BY_STATUS["default"];
  }, [proposalStatus, approvedBudgetType, jobStatus, dontAllowToSubmitReview]);

  return {
    jobdetails: jobData?.data,
    isLoading,
    refetch,
    isRefetching,
    tabItems,
  };
}

export default useJobDetails;
