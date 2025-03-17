import { StyledButton } from '@/components/forms/Buttons';
import { StyledModal } from '@/components/styled/StyledModal';
import { budgetChangeDeleteRequest } from '@/helpers/http/proposals';
import { TapiResponse } from '@/helpers/types/apiRequestResponse';
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';

type Props = {
  show: boolean;
  setShow: (show: boolean) => void;
  jobPostId: string;
  refetch: () => void;
};

export const ChangeBudgetDeleteRequest = ({
  show,
  setShow,
  jobPostId,
  refetch,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const apiCall = async () => {
    const res = await budgetChangeDeleteRequest(jobPostId);
    await refetch();
    return res;
  };

  const handleDelete = () => {
    setIsLoading(true);
    toast.promise(apiCall(), {
      loading: 'Please wait...',
      success: (res: TapiResponse<unknown>) => {
        setIsLoading(false);
        setShow(false);
        return res?.message;
      },
      error: (err) => {
        setIsLoading(false);
        return err?.response?.data?.message || 'error';
      },
    });
  };

  return (
    <StyledModal show={show} size="lg" centered onHide={() => setShow(false)}>
      <Modal.Body>
        <Button
          variant="transparent"
          className="close"
          onClick={() => setShow(false)}
        >
          &times;
        </Button>
        <div className="text-center">
          <div className="fs-32 fw-400">
            Are you sure you want to delete this request?
          </div>

          <div className="d-flex flex-row justify-content-center gap-4 mt-4">
            <StyledButton
              variant="secondary"
              type="submit"
              onClick={() => setShow(false)}
              disabled={isLoading}
            >
              No
            </StyledButton>
            <StyledButton
              variant="danger"
              type="submit"
              onClick={handleDelete}
              disabled={isLoading}
            >
              Yes
            </StyledButton>
          </div>
        </div>
      </Modal.Body>
    </StyledModal>
  );
};
