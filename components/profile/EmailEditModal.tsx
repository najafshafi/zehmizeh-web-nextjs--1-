"use client";

/*
 * This component is a modal to edit email
 */

import { useState, useEffect, useCallback } from "react";
import * as yup from "yup";
import toast from "react-hot-toast";
import ReactOtpInput from "react-otp-input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { sendVerifyOTP, changeEmail } from "@/helpers/http/auth";
import { showErr, showMsg } from "@/helpers/utils/misc";
import { VscClose } from "react-icons/vsc";

interface EmailFormData {
  email_id: string;
}

interface ApiResponse {
  status?: boolean;
  message?: string;
}

interface Props {
  show: boolean;
  onClose: () => void;
  existingEmail?: string;
  onUpdateEmail: (email: string) => void;
}

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
  const [timer, setTimer] = useState<number>(30);

  const { register, handleSubmit, formState, reset, getValues, setValue } =
    useForm<EmailFormData>({
      resolver: yupResolver(schema),
    });

  const timeOutCallback = useCallback(() => {
    setTimer((currTimer) => currTimer - 1);
  }, []);

  useEffect(() => {
    let otpTimer: NodeJS.Timeout;
    if (timer > 0) {
      otpTimer = setTimeout(timeOutCallback, 1000);
    }

    return () => {
      if (otpTimer) {
        clearTimeout(otpTimer);
      }
    };
  }, [timer, timeOutCallback]);

  useEffect(() => {
    return () => {
      setOtp("");
      setTimer(30);
    };
  }, [show]);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show]);

  const resetTimer = () => {
    if (!timer) {
      setTimer(30);
    }
  };

  const onChange = (value: string) => {
    setOtp(value);
  };

  const onResend = () => {
    const body = {
      action: "resend_otp",
      email_id: getValues("email_id"),
      type: "change_email",
    };
    const promise = sendVerifyOTP(body);
    toast.promise(promise, {
      loading: "Please wait...",
      success: (res: ApiResponse) => {
        setLoading(false);
        resetTimer();
        return res.message || "OTP sent successfully";
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || "Error sending OTP";
      },
    });
  };

  const handleToggleEmail = () => {
    setTimer(0);
    setIsOTPSent(false);
  };

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
      success: (res: ApiResponse) => {
        setLoading(false);
        setIsOTPSent(true);
        resetTimer();
        return res.message || "OTP sent successfully";
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || "Error sending OTP";
      },
    });
  };

  const verifyOtpAndChangeEmail = (e: React.FormEvent) => {
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

    sendVerifyOTP(body)
      .then((res: ApiResponse) => {
        if (res.status) {
          changeEmail({
            type: "buyer",
            old_email_id: existingEmail,
            new_email_id: body.email_id,
          })
            .then((emailChangeRes: ApiResponse) => {
              if (emailChangeRes.status) {
                setLoading(false);
                showMsg("Email updated successfully");
                onUpdateEmail(body.email_id);
                handleModalClose();
              } else {
                setLoading(false);
                showErr(emailChangeRes.message || "Failed to update email");
              }
            })
            .catch((err) => {
              showErr(err.toString());
              setLoading(false);
            });
        } else {
          setLoading(false);
          showErr(res.message || "Invalid OTP");
        }
      })
      .catch((err) => {
        setLoading(false);
        showErr(err.toString());
      });
  };

  const handleModalClose = () => {
    setIsOTPSent(false);
    setTimer(0);
    reset();
    document.body.style.overflow = "unset";
    onClose();
  };

  useEffect(() => {
    if (show) {
      setValue("email_id", existingEmail || "");
    }
  }, [existingEmail, setValue, show]);

  const onSubmit = async (data: EmailFormData) => {
    if (data.email_id === existingEmail) {
      showErr("The new email is same as current email");
      return;
    }
    sendOtp();
  };

  const { errors } = formState;

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
        onClick={handleModalClose}
      />
      <div className="relative bg-white rounded-xl px-[1rem] py-[2rem] md:p-12 max-w-[578px] w-full mx-4">
        <button
          className="absolute right-4 top-4 md:top-0 md:-right-8 text-2xl md:text-white text-gray-500 hover:text-gray-700"
          onClick={handleModalClose}
        >
          <VscClose size={24} />
        </button>

        <div className="flex flex-col gap-6">
          <h2 className="text-[28px] font-normal text-[#212529]">Edit Email</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="flex items-center text-gray-700">
              New Email<span className="text-red-500">&nbsp;*</span>
            </label>
            <div className="flex flex-col md:flex-row items-center relative gap-3 mt-2">
              <input
                placeholder="Enter new email"
                className="w-full px-5 py-4 border rounded-md focus:outline-none border-black focus:ring-4 focus:ring-[#0d6efd40] transition-all"
                maxLength={255}
                {...register("email_id")}
                disabled={isOtpSent}
              />

              {isOtpSent ? (
                <button
                  type="button"
                  className="w-full md:w-fit bg-[#F2B420] text-[#212529] px-10 py-[1.15rem] hover:scale-105 duration-300 text-lg rounded-full disabled:bg-[#F2A420]"
                  onClick={handleToggleEmail}
                >
                  Change
                </button>
              ) : null}

              {!isOtpSent ? (
                <button
                  type="submit"
                  className="w-full md:w-fit bg-[#F2B420] text-[#212529] px-10 py-[1.15rem] hover:scale-105 duration-300 text-lg rounded-full disabled:bg-[#F2A420]"
                  disabled={loading}
                >
                  Submit
                </button>
              ) : null}
            </div>
            {errors?.email_id && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email_id.message}
              </p>
            )}
          </form>

          {isOtpSent ? (
            <form
              onSubmit={verifyOtpAndChangeEmail}
              className="flex flex-col gap-4"
            >
              <p className="text-sm text-gray-600">
                Check your email. We&apos;ve sent a 6 digit code. Do not share
                this code with anyone.
              </p>
              <ReactOtpInput
                value={otp}
                onChange={onChange}
                numInputs={6}
                containerStyle="flex justify-center gap-2"
                renderInput={(props) => (
                  <input
                    {...props}
                    className="w-14 h-14 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              />
              <div className="flex flex-col items-center md:items-end gap-4">
                <button
                  type="submit"
                  className="px-17 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Verifying...
                    </span>
                  ) : (
                    "Verify"
                  )}
                </button>

                {timer > 0 ? (
                  <p className="font-bold">
                    You can resend a new OTP in&nbsp;
                    <span className="font-bold">
                      00:{timer > 9 ? timer : `0${timer}`}
                    </span>
                  </p>
                ) : (
                  <p className="font-bold flex items-center gap-1">
                    Didn&apos;t receive code?{" "}
                    <button
                      onClick={onResend}
                      className="text-blue-500 hover:text-blue-700 disabled:opacity-50"
                      disabled={loading}
                    >
                      <span className="font-bold">Resend</span>
                    </button>
                  </p>
                )}
              </div>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default EmailEditModal;
