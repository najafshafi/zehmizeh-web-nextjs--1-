"use client";
import { useCallback, useEffect, useState } from "react";
import Spinner from "@/components/forms/Spin/Spinner";
import toast from "react-hot-toast";
import moment from "moment";
import styled from "styled-components";
import SubmitProposalModal from "@/components/jobs/SubmitProposalModal";
import { archiveUnarchiveProposal } from "@/helpers/http/proposals";
import BlurredImage from "@/components/ui/BlurredImage";
import { convertToTitleCase } from "@/helpers/utils/misc";
import { useAuth } from "@/helpers/contexts/auth-context";
import Tooltip from "@/components/ui/Tooltip";
import { useRouter, useParams } from "next/navigation";
import { useQueryClient } from "react-query";
import ProposalMessageModal from "@/components/jobs/ProposalMessageModal";
import { WarningInviteesMessageModal } from "@/components/jobs/WarningInviteesMessageModal";
import { breakpoints } from "@/helpers/hooks/useResponsive";
import CustomButton from "@/components/custombutton/CustomButton";

const Wrapper = styled.div`
  padding: 2.25rem;
  box-shadow: 0px 4px 60px rgba(0, 0, 0, 0.05);
  background: ${(props) => props.theme.colors.white};
  border: ${(props) => `1px solid ${props.theme.colors.yellow}`};
  border-radius: 12px;
  & > div {
    width: 100%;
  }
  .job-title-wrapper {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    justify-content: space-between;
    .banner-title {
      line-height: 2.1rem;
      margin-bottom: 1.25rem;
      & + div {
        min-width: 160px;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
  .attribute-gray-label {
    opacity: 0.5;
  }
  .posted-date {
    gap: 0.5rem;
  }
  .line-height-28 {
    line-height: 1.75rem;
  }
  .posted-by {
    margin-top: 1.75rem;
  }
  .devider {
    opacity: 0.1;
    margin: 0rem 1.25rem;
  }
  .buttons {
    gap: 1rem;
    align-items: flex-end;
    @media (max-width: 767px) {
      align-items: flex-start;
    }
    margin-top: auto;
  }
  .archived-badge {
    width: auto;
    color: #858585;
    background-color: rgba(29, 30, 27, 0.1);
    border-radius: 4px;
    padding: 0.5rem 1rem;
  }
  .pending-badge {
    color: #ebb05d;
    background-color: rgba(227, 177, 102, 0.19);
    border-radius: 4px;
    padding: 0.5rem 1rem;
  }
  .inviteButton {
    flex-wrap: wrap;
  }
  @media ${breakpoints.mobile} {
    .inviteButton {
      button {
        width: 100%;
      }
    }
    .posted-date {
      margin-top: 10px;
    }
    .job-title-wrapper {
      flex-direction: column;
      gap: 10px;
      .banner-title {
        line-height: 2.1rem;
        margin-bottom: 0px;
        & + div {
          width: 100%;
          justify-content: flex-start;
        }
      }
    }
  }
`;

