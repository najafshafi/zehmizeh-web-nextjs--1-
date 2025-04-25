"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReactOtpInput from "react-otp-input";
import styled from "styled-components";
import { StyledButton } from "@/components/forms/Buttons";
import AuthLayout from "@/components/layout/AuthLayout";
import { LimitedH2a } from "@/components/styled/Auth.styled";
import { useAuth } from "@/helpers/contexts/auth-context";
import { breakpoints } from "@/helpers/hooks/useResponsive";
import useResponsive from "@/helpers/hooks/useResponsive";
import { showErr } from "@/helpers/utils/misc";
import useStartPageFromTop from "@/helpers/hooks/useStartPageFromTop";
import ChangeEmailModal from "./ChangeEmail";
import Image from "next/image";
import CustomButton from "@/components/custombutton/CustomButton";
import Spinner from "@/components/forms/Spin/Spinner";


const OtpInputWrapper = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  @media ${breakpoints.mobile} {
    gap: 0rem;
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

export default function TwoFactor() {
  useStartPageFromTop();
  const { isMobile } = useResponsive();
  const { twoFactor, isLoading, user } = useAuth();
  const router = useRouter();

  const [timer, setTimer] = useState<number>(0);
  const [otp, setOtp] = useState<string>("");
  const [showEditEmailModal, setShowEditEmailModal] = useState<boolean>(false);

  const timeOutCallback = React.useCallback(() => {
    setTimer((currTimer) => currTimer - 1);
  }, []);

  useEffect(() => {
    let otpTimer: NodeJS.Timeout;
    if (timer > 0) {
      otpTimer = setTimeout(timeOutCallback, 1000);
    }

    return () => {
      clearTimeout(otpTimer);
    };
  }, [timer, timeOutCallback]);

  const resetTimer = function () {
    if (!timer) {
      setTimer(30);
    }
  };

  useEffect(() => {
    if (!user?.email_id) {
      // router.push('/register/employer');
      return;
    }
  }, [user, router]);

  const onChange = (value: string) => {
    setOtp(value);
  };

  const handleOTP = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp === "") {
      showErr("Please enter a valid OTP");
      return;
    }
    const formdata = {
      action: "verify_otp",
      email_id: "",
      user_otp: otp,
      type: "new_registration",
    };
    twoFactor(formdata, () => {
      // setShowSuccess(true);
      router.push("/terms");
    });
  };

  const onResend = () => {
    const formdata = {
      action: "resend_otp",
      email_id: user.email_id,
      type: "new_registration",
    };
    twoFactor(formdata, resetTimer);
  };

  const toggleEditModal = () => {
    // This function will toggle the Add / Edit modal
    setShowEditEmailModal(!showEditEmailModal);
  };

  if (!user?.email_id) {
    router.push("/login");
    return null;
  }

  return isMobile ? (
    <div className="mt-4 flex p-2">
      <div className="flex flex-col items-center gap-4 bg-white">
        <Image
          className="mt-8"
          src="/zehmizeh-logo.svg"
          alt="logo"
          width={70}
          height={70}
        />
        <h1 className=" text-3xl font-bold mt-6 text-center">
          Two-Factor Authentication
        </h1>
        <h2 className="mt-1 leading-[140%] opacity-60 text-center px-1 text-2xl font-medium">
          We've sent a 6-digit code to{" "}
          <strong>{user?.email_id || "your email address"}</strong>. If this
          email address is incorrect, you can update it by clicking{" "}
          <span
            onClick={toggleEditModal}
            className="yellow-link cursor-pointer"
            style={{ color: "#f2b420" }}
          >
            <strong>here.</strong>
          </span>
          <ChangeEmailModal
            show={showEditEmailModal}
            existingEmail={user?.email_id}
            onClose={toggleEditModal}
          />
        </h2>
        <form
          className="flex flex-col justify-center items-center mt-2"
          onSubmit={handleOTP}
        >
          <div className=" px-2">
            <OtpInputWrapper>
              <ReactOtpInput
                value={otp}
                onChange={onChange}
                renderSeparator={<span className="text-gray-400">-</span>}
                numInputs={6}
                containerStyle="flex gap-1 md:gap-2"
                inputStyle={{
                  maxWidth: "3.5rem",
                  width: "100%",
                  height: "3.5rem",
                  borderRadius: "0.5rem",
                  margin: "0.5rem",
                  backgroundColor: "#ECECEC",
                  border: "none",
                  outline: "none",
                  fontSize: "1.5rem",
                  fontFamily: "inherit",
                }}
                shouldAutoFocus
                renderInput={(props) => <input {...props} />}
              />
            </OtpInputWrapper>
          </div>
          <CustomButton
            text={isLoading ? <Spinner /> : "Verify"}
            onClick={() => {}}
            disabled={isLoading}
            className="px-[5rem] py-[1rem]  transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[16px] mt-4"
          />

          {timer > 0 ? (
            <h4 className="font-light text-xl leading-[140%] mb-8 mt-5 flex items-center justify-center">
              You can resend a new OTP in&nbsp;
              <span className="font-bold">
                00:{timer > 9 ? timer : `0${timer}`}
              </span>
            </h4>
          ) : (
            <h4 className="font-light text-xl leading-[140%] mb-8 mt-4 flex items-center justify-center gap-1">
              Didn't receive your code?{" "}
              <StyledButton
                onClick={onResend}
                variant="link"
                className="m-0 p-0"
                padding="0rem"
                disabled={isLoading}
              >
                <div className="yellow-link" style={{ color: "#f2b420" }}>
                  Resend
                </div>
              </StyledButton>
            </h4>
          )}
        </form>
      </div>
    </div>
  ) : (
    <AuthLayout center>
      <h1>Two-Factor Authentication</h1>
      <LimitedH2a className=" px-6">
        We've sent a 6-digit code to{" "}
        <strong>{user?.email_id || "your email address"}</strong>. If this email
        address is incorrect, you can update it by clicking{" "}
        <span
          onClick={toggleEditModal}
          className="yellow-link cursor-pointer"
          style={{ color: "#f2b420" }}
        >
          <strong>here.</strong>
        </span>
        <ChangeEmailModal
          show={showEditEmailModal}
          existingEmail={user?.email_id}
          onClose={toggleEditModal}
        />
      </LimitedH2a>
      <form
        className="flex flex-col justify-center items-center mt-4"
        onSubmit={handleOTP}
      >
        <div className=" px-8">
          <OtpInputWrapper>
            <ReactOtpInput
              value={otp}
              onChange={onChange}
              renderSeparator={<span className="text-gray-400">-</span>}
              numInputs={6}
              containerStyle="flex gap-2"
              inputStyle={{
                maxWidth: "3.5rem",
                width: "100%",
                height: "3.5rem",
                borderRadius: "0.5rem",
                margin: "1rem 0.5rem",

                backgroundColor: "#ECECEC",
                border: "none",
                outline: "none",
                fontSize: "1.5rem",
                fontFamily: "inherit",
              }}
              shouldAutoFocus
              renderInput={(props) => <input {...props} />}
            />
          </OtpInputWrapper>
        </div>
        {/* <StyledButton
          className="mt-4"
          type="submit"
          disabled={isLoading}
          width={200}
          padding="0"
          height={56}
          
        >
          {isLoading ? <LoadingButtons /> : "Verify"}
        </StyledButton> */}
        <CustomButton
          text={isLoading ? <Spinner /> : "Verify"}
          onClick={() => {}}
          disabled={isLoading}
          className="px-[5rem] py-[1rem]  transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[16px] mt-4"
        />

        {timer > 0 ? (
          <h4 className="mt-5 flex items-center justify-center">
            You can resend a new OTP in&nbsp;
            <span className="font-bold">
              00:{timer > 9 ? timer : `0${timer}`}
            </span>
          </h4>
        ) : (
          <h4 className="mt-4 flex items-center justify-center gap-1">
            Didn't receive your code?{" "}
            <StyledButton
              onClick={onResend}
              variant="link"
              className="m-0 p-0"
              padding="0rem"
              disabled={isLoading}
            >
              <div className="yellow-link">Resend</div>
            </StyledButton>
          </h4>
        )}
      </form>
    </AuthLayout>
  );
}
