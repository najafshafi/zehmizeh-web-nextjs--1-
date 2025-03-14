/*
 * This component is a modal to edit email
 */
'use client';
import { useState, useEffect, useCallback } from 'react';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Modal, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { yupResolver } from '@hookform/resolvers/yup';
import { StyledModal } from '@/components/styled/StyledModal';
import { StyledButton } from '@/components/forms/Buttons';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { showErr } from '@/helpers/utils/misc';
import { editUser } from '@/helpers/http/auth';
import { useAuth } from '@/helpers/contexts/auth-context';

type Props = {
  show: boolean;
  onClose: () => void;
  existingEmail?: string;
  // onUpdateEmail: (email: string) => void;
};

const Wrapper = styled(StyledModal)`
  backdrop-filter: blur(3px);
  background-color: rgba(0, 0, 0, 0.4);
  .form-input {
    margin-top: 6px;
    padding: 1rem 1.25rem;
    border-radius: 7px;
    border: ${(props) => `1px solid ${props.theme.colors.black}`};
  }
  .edit-button {
    position: absolute;
    right: 1.25rem;
    top: 36%;
  }
  .resend-button {
    min-height: initial;
  }
  .otp-input {
    input {
      border: 0 !important;
      outline: 0 !important;
      background: ${(props) => props.theme.colors.lightGray};
      font-family: ${(props) => props.theme.font.primary};
      font-size: 1.5rem;
    }
  }
`;

const schema = yup
  .object({
    email_id: yup.string().email().required('Email is required').label('Email'),
  })
  .required();

const ChangeEmailModal = ({ show, onClose, existingEmail }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState(30);

  const { setEmail } = useAuth();

  const { register, handleSubmit, formState, reset, getValues, setValue } =
    useForm({
      resolver: yupResolver(schema),
    });

  const timeOutCallback = useCallback(() => {
    setTimer((currTimer) => currTimer - 1);
  }, []);

  useEffect(() => {
    let otpTimer;
    if (timer > 0) {
      otpTimer = setTimeout(timeOutCallback, 1000);
    }

    return () => {
      clearTimeout(otpTimer);
    };
  }, [timer, timeOutCallback]);

  useEffect(() => {
    return () => {
      setTimer(30);
    };
  }, [show]);

  /** @function Once the email is submitted, this will send an OTP */
  const updateEmail = () => {
    // Update languages api call
    setLoading(true);
    const body = {
      action: 'change_email',
      old_email: existingEmail,
      new_email: getValues('email_id'),
    };
    const promise = editUser(body);
    toast.promise(promise, {
      loading: 'Updating your details - please wait...',
      success: (res) => {
        setEmail(body.new_email);
        handleModalClose();
        //  onUpdate();
        setLoading(false);
        return res.message;
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || 'error';
      },
    });
  };

  /** @function This function will reset all values and close the modal */
  const handleModalClose = () => {
    setTimer(0);
    reset();
    onClose();
  };

  useEffect(() => {
    if (show) {
      setValue('email_id', existingEmail);
    }
  }, [existingEmail, setValue, show]);

  /** @function This function will submit the form and call send OTP api function */
  const onSubmit = async (data) => {
    if (data.email_id === existingEmail) {
      showErr('The new email is same as current email');
      return;
    }

    if (!!existingEmail && getValues('email_id')) updateEmail();
  };

  const { errors } = formState;

  return (
    <Wrapper
      maxwidth={578}
      show={show}
      size="sm"
      onHide={handleModalClose}
      centered
    >
      <Modal.Body>
        <Button
          variant="transparent"
          className="close"
          onClick={handleModalClose}
        >
          &times;
        </Button>

        <div className="d-flex flex-column gap-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="d-flex align-items-center opacity-75">
              New Email<span className="mandatory">&nbsp;*</span>
            </label>
            <div className="d-flex flex-md-row flex-column align-item-center position-relative gap-3">
              <Form.Control
                placeholder="Enter new email"
                className="form-input full-width"
                maxLength={255}
                {...register('email_id')}
              />
              <StyledButton
                type="submit"
                padding="1.125rem 2.25rem"
                variant="primary"
                disabled={loading}
              >
                Submit
              </StyledButton>
            </div>
            {errors?.email_id && (
              <ErrorMessage message={errors.email_id.message as string} />
            )}
          </form>
        </div>
      </Modal.Body>
    </Wrapper>
  );
};

export default ChangeEmailModal;
