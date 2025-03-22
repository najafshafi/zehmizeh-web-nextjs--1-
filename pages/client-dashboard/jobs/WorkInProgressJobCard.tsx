/*
 * This is the card that displays the details of ..Work In Progress.. Job
 */
import styled from "styled-components";
import Link from "next/link";
import BlurredImage from "@/components/ui/BlurredImage";
import { transition } from "@/styles/transitions";
import { convertToTitleCase, numberWithCommas } from "@/helpers/utils/misc";
import DollarCircleIcon from "@/public/icons/dollar-circle.svg";

const Wrapper = styled.div`
  border: 1px solid #d9d9d9;
  border-radius: 0.5rem;
  padding: 1.25rem;
  word-break: break-word;
  .divider {
    height: 2rem;
    width: 1px;
    background-color: #d9d9d9;
  }
  .light-text {
    opacity: 0.5;
  }
  .budget {
    background-color: #fbf5e8;
    border-radius: 1rem;
    padding: 0.375rem 0.75rem;
  }
  .details {
    margin-top: 0.75rem;
  }
  ${() => transition()}
`;

const WorkInProgressJobCard = ({ data }: { data: any }) => {
  return (
    <Link
      href={`/client-job-details/${data?.job_post_id}`}
      className="no-hover-effect"
    >
      <Wrapper className="mt-3 cursor-pointer">
        <div className="text-lg font-normal">
          {convertToTitleCase(data?.job_title)}
        </div>

        <div className="flex items-center gap-4 flex-wrap details ">
          {/* Freelancer profile and name */}
          <div className="flex items-center gap-2">
            <BlurredImage
              src={data?.userdata?.user_image || "/images/default_avatar.png"}
              height="42px"
              width="42px"
              allowToUnblur={false}
              type="small"
            />
            <div>
              <div className="light-text text-sm font-normal">Freelancer:</div>
              <div className="text-base font-normal text-capitalize">
                {data?.userdata?.first_name} {data?.userdata?.last_name}
              </div>
            </div>
          </div>

          <div className="divider" />

          {/* Freelancer costing (budget) */}

          <div className="flex items-center text-base font-normal budget">
            <DollarCircleIcon />
            <span className="ms-1">
              {data?.proposal?.approved_budget?.amount
                ? numberWithCommas(
                    data?.proposal?.approved_budget?.amount,
                    "USD"
                  )
                : " - "}
            </span>
            {data?.proposal?.approved_budget?.type == "fixed" ? (
              <span className="light-text ml-1">Budget</span>
            ) : (
              <span className="light-text">/hr</span>
            )}
          </div>
        </div>
      </Wrapper>
    </Link>
  );
};

export default WorkInProgressJobCard;
