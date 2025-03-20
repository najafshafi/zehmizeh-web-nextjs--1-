import { Modal } from "react-bootstrap";
import { StyledModal } from "@/components/styled/StyledModal";
import { StyledButton } from "@/components/forms/Buttons";

type Props = {
  show: boolean;
  onConfirm: (selection: string) => void;
  loading?: boolean;
};

const JobClosureModal = ({ show, onConfirm, loading = false }: Props) => {
  const handleSelection = (option: string) => () => {
    onConfirm(option);
  };

  return (
    <StyledModal maxwidth={556} show={show} size="sm" centered scrollable>
      <Modal.Body>
        <div className="flex flex-column justify-center">
          <div className="fs-24 fw-700 text-center mb-3">
            The client is ending this project.
          </div>
          <div className="fs-18 font-normal text-center mb-2">
            There are three actions you can take.
          </div>
          <ul>
            <li className="mt-2 fs-18 font-normal text-start">
              If you’ve already been paid for all of the work you’ve done on
              this project, press “Accept Closure” below to close the project.
            </li>
            <li className="mt-2 fs-18 font-normal text-start">
              If you've completed work that you haven't been paid for yet, you
              have the opportunity to submit one last hour submission by
              selecting "Submit Final Hours." This project will close once these
              hours are paid for, so be sure to include all remaining unpaid
              hours in your submission.
            </li>
            <li className="mt-2 fs-18 font-normal text-left">
              If you need to speak to the client before closing, press “Delay
              Closure” below.
            </li>
          </ul>
          <div className="fs-18 font-normal text-center">
            What would you like to do?
          </div>
          <div className="flex flex-column gap-md-3 gap-2 mt-md-4 mt-3">
            <StyledButton
              className="fs-16 font-normal w-100"
              variant="outline-dark"
              padding="0.8125rem 2rem"
              onClick={handleSelection("end_job")}
              disabled={loading}
            >
              {/* I have no remaining hours to post - end the job */}Accept
              Closure
            </StyledButton>

            <StyledButton
              className="fs-16 font-normal w-100"
              variant="outline-dark"
              padding="0.8125rem 2rem"
              onClick={handleSelection("final_milestone")}
              disabled={loading}
            >
              Submit Final Hours
            </StyledButton>

            <StyledButton
              className="fs-16 font-normal w-100"
              variant="outline-dark"
              padding="0.8125rem 2rem"
              onClick={handleSelection("decide_later")}
              disabled={loading}
            >
              Delay Closure
            </StyledButton>
          </div>
        </div>
      </Modal.Body>
    </StyledModal>
  );
};

export default JobClosureModal;
