/*
 * This is the card that displays the details of ..Prospects || Drafts.. Job
 */
import { useMemo } from "react";
import Link from "next/link";
import styled from "styled-components";
import { transition } from "@/styles/CssUtils";
import {
  convertToTitleCase,
  numberWithCommas,
  showFormattedBudget,
} from "@/helpers/utils/misc";
import DollarCircleIcon from "@/public/icons/dollar-circle.svg";
import ProspectsIcon from "@/public/icons/prospects.svg";

const Wrapper = styled.div`
  border: 1px solid #d9d9d9;
  border-radius: 0.5rem;
  padding: 1.25rem;
  word-break: break-word;
  .avatar {
    height: 42px;
    width: 42px;
    border-radius: 50%;
  }
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
    border-radius: 1.5rem;
    padding: 0.375rem 0.75rem;
  }
  .details {
    margin-top: 0.75rem;
  }
  ${() => transition()}
`;

const ProspectJobCard = ({
  data,
  activeTabKey,
}: {
  data: any;
  activeTabKey: string;
}) => {
  const getBudget = useMemo(() => {
    /* This memoised fucntion will format how the budget should be displayed based on
    if budget is there or not, and if there then based on budget type it will display
    */

    if (data?.budget) {
      if (data?.budget?.isProposal == true) {
        return "Open to Proposals";
      }
      if (data?.budget?.type == "fixed") {
        // If budget type is fixed
        return `${showFormattedBudget(data?.budget)} Budget`;
      } else {
        /*
          If budget type is not fixed then it could be hourly or unsure:
          In hourly it will be min_amount and max_amount but
          in unsure it could be min | max or amount as well, 
        */
        return showFormattedBudget(data?.budget);
      }
    } else {
      return " - "; // If there is no budget
    }
  }, [data?.budget]);

  return (
    <Link
      href={`/client-job-details/${data?.job_post_id}/applicants`}
      className="no-hover-effect"
    >
      <Wrapper className="mt-3 cursor-pointer">
        <div className="text-lg font-normal">
          {convertToTitleCase(data?.job_title)}
        </div>

        <div className="flex items-center gap-3 flex-wrap details">
          {/* Job budget */}

          <div className="budget text-base font-normal flex items-center gap-1">
            <DollarCircleIcon />
            {getBudget}
          </div>

          {/* Location */}

          {activeTabKey == "prospects" && (
            <div className="budget text-base font-normal flex items-center gap-1">
              <ProspectsIcon />
              {numberWithCommas(data?.applicants)}
              <span className="mx-1 light-text">Applicants</span>
            </div>
          )}
        </div>
      </Wrapper>
    </Link>
  );
};

export default ProspectJobCard;
