"use client";
import { StyledModal } from "@/components/styled/StyledModal";
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

type Props = {
  show: boolean;
  setShow: (value: boolean) => void;
  onContinue: () => void;
};

export const WarningFreelancerMessageModal = ({
  setShow,
  show,
  onContinue,
}: Props) => {
  const [firstCheckbox, setFirstCheckbox] = useState(false);
  const [secondCheckbox, setSecondCheckbox] = useState(false);

  useEffect(() => {
    if (firstCheckbox && secondCheckbox) {
      closeModal();
      onContinue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstCheckbox, secondCheckbox]);

  const closeModal = () => setShow(false);

  return (
    <StyledModal
      maxwidth={767}
      show={show}
      size="sm"
      onHide={closeModal}
      centered
    >
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={closeModal}>
          &times;
        </Button>
        <div className="flex flex-col justify-center items-center">
          <h4>Note: The Freelancer Has NOT Been Hired</h4>

          {/* <p className="mt-4 mb-2">
            Messaging the freelancer before accepting their proposal is only
            meant to help you decide whether you want to hire them. The
            freelancer is not hired until you have accepted the proposal, so{' '}
            <b>they should not do any work until that point.</b>
          </p> */}
          <p className="mt-4 mb-1 text-center">
            The freelancer is not hired until you click ‘Accept Proposal’ on
            their proposal.
          </p>
          <p className="font-weight-bold">
            They should not do work before that point.
          </p>
          <Form.Check
            type="checkbox"
            className="d-inline-flex items-center g-1 user-select-none"
            label="I understand"
            checked={firstCheckbox}
            onChange={(e) => {
              setFirstCheckbox(e.target.checked);
            }}
          />

          {/* <p className="mt-4 mb-2">
            Freelancers cannot be paid until their proposal has been accepted. I
            understand that payment for projects found on ZMZ must be made
            through ZMZ’s payment system and that{' '}
            <b>payment through any other method is theft from the company</b> (a
            violation of our Terms of Service and Halacha).
          </p> */}
          <p className="mt-4 mb-1 text-center">
            Payments for ZMZ projects must be made on ZMZ.{" "}
          </p>
          <p>
            <span className="font-weight-bold">
              Any other payment method is theft
            </span>
            , a violation of our terms and halacha.
          </p>
          <Form.Check
            type="checkbox"
            className="d-inline-flex items-center g-1 user-select-none"
            label="I understand"
            checked={secondCheckbox}
            onChange={(e) => {
              setSecondCheckbox(e.target.checked);
            }}
          />
        </div>
      </Modal.Body>
    </StyledModal>
  );
};
