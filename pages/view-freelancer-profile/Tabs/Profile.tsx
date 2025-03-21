"use client";
import FreelancerProfileBanner from "../Partials/FreelancerProfileBanner";
import { useQueryData } from "@/helpers/hooks/useQueryData";
import { usePathname } from "next/navigation";
import FreelancerJobs from "../Partials/FreelancerJobs";
import FreelancerOtherDetails from "../Partials/FreelancerOtherDetails";
import { queryKeys } from "@/helpers/const/queryKeys";
import { IFreelancerDetails } from "@/helpers/types/freelancer.type";

export const Profile = () => {
  const pathname = usePathname();
  // Extract freelancerId from the pathname
  const freelancerId = pathname ? pathname.split("/").pop() || "" : "";

  const { data } = useQueryData<IFreelancerDetails>(
    queryKeys.getFreelancerDetails(freelancerId)
  );

  return (
    <>
      <FreelancerProfileBanner data={data} />
      {/* Freelancer's Jobs */}

      {data?.activeJobsClient && data.activeJobsClient.length > 0 && (
        <FreelancerJobs
          jobs={data.activeJobsClient}
          freelancerName={data?.first_name + " " + data?.last_name}
        />
      )}

      {/* Freelancer other details */}
      <FreelancerOtherDetails data={data} />
    </>
  );
};
