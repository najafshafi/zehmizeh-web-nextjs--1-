// "use client"; // Required for client-side components in Next.js App Router

// import React, { useEffect, useState, useCallback } from "react";
// import { useRouter } from "next/navigation"; // Replace useNavigate from react-router-dom
// import ReactOtpInput from "react-otp-input";
// import Image from "next/image"; // Use Next.js Image component for optimized images
// import logo from "@/public/icons/logo.svg"; // Adjust path if needed
// import { useAuth } from "@/helpers/contexts/auth-context"; // Adjust path if needed
// import useResponsive from "@/helpers/hooks/useResponsive"; // Adjust path if needed
// import { showErr } from "@/helpers/utils/misc"; // Adjust path if needed
// import useStartPageFromTop from "@/helpers/hooks/useStartPageFromTop"; // Adjust path if needed
// import ChangeEmailModal from "./ChangeEmail"; // Adjust path if needed
// import LoadingButtons from "@/components/LoadingButtons"; // Adjust path if needed

// interface TwoFactorProps {
//   // Add any props if needed
// }

// export default function TwoFactor({}: TwoFactorProps) {
//   useStartPageFromTop();
//   const { isMobile } = useResponsive();
//   const { twoFactor, isLoading, user } = useAuth();
//   const router = useRouter(); // Next.js router for navigation

//   const [timer, setTimer] = useState(0);
//   const [otp, setOtp] = useState("");
//   const [showEditEmailModal, setShowEditEmailModal] = useState(false);

//   const timeOutCallback = useCallback(() => {
//     setTimer((currTimer) => currTimer - 1);
//   }, []);

//   useEffect(() => {
//     let otpTimer: NodeJS.Timeout;
//     if (timer > 0) {
//       otpTimer = setTimeout(timeOutCallback, 1000);
//     }
//     return () => {
//       clearTimeout(otpTimer);
//     };
//   }, [timer, timeOutCallback]);

//   const resetTimer = () => {
//     if (!timer) {
//       setTimer(30);
//     }
//   };

//   useEffect(() => {
//     if (!user?.email_id) {
//       // router.push('/register/employer'); // Uncomment if needed
//       return;
//     }
//   }, [user, router]);

//   const onChange = (value: string) => {
//     setOtp(value);
//   };

//   const handleOTP = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (otp === "") {
//       showErr("Please enter a valid OTP");
//       return;
//     }
//     const formdata = {
//       action: "verify_otp",
//       email_id: "",
//       user_otp: otp,
//       type: "new_registration",
//     };
//     twoFactor(formdata, () => {
//       router.push("/terms"); // Navigate using Next.js router
//     });
//   };

//   const onResend = () => {
//     const formdata = {
//       action: "resend_otp",
//       email_id: user.email_id,
//       type: "new_registration",
//     };
//     twoFactor(formdata, resetTimer);
//   };

//   const toggleEditModal = () => {
//     setShowEditEmailModal((prev) => !prev);
//   };

//   if (!user?.email_id) {
//     router.push("/login"); // Redirect if no email
//     return null; // Return null instead of empty fragment for Next.js
//   }

//   return isMobile ? (
//     <div className="min-h-screen bg-white p-4">
//       <div className="flex flex-col items-center gap-4">
//         <Image className="mt-8" src={logo} alt="logo" width={70} height={70} />
//         <h1 className="text-3xl font-bold mt-6 text-center text-gray-900">
//           Two-Factor Authentication
//         </h1>
//         <h2 className="text-xl font-light mt-1 text-center leading-relaxed text-gray-600">
//           We&apos;ve sent a 6-digit code to{" "}
//           <strong className="text-gray-900">
//             {user?.email_id || "your email address"}
//           </strong>
//           . If this email address is incorrect, you can update it by clicking{" "}
//           <button
//             onClick={toggleEditModal}
//             className="text-amber-500 hover:text-amber-600 font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded"
//           >
//             here.
//           </button>
//           <ChangeEmailModal
//             show={showEditEmailModal}
//             existingEmail={user?.email_id}
//             onClose={toggleEditModal}
//           />
//         </h2>
//         <form className="w-full max-w-sm mt-4" onSubmit={handleOTP}>
//           <div className="mx-4 flex gap-4 justify-center">
//             <ReactOtpInput
//               value={otp}
//               onChange={onChange}
//               renderSeparator={<span className="text-gray-400">-</span>}
//               numInputs={6}
//               containerStyle="flex gap-2"
//               inputStyle={{
//                 maxWidth: "3.5rem",
//                 width: "100%",
//                 height: "3.5rem",
//                 borderRadius: "0.5rem",
//                 margin: "0.5rem",
//                 backgroundColor: "#f3f4f6",
//                 border: "none",
//                 outline: "none",
//                 fontSize: "1.5rem",
//                 fontFamily: "inherit",
//               }}
//               shouldAutoFocus
//               renderInput={(props) => <input {...props} />}
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="mt-10 w-full h-14 bg-amber-500 text-white rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isLoading ? <LoadingButtons /> : "Verify"}
//           </button>

