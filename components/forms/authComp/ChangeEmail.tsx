/*
 * This component is a modal to edit email
 */
'use client';
import { useState, useEffect, useCallback } from 'react';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { showErr } from '@/helpers/utils/misc';
import { editUser } from '@/helpers/http/auth';
import { useAuth } from '@/helpers/contexts/auth-context';

type Props = {
  show: boolean;
  onClose: () => void;
  existingEmail?: string;
};

type FormData = {
  email_id: string;
};

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
    useForm<FormData>({
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
    if (show && existingEmail) {
      setValue('email_id', existingEmail);
    }
  }, [existingEmail, setValue, show]);

  /** @function This function will submit the form and call send OTP api function */
  const onSubmit = async (data: FormData) => {
    if (data.email_id === existingEmail) {
      showErr('The new email is same as current email');
      return;
    }

    if (!!existingEmail && getValues('email_id')) updateEmail();
  };

  const { errors } = formState;

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-500 flex items-center justify-center">
      <div className="fixed inset-0 bg-black" onClick={handleModalClose} />
      <div className="relative w-full max-w-[578px]">
        <button
          className="absolute -right-6 -top-6 text-3xl text-white hover:opacity-70"
          onClick={handleModalClose}
        >
          ×
        </button>
        <div className="rounded-[20px] bg-white shadow-lg p-8">
          <div className="flex flex-col">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="w-full">
                <label className="block text-left text-[16px] font-normal text-[#000000]">
                  New Email <span className="text-red-500">*</span>
                </label>
                <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-center">
                  <input
                    type="email"
                    placeholder="Enter new email"
                    className="w-full rounded-[10px] border border-[#E5E7EB] bg-white px-4 py-3.5 text-[16px] text-black placeholder:text-[#9CA3AF] focus:border-[#E5E7EB] focus:outline-none focus:ring-0"
                    maxLength={255}
                    {...register('email_id')}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className={`rounded-full bg-[#F5B544] px-12 py-3.5 text-[16px] font-medium text-black transition-all hover:bg-[#F5B544]/90 disabled:cursor-not-allowed disabled:opacity-50
                      ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    Submit
                  </button>
                </div>
                {errors?.email_id && (
                  <ErrorMessage message={errors.email_id.message as string} />
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeEmailModal;
