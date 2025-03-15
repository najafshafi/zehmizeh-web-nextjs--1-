"use client"; // Required for client-side components in Next.js App Router

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Replace useNavigate from react-router-dom
import { form } from "react-bootstrap";
import ReactOtpInput from "react-otp-input";
import styled from "styled-components";
import Image from "next/image"; // Use Next.js Image component for optimized images
import logo from "@/public/icons/logo.svg"; // Adjust path if needed
import { StyledButton } from "@/components/forms/Buttons"; // Adjust path if needed
import AuthLayout from "@/components/layout/AuthLayout"; // Adjust path if needed
import { LimitedH2 } from "@/components/styled/Auth.styled"; // Adjust path if needed
import LoadingButtons from "@/components/LoadingButtons"; // Adjust path if needed
import { useAuth } from "@/helpers/contexts/auth-context"; // Adjust path if needed
import { breakpoints } from "@/helpers/hooks/useResponsive"; // Adjust path if needed
import useResponsive from "@/helpers/hooks/useResponsive"; // Adjust path if needed
import { showErr } from "@/helpers/utils/misc"; // Adjust path if needed
import useStartPageFromTop from "@/helpers/hooks/useStartPageFromTop"; // Adjust path if needed
import ChangeEmailModal from "./ChangeEmail"; // Adjust path if needed

const MobileWrapper = styled.div`
  display: flex;
  background: white;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  .logo {
    margin-top: 2rem;
  }
  .h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-top: 1.5rem;
    text-align: center;
  }
  .h2 {
    margin-top: 0.2rem;
    font-weight: 300;
    font-size: 1.5rem;
    line-height: 140%;
    opacity: 0.63;
    text-align: center;
  }
  .h4 {
    font-weight: 300;
    font-size: 1.25rem;
    line-height: 140%;
    margin-bottom: 2rem;
  }
`;

const OtpInputWrapper = styled.div`
  margin: 1rem;
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
  const router = useRouter(); // Next.js router for navigation

  const [timer, setTimer] = useState(0);
  const [otp, setOtp] = useState("");
  const [showEditEmailModal, setShowEditEmailModal] = useState(false);

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

  const resetTimer = () => {
    if (!timer) {
      setTimer(30);
    }
  };

  useEffect(() => {
    if (!user?.email_id) {
      // router.push('/register/employer'); // Uncomment if needed
      return;
    }
  }, [user, router]);

  const onChange = (value) => {
    setOtp(value);
  };

  const handleOTP = (e) => {
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
      router.push("/terms"); // Navigate using Next.js router
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
    setShowEditEmailModal((prev) => !prev);
  };

  if (!user?.email_id) {
    router.push("/login"); // Redirect if no email
    return null; // Return null instead of empty fragment for Next.js
  }

  return isMobile ? (
    <div className="mt-4  p-2 ">
      <MobileWrapper>
        <Image
          className="logo"
          src={logo}
          alt="logo"
          width={70}
          height={70} // Add height for Next.js Image component
        />
        <h1 className="h1">Two-Factor Authentication</h1>
        <h2 className="h3">
          We&apos;ve sent a 6-digit code to{" "}
          <strong>{user?.email_id || "your email address"}</strong>. If this
          email address is incorrect, you can update it by clicking{" "}
          <span
            onClick={toggleEditModal}
            className="yellow-link pointer"
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
         className=" mt-4"
          onSubmit={handleOTP}
        >
          <OtpInputWrapper>
          <ReactOtpInput
            value={otp}
            onChange={onChange}
            renderSeparator={<span style={{ color: '#909090' }}>-</span>}
            numInputs={6}
            containerStyle="otp-input"
            inputStyle={{
              maxWidth: '3.5rem',
              width: '100%',
              height: '3.5rem',
              borderRadius: 7,
              margin: 8,
            }}
            shouldAutoFocus
            renderInput={(props) => <input {...props} />}
          />
          </OtpInputWrapper>

          <StyledButton
            className="mt-10"
            width={200}
            height={56}
            type="submit"
            padding="0"
            disabled={isLoading}
            background="#F2B420"
          >
            {isLoading ? <LoadingButtons /> : 'Verify'}
          </StyledButton>

          {timer > 0 ? (
            <h4 className="h4 mt-5 flex items-center justify-center">
              You can resend a new OTP in{" "}
              <span className="fw-700">
                00:{timer > 9 ? timer : `0${timer}`}
              </span>
            </h4>
          ) : (
            <h4 className="h4 mt-4 flex items-center justify-center g-1">
              Didn&apos;t receive your code?{" "}
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
      </MobileWrapper>
    </div>
  ) : (
    <AuthLayout center>
      <h1>Two-Factor Authentication</h1>
      <LimitedH2>
        We&apos;ve sent a 6-digit code to{" "}
        <strong>{user?.email_id || "your email address"}</strong>. If this email
        address is incorrect, you can update it by clicking{" "}
        <span
          onClick={toggleEditModal}
          className="yellow-link pointer"
          style={{ color: "#f2b420" }}
        >
          <strong className="cursor-pointer">here.</strong>
        </span>
        <ChangeEmailModal
          show={showEditEmailModal}
          existingEmail={user?.email_id}
          onClose={toggleEditModal}
        />
      </LimitedH2>
      <form
        className="  mt-4   "
        onSubmit={handleOTP}
      > 
        <OtpInputWrapper>
        <ReactOtpInput
            value={otp}
            onChange={onChange}
            renderSeparator={<span style={{ color: '#909090' }}>-</span>}
            numInputs={6}
            containerStyle="otp-input"
            inputStyle={{
              maxWidth: '3.5rem',
              width: '100%',
              height: '3.5rem',
              borderRadius: 7,
              margin: 8,
            }}
            shouldAutoFocus
            renderInput={(props) => <input {...props} />}
          />
        </OtpInputWrapper>

        <StyledButton
            className="mt-2"
            width={200}
            height={56}
            type="submit"
            padding="0"
            disabled={isLoading}
            background="#F2B420"
            style={{ 
              marginTop: '0.5rem',
              width: '200px',
              height: '56px',
            }}
          >
            {isLoading ? <LoadingButtons /> : 'Verify'}
          </StyledButton>

        {timer > 0 ? (
          <h4 className="mt-5 flex items-center justify-center ">
            You can resend a new OTP in{" "}
            <span className="fw-700">00:{timer > 9 ? timer : `0${timer}`}</span>
          </h4>
        ) : (
          <h4 className="mt-4 flex items-center justify-center g-1">
              Didn&apos;t receive your code?{" "}
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