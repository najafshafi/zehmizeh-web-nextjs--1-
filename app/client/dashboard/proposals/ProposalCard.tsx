/*
 * This is the proposal card that display received proposal details
 */

import BlurredImage from "@/components/ui/BlurredImage";
import { convertToTitleCase, numberWithCommas } from "@/helpers/utils/misc";
import DollarCircleIcon from "@/public/icons/dollar-circle.svg";
import moment from "moment";
import { formatDateAndTime } from "@/helpers/utils/formatter";

type Props = {
  data: any;
  onSelect: () => void;
};

const ProposalCard = ({ data, onSelect }: Props) => {
  return (
    <div
      className="mt-3 cursor-pointer border border-[#d9d9d9] rounded-lg p-5 break-words 
                relative overflow-hidden transition-all duration-300"
      onClick={onSelect}
    >
      {data?.edited_at && (
        <p className="absolute top-0 left-0 right-0 text-center bg-[#ffedd3] text-[#ee761c] py-0.5">
          Updated on {formatDateAndTime(data.edited_at)}
        </p>
      )}
      <div className={`text-lg font-normal ${data?.edited_at ? "mt-3" : ""}`}>
        {convertToTitleCase(data?.job_title)}
      </div>

      <div className="flex items-center mt-3 gap-4 flex-wrap">
        {/* Freelancer image and name */}
        <div className="flex items-center gap-2">
          <BlurredImage
            src={data?.userdata?.user_image || "/images/default_avatar.png"}
            height="42px"
            width="42px"
            allowToUnblur={false}
            type="small"
          />
          <div>
            <div className="text-sm font-normal opacity-50">Proposed by:</div>
            <div className="text-base font-normal capitalize">
              {data?.first_name} {data?.last_name}
            </div>

            {/* Proposal date */}
            {data?.applied_on && (
              <div className="mt-2">
                <div className="text-sm font-normal opacity-50">
                  Proposal Date:
                </div>
                <div className="text-base font-normal capitalize">
                  {moment(data?.applied_on).format("MMM DD, YYYY")}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-24 w-px bg-[#d9d9d9]" />

        {/* Budget */}
        <div className="flex items-center text-base font-normal bg-[#fbf5e8] rounded-2xl py-1.5 px-3">
          <DollarCircleIcon />
          <span className="ml-1">
            {numberWithCommas(data?.proposed_budget?.amount, "USD")}
          </span>
          {data?.proposed_budget?.type == "fixed" ? (
            <span className="opacity-50 ml-1">Cost estimation</span>
          ) : (
            <span className="opacity-50">/hr</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalCard;
