/*
 * This is the card that displays the details of ..Prospects || Drafts.. Job
 */
import { useMemo } from "react";
import Link from "next/link";
import {
  convertToTitleCase,
  numberWithCommas,
  showFormattedBudget,
} from "@/helpers/utils/misc";
import DollarCircleIcon from "@/public/icons/dollar-circle.svg";
import ProspectsIcon from "@/public/icons/prospects.svg";

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
      <div className="mt-3 cursor-pointer border border-[#d9d9d9] rounded-lg p-5 break-words transition-all duration-200 ease-in hover:shadow-[0_8px_36px_rgba(0,0,0,0.16)] hover:-translate-y-[2px]">
        <div className="text-lg font-normal">
          {convertToTitleCase(data?.job_title)}
        </div>

        <div className="flex items-center gap-3 flex-wrap mt-3">
          {/* Job budget */}

          <div className="bg-[#fbf5e8] rounded-3xl px-3 py-1.5 text-base font-normal flex items-center gap-1">
            <DollarCircleIcon />
            {getBudget}
          </div>

          {/* Location */}

          {activeTabKey == "prospects" && (
            <div className="bg-[#fbf5e8] rounded-3xl px-3 py-1.5 text-base font-normal flex items-center gap-1">
              <ProspectsIcon />
              {numberWithCommas(data?.applicants)}
              <span className="mx-1 opacity-50">Applicants</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProspectJobCard;
