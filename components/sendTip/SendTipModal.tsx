"use client";

import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { numberWithCommas } from "@/helpers/utils/misc";
import toast from "react-hot-toast";
import { sendTip } from "@/helpers/http/jobs";
import CustomButton from "../custombutton/CustomButton";

interface Props {
  show: boolean;
  toggle: () => void;
  jobId: string;
  refetch: () => void;
}

const SendTipModal = ({ show, toggle, jobId, refetch }: Props) => {
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);
      const response = await sendTip({
        job_id: jobId,
        amount: Number(amount),
      });

      if (response.status) {
        toast.success("Tip sent successfully");
        refetch();
        toggle();
      } else {
        toast.error(response.message || "Failed to send tip");
      }
    } catch (error) {
      toast.error("An error occurred while sending tip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={toggle}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center  p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-2xl transform  rounded-2xl bg-white px-4 py-8 md:p-12 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-semibold leading-6 text-gray-900"
                  >
                    Send Tip to Freelancer
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-900 md:text-white hover:text-opacity-75"
                    onClick={toggle}
                  >
                    <XMarkIcon className="h-6 w-6 absolute top-4 right-4 md:top-0 md:-right-8" />
                  </button>
                </div>

                <div className="mt-4">
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Tip Amount (USD)
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="amount"
                      id="amount"
                      className="block w-full rounded-md border-0 py-[0.95rem] pl-8 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary text-sm md:text-base sm:leading-6"
                      placeholder="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="0"
                      step="01"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 sm:text-sm">USD</span>
                    </div>
                  </div>
                </div>

                <div className="mt-7 flex justify-end gap-3">
                  {/* <button
                    type="button"
                    className="inline-flex justify-center rounded-full border border-transparent bg-gray-100 px-8 py-[0.85rem] text-lg font-medium text-gray-900 hover:bg-gray-900   hover:text-gray-100 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    onClick={toggle}
                  >
                    Cancel
                  </button> */}

                  <CustomButton
                    text="Cancel"
                    className={`px-8 py-4 text-base font-normal border-2 border-gray-800 text-gray-800 rounded-full transition-transform duration-200 hover:scale-105 hover:bg-black hover:text-white`}
                    onClick={toggle}
                  />

                  {/* <button
                    type="button"
                    className="inline-flex justify-center rounded-full border border-transparent bg-primary px-8 py-[0.85rem] text-lg font-medium text-white hover:bg-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSubmit}
                    disabled={
                      loading ||
                      !amount ||
                      isNaN(Number(amount)) ||
                      Number(amount) <= 0
                    }
                  >
                    {loading ? "Sending..." : "Send Tip"}
                  </button> */}

                  <CustomButton
                    text={loading ? "Sending..." : "Send Tip"}
                    className={`px-8 py-4 text-base font-normal rounded-full bg-primary text-black transition-transform duration-200 hover:scale-105  border-2 border-primary ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={handleSubmit}
                    disabled={
                      loading ||
                      !amount ||
                      isNaN(Number(amount)) ||
                      Number(amount) <= 0
                    }
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SendTipModal;
