/*
 * This is the main component of this route
 */
"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "react-query";
import { Wrapper } from "./offer-details.styled";
import Loader from "@/components/Loader";
import BackButton from "@/components/ui/BackButton";
import OfferDetailsBanner from "./OfferDetailsBanner";
import OfferOtherDetails from "./OfferOtherDetails";
import { getJobDetails } from "@/helpers/http/jobs";
import useStartPageFromTop from "@/helpers/hooks/useStartPageFromTop";
import { archiveUnarchiveProposal } from "@/helpers/http/proposals";

const OfferDetails = () => {
  useStartPageFromTop();
  const params = useParams();
  const id = params?.id as string;
  const [isProposalSubmitted, setIsProposalSubmitted] =
    useState<boolean>(false);

  const onProposalSubmitted = () => {
    setIsProposalSubmitted(true);
  };

  /* This will fetch the Offer details */
  const { data, isLoading } = useQuery(
    ["job-details", id],
    () =>
      getJobDetails(id).catch((err) => {
        throw err;
      }),
    { enabled: !!id }
  );

  useEffect(() => {
    if (data?.data?.invite_status === "pending") {
      archiveUnarchiveProposal(data?.data?.job_post_id, false, "read").then(
        () => {}
      );
    }
  }, [data]);

  if (!isLoading && data?.data?.status === "active")
    return (
      <Wrapper className="my-7 h-full flex-1">
        <BackButton route="/dashboard" />
        <div className="text-center mt-7">
          <p className="text-lg">
            The client has accepted another freelancer&apos;s proposal for this
            project.
          </p>
        </div>
      </Wrapper>
    );

  return (
    <div className="my-12 h-full flex-1 ">
      <Wrapper>
        {/* Back button header */}
        <BackButton />

        {isLoading ? (
          <Loader />
        ) : (
          data?.data && (
            <>
              {/* Offer details banner */}
              <OfferDetailsBanner
                data={data?.data}
                updateProposalSubmitted={onProposalSubmitted}
              />

              {/* Offer other details */}
              <OfferOtherDetails
                data={data?.data}
                isProposalSubmitted={isProposalSubmitted}
              />
            </>
          )
        )}
      </Wrapper>
    </div>
  );
};

export default OfferDetails;