//           {timer > 0 ? (
//             <h4 className="text-xl font-light mt-5 flex items-center justify-center text-gray-600">
//               You can resend a new OTP in{" "}
//               <span className="font-bold text-gray-900">
//                 00:{timer > 9 ? timer : `0${timer}`}
//               </span>
//             </h4>
//           ) : (
//             <h4 className="text-xl font-light mt-4 flex items-center justify-center gap-1 text-gray-600">
//               Didn&apos;t receive your code?{" "}
//               <button
//                 onClick={onResend}
//                 disabled={isLoading}
//                 className="text-amber-500 hover:text-amber-600 font-bold disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded"
//               >
//                 Resend
//               </button>
//             </h4>
//           )}
//         </form>
//       </div>
//     </div>
//   ) : (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
//         <h1 className="text-3xl font-bold text-center text-gray-900">
//           Two-Factor Authentication
//         </h1>
//         <h2 className="text-xl font-light mt-4 text-center leading-relaxed text-gray-600">
//           We&apos;ve sent a 6-digit code to{" "}
//           <strong className="text-gray-900">
//             {user?.email_id || "your email address"}
//           </strong>
//           . If this email address is incorrect, you can update it by clicking{" "}
//           <button
//             onClick={toggleEditModal}
//             className="text-amber-500 hover:text-amber-600 font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded"
//           >
//             here.
//           </button>
//           <ChangeEmailModal
//             show={showEditEmailModal}
//             existingEmail={user?.email_id}
//             onClose={toggleEditModal}
//           />
//         </h2>
//         <form className="mt-8" onSubmit={handleOTP}>
//           <div className="flex gap-4 justify-center">
//             <ReactOtpInput
//               value={otp}
//               onChange={onChange}
//               renderSeparator={<span className="text-gray-400">-</span>}
//               numInputs={6}
//               containerStyle="flex gap-2"
//               inputStyle={{
//                 maxWidth: "3.5rem",
//                 width: "100%",
//                 height: "3.5rem",
//                 borderRadius: "0.5rem",
//                 margin: "0.5rem",
//                 backgroundColor: "#f3f4f6",
//                 border: "none",
//                 outline: "none",
//                 fontSize: "1.5rem",
//                 fontFamily: "inherit",
//               }}
//               shouldAutoFocus
//               renderInput={(props) => <input {...props} />}
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="mt-8 w-full h-14 bg-amber-500 text-white rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isLoading ? <LoadingButtons /> : "Verify"}
//           </button>

//           {timer > 0 ? (
//             <h4 className="mt-6 flex items-center justify-center text-gray-600">
//               You can resend a new OTP in{" "}
//               <span className="font-bold text-gray-900">
//                 00:{timer > 9 ? timer : `0${timer}`}
//               </span>
//             </h4>
//           ) : (
//             <h4 className="mt-6 flex items-center justify-center gap-1 text-gray-600">
//               Didn&apos;t receive your code?{" "}
//               <button
//                 onClick={onResend}
//                 disabled={isLoading}
//                 className="text-amber-500 hover:text-amber-600 font-bold disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded"
//               >
//                 Resend
//               </button>
//             </h4>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// }

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
      <MobileWrapper>
        <Image
          className="logo"
          src="/zehmizeh-logo.svg"
          alt="logo"
          width={70}
          height={70}
        />
        <h1 className="h1">Two-Factor Authentication</h1>
        <h2 className="h3 px-1 text-2xl font-medium">
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
            <h4 className="h4 mt-5 flex items-center justify-center">
              You can resend a new OTP in&nbsp;
              <span className="font-bold">
                00:{timer > 9 ? timer : `0${timer}`}
              </span>
            </h4>
          ) : (
            <h4 className="h4 mt-4 flex items-center justify-center gap-1">
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
      </MobileWrapper>
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
