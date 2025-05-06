/*
 * This is the card that displays the details of ..Work In Progress.. Job
 */

import Link from "next/link";
import BlurredImage from "@/components/ui/BlurredImage";
import { convertToTitleCase, numberWithCommas } from "@/helpers/utils/misc";
import DollarCircleIcon from "@/public/icons/dollar-circle.svg";

interface JobData {
  job_post_id: string | number;
  job_title: string;
  userdata?: {
    user_image?: string;
    first_name?: string;
    last_name?: string;
  };
  proposal?: {
    approved_budget?: {
      amount?: number | string;
      type?: string;
    };
  };
}

const WorkInProgressJobCard = ({ data }: { data: JobData }) => {
  return (
    <Link
      href={`/client-job-details/${data?.job_post_id}`}
      className="no-hover-effect"
    >
      <div className="mt-3 cursor-pointer border border-[#d9d9d9] rounded-lg p-5 break-words transition-all duration-200 ease-in hover:shadow-[0_8px_36px_rgba(0,0,0,0.16)] hover:-translate-y-[2px]">
        <div className="text-lg font-normal">
          {convertToTitleCase(data?.job_title)}
        </div>

        <div className="flex items-center gap-4 flex-wrap mt-3 ">
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

          <div className="h-8 w-px bg-[#d9d9d9]" />

          {/* Freelancer costing (budget) */}

          <div className="flex items-center text-base font-normal bg-[#fbf5e8] rounded-2xl px-3 py-1.5">
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
              <span className="opacity-50 ml-1">Budget</span>
            ) : (
              <span className="opacity-50">/hr</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default WorkInProgressJobCard;
