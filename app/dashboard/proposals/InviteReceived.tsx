/*
 * This component serves a list of invites received
 */
"use client";
import Link from "next/link";
import { ProposalWrapper, TabContent } from "./proposals.styled";
import Loader from "@/components/Loader";
import NoDataFound from "@/components/ui/NoDataFound";
import BlurredImage from "@/components/ui/BlurredImage";
import useProposals from "./use-proposals";
import { convertToTitleCase, showFormattedBudget } from "@/helpers/utils/misc";
import DollarCircleIcon from "@/public/icons/dollar-circle.svg";

const InviteReceived = () => {
  const { proposals, isLoading, isRefetching } = useProposals("invite");

  return (
    <TabContent>
      {isLoading || isRefetching ? (
        <Loader />
      ) : proposals.length > 0 ? (
        proposals.map((item: any) => (
          <Link
            href={`/offer-details/${item.job_post_id}`}
            key={item.invite_id}
            className="no-hover-effect"
          >
            <ProposalWrapper className="mt-3 flex flex-col cursor-pointer">
              <div className="text-sm font-normal break-word">
                {convertToTitleCase(item.job_title)}
              </div>
              <div className="proposal__details flex items-center flex-wrap">
                {/* Client details */}

                <div className="flex items-center">
                  <BlurredImage
                    src={item?.user_image || "/images/default_avatar.png"}
                    className="proposal__client-profile-img"
                    height="2.625rem"
                    width="2.625rem"
                    allowToUnblur={false}
                    type="small"
                  />
                  <div>
                    <div className="proposal__client-detail-label text-sm font-normal">
                      Sent by:
                    </div>
                    <div className="text-base font-normal capitalize">
                      {item?.first_name} {item?.last_name}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="divider hidden lg:block" />

                {/* Budget */}
                <div className="proposal__budget flex items-center flex-wrap">
                  <DollarCircleIcon />
                  <div className="proposal__budget-value flex">
                    {item?.budget?.isProposal
                      ? "Open To Proposals"
                      : showFormattedBudget(item?.budget)}
                  </div>
                  {item?.budget?.type === "fixed" &&
                    !item?.budget?.isProposal && (
                      <div className="proposal__budget-grey-label text-sm font-normal">
                        Budget
                      </div>
                    )}
                </div>
              </div>
            </ProposalWrapper>
          </Link>
        ))
      ) : (
        <NoDataFound />
      )}
    </TabContent>
  );
};

export default InviteReceived;
