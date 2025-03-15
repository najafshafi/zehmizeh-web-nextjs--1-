"use client";
import React from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { StyledButton } from '@/components/forms/Buttons';
import AuthLayout from '@/components/layout/AuthLayout';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useAuth } from '@/helpers/contexts/auth-context';
import { forgotPassword } from '@/helpers/http/auth';
import { showErr, showMsg } from '@/helpers/utils/misc';

interface ForgotPasswordFormData {
  email_id: string;
}

const CustomSpinner = () => (
  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full ml-2"/>
);

export default function ForgotPassword() {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { setEmail } = useAuth();

  const schema = yup.object({
    email_id: yup
      .string()
      .required('Email is required.')
      .email('Please enter a valid email.'),
  });

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      const res = await forgotPassword(data.email_id);
      setLoading(false);
      if (!res.status) {
        showErr(res.message);
        return;
      }
      showMsg(res.message);
      setEmail(data.email_id);
      router.push('/reset-password');
    } catch (error) {
      if (error instanceof Error) {
        showErr(error.message);
      } else {
        showErr('Something went wrong');
      }
      setLoading(false);
    }
  };

  return (
    <AuthLayout center small showNavigationHeader>
      <h1 className="text-[30px] font-bold">Forgot Password</h1>
      <p className="text-[20px] font-light text-muted my-2">
        Enter the email address attached to your account and we&apos;ll send you a
        code to reset your password.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[600px] md:px-0 px-6 mt-4">
        <div className="relative mb-4">
          <div className="relative">
            <input
              type="email"
              {...register('email_id')}
              placeholder=" "
              className="peer w-full px-4 py-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent"
            />
            <label
              className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600
                     transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base
                     peer-focus:-top-2.5 peer-focus:text-sm"
            >
              Email Address
            </label>
          </div>
          {errors.email_id && (
            <ErrorMessage className="text-start mt-1 text-red-500">
              {errors.email_id.message}
            </ErrorMessage>
          )}
        </div>

        <div className="flex justify-center ">
          <div className="hover:scale-110 transition-all duration-300">
          <StyledButton
            className="mt-2 "
            width={200}
            height={56}
            type="submit"
            padding="0"
            disabled={loading}
            background="#F2B420"
          >
            <span className="flex items-center justify-center">
              Submit
              {loading && <CustomSpinner />}
            </span>
          </StyledButton>
          </div>
         
        </div>
      </form>

      <h4 className="align-self-center mt-4">
        <Link href="/login" className="yellow-link">
          Back to login
        </Link>
      </h4>
    </AuthLayout>
  );
}
