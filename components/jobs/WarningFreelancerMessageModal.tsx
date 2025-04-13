"use client";

import { useEffect, useState } from "react";
import { VscClose } from "react-icons/vsc";

interface Props {
  show: boolean;
  setShow: (value: boolean) => void;
  onContinue: () => void;
}

export const WarningFreelancerMessageModal = ({
  setShow,
  show,
  onContinue,
}: Props) => {
  const [firstCheckbox, setFirstCheckbox] = useState(false);
  const [secondCheckbox, setSecondCheckbox] = useState(false);

  useEffect(() => {
    if (firstCheckbox && secondCheckbox) {
      closeModal();
      onContinue();
    }
  }, [firstCheckbox, secondCheckbox, onContinue]);

  const closeModal = () => setShow(false);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={closeModal}
      />
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div className="relative w-full max-w-[767px] transform overflow-hidden rounded-2xl bg-white px-4 py-8 md:p-12 text-left align-middle shadow-xl transition-all">
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 md:top-0 md:-right-8 md:text-white text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <VscClose className="h-6 w-6" />
            </button>

            <div className="flex flex-col justify-center items-center">
              <h4 className="text-xl font-semibold mb-4">
                Note: The Freelancer Has NOT Been Hired
              </h4>

              <p className="mt-4 mb-1 text-center text-gray-700">
                The freelancer is not hired until you click 'Accept Proposal' on
                their proposal.
              </p>
              <p className="font-bold text-gray-800 mb-4">
                They should not do work before that point.
              </p>

              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  id="first-checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                  checked={firstCheckbox}
                  onChange={(e) => setFirstCheckbox(e.target.checked)}
                />
                <label htmlFor="first-checkbox" className="text-gray-700">
                  I understand
                </label>
              </div>

              <p className="mt-4 mb-1 text-center text-gray-700">
                Payments for ZMZ projects must be made on ZMZ.
              </p>
              <p className="text-gray-700 mb-4">
                <span className="font-bold">
                  Any other payment method is theft
                </span>
                , a violation of our terms and halacha.
              </p>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="second-checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                  checked={secondCheckbox}
                  onChange={(e) => setSecondCheckbox(e.target.checked)}
                />
                <label htmlFor="second-checkbox" className="text-gray-700">
                  I understand
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
