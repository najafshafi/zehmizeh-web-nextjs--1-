'use client';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import ReactOtpInput from 'react-otp-input';
import styled from 'styled-components';
import logo from '@/public/icons/logo.svg';
import { StyledButton } from '@/components/forms/Buttons';
import AuthLayout from '@/components/layout/AuthLayout';
import { LimitedH2 } from '@/components/styled/Auth.styled';
import LoadingButtons from '@/components/LoadingButtons';
import { useAuth } from '@/helpers/contexts/auth-context';
import { breakpoints } from '@/helpers/hooks/useResponsive';
import useResponsive from '@/helpers/hooks/useResponsive';
import { showErr } from '@/helpers/utils/misc';
import useStartPageFromTop from '@/helpers/hooks/useStartPageFromTop';
import ChangeEmailModal from './ChangeEmail';

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
  const navigate = useNavigate();

  const [timer, setTimer] = React.useState(0);
  const [otp, setOtp] = useState<string>('');
  const [showEditEmailModal, setShowEditEmailModal] = useState<boolean>(false);

  const timeOutCallback = React.useCallback(() => {
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

  const resetTimer = function () {
    if (!timer) {
      setTimer(30);
    }
  };

  useEffect(() => {
    if (!user?.email_id) {
      // navigate('/register/employer');
      return;
    }
  });

  const onChange = (value) => {
    setOtp(value);
  };

  const handleOTP = (e: any) => {
    e.preventDefault();
    if (otp === '') {
      showErr('Please enter a valid OTP');
      return;
    }
    const formdata = {
      action: 'verify_otp',
      email_id: '',
      user_otp: otp,
      type: 'new_registration',
    };
    twoFactor(formdata, () => {
      // setShowSuccess(true);
      navigate('/terms');
    });
  };
  const onResend = () => {
    const formdata = {
      action: 'resend_otp',
      email_id: user.email_id,
      type: 'new_registration',
    };
    twoFactor(formdata, resetTimer);
  };

  const toggleEditModal = () => {
    // This function will toggle the Add / Edit modal
    setShowEditEmailModal(!showEditEmailModal);
  };

  if (!user?.email_id) {
    navigate('/login');
    return <></>;
  }

  return isMobile ? (
    <div className="mt-4 d-flex p-2">
      <MobileWrapper>
        <img className="logo" src={logo} alt="logo" width={70} />
        <h1 className="h1">Two-Factor Authentication</h1>
        <h2 className="h3">
          We’ve sent a 6-digit code to{' '}
          <strong>{user?.email_id || 'your email address'}</strong>. If this
          email address is incorrect, you can update it by clicking{' '}
          <span
            onClick={toggleEditModal}
            className="yellow-link pointer"
            style={{ color: '#f2b420' }}
          >
            <strong>here.</strong>
          </span>
          <ChangeEmailModal
            show={showEditEmailModal}
            existingEmail={user?.email_id}
            onClose={toggleEditModal}
          />
        </h2>
        <Form
          className="d-flex flex-column justify-content-center align-items-center mt-2"
          onSubmit={handleOTP}
        >
          <OtpInputWrapper>
            <ReactOtpInput
              value={otp}
              separator={<span style={{ color: '#909090' }}>-</span>}
              onChange={onChange}
              numInputs={6}
              className="otp-input"
              // containerStyle="flex flex-row justify-center mt-8 md:gap-3 gap-2"
              inputStyle={{
                maxWidth: '3.5rem',
                width: '100%',
                height: '3.5rem',
                borderRadius: 7,
                margin: 8,
              }}
              isInputNum={true}
            />
          </OtpInputWrapper>

          <StyledButton
            className="mt-4"
            type="submit"
            disabled={isLoading}
            width={200}
            height={56}
          >
            {isLoading ? <LoadingButtons /> : 'Verify'}
          </StyledButton>

          {timer > 0 ? (
            <h4 className="h4 mt-5 d-flex align-items-center justify-content-center">
              You can resend a new OTP in&nbsp;
              <span className="fw-700">
                00:{timer > 9 ? timer : `0${timer}`}
              </span>
            </h4>
          ) : (
            <h4 className="h4 mt-4 d-flex align-items-center justify-content-center g-1">
              Didn't receive your code?{' '}
              <StyledButton
                onClick={onResend}
                variant="link"
                className="m-0 p-0"
                padding="0rem"
                disabled={isLoading}
              >
                <div className="yellow-link" style={{ color: '#f2b420' }}>
                  Resend
                </div>
              </StyledButton>
            </h4>
          )}
        </Form>
      </MobileWrapper>
    </div>
  ) : (
    <AuthLayout center>
      <h1>Two-Factor Authentication</h1>
      <LimitedH2>
        We’ve sent a 6-digit code to{' '}
        <strong>{user?.email_id || 'your email address'}</strong>. If this email
        address is incorrect, you can update it by clicking{' '}
        <span
          onClick={toggleEditModal}
          className="yellow-link pointer"
          style={{ color: '#f2b420' }}
        >
          <strong>here.</strong>
        </span>
        <ChangeEmailModal
          show={showEditEmailModal}
          existingEmail={user?.email_id}
          onClose={toggleEditModal}
        />
      </LimitedH2>
      <Form
        className="d-flex flex-column justify-content-center align-items-center mt-4"
        onSubmit={handleOTP}
      >
        <OtpInputWrapper>
          <ReactOtpInput
            separator={<span style={{ color: '#909090' }}>-</span>}
            value={otp}
            onChange={onChange}
            numInputs={6}
            className="otp-input"
            // containerStyle="flex flex-row justify-center mt-8 md:gap-3 gap-2"
            inputStyle={{
              maxWidth: '3.5rem',
              width: '100%',
              height: '3.5rem',
              borderRadius: 7,
              margin: 8,
            }}
            isInputNum={true}
          />
        </OtpInputWrapper>

        <StyledButton
          className="mt-4"
          type="submit"
          disabled={isLoading}
          width={200}
          padding="0"
          height={56}
        >
          {isLoading ? <LoadingButtons /> : 'Verify'}
        </StyledButton>

        {timer > 0 ? (
          <h4 className="mt-5 d-flex align-items-center justify-content-center">
            You can resend a new OTP in&nbsp;
            <span className="fw-700">00:{timer > 9 ? timer : `0${timer}`}</span>
          </h4>
        ) : (
          <h4 className="mt-4 d-flex align-items-center justify-content-center g-1">
            Didn't receive your code?{' '}
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
      </Form>
    </AuthLayout>
  );
}
