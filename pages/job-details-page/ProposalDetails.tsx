/*
 * This component displays the proposal sent for the job *
 */

import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import StyledHtmlText from '@/components/ui/StyledHtmlText';
import AttachmentPreview from '@/components/ui/AttachmentPreview';
import { numberWithCommas } from '@/helpers/utils/misc';
import EditBlueIcon from '@/public/icons/edit-blue.svg';
import DeleteIcon from '@/public/icons/trash.svg';
import { transition } from '@/styles/transitions';
import moment from 'moment';
import DeleteProposalModal from './modals/DeleteProposalModal';
import { getTimeEstimation } from '@/helpers/utils/helper';
import SubmitProposalModal from '@/components/jobs/SubmitProposalModal';
import { StyledButton } from '@/components/forms/Buttons';
import { useRouter } from 'next/navigation';
import ProposalMessageModal from '@/components/jobs/ProposalMessageModal';
import { WarningProposalMessageModal } from '@/components/jobs/WarningProposalMessageModal';
import { useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { reopenProposal } from '@/helpers/http/proposals';
import { Spinner } from 'react-bootstrap';

const Wrapper = styled.div`
  gap: 1.25rem;
  margin-top: 2rem;
  padding: 2.875rem;
  position: relative;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0px 4px 54px rgba(0, 0, 0, 0.04);
  border-radius: 0.75rem;
  .description-text {
    opacity: 0.7;
    line-height: 160%;
  }
  .proposal-details-item {
    gap: 0.875rem;
    .row-item {
      gap: 10px;
    }
  }
  .attachments {
    background-color: #f8f8f8;
    border: 1px solid #dedede;
    padding: 0.75rem 1.25rem;
    border-radius: 0.5rem;
    gap: 10px;
  }
  .edit-btn {
    background-color: rgba(209, 229, 255, 0.3);
    border-radius: 0.5rem;
    height: 44px;
    gap: 0.5rem;
    padding: 0 1rem;
    ${() => transition()};
    span {
      color: #0067ff;
    }
  }

  .delete-btn {
    background-color: #fbf5e8;
    border-radius: 0.5rem;
    margin-left: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 44px;
    gap: 0.5rem;
    padding: 0 1rem;
    ${() => transition()}
    span {
      color: #f72b2b;
    }
  }
`;

interface ProposalDetailsProps {
  data: any;
  jobDetails: any;
  refetch: () => void;
  isDeleted: boolean;
}

const ProposalDetails = ({ data, jobDetails, refetch, isDeleted }: ProposalDetailsProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showEditProposalModal, setShowEditProposalModal] = useState<boolean>(false);
  const [showDeleteProposalModal, setShowDeleteProposalModal] = useState<boolean>(false);
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
      const invites = queryClient.getQueryData(['get-received-invite']) as { data: Array<{ job_post_id: string; message_freelancer_popup_count?: number }> } | undefined;
      const dashboardJobDetails = invites?.data?.find((invite) => invite?.job_post_id === jobId);

      const clientJobDetails = queryClient.getQueryData(['jobdetails', jobId]) as { data: { message_freelancer_popup_count?: number } } | undefined;
      return (
        dashboardJobDetails?.message_freelancer_popup_count ||
        clientJobDetails?.data?.message_freelancer_popup_count ||
        0
      );
    },
    [queryClient]
  );

  const handleReOpenProposal = (proposal: { proposal_id?: string }) => {
    if (!proposal || !proposal?.proposal_id) return toast.error('Invalid request.');

    const response = reopenProposal({ proposal_id: proposal?.proposal_id });
    setLoading(true);

    toast.promise(response, {
      loading: 'Re-opening proposal...',
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  console.log('data: ', data);
  return (
    <Wrapper className="flex flex-col">
      {/* START ----------------------------------------- Description */}
      <div className="proposal-details-item flex flex-col">
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold">
            <span>Proposal</span>
            {/* START ----------------------------------------- Proposal Date */}
            {data?.date_created && (
              <div className="text-base font-normal">Submitted: {moment(data.date_created).format('MMM DD, YYYY')}</div>
            )}
            {/* END ------------------------------------------- Proposal Date */}
          </div>
          {/* Edit icon */}
          {!isDeleted && (
            <div className="flex items-center">
              {data?.status === 'pending' && data.is_proposal_deleted === 0 && (
                <>
                  <div
                    className="edit-btn flex justify-center items-center cursor-pointer"
                    onClick={toggleEditProposalModal}
                  >
                    <EditBlueIcon stroke="#0067FF" fill="#0067FF" />
                    <span>Edit</span>
                  </div>

                  <div className="delete-btn p-2 cursor-pointer flex items-center" onClick={toggleDeleteProposalModal}>
                    <DeleteIcon />
                    <span>Delete</span>
                  </div>
                </>
              )}
            </div>
          )}

          {data.is_proposal_deleted === 1 && (
            <StyledButton
              disabled={loading}
              variant="outline-dark"
              type="submit"
              className="flex items-center gap-3"
              onClick={() => handleReOpenProposal(data)}
            >
              {loading && <Spinner size="sm" animation="border" />} Re-open
            </StyledButton>
          )}
        </div>

        <div className="description-text text-lg font-normal">
          <StyledHtmlText id="description" htmlString={data?.description} needToBeShorten={true} />
        </div>
      </div>
      {/* END ------------------------------------------- Description */}

      {/* Other details */}
      <div className="proposal-details-item flex flex-col">
        {/* START ----------------------------------------- Price */}
        <div className="row-item flex items-center">
          <div className="text-base font-bold">Price:</div>
          <div className="text-base font-light">
            {numberWithCommas(data?.proposed_budget?.amount, 'USD')}
            {data?.proposed_budget?.type == 'hourly' ? `/hr` : ``}
          </div>
        </div>
        {/* END ------------------------------------------- Price */}

        {/* START ----------------------------------------- Time estimation */}
        {data?.proposed_budget?.time_estimation && (
          <div className="row-item flex items-center">
            <div className="text-base font-bold">Time Estimation: </div>
            <div className="text-base font-light">
              {getTimeEstimation(
                data?.proposed_budget?.time_estimation,
                data?.proposed_budget?.type == 'hourly' ? 'hours' : 'weeks'
              )}
            </div>
          </div>
        )}
        {/* END ------------------------------------------- Time estimation */}

        {/* START ----------------------------------------- Terms and conditions */}
        {data?.terms_and_conditions && (
          <div className="flex flex-col">
            <div className="text-base font-bold">Special Terms & Conditions:</div>
            <div className="description-text text-lg font-light">
              <StyledHtmlText id="termsAndConditions" htmlString={data.terms_and_conditions} needToBeShorten={true} />
            </div>
          </div>
        )}
        {/* END ------------------------------------------- Terms and conditions */}

        {/* START ----------------------------------------- Questions */}
        {data?.questions && (
          <div className="flex flex-col">
            <div className="text-base font-bold">Questions:</div>
            <div className="description-text text-lg font-light">
              <StyledHtmlText id="questions" htmlString={data?.questions} needToBeShorten={true} />
            </div>
          </div>
        )}
        {/* END ------------------------------------------- Questions */}

        {/* START ----------------------------------------- Attachments */}
        {data?.attachments && data?.attachments?.length > 0 && (
          <div className="row-item">
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
        {/* END ------------------------------------------- Attachments */}
        {!data?.threadExists &&
          jobDetails?.invite_status === 'accepted' &&
          jobDetails?.status === 'prospects' &&
          jobDetails?.proposal?.status === 'pending' && (
            <div className="flex justify-end mt-3 gap-3 ">
              <div className="border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white rounded-full">
                <StyledButton
                  padding="1rem 2rem"
                  variant="outline-dark"
                onClick={() => {
                  if (warningPopupCount < 3) {
                    setIsWarningModalOpen(true);
                    return;
                  } else {
                    setProMessModal(true);
                  }
                }}
              >
                Message Client
              </StyledButton>
              </div>
            </div>
          )}
        {data?.threadExists && (
          <div className="flex justify-end mt-3 gap-3">
            <StyledButton
              padding="1rem 2rem"
              variant="primary"
              onClick={() => {
                return router.push(`/messages-new/proposal_${data.proposal_id}`);
              }}
            >
              Go To Chat
            </StyledButton>
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

      {proMessModal && data && !data?.threadExists && jobDetails?._client_user_id && (
        <ProposalMessageModal
          show
          setShow={setProMessModal}
          freelancerName={`${jobDetails?.userdata?.first_name} ${jobDetails?.userdata?.last_name}`}
          proposal={{ ...data, _client_user_id: jobDetails._client_user_id }}
          jobId={jobDetails?.job_post_id}
          messagePopupCount={warningPopupCount}
        />
      )}
    </Wrapper>
  );
};

export default ProposalDetails;
