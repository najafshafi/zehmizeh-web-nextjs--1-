"use client";
import React, { useState } from "react";
import cns from "classnames";
import toast from "react-hot-toast";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import YupPassword from "yup-password";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import AuthLayout from "@/components/layout/AuthLayout";
import ErrorMessage from "@/components/ui/ErrorMessage";
import LoadingButtons from "@/components/LoadingButtons";
import { changePassword } from "@/helpers/http/auth";
import useStartPageFromTop from "@/helpers/hooks/useStartPageFromTop";
import Eye from "@/public/icons/eye.svg";
import { useAuth } from "@/helpers/contexts/auth-context";
import CustomButton from "../custombutton/CustomButton";

YupPassword(yup);

const passwordError =
  "Every password must include at least: 1 uppercase letter, 1 lowercase letter, 1 number, 1 symbol, and at least 8 characters";

export default function ChangePassword() {
  useStartPageFromTop();
  const auth = useAuth();

  const [loading, setLoading] = useState<boolean>(false);

  const [isExstPasswordPreview, setIsExstPasswordPreview] =
    React.useState(false);
  const [isNewPasswordPreview, setIsNewPasswordPreview] = React.useState(false);

  const toggleExstPasswordPreview = () =>
    setIsExstPasswordPreview(!isExstPasswordPreview);
  const toggleNewPasswordPreview = () =>
    setIsNewPasswordPreview(!isNewPasswordPreview);

  // modal flag function
  // const toggleConfirmPasswordPreview = () =>
  //   setIsConfirmPasswordPreview(!isConfirmPasswordPreview);

  const schema = yup.object({
    existingPassword: yup.string().required("Existing password is required."),
    newPassword: yup
      .string()
      .required("New password is required.")
      .min(8, passwordError)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*-?])[A-Za-z\d#$@!%&*-?]{8,30}$/,
        passwordError
      ),
    confirmPassword: yup
      .string()
      .oneOf(
        [yup.ref("newPassword"), undefined],
        "New password and confirm password must match"
      ),
  });

  const router = useRouter();

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any, e: any) => {
    e.preventDefault();
    onChangePassword(data);
  };

  const onChangePassword = (data: any) => {
    // Change password api call
    setLoading(true);
    const body = {
      old_password: data?.existingPassword,
      new_password: data?.newPassword,
    };
    const promise = changePassword(body);
    toast.promise(promise, {
      loading: "Loading...",
      success: (res) => {
        setLoading(false);
        router.push(
          auth?.user?.user_type == "freelancer"
            ? "/freelancer/account/profile"
            : "/client/account/profile"
        );
        return res.message;
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || "error";
      },
    });
  };

  const { errors } = formState;

  return (
    <AuthLayout center={true} small={true}>
      <h1>Reset Password</h1>

      <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap">
          <div className="w-full text-left mb-2">
            <div className="relative">
              <div className="relative">
                <input
                  id="existingPassword"
                  type={!isExstPasswordPreview ? "password" : "text"}
                  placeholder=""
                  className="w-full px-3 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary peer pt-7"
                  {...register("existingPassword")}
                />
                <label
                  htmlFor="existingPassword"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                >
                  Enter current password
                </label>
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={toggleExstPasswordPreview}
                >
                  <Eye
                    className={cns("input-icon", {
                      active: isExstPasswordPreview,
                    })}
                  />
                </span>
              </div>
            </div>
            <ErrorMessage>{errors.existingPassword?.message}</ErrorMessage>
          </div>
          <div className="w-full text-left mb-2">
            <div className="relative">
              <div className="relative">
                <input
                  id="newPassword"
                  type={!isNewPasswordPreview ? "password" : "text"}
                  placeholder=""
                  className="w-full px-3 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary peer pt-7"
                  {...register("newPassword")}
                />
                <label
                  htmlFor="newPassword"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                >
                  Create a new password
                </label>
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={toggleNewPasswordPreview}
                >
                  <Eye
                    className={cns("input-icon", {
                      active: isNewPasswordPreview,
                    })}
                  />
                </span>
              </div>
            </div>
            <ErrorMessage>{errors.newPassword?.message}</ErrorMessage>
          </div>
          <div className="w-full text-left mb-2">
            <div className="relative">
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={!isNewPasswordPreview ? "password" : "text"}
                  placeholder=""
                  className="w-full px-3 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary peer pt-7"
                  {...register("confirmPassword")}
                />
                <label
                  htmlFor="confirmPassword"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                >
                  Confirm password
                </label>
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={toggleNewPasswordPreview}
                >
                  <Eye
                    className={cns("input-icon", {
                      active: isNewPasswordPreview,
                    })}
                  />
                </span>
              </div>
            </div>
            <ErrorMessage>{errors.confirmPassword?.message}</ErrorMessage>
          </div>
        </div>
        <div className="flex justify-center">
          <CustomButton
            text={loading ? <LoadingButtons /> : "Reset"}
            className="px-16 py-4 max-w-[200px] transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px] close-account-btn mt-5"
            onClick={() => {}}
            disabled={loading}
          />
        </div>

        <h4 className="self-center mt-4">
          <div
            className="yellow-link cursor-pointer"
            onClick={() => router.back()}
          >
            Go back
          </div>
        </h4>
      </form>
    </AuthLayout>
  );
}
