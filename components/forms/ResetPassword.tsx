"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import cns from "classnames";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactOtpInput from "react-otp-input";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import * as yup from "yup";
import YupPassword from "yup-password";
import { yupResolver } from "@hookform/resolvers/yup";
import { StyledButton } from "@/components/forms/Buttons";
import AuthLayout from "@/components/layout/AuthLayout";
import { LimitedH2 } from "@/components/styled/Auth.styled";
import { useAuth } from "@/helpers/contexts/auth-context";
import LoadingButtons from "@/components/LoadingButtons";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { apiClient } from "@/helpers/http";
import { showErr, showMsg } from "@/helpers/utils/misc";
import auth from "@/helpers/http/auth";
import useStartPageFromTop from "@/helpers/hooks/useStartPageFromTop";
import EyeIcon from "@/public/icons/eyeicon.svg";

const Wrapper = styled.div`
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

YupPassword(yup);

const passwordError =
  "Every password must include at least: 1 uppercase letter, 1 lowercase letter, 1 number, 1 symbol, and at least 8 characters";

interface FormData {
  password: string;
  confirm: string;
}

export default function ResetPassword() {
  useStartPageFromTop();

  const [isPasswordPreview, setIsPasswordPreview] = React.useState(false);
  const togglePasswordPreview = () => setIsPasswordPreview(!isPasswordPreview);

  const { isLoading, user, twoFactor } = useAuth();
  const [otpId, setOtpId] = React.useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const router = useRouter();

  const onChange = (value) => {
    setOtp(value);
  };

  const schema = yup
    .object({
      password: yup
        .string()
        .required("Password is required.")
        .min(8, passwordError)
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*-?])[A-Za-z\d#$@!%&*-?]{8,30}$/,
          passwordError
        ),
      confirm: yup
        .string()
        .required("Password is required.")
        .oneOf([yup.ref("password"), null], "Passwords don't match."),
    })
    .required();

  useEffect(() => {
    if (!user?.email_id) {
      router.push("/forgot-password");
      return;
    }
  }, [user?.email_id, router]);

  const handleOTP = (e: any) => {
    e.preventDefault();
    if (otp === "") {
      showErr("Please enter a valid OTP");
      return;
    }
    const formdata = {
      action: "verify_otp",
      email_id: user?.email_id,
      user_otp: otp,
      type: "forgot_password",
    };

    setLoading(true);

    apiClient
      .post("/auth/otp", formdata)
      .then((res) => {
        setLoading(false);
        if (!res.data.status) {
          showErr(res.data.message);
          return;
        }
        showMsg(res.data.message);
        setOtpId(res.data?.data?.otp_id);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onSubmit = ({ password }: { password: string }) => {
    const payload = {
      email_id: user?.email_id,
      otp_id: otpId,
      new_password: password,
    };
    setLoading(true);
    toast.promise(auth.resetPassword(payload), {
      loading: "Resetting password...",
      success: (res) => {
        setLoading(false);
        router.push("/login");
        return res.message;
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || err.toString() || "Error";
      },
    });
  };

  const [timer, setTimer] = React.useState(30);

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

  const onResend = () => {
    const formdata = {
      action: "resend_otp",
      email_id: user?.email_id,
      type: "forgot_password",
    };
    twoFactor(formdata, resetTimer);
  };

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  if (otpId) {
    return (
      <AuthLayout center showNavigationHeader>
        <h1>Reset Password</h1>
        <LimitedH2>
          Your OTP is verified. Please set your new password.
        </LimitedH2>

        <form className="mt-4 px-2" onSubmit={handleSubmit(onSubmit)}>
          <div className="relative mb-4 mt-5">
            <input
              type={isPasswordPreview ? "text" : "password"}
              className="peer m-0 block h-[58px] w-full rounded border border-solid border-secondary-500 bg-transparent bg-clip-padding px-3 pr-12 py-4 text-base font-normal leading-tight text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:border-primary focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:shadow-twe-primary focus:outline-none peer-focus:text-primary dark:border-neutral-400 dark:text-neutral-700 dark:autofill:shadow-autofill dark:focus:border-primary dark:peer-focus:text-primary [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]"
              id="password"
              placeholder="Submit a new password"
              {...register("password")}
            />
            <label
              htmlFor="password"
              className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary"
            >
              Submit a new password
            </label>
            <span
              className="pointer absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={togglePasswordPreview}
            >
              <EyeIcon
                className={cns("input-icon w-5 h-5", {
                  active: isPasswordPreview,
                })}
              />
            </span>
            <ErrorMessage className="text-start my-2">
              {errors.password?.message}
            </ErrorMessage>
          </div>

          <div className="relative mb-8 mt-4">
            <input
              type={isPasswordPreview ? "text" : "password"}
              className="peer m-0 block h-[58px] w-full rounded border border-solid border-secondary-500 bg-transparent bg-clip-padding px-3 pr-12 py-4 text-base font-normal leading-tight text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:border-primary focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:shadow-twe-primary focus:outline-none peer-focus:text-primary dark:border-neutral-400 dark:text-neutral-700 dark:autofill:shadow-autofill dark:focus:border-primary dark:peer-focus:text-primary [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]"
              id="confirm"
              placeholder="Confirm new password"
              {...register("confirm")}
            />
            <label
              htmlFor="confirm"
              className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary"
            >
              Confirm new password
            </label>
            <span
              className="pointer absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={togglePasswordPreview}
            >
              <EyeIcon
                className={cns("input-icon w-5 h-5", {
                  active: isPasswordPreview,
                })}
              />
            </span>
            <ErrorMessage className="text-start my-2">
              {errors.confirm?.message}
            </ErrorMessage>
          </div>

          <StyledButton
            className="mt-10"
            width={200}
            height={56}
            type="submit"
            padding="0"
            disabled={loading}
            background="#F2B420"
          >
            {loading ? <LoadingButtons /> : "Reset"}
          </StyledButton>
          <h4 className="self-center mt-4">
            <Link href="/login" className="yellow-link">
              Back to Login
            </Link>
          </h4>
        </form>
      </AuthLayout>
    );
  }
  return (
    <AuthLayout center>
      <h1>Enter Code</h1>
      <h2>Enter 6-digit code sent to &apos;{user?.email_id}&apos;</h2>

      <form className="mt-4" onSubmit={handleOTP}>
        <Wrapper className="flex justify-center">
          <ReactOtpInput
            value={otp}
            onChange={onChange}
            renderSeparator={<span style={{ color: "#909090" }}>-</span>}
            numInputs={6}
            containerStyle="otp-input"
            inputStyle={{
              maxWidth: "3.5rem",
              width: "100%",
              height: "3.5rem",
              borderRadius: 7,
              margin: 8,
            }}
            shouldAutoFocus
            renderInput={(props) => <input {...props} />}
          />
        </Wrapper>

        {timer > 0 ? (
          <h4 className="mt-5 flex items-center justify-center  mb-10">
            You can resend a new OTP in&nbsp;
            <span className="fw-700">00:{timer > 9 ? timer : `0${timer}`}</span>
          </h4>
        ) : (
          <h4 className="mt-10 flex items-center justify-center gap-1">
            Didn&apos;t receive code?{" "}
            <StyledButton
              onClick={onResend}
              className="mt-4"
              width={100}
              height={56}
              type="submit"
              padding="0"
              disabled={loading}
            >
              <div className="yellow-link">Resend</div>
            </StyledButton>
          </h4>
        )}

        <StyledButton
          className="mt-5"
          type="submit"
          disabled={isLoading || loading}
          width={200}
          padding="0"
          height={56}
          background="#F2B420"
        >
          {isLoading || loading ? <LoadingButtons /> : "Submit"}
        </StyledButton>

        <h4 className="self-center mt-4">
          <Link href="/login" className="yellow-link">
            Back to Login
          </Link>
        </h4>
      </form>
    </AuthLayout>
  );
}
