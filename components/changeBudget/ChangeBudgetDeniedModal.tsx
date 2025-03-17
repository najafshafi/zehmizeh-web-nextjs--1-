import { StyledButton } from '@/components/forms/Buttons';
import { StyledModal } from '@/components/styled/StyledModal';
import { budgetChangeSeenDeniedModal } from '@/helpers/http/proposals';
import { TapiResponse } from '@/helpers/types/apiRequestResponse';
import { TJobDetails } from '@/helpers/types/job.type';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';

type Props = {
  jobDetails: TJobDetails;
  refetch: () => void;
  userType: 'client' | 'freelancer';
};

export const ChangeBudgetDeniedModal = ({
  jobDetails,
  refetch,
  userType,
}: Props) => {
  const jobTypeText =
    jobDetails.proposal.approved_budget.type === 'fixed'
      ? 'budget'
      : 'hourly rate';

  /*
      1. is_seen_denied_modal is 0 so user hasn't already seen denied modal
      2. budget change status is denied
      3. user who requested budget change should be same as current user
      */
  const shouldShowModal =
    jobDetails?.proposal?.budget_change?.is_seen_denied_modal === 0 &&
    jobDetails?.proposal?.budget_change?.status === 'denied' &&
    jobDetails?.proposal?.budget_change?.requested_by === userType;

  const [isLoading, setIsLoading] = useState(false);

  // budget seen flag change and refetch jobdetails
  const apiCalls = async () => {
    const res = await budgetChangeSeenDeniedModal({
      job_post_id: jobDetails.job_post_id,
      is_seen_denied_modal: 1,
    });
    await refetch();
    return res;
  };

  // call api
  const handleOkay = () => {
    setIsLoading(true);
    toast.promise(apiCalls(), {
      loading: 'Please wait...',
      success: (res: TapiResponse<unknown>) => {
        setIsLoading(false);
        return res?.message;
      },
      error: (err) => {
        setIsLoading(false);
        return err?.response?.data?.message || 'error';
      },
    });
  };

  const textContent =
    userType === 'client'
      ? `Your freelancer has declined your ${jobTypeText} decrease request.`
      : `Your client has declined your ${jobTypeText} increase request.`;

  return (
    <StyledModal show={shouldShowModal} size="lg" centered>
      <Modal.Body>
        <div className="text-center">
          <div className="fs-32 fw-400">{textContent}</div>
          <div className="mt-4">
            <StyledButton
              variant="primary"
              type="submit"
              onClick={handleOkay}
              disabled={isLoading}
            >
              Okay
            </StyledButton>
          </div>
        </div>
      </Modal.Body>
    </StyledModal>
  );
};
