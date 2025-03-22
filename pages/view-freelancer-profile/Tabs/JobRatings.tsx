"use client";
/*
 * This component will display the reviews given to the freelancer by other clients
 */

import styled from "styled-components";
import StarIcon from "@/public/icons/star-yellow.svg";
import BlurredImage from "@/components/ui/BlurredImage";
import { convertToTitleCase } from "@/helpers/utils/misc";
import { useQueryData } from "@/helpers/hooks/useQueryData";
import { usePathname } from "next/navigation";
import { queryKeys } from "@/helpers/const/queryKeys";
import { IFreelancerDetails } from "@/helpers/types/freelancer.type";
import { useState } from "react";
import { StyledButton } from "@/components/forms/Buttons";

const ReviewsWrapper = styled.div`
  padding: 3.25rem;
  border-radius: 0.875rem;
  background: ${(props) => props.theme.colors.white};
  box-shadow: 0px 4px 61px rgba(0, 0, 0, 0.04);
  margin-top: 28px;
`;

const JobItemWrapper = styled.div`
  padding: 2.25rem;
  border-radius: 1.25rem;
  border: ${(props) => `1px solid ${props.theme.colors.gray5}`};
  margin-top: 1.25rem;
  .job-description {
    font-style: italic;
    opacity: 0.8;
  }
  .job-details-attribute {
    margin-right: 4.6875rem;
  }
  .attribute-label {
    opacity: 0.5;
    margin-bottom: 3px;
  }
  .line-height-160 {
    line-height: 160%;
  }
  .ratings {
    background: ${(props) => props.theme.colors.body};
    width: max-content;
    padding: 0.875rem 1.25rem;
    border-radius: 2rem;
  }
  .job-client-details {
    gap: 0.75rem;
  }
  .elements-gap {
    gap: 1.5rem;
  }
  .light-text {
    opacity: 0.5;
  }
`;

/* Main component of the file */

export const JobRatings = () => {
  const pathname = usePathname();
  // Extract freelancerId from the pathname
  const freelancerId = pathname ? pathname.split("/").pop() || "" : "";

  const { data: freelancerData } =
    useQueryData<IFreelancerDetails>(
      queryKeys.getFreelancerDetails(freelancerId)
    ) || {};

  return (
    <ReviewsWrapper>
      <div className="profile-detail-block">
        <div className="title text-[28px] font-normal">
          Ratings{" "}
          {freelancerData?.completedJobDetail?.length === 0 && "(None Yet)"}
        </div>

        {/* List of completed jobs by thr freelancer */}
        {freelancerData?.completedJobDetail &&
          freelancerData.completedJobDetail.length > 0 && (
            <Jobs jobsData={freelancerData.completedJobDetail} />
          )}
      </div>
    </ReviewsWrapper>
  );
};

const Jobs = ({
  jobsData,
}: {
  jobsData: IFreelancerDetails["completedJobDetail"];
}) => {
  const initialCount = 2;
  const [count, setCount] = useState(initialCount);

  const toggleCount = () => {
    setCount(count === initialCount ? jobsData?.length || 0 : initialCount);
  };

  return (
    <>
      {jobsData?.slice(0, count)?.map((item) => (
        <JobItemWrapper key={item.job_post_id}>
          <div className="job-title line-height text-[20px] font-bold">
            {convertToTitleCase(item.job_title)}
          </div>
          <div className="flex justify-between items-center flex-wrap elements-gap mt-5">
            <div className="ratings">
              <Ratings ratings={item.rate} />
            </div>
            {/*<div className="job-client-details d-flex items-center">
              <div className="light-text">From: </div>
              <BlurredImage
                src={item?.user_image || '/images/default_avatar.png'}
                height="38px"
                width="38px"
                allowToUnblur={false}
              />
              <div className="text-capitalize">
                {item?.first_name} {item?.last_name}
              </div>
            </div>*/}
          </div>
          <div className="job-description line-height text-[18px] font-normal mt-5">
            &quot;{item.description}&quot;
          </div>
        </JobItemWrapper>
      ))}
      {jobsData && jobsData.length > initialCount && (
        <div className="flex align-center justify-center mt-5">
          <StyledButton variant="outline-dark" onClick={toggleCount}>
            See {count !== initialCount ? "Less" : "More"}
          </StyledButton>
        </div>
      )}
    </>
  );
};

const Ratings = ({ ratings }: { ratings: number }) => {
  return (
    <div className="flex align-center gap-1">
      {Array(Math.ceil(ratings))
        .fill(null)
        .map((_, i) => (
          <StarIcon key={i} />
        ))}
      <div className="mx-1">{ratings?.toFixed(1)}</div>
    </div>
  );
};