const OfferDetailsBanner = ({ data, updateProposalSubmitted }: any) => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [archiving, setArchiving] = useState<boolean>(false);
  const [declineLoading, setDeclineLoading] = useState<boolean>(false);
  const [isProposalSubmitted, setIsProposalSubmitted] =
    useState<boolean>(false);
  const [isArchived, setArchived] = useState<boolean>(
    data?.invite_status == "archived" ? true : false
  );
  const [showSubmitProposalModal, setShowSubmitProposalModal] =
    useState<boolean>(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [proMessModal, setProMessModal] = useState(false);
  const [warningPopupCount, setWarningPopupCount] = useState(0);

  console.log("data: ", data);

  const toggleProposalModal = () => {
    setShowSubmitProposalModal(!showSubmitProposalModal);
  };

  const queryClient = useQueryClient();

  const { user } = useAuth();
  const onArchiveUnarchiveProposal = () => {
    setArchiving(true);
    archiveUnarchiveProposal(data?.job_post_id, !isArchived).then((res) => {
      setArchiving(false);
      if (res.status) {
        toast.success(res.message);
        setArchived(!isArchived);
      } else {
        toast.error(res.message);
      }
    });
  };

  const onDeclinedProposal = () => {
    setDeclineLoading(true);
    archiveUnarchiveProposal(data?.job_post_id, !isArchived, "declined").then(
      (res) => {
        setDeclineLoading(false);

        if (res.status) {
          toast.success(res.message);
          router.push("/dashboard");
        } else {
          toast.error(res.message);
        }
      }
    );
  };

  const onSubmitProposal = () => {
    setIsProposalSubmitted(true);
    toggleProposalModal();
    updateProposalSubmitted();
    if (id) router.push(`/job-details/${id}/proposal_sent`);
  };

  const isProjectProposalDisabled = !(
    user?.is_account_approved &&
    user.stp_account_id &&
    user?.stp_account_status === "verified"
  );

  type InviteType = {
    job_post_id: string;
    message_freelancer_popup_count?: number;
  };

  const getMessageInvitePopupCount = useCallback(
    (jobId: string) => {
      const invites = queryClient.getQueryData<{ data: InviteType[] }>([
        "get-received-invite",
      ]);
      const dashboardJobDetails = invites?.data?.find(
        (invite) => invite?.job_post_id === jobId
      );

      const clientJobDetails = queryClient.getQueryData<{
        data: { message_freelancer_popup_count?: number };
      }>(["jobdetails", jobId]);
      return (
        dashboardJobDetails?.message_freelancer_popup_count ||
        clientJobDetails?.data?.message_freelancer_popup_count ||
        0
      );
    },
    [queryClient]
  );

  useEffect(() => {
    setWarningPopupCount(getMessageInvitePopupCount(data.job_post_id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  return (
    <>
      {proMessModal && data && !data?.threadExists && (
        <ProposalMessageModal
          show
          setShow={setProMessModal}
          freelancerName={`${data?.userdata?.first_name} ${data?.userdata?.last_name}`}
          proposal={data}
          jobId={data?.job_post_id}
          messagePopupCount={warningPopupCount}
        />
      )}
      {isWarningModalOpen && (
        <WarningInviteesMessageModal
          show
          setShow={setIsWarningModalOpen}
          onContinue={() => {
            setProMessModal(true);
          }}
        />
      )}
      <Wrapper className="flex justify-between flex-wrap gap-4 mt-4">
        {/* START ----------------------------------------- Job title */}
        <div>
          <div className="job-title-wrapper">
            <div className="banner-title text-2xl font-normal capital-first-ltr">
              {convertToTitleCase(data.job_title)}
            </div>
            {/* START ----------------------------------------- Archive and unarchive */}
            {!isProposalSubmitted && (
              <div onClick={onArchiveUnarchiveProposal}>
                {!archiving ? (
                  !isArchived ? (
                    <div
                      className={
                        "font-normal cursor-pointer text-red-500 w-max"
                      }
                    >
                      Put Aside in Archive
                    </div>
                  ) : (
                    <div>
                      <CustomButton
                        text="Unarchive"
                        className="px-8 py-4 text-center  transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full  text-[18px] border border-[#EE761C] hover:bg-black hover:text-white hover:border-none"
                        onClick={onArchiveUnarchiveProposal}
                        disabled={archiving}
                      />
                    </div>
                  )
                ) : (
                  <Spinner className="w-5 h-5" />
                )}
              </div>
            )}
            {/* END ------------------------------------------- Archive and unarchive */}
          </div>
          {/* END ------------------------------------------- Job title */}

          {/* START ----------------------------------------- Posted date */}
          <div className="posted-date flex items-center flex-wrap">
            <div className="attribute-gray-label line-height-28 text-xl font-normal">
              Posted:
            </div>
            <div className="attribute-value line-height-28 text-xl font-normal">
              {moment(data?.date_created).format("MMM DD, YYYY")}
            </div>
          </div>
          {/* END ------------------------------------------- Posted date */}

          {/* START ----------------------------------------- Client name */}
          <div className="posted-by flex items-center gap-1">
            <BlurredImage
              src={data?.userdata?.user_image || "/images/default_avatar.png"}
              height="52px"
              width="52px"
              allowToUnblur={false}
            />
            <div>
              <div className="attribute-gray-label text-sm font-normal">
                Client:
              </div>
              <div className="text-xl font-normal line-height-28 capitalize">
                {data?.userdata?.first_name} {data?.userdata?.last_name}
              </div>
            </div>
          </div>
          {/* END ------------------------------------------- Client name */}
        </div>

        {/* START ----------------------------------------- Submit, decline invite or message client buttons */}
        {!isArchived ? (
          !isProposalSubmitted ? (
            <>
              <div className="bottom-buttons flex gap-3 inviteButton">
                {isProjectProposalDisabled && (
                  <Tooltip className="stripe-tooltip">
                    {!["verified"].includes(user.stp_account_status)
                      ? "Before you can respond to this invitation, please complete your Stripe activation."
                      : "Before you can respond to this invitation, make sure to complete your profile to be considered for approval."}
                  </Tooltip>
                )}
                {/* <StyledButton
                  variant="outline-dark"
                  className="width-fit-content"
                  border="0.87px solid #EE761C"
                  onClick={() => {
                    if (data?.threadExists)
                      return router.push(
                        `/messages-new/invite_${data?.invite_id}`
                      );
                    // warning modal should be shown 3 times per project after that it shouldnt show
                    if (warningPopupCount < 3) {
                      setIsWarningModalOpen(true);
                      return;
                    }
                    setProMessModal(true);
                  }}
                >
                  {data?.threadExists ? "Go To Chat" : "Message Client"}
                </StyledButton> */}

                <CustomButton
                  text={data?.threadExists ? "Go To Chat" : "Message Client"}
                  className="px-8 py-4 w-full  md:max-w-[200px] transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full  text-[18px] border border-[#EE761C] mt-3  hover:bg-black hover:text-white
                  hover:border-none"
                  onClick={() => {
                    if (data?.threadExists)
                      return router.push(
                        `/messages-new/invite_${data?.invite_id}`
                      );
                    // warning modal should be shown 3 times per project after that it shouldnt show
                    if (warningPopupCount < 3) {
                      setIsWarningModalOpen(true);
                      return;
                    }
                    setProMessModal(true);
                  }}
                  disabled={declineLoading}
                />

                {/* <StyledButton
                  variant="outline-dark"
                  className="width-fit-content flex items-center gap-2"
                  padding="10px 55px 10px 55px !important"
                  border="0.87px solid #EE761C"
                  onClick={onDeclinedProposal}
                  disabled={declineLoading}
                >
                  {declineLoading && <Spinner size="sm" />}
                  Decline Invite
                </StyledButton> */}

                <CustomButton
                  text={
                    declineLoading ? (
                      <Spinner className="w-4 h-4" />
                    ) : (
                      "Decline Invite"
                    )
                  }
                  className="px-8 py-4 text-center w-full  md:max-w-[200px] transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full  text-[18px] border border-[#EE761C] mt-3 hover:bg-black hover:text-white hover:border-none"
                  onClick={onDeclinedProposal}
                  disabled={declineLoading}
                />

                {/* <StyledButton
                  disabled={isProjectProposalDisabled}
                  padding="10px 28px 10px 28px !important"
                  onClick={toggleProposalModal}
                >
                  Submit Proposal
                </StyledButton> */}
                <CustomButton
                  className="px-8 py-4 text-center w-full  md:max-w-[200px] transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px] mt-3"
                  disabled={isProjectProposalDisabled}
                  onClick={toggleProposalModal}
                  text="Submit Proposal"
                />
              </div>
            </>
          ) : (
            <div className="pending-badge text-sm font-normal width-fit-content">
              Pending
            </div>
          )
        ) : (
          <div className="archived-badge text-sm font-normal width-fit-content">
            Archived
          </div>
        )}
        {/* END ------------------------------------------- Submit, decline invite or message client buttons */}
      </Wrapper>
      <SubmitProposalModal
        show={showSubmitProposalModal}
        toggle={toggleProposalModal}
        data={data}
        onSubmitProposal={onSubmitProposal}
      />
    </>
  );
};

export default OfferDetailsBanner;
