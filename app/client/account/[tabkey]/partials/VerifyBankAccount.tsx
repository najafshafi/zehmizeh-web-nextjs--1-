import { useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { verifyBankAccountForACH } from "@/helpers/http/client";

type Props = {
  show: boolean;
  bankAccountId: string;
  onClose: () => void;
  onUpdate: () => void;
};

const VerifyBankAccount = ({
  show,
  bankAccountId,
  onClose,
  onUpdate,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const schema = yup.object({
    amount1: yup
      .number()
      .integer("Deposit should be a whole number.")
      .required()
      .test("Is positive?", "Please enter a valid amount", (value) => value > 0)
      .typeError("Please enter a valid amount"),
    amount2: yup
      .number()
      .integer("Deposit should be a whole number.")
      .required()
      .test("Is positive?", "Please enter a valid amount", (value) => value > 0)
      .typeError("Please enter a valid amount"),
  });

  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any, e: any) => {
    e.preventDefault();
    verifyAccount(data);
  };

  const verifyAccount = (data: any) => {
    setLoading(true);

    const body = {
      bank_account_id: bankAccountId + "",
      amounts: [data?.amount1, data?.amount2],
    };

    const promise = verifyBankAccountForACH(body);
    toast.promise(promise, {
      loading: "Loading...",
      success: (res) => {
        setLoading(false);
        reset();
        onUpdate();
        return res.message;
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || "error";
      },
    });
  };

  const onModalClose = () => {
    reset();
    onClose();
  };

  const { errors } = formState;

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50">
      <div className="relative w-full max-w-[726px] mx-auto rounded-lg bg-white p-6">
        <button
          className="absolute -top-4 -right-8 text-3xl font-light text-white "
          onClick={onModalClose}
        >
          &times;
        </button>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="text-[28px] font-normal mb-3">
            Verify Bank Account
          </div>
          <div className="text-sm font-normal">
            Enter the two small amounts that Stripe has deposited to this bank
            account <b>in cents.</b>
          </div>

          <div className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mt-5">
                <label className="text-sm font-normal">
                  Deposit 1<span className="text-red-500">&nbsp;*</span>
                </label>
                <input
                  placeholder="Enter amount"
                  type="number"
                  step="0.01"
                  className="w-full mt-1.5 p-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={5}
                  {...register("amount1")}
                />
                {errors?.amount1 && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.amount1?.message}
                  </p>
                )}
              </div>

              <div className="mt-5">
                <label className="text-sm font-normal">
                  Deposit 2<span className="text-red-500">&nbsp;*</span>
                </label>
                <input
                  placeholder="Enter amount"
                  type="number"
                  step="0.01"
                  className="w-full mt-1.5 p-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={5}
                  {...register("amount2")}
                />
                {errors?.amount2 && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.amount2?.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center md:justify-end mt-4">
            <button
              disabled={loading}
              type="submit"
              className="px-[2rem] py-[1rem]  transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[16px]"
            >
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyBankAccount;
