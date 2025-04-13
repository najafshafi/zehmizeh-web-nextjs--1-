"use client";

/*
 * This component displays the proposal sent for the job *
 */

import { useCallback, useEffect, useState } from "react";
import StyledHtmlText from "@/components/ui/StyledHtmlText";
import AttachmentPreview from "@/components/ui/AttachmentPreview";
import { numberWithCommas } from "@/helpers/utils/misc";
import EditBlueIcon from "@/public/icons/edit-blue.svg";
import DeleteIcon from "@/public/icons/trash.svg";
import moment from "moment";
import DeleteProposalModal from "./modals/DeleteProposalModal";
import { getTimeEstimation } from "@/helpers/utils/helper";
import SubmitProposalModal from "@/components/jobs/SubmitProposalModal";
import { useRouter } from "next/navigation";
import ProposalMessageModal from "@/components/jobs/ProposalMessageModal";
import { WarningProposalMessageModal } from "@/components/jobs/WarningProposalMessageModal";
import { useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { reopenProposal } from "@/helpers/http/proposals";
import Image from "next/image";

interface ProposalDetailsProps {
  data: any;
  jobDetails: any;
  refetch: () => void;
  isDeleted: boolean;
}

const ProposalDetails = ({
  data,
  jobDetails,
  refetch,
  isDeleted,
}: ProposalDetailsProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showEditProposalModal, setShowEditProposalModal] =
    useState<boolean>(false);
  const [showDeleteProposalModal, setShowDeleteProposalModal] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [proMessModal, setProMessModal] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [warningPopupCount, setWarningPopupCount] = useState(0);

  const toggleEditProposalModal = () => {
    setShowEditProposalModal(!showEditProposalModal);
  };

  const toggleDeleteProposalModal = () => {
    setShowDeleteProposalModal(!showDeleteProposalModal);
  };

  const getMessageInvitePopupCount = useCallback(
    (jobId: string) => {
      const invites = queryClient.getQueryData(["get-received-invite"]) as
        | {
            data: Array<{
              job_post_id: string;
              message_freelancer_popup_count?: number;
            }>;
          }
        | undefined;
      const dashboardJobDetails = invites?.data?.find(
        (invite) => invite?.job_post_id === jobId
      );

      const clientJobDetails = queryClient.getQueryData([
        "jobdetails",
        jobId,
      ]) as { data: { message_freelancer_popup_count?: number } } | undefined;
      return (
        dashboardJobDetails?.message_freelancer_popup_count ||
        clientJobDetails?.data?.message_freelancer_popup_count ||
        0
      );
    },
    [queryClient]
  );

  const handleReOpenProposal = (proposal: { proposal_id?: string }) => {
    if (!proposal || !proposal?.proposal_id)
      return toast.error("Invalid request.");

    const response = reopenProposal({
      proposal_id: Number(proposal.proposal_id),
    });
    setLoading(true);

    toast.promise(response, {
      loading: "Re-opening proposal...",
      success: (data) => {
        setLoading(false);
        refetch();
        return data.message;
      },
      error: (error) => {
        setLoading(false);
        return error.response.data.message;
      },
    });
  };

  useEffect(() => {
    setWarningPopupCount(getMessageInvitePopupCount(data.job_post_id));
  }, [data.job_post_id, getMessageInvitePopupCount]);

  return (
    <div className="flex flex-col gap-5 mt-8 p-11 relative bg-white/70 shadow-[0px_4px_54px_rgba(0,0,0,0.04)] rounded-3xl">
      {/* Description */}
      <div className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold">
            <span>Proposal</span>
            {data?.date_created && (
              <div className="text-base font-normal">
                Submitted: {moment(data.date_created).format("MMM DD, YYYY")}
              </div>
            )}
          </div>

          {!isDeleted && (
            <div className="flex items-center">
              {data?.status === "pending" && data.is_proposal_deleted === 0 && (
                <>
                  <button
                    onClick={toggleEditProposalModal}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  >
                    <Image
                      src={EditBlueIcon}
                      alt="Edit"
                      width={20}
                      height={20}
                    />
                    <span className="text-blue-600">Edit</span>
                  </button>

                  <button
                    onClick={toggleDeleteProposalModal}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors duration-200 ml-4"
                  >
                    <Image
                      src={DeleteIcon}
                      alt="Delete"
                      width={20}
                      height={20}
                    />
                    <span className="text-red-500">Delete</span>
                  </button>
                </>
              )}
            </div>
          )}

          {data.is_proposal_deleted === 1 && (
            <button
              disabled={loading}
              onClick={() => handleReOpenProposal(data)}
              className="flex items-center gap-2 px-6 py-2 border border-gray-800 rounded-lg hover:bg-gray-800 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-gray-800 border-t-transparent rounded-full animate-spin" />
              )}
              Re-open
            </button>
          )}
        </div>

        <div className="text-lg font-normal opacity-70 leading-[160%]">
          <StyledHtmlText
            id="description"
            htmlString={data?.description}
            needToBeShorten={true}
          />
        </div>
      </div>

      {/* Other details */}
      <div className="flex flex-col gap-3.5">
        {/* Price */}
        <div className="flex items-center gap-2.5">
          <div className="text-base font-bold">Price:</div>
          <div className="text-base font-light">
            {numberWithCommas(data?.proposed_budget?.amount, "USD")}
            {data?.proposed_budget?.type == "hourly" ? `/hr` : ``}
          </div>
        </div>

        {/* Time estimation */}
        {data?.proposed_budget?.time_estimation && (
          <div className="flex items-center gap-2.5">
            <div className="text-base font-bold">Time Estimation: </div>
            <div className="text-base font-light">
              {getTimeEstimation(
                data?.proposed_budget?.time_estimation,
                data?.proposed_budget?.type == "hourly" ? "hours" : "weeks"
              )}
            </div>
          </div>
        )}

        {/* Terms and conditions */}
        {data?.terms_and_conditions && (
          <div className="flex flex-col">
            <div className="text-base font-bold">
              Special Terms & Conditions:
            </div>
            <div className="text-lg font-light opacity-70 leading-[160%]">
              <StyledHtmlText
                id="termsAndConditions"
                htmlString={data.terms_and_conditions}
                needToBeShorten={true}
              />
            </div>
          </div>
        )}

        {/* Questions */}
        {data?.questions && (
          <div className="flex flex-col">
            <div className="text-base font-bold">Questions:</div>
            <div className="text-lg font-light opacity-70 leading-[160%]">
              <StyledHtmlText
                id="questions"
                htmlString={data?.questions}
                needToBeShorten={true}
              />
            </div>
          </div>
        )}

        {/* Attachments */}
        {data?.attachments && data?.attachments?.length > 0 && (
          <div className="flex flex-col">
            <div className="text-base font-bold">Attachments:</div>
            <div className="flex flex-wrap mt-2">
              {data.attachments.map((attachment: any) => (
                <div key={attachment} className="m-1">
                  <AttachmentPreview
                    uploadedFile={attachment}
                    removable={false}
                    shouldShowFileNameAndExtension={false}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {!data?.threadExists &&
          jobDetails?.invite_status === "accepted" &&
          jobDetails?.status === "prospects" &&
          jobDetails?.proposal?.status === "pending" && (
            <div className="flex justify-end mt-3 gap-3">
              <button
                onClick={() => {
                  if (warningPopupCount < 3) {
                    setIsWarningModalOpen(true);
                    return;
                  } else {
                    setProMessModal(true);
                  }
                }}
                className="px-8 py-4 border border-gray-800 text-gray-800 rounded-full hover:bg-gray-800 hover:text-white transition-colors duration-200"
              >
                Message Client
              </button>
            </div>
          )}

        {data?.threadExists && (
          <div className="flex justify-end mt-3 gap-3">
            <button
              onClick={() => {
                return router.push(
                  `/messages-new/proposal_${data.proposal_id}`
                );
              }}
              className="px-8 py-4 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors duration-200"
            >
              Go To Chat
            </button>
          </div>
        )}
      </div>

      {/* Edit proposal modal */}
      <SubmitProposalModal
        show={showEditProposalModal}
        toggle={toggleEditProposalModal}
        data={data}
        onSubmitProposal={refetch}
      />

      {/* Delete proposal modal */}
      <DeleteProposalModal
        proposal_id={data.proposal_id}
        show={showDeleteProposalModal}
        toggle={toggleDeleteProposalModal}
      />

      {isWarningModalOpen && (
        <WarningProposalMessageModal
          show
          setShow={setIsWarningModalOpen}
          onContinue={() => {
            setProMessModal(true);
          }}
        />
      )}

      {proMessModal &&
        data &&
        !data?.threadExists &&
        jobDetails?._client_user_id && (
          <ProposalMessageModal
            show
            setShow={setProMessModal}
            freelancerName={`${jobDetails?.userdata?.first_name} ${jobDetails?.userdata?.last_name}`}
            proposal={{ ...data, _client_user_id: jobDetails._client_user_id }}
            jobId={jobDetails?.job_post_id}
            messagePopupCount={warningPopupCount}
          />
        )}
    </div>
  );
};

export default ProposalDetails;
