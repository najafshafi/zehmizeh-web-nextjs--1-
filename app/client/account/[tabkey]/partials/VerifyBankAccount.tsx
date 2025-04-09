import { useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import { Form, Modal, Button, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { StyledButton } from "@/components/forms/Buttons";
import { StyledModal } from "@/components/styled/StyledModal";
import { verifyBankAccountForACH } from "@/helpers/http/client";

const StyledFormGroup = styled.div`
  margin-top: 1.25rem;
  .form-input {
    margin-top: 6px;
    padding: 1rem 1.25rem;
    border-radius: 7px;
    border: 1px solid ${(props) => props.theme.colors.gray6};
  }
`;

type Props = {
  show: boolean;
  bankAccountId: string;
  onClose: () => void;
  onUpdate: () => void;
};

const VerifyBankAccount = ({
  show,
  bankAccountId,
  onClose,
  onUpdate,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const schema = yup.object({
    amount1: yup
      .number()
      .integer("Deposit should be a whole number.")
      .required()
      .test("Is positive?", "Please enter a valid amount", (value) => value > 0)
      .typeError("Please enter a valid amount"),
    amount2: yup
      .number()
      .integer("Deposit should be a whole number.")
      .required()
      .test("Is positive?", "Please enter a valid amount", (value) => value > 0)
      .typeError("Please enter a valid amount"),
  });

  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any, e: any) => {
    e.preventDefault();
    verifyAccount(data);
  };

  const verifyAccount = (data: any) => {
    setLoading(true);

    const body = {
      bank_account_id: bankAccountId + "",
      amounts: [data?.amount1, data?.amount2],
    };

    const promise = verifyBankAccountForACH(body);
    toast.promise(promise, {
      loading: "Loading...",
      success: (res) => {
        setLoading(false);
        reset();
        onUpdate();
        return res.message;
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || "error";
      },
    });
  };

  const onModalClose = () => {
    reset();
    onClose();
  };

  const { errors } = formState;
  return (
    <StyledModal
      maxwidth={726}
      show={show}
      size="sm"
      onHide={onModalClose}
      centered
    >
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={onModalClose}>
          &times;
        </Button>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="fs-28 fw-400 mb-3">Verify Bank Account</div>
          <div className="fs-sm fw-400">
            {/* Enter the two small amounts that has been credited to your bank
            account. */}
            Enter the two small amounts that Stripe has deposited to this bank
            account <b>in cents.</b>
          </div>

          <div className="account-form">
            <Row>
              <Col md={6}>
                <StyledFormGroup>
                  <label className="fs-14 fw-400">
                    Deposit 1<span className="mandatory">&nbsp;*</span>
                  </label>
                  <Form.Control
                    placeholder="Enter amount"
                    type="number"
                    step="0.01"
                    className="form-input"
                    maxLength={5}
                    {...register("amount1")}
                  />
                  {errors?.amount1 && (
                    <ErrorMessage>{errors.amount1?.message}</ErrorMessage>
                  )}
                </StyledFormGroup>
              </Col>
              <Col md={6}>
                <StyledFormGroup>
                  <label className="fs-14 fw-400">
                    Deposit 2<span className="mandatory">&nbsp;*</span>
                  </label>
                  <Form.Control
                    placeholder="Enter amount"
                    type="number"
                    step="0.01"
                    className="form-input"
                    {...register("amount2")}
                    maxLength={5}
                  />
                  {errors?.amount2 && (
                    <ErrorMessage>{errors.amount2?.message}</ErrorMessage>
                  )}
                </StyledFormGroup>
              </Col>
            </Row>
          </div>

          <div className="d-flex justify-content-center justify-content-md-end mt-4">
            <StyledButton disabled={loading} type="submit">
              Verify
            </StyledButton>
          </div>
        </Form>
      </Modal.Body>
    </StyledModal>
  );
};

export default VerifyBankAccount;
