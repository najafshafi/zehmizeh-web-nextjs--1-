"use client";

import { useEffect, useState } from "react";
import { VscClose } from "react-icons/vsc";

interface Props {
  show: boolean;
  setShow: (value: boolean) => void;
  onContinue: () => void;
}

export const WarningProposalMessageModal = ({
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
                Note: You are NOT Hired
              </h4>

              <p className="mt-4 mb-2 text-center text-gray-700">
                You are not hired until the client accepts your proposal, so{" "}
                <span className="font-bold">
                  you should not be doing any work on the project until then.
                </span>
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

              <p className="mt-4 mb-2 text-center text-gray-700">
                Payment for projects found on ZMZ must be made through
                ZMZ&apos;s payment system. Paying through{" "}
                <span className="font-bold">
                  any other method is theft from the company,
                </span>{" "}
                (violating our Terms of Service and halacha).
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
