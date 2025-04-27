import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { manageMilestone } from "@/helpers/http/jobs";
import { manageHours } from "@/helpers/http/jobs";
import CustomButton from "@/components/custombutton/CustomButton";

type Props = {
  show: boolean;
  toggle: () => void;
  onSubmit: () => void;
  milestoneId: string | number;
  type: string;
};

interface DeclineRequestBody {
  decline_reason: string;
  status: string;
  action: string;
  milestone_id?: string | number;
  hourly_id?: string | number;
}

interface ApiResponse {
  response: string;
  data?: unknown;
}

const DeclineReasonPrompt = ({
  show,
  toggle,
  onSubmit,
  milestoneId,
  type,
}: Props) => {
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (show && type === "milestone") {
      setShowWarning(true);
    }
  }, [type, show]);

  useEffect(() => {
    if (show) {
      // Lock body scroll
      document.body.style.overflow = "hidden";
    } else {
      // Restore scroll
      document.body.style.overflow = "";
    }

    return () => {
      // Cleanup
      document.body.style.overflow = "";
    };
  }, [show]);

  const submitDeclineReason = (e: React.FormEvent) => {
    e.preventDefault();

    const body: DeclineRequestBody = {
      decline_reason: "Declined",
      status: "decline",
      action: type === "milestone" ? "edit_milestone" : "edit_hours",
    };
    if (type === "milestone") {
      body.milestone_id = milestoneId;
    } else {
      body.hourly_id = milestoneId;
    }

    setLoading(true);

    let promise = null;
    if (type === "hourly") {
      promise = manageHours(
        body as {
          action: string;
          hourly_id?: string;
          status?: string;
          decline_reason?: string;
        }
      );
    } else {
      promise = manageMilestone(body as any);
    }

    if (promise) {
      toast.promise(promise, {
        loading: "Loading...",
        success: (res: ApiResponse) => {
          setLoading(false);
          toggle();
          onSubmit();
          return res.response;
        },
        error: (err) => {
          setLoading(false);
          return err?.response?.data?.message || "error";
        },
      });
    }
  };

  const closeModal = () => {
    setLoading(false);
    toggle();
  };

  const closeWarning = () => {
    setShowWarning(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={closeModal}
      ></div>

      <div className="relative w-full max-w-[570px] mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-12">
          <button
            className="absolute -top-4 -right-8 text-3xl font-extralight leading-none hover:text-gray-500 focus:outline-none"
            onClick={closeModal}
          >
            &times;
          </button>

          {showWarning && (
            <div>
              <div className="fs-24 font-normal text-center mb-3">
                Are you sure you want to terminate this milestone?
              </div>
              <div className="fs-20 font-normal text-center mb-3">
                When you terminate, the milestone is closed permanently and the
                money you deposited previously is returned to you.
              </div>
              <div className="fs-20 font-normal text-center">
                If you are simply not ready to deliver payment because you have
                feedback about the work your freelancer delivered - or because
                your freelancer has not yet delivered the work - close this
                window and communicate with them in the &quot;Messages&quot;
                tab.
              </div>
              <div className="flex items-center justify-center gap-3 flex-wrap mt-4">
                <CustomButton
                  text="Terminate Milestone"
                  className="px-8 py-4 text-base font-normal border-2 border-gray-800 text-gray-800 rounded-full transition-transform duration-200 hover:scale-105 hover:bg-black hover:text-white"
                  onClick={closeWarning}
                />

                <CustomButton
                  text="I'll Send Feedback"
                  className="px-8 py-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px]"
                  onClick={toggle}
                />
              </div>
            </div>
          )}

          {!showWarning && (
            <>
              <div className="fs-20 font-normal text-center">
                Are you sure you would like to decline this Final Hours
                Submission? This will return the project to a &quot;Project in
                Progress&quot; status and the freelancer will be able to
                continue to submit hours.
              </div>
              <form onSubmit={submitDeclineReason}>
                <div className="flex gap-2 flex-wrap mt-4 justify-center">
                  <CustomButton
                    text="Reopen the Project"
                    className={`px-8 py-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[16px] ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => {}}
                    disabled={loading}
                  />

                  <CustomButton
                    text="Cancel"
                    className={`px-8 py-4 text-base font-normal border-2 border-gray-800 text-gray-800 rounded-full transition-transform duration-200 hover:scale-105 hover:bg-black hover:text-white ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={closeModal}
                    disabled={loading}
                  />
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeclineReasonPrompt;
