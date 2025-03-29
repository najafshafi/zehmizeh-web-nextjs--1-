import { StyledButton } from "@/components/forms/Buttons";
import { StyledModal } from "@/components/styled/StyledModal";
import { breakpoints } from "@/helpers/hooks/useResponsive";
import { Button, Modal } from "react-bootstrap";
import styled from "styled-components";

type Props = {
  show: boolean;
  onCloseModal: () => void;
  isLoading: boolean;
  handleClick: (type: "public" | "hidden") => void;
};

const Wrapper = styled.div`
  text-align: center;
  h4 {
    text-align: center;
    margin-bottom: 1.5rem;
  }
  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 30px;
    margin-top: 2rem;
    @media ${breakpoints.mobile} {
      flex-direction: column;
      width: 100%;
      gap: 20px;
    }
  }
`;

export const PostVisibilityModal = ({
  show,
  onCloseModal,
  isLoading,
  handleClick,
}: Props) => {
  return (
    <StyledModal maxwidth={767} show={show} size="sm" centered>
      <Modal.Body>
        {!isLoading && (
          <Button
            variant="transparent"
            className="close"
            onClick={onCloseModal}
          >
            &times;
          </Button>
        )}
        <Wrapper>
          <h4>Who should see the project?</h4>
          <span className="fs-18">
            <p className="mb-2">
              If you'd like to post so all ZMZ freelancers can see it, click{" "}
              <b>"Post Publicly."</b>
            </p>
            <p>
              If you'd like only freelancers you invite to have access, click{" "}
              <b>"Post Hidden."</b>
            </p>
          </span>
          <div className="buttons">
            <StyledButton
              className="fs-16 fw-400"
              variant="primary"
              padding="0.8125rem 2rem"
              type="submit"
              disabled={isLoading}
              onClick={() => handleClick("public")}
            >
              Post Publicly
            </StyledButton>
            <StyledButton
              className="fs-16 fw-400"
              variant="primary"
              padding="0.8125rem 2rem"
              type="submit"
              disabled={isLoading}
              onClick={() => handleClick("hidden")}
            >
              Post Hidden
            </StyledButton>
          </div>
        </Wrapper>
      </Modal.Body>
    </StyledModal>
  );
};
