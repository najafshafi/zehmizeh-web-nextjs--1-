import CustomButton from "@/components/custombutton/CustomButton";

type Props = {
  show: boolean;
  toggle: () => void;
  onConfirm: () => void;
  loading: boolean;
};

const FinalMilestoneModal = ({ show, toggle, onConfirm, loading }: Props) => {
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

            <div className="text-center text-xl mb-3">
              Your freelancer has posted a Final Hours Submission and would like
              to close the project. Please review the submission and decide if
              you would like to accept or decline the request.
            </div>

            <div className="flex flex-col md:flex-row justify-center mt-4 gap-2">
              <CustomButton
                text="Close"
                className={`px-8 py-4 text-base font-normal rounded-full bg-primary text-black transition-transform duration-200 hover:scale-105 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={onConfirm}
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalMilestoneModal;
