import { StyledButton } from "@/components/forms/Buttons";
import { StyledModal } from "@/components/styled/StyledModal";
import { Button, Modal } from "react-bootstrap";
import styled from "styled-components";

interface Props {
  show: boolean;
  onClose: () => void;
}

const Wrapper = styled.div`
  .link {
    color: #f2b420;
    text-decoration: underline;
    cursor: pointer;
  }

  .close {
    postition: relative;
    top: -16px;
    right: 5px;
  }
`;

const helpCenter = () =>
  window.open("https://intercom.help/zehmizehfaq/en", "_blank");

const NewPaymentInfoModal = ({ onClose, show }: Props) => {
  return (
    <StyledModal maxwidth={580} show={show} size="sm" onHide={onClose} centered>
      <Modal.Body>
        <Wrapper>
          <Button variant="transparent" className="close" onClick={onClose}>
            &times;
          </Button>

          <div className="content">
            <h3 className="fs-36 fw-700 text-center mb-4">
              You&apos;re Ready to Go!
            </h3>
            <ul>
              <li className="mt-3" style={{ listStyle: "none" }}>
                Now that you&apos;ve added payment details, you&apos;re ready
                to post projects. Click the yellow &quot;Post Project&quot;
                button in the top-right to make a new post!
              </li>
              <li className="mt-3" style={{ listStyle: "none" }}>
                For more information on how to use ZMZ, see our&nbsp;
                <span onClick={helpCenter} className="link">
                  FAQs.
                </span>
              </li>
            </ul>

            <div className="d-flex justify-content-center mt-4">
              <StyledButton
                onClick={() => onClose()}
                padding="1.125rem 2.25rem"
                variant="primary"
              >
                Close
              </StyledButton>
            </div>
          </div>
        </Wrapper>
      </Modal.Body>
    </StyledModal>
  );
};

export default NewPaymentInfoModal;
