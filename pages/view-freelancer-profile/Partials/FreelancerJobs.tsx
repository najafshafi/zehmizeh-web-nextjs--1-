/*
 * This component list the jobs (Only titles) that the freelancer is working on
 */

import { convertToTitleCase } from "@/helpers/utils/misc";
import styled from "styled-components";

const Wrapper = styled.div`
  padding: 1.625rem 2rem;
  border-radius: 0.875rem;
  background: ${(props) => props.theme.colors.white};
  box-shadow: 0px 4px 61px rgba(0, 0, 0, 0.04);
  .label {
    color: #999999;
  }
  .jobs-list {
    max-height: 300px;
    overflow-y: auto;
  }
`;

const FreelancerJobs = ({
  jobs,
  freelancerName,
}: {
  jobs: any; //TODO: Here I am putting any, later on I will create a jobs.types.ts file and create one job item modal there and use it here
  freelancerName: string;
}) => {
  return (
    <Wrapper className="mt-4">
      <div className="fs-18 fw-400 label">
        My active projects with{' '}
        <span className="text-capitalize">{freelancerName}</span>
      </div>
      <div className="jobs-list">
        {jobs?.map((item: any) => (
          <div key={item?.job_post_id} className="fs-24 fw-400 mt-2">
            {convertToTitleCase(item?.job_title)}
          </div>
        ))}
      </div>
    </Wrapper>
  );
};

export default FreelancerJobs;
