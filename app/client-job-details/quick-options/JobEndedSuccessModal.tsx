/*
 * This is a Success modal after ending a job
 */
import styled from "styled-components";
import SuccessTickIcon from "@/public/icons/success-tick.svg";

type Props = {
  show: boolean;
  toggle: () => void;
};

const SuccessModalContent = styled.div`
  .description {
    opacity: 0.63;
  }
`;

const EndJobModal = ({ show, toggle }: Props) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                onClick={toggle}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex flex-col justify-center items-center">
              <SuccessTickIcon />
              <SuccessModalContent>
                <div className="text-3xl font-bold text-center">
                  Project Ended!
                </div>
                <div className="description mt-3 text-xl font-light text-center">
                  Project ended successfully!
                </div>
              </SuccessModalContent>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndJobModal;
