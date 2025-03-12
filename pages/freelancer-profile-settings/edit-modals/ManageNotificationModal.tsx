import { Modal, Button } from "react-bootstrap";
import { StyledModal } from "@/components/styled/StyledModal";
import { StyledButton } from "@/components/forms/Buttons";
import styled from "styled-components";
import Select from "react-select";
import { useEffect, useState } from "react";
import LoadingButtons from "@/components/LoadingButtons";

const Wrapper = styled.div`
  .close-btn {
    border: 1px solid ${(props) => props.theme.statusColors.darkPink.color};
    color: ${(props) => props.theme.statusColors.darkPink.color};
    :hover {
      background-color: inherit;
    }
  }
`;

const options = [
  { value: "1", label: "Once A Week" },
  { value: "2", label: "Twice A Week" },
  { value: "3", label: "Disable Job Alerts" },
];

const defaultOptions = {
  1: { value: "1", label: "Once A Week" },
  2: { value: "2", label: "Twice A Week" },
  3: { value: "3", label: "Disable Job Alerts" },
};

type Props = {
  show: boolean;
  toggle: () => void;
  onConfirm: (data) => void;
  loading: boolean;
  defaultEmailNotification: any;
};

const ManageNotificationModal = ({
  show,
  toggle,
  onConfirm,
  loading,
  defaultEmailNotification = 1,
}: Props) => {
  const [selectedOPT, setSelectedOPT] = useState(
    defaultOptions[defaultEmailNotification]
  );

  useEffect(() => {
    if (show) setSelectedOPT(defaultOptions[defaultEmailNotification]);
  }, [show]);

  return (
    <StyledModal maxwidth={678} show={show} size="sm" onHide={toggle} centered>
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={toggle}>
          &times;
        </Button>
        <Wrapper>
          <div className="content flex flex-column">
            <div className="modal-title fs-28 fw-400">Manage Notification</div>
            <Select
              defaultValue={selectedOPT}
              value={selectedOPT}
              className="mt-3"
              options={options}
              onChange={(dt) => setSelectedOPT(dt)}
            />
          </div>
          <div className="mt-4 flex items-center justify-content-center">
            <StyledButton
              disabled={loading}
              style={{ minWidth: "10rem" }}
              onClick={() => onConfirm(selectedOPT)}
            >
              {loading ? (
                <>
                  <LoadingButtons />
                </>
              ) : (
                "Save"
              )}
            </StyledButton>
          </div>
        </Wrapper>
      </Modal.Body>
    </StyledModal>
  );
};

export default ManageNotificationModal;
