import { StyledButton } from "@/components/forms/Buttons";
import { StyledModal } from "@/components/styled/StyledModal";
import useResponsive from "@/helpers/hooks/useResponsive";
import { Modal } from "react-bootstrap";

type Props = {
  show: boolean;
  loading: boolean;
  onConfirm: (selectedOption: "not_yet" | "decline_closure" | "accept") => void;
};

export const JobClosuremodalProjectBased = ({
  show,
  loading,
  onConfirm,
}: Props) => {
  const { isMobile } = useResponsive();

  return (
    <StyledModal maxwidth={800} show={show} size="lg" centered scrollable>
      <Modal.Body>
        <div className="d-flex flex-column justify-content-center">
          <div className="fs-24 fw-700 text-center mb-3">
            The Client Requests to Close the Project
          </div>
          <p className="mt-2 fs-18 font-normal text-start">
            Your client is requesting that this project be closed. Since you
            have not been paid for any milestones, you can decline this request
            if you wish.
          </p>
          <p className="mt-2 fs-18 font-normal text-start">
            Any project that is closed before the freelancer has been paid is
            automatically marked as <b>Incomplete</b>. Having been part of this
            project therefore does not contribute to your record on ZMZ. You and
            your client will both be unable to leave ratings or feedback.
          </p>
          <p className="mt-2 fs-18 font-normal text-start">
            If no decision is made, the project will be closed automatically 3
            weeks after the client's closure request.
          </p>
          <ul>
            <li className="mt-2 fs-18 font-normal text-start">
              To keep the project open, click <b>Decline Closure Request</b>{" "}
              below.
            </li>
            <li className="mt-2 fs-18 font-normal text-start">
              To close the project, press <b>Accept & Close</b> below. This
              cannot be undone.
            </li>
          </ul>
          <div className="d-flex flex-column justify-content-center align-items-center gap-md-3 gap-2 mt-md-4 mt-3">
            <StyledButton
              className={`fs-16 font-normal ${isMobile ? "w-100" : "w-50"}`}
              variant="outline-dark"
              padding="0.8125rem 2rem"
              onClick={() => onConfirm("not_yet")}
              disabled={loading}
            >
              Not Yet
            </StyledButton>

            <StyledButton
              className={`fs-16 font-normal ${isMobile ? "w-100" : "w-50"}`}
              variant="outline-dark"
              padding="0.8125rem 2rem"
              onClick={() => onConfirm("decline_closure")}
              disabled={loading}
            >
              Decline Closure Request
            </StyledButton>

            <StyledButton
              className={`fs-16 font-normal ${isMobile ? "w-100" : "w-50"}`}
              variant="outline-dark"
              padding="0.8125rem 2rem"
              onClick={() => onConfirm("accept")}
              disabled={loading}
            >
              Accept & Close
            </StyledButton>
          </div>
        </div>
      </Modal.Body>
    </StyledModal>
  );
};
