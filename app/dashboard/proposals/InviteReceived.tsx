/*
 * This component serves a list of invites received
 */
"use client";
import Link from "next/link";
import Loader from "@/components/Loader";
import NoDataFound from "@/components/ui/NoDataFound";
import BlurredImage from "@/components/ui/BlurredImage";
import useProposals from "./use-proposals";
import { convertToTitleCase, showFormattedBudget } from "@/helpers/utils/misc";
import DollarCircleIcon from "@/public/icons/dollar-circle.svg";

const InviteReceived = () => {
  const { proposals, isLoading, isRefetching } = useProposals("invite");

  return (
    <div className="h-[500px] max-h-[500px] overflow-y-auto">
      {isLoading || isRefetching ? (
        <Loader />
      ) : proposals.length > 0 ? (
        proposals.map((item: any) => (
          <Link
            href={`/offer-details/${item.job_post_id}`}
            key={item.invite_id}
            className="no-hover-effect"
          >
            <div className="mt-3 flex flex-col cursor-pointer border border-[#dbdbdb] p-5 rounded-lg transition-all gap-3.5">
              <div className="text-lg font-normal break-words">
                {convertToTitleCase(item.job_title)}
              </div>
              <div className="flex items-center flex-wrap gap-4">
                {/* Client details */}
                <div className="flex items-center">
                  <BlurredImage
                    src={item?.user_image || "/images/default_avatar.png"}
                    className="mr-2"
                    height="2.625rem"
                    width="2.625rem"
                    allowToUnblur={false}
                    type="small"
                  />
                  <div>
                    <div className="text-sm font-normal opacity-50 mb-0.5">
                      Sent by:
                    </div>
                    <div className="text-base font-normal capitalize">
                      {item?.first_name} {item?.last_name}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px h-8 bg-[#FEEBF0]" />

                {/* Budget */}
                <div className="flex items-center flex-wrap gap-2 bg-[#fbf5e8] rounded-full p-2">
                  <DollarCircleIcon />
                  <div className="flex text-base font-normal text-[#212529]">
                    {item?.budget?.isProposal
                      ? "Open To Proposals"
                      : showFormattedBudget(item?.budget)}
                  </div>
                  {item?.budget?.type === "fixed" &&
                    !item?.budget?.isProposal && (
                      <div className="text-sm font-normal opacity-60 ml-1.5">
                        Budget
                      </div>
                    )}
                </div>
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

export default InviteReceived;
