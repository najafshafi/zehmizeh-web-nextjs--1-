import { Modal, Button } from 'react-bootstrap';
import Filters from './Filters';
import { StyledModal } from '@/components/styled/StyledModal';

// This is a modal for displaying filters in mobile view

type Props = {
  isSkillAndCategoryModalOpen?: boolean;
  onClose: () => void;
  show: boolean;
};

const MobileFilterModal = ({
  show,
  onClose,
  isSkillAndCategoryModalOpen,
}: Props) => {
  return (
    <StyledModal
      maxwidth={678}
      show={show}
      size="sm"
      onHide={onClose}
      $hideModal={isSkillAndCategoryModalOpen}
    >
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={onClose}>
          &times;
        </Button>

        {/* Filters */}
        <Filters showApplyBtn onApply={onClose} />

        {/*  */}
      </Modal.Body>
    </StyledModal>
  );
};

export default MobileFilterModal;
