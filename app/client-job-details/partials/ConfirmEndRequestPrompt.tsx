import { useState } from "react";
import toast from "react-hot-toast";
import { endJob } from "@/helpers/http/jobs";
import CustomButton from "@/components/custombutton/CustomButton";

type Props = {
  show: boolean;
  toggle: () => void;
  jobPostId: string;
  onEndJob: () => void;
  completionStatus: string;
};

const ConfirmEndRequestPrompt = ({
  show,
  toggle,
  jobPostId,
  onEndJob,
  completionStatus,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleEndJob = () => {
    // End job api call

    setLoading(true);
    const body: any = {
      job_id: jobPostId,
      status: completionStatus,
    };

    const promise = endJob(body);

    toast.promise(promise, {
      loading: "Please wait...",
      success: (res) => {
        setLoading(false);
        onEndJob();
        return res.message;
      },
      error: (err) => {
        setLoading(false);
        toggle();
        return err?.response?.data?.message || "error";
      },
    });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
        onClick={toggle}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl w-full max-w-[570px] mx-4 p-12 sm:mx-0">
        {/* Close button */}
        <button
          className="absolute right-4 top-0 md:-right-8 md:top-0 text-2xl md:text-white text-gray-500 hover:text-gray-700"
          onClick={toggle}
        >
          &times;
        </button>

        <div className="flex flex-col justify-center items-center">
          <div className="text-center">
            <div className="text-xl font-normal">
              Are you sure you want to end this job?
            </div>
            <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
              <CustomButton
                text="Go Back"
                className="px-8 py-4 text-base font-normal border-2 border-gray-800 text-gray-800 rounded-full transition-transform duration-200 hover:scale-105 hover:bg-black hover:text-white"
                onClick={toggle}
              />

              <CustomButton
                text="Confirm"
                className={`px-8 py-4 text-base font-normal rounded-full bg-primary text-black transition-transform duration-200 hover:scale-105`}
                onClick={handleEndJob}
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEndRequestPrompt;
