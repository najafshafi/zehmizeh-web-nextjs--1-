/*
 * This component is a modal for delete proposal *
 */

import { Modal, Button, Spinner } from 'react-bootstrap';
import { StyledModal } from '@/components/styled/StyledModal';
import { StyledButton } from '@/components/forms/Buttons';
import toast from 'react-hot-toast';
import { deleteProposal } from '@/helpers/http/proposals';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  show: boolean;
  toggle: () => void;
  proposal_id: number;
}

const DeleteProposalModal = ({ show, toggle, proposal_id }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const onCloseModal = () => toggle();

  const deleteProposalHandler = () => {
    if (!proposal_id) return;

    setLoading(true);

    const promise = deleteProposal({ proposal_id });
    toast.promise(promise, {
      loading: 'deleting proposal...',

      error: (error) => {
        setLoading(false);
        return error?.response?.data?.message ?? error?.message;
      },

      success: (resp) => {
        setLoading(false);
        navigate(-1);
        return resp.message ?? 'Proposal deleted successfully';
      },
    });
  };

  return (
    <StyledModal
      maxwidth={718}
      show={show}
      size="lg"
      onHide={onCloseModal}
      centered
    >
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={onCloseModal}>
          &times;
        </Button>
        <p className="fs-18 mb-0 text-center">
          Are you sure you would like to delete this proposal?
        </p>
        <p className="fs-18 text-center mt-1">
          <b>You will not be able to send a new proposal for this project.</b>
        </p>
        <div className="d-flex align-items-center justify-content-center gap-3 mt-4">
          <StyledButton
            className="d-flex align-items-center gap-2"
            disabled={loading}
            onClick={deleteProposalHandler}
          >
            {loading && <Spinner size="sm" animation="border" />} Yes - Delete
          </StyledButton>
          <StyledButton onClick={toggle} variant="outline-dark">
            No - Keep Proposal
          </StyledButton>
        </div>
      </Modal.Body>
    </StyledModal>
  );
};

export default DeleteProposalModal;
