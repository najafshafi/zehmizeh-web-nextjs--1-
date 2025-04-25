import Link from "next/link";
import Loader from "@/components/Loader";
import { StatusBadge } from "@/components/styled/Badges";
import NoDataFound from "@/components/ui/NoDataFound";
import BlurredImage from "@/components/ui/BlurredImage";
import useProposals from "./use-proposals";
import { convertToTitleCase, showFormattedBudget } from "@/helpers/utils/misc";
import DollarCircleIcon from "@/public/icons/dollar-circle.svg";

const ArchivedProposals = () => {
  const { proposals, isLoading, isRefetching } = useProposals("archived");
  return (
    <div className="h-[500px] max-h-[500px] overflow-y-auto">
      {isLoading || isRefetching ? (
        <Loader />
      ) : proposals?.length > 0 ? (
        proposals.map((item: any) => (
          <Link
            href={`/offer-details/${item.job_post_id}`}
            key={item.invite_id}
            className="no-hover-effect"
          >
            <div
              key={item.invite_id}
              className="mt-3 flex flex-col cursor-pointer border border-[#dbdbdb] p-5 rounded-lg transition-all gap-3.5"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-3">
                <div className="lg:col-span-8">
                  <div className="text-lg font-normal break-words">
                    {convertToTitleCase(item.job_title)}
                  </div>
                </div>
                <div className="lg:col-span-4">
                  <div className="flex justify-end">
                    <StatusBadge color="gray">Archived</StatusBadge>
                  </div>
                </div>
              </div>

              <div className="flex items-center flex-wrap mt-2 gap-4">
                {/* Client details */}
                <div className="flex items-center">
                  <BlurredImage
                    src={item?.user_image || "/images/default_avatar.png"}
                    className="mr-2"
                    height="2.625rem"
                    width="2.625rem"
                    allowToUnblur={false}
                  />
                  <div className="ml-2">
                    <div className="text-sm font-normal opacity-50 mb-0.5">
                      Sent by:
                    </div>
                    <div className="text-sm font-normal capitalize">
                      {item?.first_name} {item?.last_name}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px h-8 bg-[#FEEBF0]" />

                {/* Budget */}
                <div className="flex items-center flex-wrap gap-2 bg-[#fbf5e8] rounded-full p-2">
                  <DollarCircleIcon />
                  <div className="text-base font-normal text-[#212529]">
                    {item?.budget?.isProposal
                      ? "Open To Proposals"
                      : item?.budget?.type === "fixed"
                        ? `${showFormattedBudget(item?.budget)} Budget`
                        : showFormattedBudget(item?.budget)}
                  </div>
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

export default ArchivedProposals;
