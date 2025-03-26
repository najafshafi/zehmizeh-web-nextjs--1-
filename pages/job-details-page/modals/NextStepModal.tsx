import { Modal, Button } from "react-bootstrap";
import { StyledModal } from "@/components/styled/StyledModal";
import { StyledButton } from "@/components/forms/Buttons";

type Props = {
  show: boolean;
  toggle: () => void;
};

const NextStepModal = ({ show, toggle }: Props) => {
  return (
    <StyledModal maxwidth={570} show={show} size="sm" onHide={toggle} centered>
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={toggle}>
          &times;
        </Button>
        <div className="fs-24 font-normal mb-4">Next Step</div>
        <div className="fs-1rem fw-700">
          The client has accepted your proposal - mazal tov!
          <span className="fw-300">
            {" "}
            Because this is a Project-Based project, the next step is to discuss
            the project's milestones with your client.
          </span>
        </div>
        <div className="fs-1rem fw-300 mt-3">
          The milestone system is a way of breaking up the project into pieces,
          allowing the freelancer to get paid as they complete work. For
          example, if you were ghostwriting a book, you could divide the book
          into 10 chapters and propose 1 milestone for each chapter. That way,
          you could get paid every time a chapter is finished.
        </div>
        <div className="fs-1rem fw-300 mt-3">
          There's no requirement to break up the project into pieces. You're
          always welcome to post one milestone and charge for the whole project
          at once.
        </div>
        <div className="fs-1rem fw-300 mt-3">
          Use the "Messages" tab to communicate your preferences with the
          client. Visit the Help Center pages for more info about milestones,
          (see the yellow icon in the bottom-right corner).
        </div>
        <div className="flex justify-end mt-3">
          <StyledButton onClick={toggle}>I Understand</StyledButton>
        </div>
      </Modal.Body>
    </StyledModal>
  );
};

export default NextStepModal;
