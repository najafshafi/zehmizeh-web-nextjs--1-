"use client";

import { useEffect, useState } from "react";
import { VscClose } from "react-icons/vsc";
import moment from "moment";

interface Props {
  show: boolean;
  loading: boolean;
  toggle: () => void;
  handleClick: (
    data: "ACCEPT_AND_DECLINE_REST" | "ACCEPT_AND_LEAVE_OPEN"
  ) => void;
}

export const HiringMoreFreelancerModal = ({
  show,
  toggle,
  handleClick,
  loading,
}: Props) => {
  const [showInformationModal, setShowInformationModal] = useState(false);

  // Reseting state when modal is not open
  useEffect(() => {
    if (!show) {
      // Added timeout because it was changing UI while closing animation is going on
      // So it'll change state only after closing animation is complete
      setTimeout(() => {
        setShowInformationModal(false);
      }, 1000);
    }
  }, [show]);

  const toggleWrapper = () => {
    if (!loading) toggle();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={toggleWrapper}
      />
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div className="relative w-full max-w-[678px] transform overflow-hidden rounded-2xl bg-white px-4 py-8 md:p-12 text-left align-middle shadow-xl transition-all">
            {!loading && (
              <button
                onClick={toggleWrapper}
                className="absolute right-4 top-4 md:top-0 md:-right-8 md:text-white text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <VscClose className="h-6 w-6" />
              </button>
            )}

            {!showInformationModal ? (
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900">
                  Would you like to hire more freelancers?
                </h3>

                <p className="mt-4 text-gray-600">
                  Would you like to accept this freelancer and decline the
                  others?
                  <br />
                  Or would you like to keep the project post open so you can
                  hire more freelancers?
                </p>

                <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center justify-center">
                  <button
                    onClick={() => setShowInformationModal(true)}
                    className="w-full sm:w-auto px-8 py-4 bg-amber-500 text-white rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    Accept & Leave Open
                  </button>
                  <button
                    onClick={() => handleClick("ACCEPT_AND_DECLINE_REST")}
                    className="w-full sm:w-auto px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    Accept & Decline the Rest
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900">
                  You can continue accepting proposals and inviting more
                  freelancers to this project.
                </h3>

                <p className="mt-4 text-gray-600">
                  In 65 Days (
                  {moment().add("65", "days").format("MMM DD, YYYY")}), your
                  project post will close. Every time you accept a freelancer,
                  the time will be extended again.
                </p>

                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => handleClick("ACCEPT_AND_LEAVE_OPEN")}
                    className="w-full sm:w-auto px-8 py-4 bg-amber-500 text-white rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
