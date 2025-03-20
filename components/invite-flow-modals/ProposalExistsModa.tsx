import { Modal, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { StyledModal } from '@/components/styled/StyledModal';
import Link from 'next/link';

type Props = {
  show: boolean;
  job_post_id: string;
  toggle: () => void;
};

const ContentWrapper = styled.div`
  .invite-freelancer__message-box {
    padding: 1rem 1.25rem;
    margin-top: 2.5rem;
  }
`;

const ProjectLink = styled(Link)`
  color: rgb(242, 180, 32);
  text-decoration: underline;
`;

const ProposalExistsModal = ({ show, toggle, job_post_id }: Props) => {
  const onCloseModal = () => {
    toggle();
  };

  return (
    <StyledModal
      show={show}
      size="lg"
      onHide={onCloseModal}
      centered
      maxwidth={765}
    >
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={onCloseModal}>
          &times;
        </Button>
        <ContentWrapper>
          This freelancer already submitted a proposal to that project - click{' '}
          <ProjectLink href={`/client-job-details/${job_post_id}/applicants`}>
            here
          </ProjectLink>{' '}
          to see it!
        </ContentWrapper>
      </Modal.Body>
    </StyledModal>
  );
};

export default ProposalExistsModal;
