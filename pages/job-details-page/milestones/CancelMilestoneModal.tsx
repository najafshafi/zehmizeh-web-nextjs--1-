"use client";

import { VscClose } from "react-icons/vsc";

interface Props {
  cancelStateData: {
    show: boolean;
    loading?: boolean;
    milestoneStatus: string;
  };
  toggle: () => void;
  onConfirm: () => void;
}

const CancelMileStoneModal = ({
  cancelStateData,
  toggle,
  onConfirm,
}: Props) => {
  if (!cancelStateData.show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
        onClick={toggle}
      />
      <div className="relative bg-white rounded-xl px-6 py-8 md:p-12 max-w-[678px] w-full mx-4">
        <button
          type="button"
          className="absolute right-4 top-4 md:top-2 md:right-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          onClick={toggle}
          aria-label="Close modal"
        >
          <VscClose size={24} />
        </button>

        <div className="flex flex-col gap-4 md:gap-6">
          <h2 className="text-xl md:text-2xl font-normal text-center">
            Are you sure you want to cancel
            {cancelStateData.milestoneStatus === "pending" ? (
              <span>&nbsp;this milestone proposal?</span>
            ) : (
              <span>?</span>
            )}
          </h2>

          {cancelStateData.milestoneStatus !== "pending" && (
            <div className="text-base md:text-lg font-normal text-center">
              If you cancel this milestone, the money that has been deposited to
              pay you for its completion will be sent back to the client. There
              is no way to undo this and the client will not be obligated to pay
              for the incomplete work of this milestone.
              <div className="mt-4 md:mt-6">
                (To be paid for the work you&apos;ve done in this milestone so
                far: have the client accept a new milestone to cover previous
                work before canceling this milestone.)
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-center gap-3">
            <button
              type="button"
              className="px-8 py-3 text-lg font-medium border-2 border-gray-800 text-gray-800 rounded-full hover:bg-gray-100 transition-colors duration-200"
              onClick={toggle}
            >
              Not Now
            </button>
            <button
              type="button"
              className="px-8 py-3 text-lg font-medium bg-[#F2B420] text-[#212529] rounded-full hover:bg-[#daa31d] transition-colors duration-200 disabled:opacity-50"
              onClick={onConfirm}
              disabled={cancelStateData.loading}
            >
              {cancelStateData.milestoneStatus === "pending"
                ? "Yes - Cancel"
                : "Yes - Cancel and Send Back Deposit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelMileStoneModal;
