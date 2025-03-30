"use client";
import FreelancerProfileBanner from "../Partials/FreelancerProfileBanner";
import { useQueryData } from "@/helpers/hooks/useQueryData";
import { usePathname } from "next/navigation";
import FreelancerJobs from "../Partials/FreelancerJobs";
import FreelancerOtherDetails from "../Partials/FreelancerOtherDetails";
import { queryKeys } from "@/helpers/const/queryKeys";
import { IFreelancerDetails } from "@/helpers/types/freelancer.type";
import { useAuth } from "@/helpers/contexts/auth-context";

interface ProfileProps {
  handleAuthenticatedAction?: (action: string) => boolean;
}

export const Profile = ({ handleAuthenticatedAction }: ProfileProps) => {
  const pathname = usePathname();
  // Extract freelancerId from the pathname
  const freelancerId = pathname ? pathname.split("/").pop() || "" : "";
  // Get current user context to check user type
  const { user } = useAuth();

  // Check if user is a client
  const isClient = user && user.user_type === "client";

  const { data } = useQueryData<IFreelancerDetails>(
    queryKeys.getFreelancerDetails(freelancerId)
  );

  return (
    <>
      <FreelancerProfileBanner
        data={data}
        handleAuthenticatedAction={handleAuthenticatedAction}
      />
      {/* Freelancer's Jobs - Only show for client users */}
      {isClient &&
        data?.activeJobsClient &&
        data.activeJobsClient.length > 0 && (
          <FreelancerJobs
            jobs={data.activeJobsClient}
            freelancerName={data?.first_name + " " + data?.last_name}
            handleAuthenticatedAction={handleAuthenticatedAction}
          />
        )}

      {/* Freelancer other details */}
      {data && (
        <FreelancerOtherDetails
          data={data}
          handleAuthenticatedAction={handleAuthenticatedAction}
        />
      )}
    </>
  );
};
