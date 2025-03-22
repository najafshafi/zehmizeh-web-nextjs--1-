/*
 * This component is a modal to edit email
 */

import { useState, useEffect, useCallback } from "react";
import * as yup from "yup";
import toast from "react-hot-toast";
import ReactOtpInput from "react-otp-input";
import { Modal, Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { yupResolver } from "@hookform/resolvers/yup";
import { StyledModal } from "@/components/styled/StyledModal";
import { StyledButton } from "@/components/forms/Buttons";
import LoadingButtons from "@/components/LoadingButtons";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { sendVerifyOTP, changeEmail } from "@/helpers/http/auth";
import { showErr, showMsg } from "@/helpers/utils/misc";

type Props = {
  show: boolean;
  onClose: () => void;
  existingEmail?: string;
  onUpdateEmail: (email: string) => void;
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
    email_id: yup.string().email().required("Email is required").label("Email"),
  })
  .required();

const EmailEditModal = ({
  show,
  onClose,
  onUpdateEmail,
  existingEmail,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isOtpSent, setIsOTPSent] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [timer, setTimer] = useState(30);

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
      setOtp("");
      setTimer(30);
    };
  }, [show]);

  const resetTimer = function () {
    if (!timer) {
      setTimer(30);
    }
  };

  const onChange = (value) => {
    setOtp(value);
  };

  /** @function This function will resend the OTP */
  const onResend = () => {
    const body = {
      action: "resend_otp",
      email_id: getValues("email_id"),
      type: "change_email",
    };
    const promise = sendVerifyOTP(body);
    toast.promise(promise, {
      loading: "Please wait...",
      success: (res: any) => {
        setLoading(false);
        resetTimer();
        return res.message;
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || "error";
      },
    });
  };

  const handleToggleEmail = () => {
    setTimer(0);
    setIsOTPSent(false);
  };

  /** @function Once the email is submitted, this will send an OTP */
  const sendOtp = () => {
    setLoading(true);
    const body = {
      action: "send_otp",
      email_id: getValues("email_id"),
      type: "change_email",
    };
    const promise = sendVerifyOTP(body);
    toast.promise(promise, {
      loading: "Please wait...",
      success: (res: any) => {
        setLoading(false);
        setIsOTPSent(true);
        resetTimer();
        return res.message;
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || "error";
      },
    });
  };

  /** @function */
  const verifyOtpAndChangeEmail = (e: any) => {
    e.preventDefault();
    if (otp === "") {
      showErr("Please enter a valid OTP");
      return;
    }
    const body = {
      action: "verify_otp",
      email_id: getValues("email_id"),
      user_otp: otp,
      type: "change_email",
    };

    setLoading(true);

    // This will call an api to verify otp
    sendVerifyOTP(body)
      .then((res) => {
        if (res.status) {
          // If the otp is verified, then this will call an api to change the email
          changeEmail({
            type: "buyer",
            old_email_id: existingEmail,
            new_email_id: body.email_id,
          })
            .then((emailChangeRes) => {
              if (emailChangeRes.status) {
                setLoading(false);
                showMsg("Email updated successfully");
                onUpdateEmail(body.email_id);
                handleModalClose();
              } else {
                setLoading(false);
                showErr(emailChangeRes.message);
              }
            })
            .catch((err) => {
              showErr(err + "");
              setLoading(false);
            });
        } else {
          setLoading(false);
          showErr(res.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        showErr(err + "");
      });
  };

  /** @function This function will reset all values and close the modal */
  const handleModalClose = () => {
    setIsOTPSent(false);
    setTimer(0);
    reset();
    onClose();
  };

  useEffect(() => {
    if (show) {
      setValue("email_id", existingEmail || "");
    }
  }, [existingEmail, setValue, show]);

  /** @function This function will submit the form and call send OTP api function */
  const onSubmit = async (data) => {
    if (data.email_id === existingEmail) {
      showErr("The new email is same as current email");
      return;
    }
    sendOtp();
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

        <div className="flex flex-col gap-4">
          <header className="fs-28 font-normal">Edit Email</header>

          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="flex items-center opacity-75">
              New Email<span className="mandatory">&nbsp;*</span>
            </label>
            <div className="flex md:flex-row flex-col align-item-center position-relative gap-3">
              <Form.Control
                placeholder="Enter new email"
                className="form-input full-width"
                maxLength={255}
                {...register("email_id")}
                disabled={isOtpSent}
              />

              {isOtpSent ? (
                <div
                  className="edit-button pointer position-absolute fs-1rem font-normal"
                  onClick={handleToggleEmail}
                >
                  Change
                </div>
              ) : null}

              {!isOtpSent ? (
                <StyledButton
                  type="submit"
                  padding="1.125rem 2.25rem"
                  variant="primary"
                  disabled={loading}
                >
                  Submit
                </StyledButton>
              ) : null}
            </div>
            {errors?.email_id && (
              <ErrorMessage message={errors.email_id.message as string} />
            )}
          </form>

          {isOtpSent ? (
            <Form
              onSubmit={verifyOtpAndChangeEmail}
              className="flex flex-col gap-4"
            >
              <div className="fs-15 font-normal opacity-75">
                Check your email. We&apos;ve sent a 6 digit code. Do not share
                this code with anyone.
              </div>
              <ReactOtpInput
                value={otp}
                onChange={onChange}
                numInputs={6}
                containerStyle="otp-input"
                renderInput={(props) => <input {...props} />}
                // containerStyle="flex flex-row justify-center mt-8 md:gap-3 gap-2"
                inputStyle={{
                  maxWidth: "3.5rem",
                  width: "100%",
                  height: "3.5rem",
                  borderRadius: 7,
                  margin: 8,
                }}
              />
              <div className="flex flex-col align-items-md-end items-center gap-4">
                <StyledButton
                  padding="1.125rem 4.225rem"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <LoadingButtons /> : "Verify"}
                </StyledButton>

                {timer > 0 ? (
                  <h6 className="flex items-center fw-700">
                    You can resend a new OTP in&nbsp;
                    <span className="fw-700">
                      00:{timer > 9 ? timer : `0${timer}`}
                    </span>
                  </h6>
                ) : (
                  <h6 className="flex items-center g-1 fw-700">
                    Didn't receive code?{" "}
                    <StyledButton
                      onClick={onResend}
                      variant="link"
                      className="resend-button p-0"
                      disabled={loading}
                    >
                      <div className="yellow-link fw-700">Resend</div>
                    </StyledButton>
                  </h6>
                )}
              </div>
            </Form>
          ) : (
            ""
          )}
        </div>
      </Modal.Body>
    </Wrapper>
  );
};

export default EmailEditModal;
