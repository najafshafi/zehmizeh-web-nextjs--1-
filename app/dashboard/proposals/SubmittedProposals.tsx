/*
 * This component serves a list of submitted proposals
 */
import moment from "moment";
import Link from "next/link";
import Loader from "@/components/Loader";
import NoDataFound from "@/components/ui/NoDataFound";
import { StatusBadge } from "@/components/styled/Badges";
import useProposals from "./use-proposals";
import {
  numberWithCommas,
  changeStatusDisplayFormat,
  convertToTitleCase,
} from "@/helpers/utils/misc";
import DollarCircleIcon from "@/public/icons/dollar-circle.svg";
import LocationIcon from "@/public/icons/location-blue.svg";

const SubmittedProposals = () => {
  const { proposals, isLoading, isRefetching } = useProposals("submitted");
  return (
    <div className="h-[500px] max-h-[500px] overflow-y-auto">
      {isLoading || isRefetching ? (
        <Loader />
      ) : proposals?.length > 0 ? (
        proposals.map((item: any) => (
          <Link
            href={`/job-details/${item.job_post_id}/proposal_sent`}
            key={item.proposal_id}
            className="no-hover-effect"
          >
            <div className="mt-3 flex flex-col cursor-pointer border border-[#dbdbdb] p-5 rounded-lg transition-all gap-3.5">
              {/* Name and title */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="text-lg font-normal break-words">
                  {convertToTitleCase(item.job_title)}
                </div>
                <div>
                  <StatusBadge
                    color={item?.status === "denied" ? "darkPink" : "yellow"}
                  >
                    {item?.status === "denied"
                      ? "Declined"
                      : changeStatusDisplayFormat(item?.status)}
                  </StatusBadge>
                  {item?.status === "pending" && (
                    <StatusBadge
                      color={item?.is_viewed ? "green" : "red"}
                      className="ms-2"
                    >
                      {item?.is_viewed ? "Read" : "Unread"}
                    </StatusBadge>
                  )}
                </div>
              </div>

              <div className="flex items-center flex-wrap gap-2.5">
                {/* Budget */}
                <div className="flex items-center justify-center flex-wrap bg-[#fbf5e8] rounded-full p-2">
                  <DollarCircleIcon />
                  <div className="flex text-base font-normal text-[#212529]">
                    {numberWithCommas(item?.proposed_budget?.amount, "USD")}
                    {item?.budget?.type === "fixed" ? (
                      <span className="opacity-60 font-normal ms-1">
                        Budget
                      </span>
                    ) : (
                      <span className="opacity-60 font-normal ms-1">/hr</span>
                    )}
                  </div>
                </div>

                {/* Location */}
                {Array.isArray(item?.preferred_location) &&
                  item?.preferred_location?.length > 0 && (
                    <div className="flex items-center justify-center flex-wrap bg-[#fbf5e8] rounded-full p-2">
                      <LocationIcon />
                      <div className="text-base font-normal mx-4">
                        {item.preferred_location.join(", ")}
                      </div>
                    </div>
                  )}
              </div>

              {/* Applied on */}
              <div className="text-base font-normal opacity-63">
                Submitted {moment(item?.applied_on).format("MMM DD, YYYY")}
              </div>
            </div>
          </Link>
        ))
      ) : (
        <NoDataFound />
      )}
    </div>
  );
};

export default SubmittedProposals;
