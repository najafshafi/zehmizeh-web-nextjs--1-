import { useState } from "react";
import toast from "react-hot-toast";
import AnimatedStar from "./AnimatedStar";
import { endJob } from "@/helpers/http/jobs";
import ErrorMessage from "@/components/ui/ErrorMessage";
import CustomButton from "@/components/custombutton/CustomButton";

interface EndJobState {
  selectedStatus: string;
  endingReason?: string;
  incompleteJobDescription?: string;
}

interface ApiResponse {
  status: boolean;
  message: string;
  response?: any;
}

interface EndJobPayload {
  job_id: string;
  status: string;
  rate?: number;
  description?: string;
  reason?: string;
  incomplete_description?: string;
}

type Props = {
  onEndJob?: () => void;
  freelancerName: string;
  jobPostId: string;
  endJobState: EndJobState;
  onError: (msg: string) => void;
};

const errorInitialState = { ratings: "", feedback: "" };

const Feedback = ({
  onEndJob,
  freelancerName,
  jobPostId,
  endJobState,
  onError,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [ratings, setRatings] = useState<number>(0);
  const [reviewMsg, setReviewMsg] = useState<string>("");
  const [error, setError] = useState(errorInitialState);

  const isValid = () => {
    const errors = { ...errorInitialState };
    if (!(endJobState?.selectedStatus == "in-complete")) {
      if (!ratings) {
        errors.ratings = "Please enter ratings";
      }
      if (!reviewMsg) {
        errors.feedback = "Please enter feedback";
      }
    }
    setError(errors);
    if (Object.values(errors).some((x) => x !== "")) return false;
    return true;
  };

  const handleEndJob = () => {
    if (loading || !isValid()) return;
    // End job api call

    setLoading(true);
    const body: EndJobPayload = {
      job_id: jobPostId,
      status:
        endJobState?.selectedStatus == "closed" ? "closed" : "in-complete",
      rate: ratings,
      description: reviewMsg,
    };

    if (endJobState?.selectedStatus == "in-complete") {
      body.reason = endJobState?.endingReason;
      body.incomplete_description = endJobState?.incompleteJobDescription;
    }

    toast.loading("Please wait...");

    endJob(body)
      .then((res: ApiResponse) => {
        setLoading(false);
        if (res.status) {
          if (onEndJob) {
            onEndJob();
          }
          toast.success(res.message);
        } else {
          onError(res.message);
        }
        toast.dismiss();
      })
      .catch((err) => {
        setLoading(false);
        onError(err?.response?.data?.message);
        toast.dismiss();
      });
  };

  return (
    <div className="flex flex-col gap-6 mt-6">
      <div className="text-3xl font-bold">Close Project</div>
      <div className="flex flex-col gap-6">
        {endJobState?.selectedStatus == "in-complete" ? (
          <>
            <div className="flex flex-col gap-5 p-6 border border-gray-300 rounded-lg opacity-50 pointer-events-none">
              <div className="text-base font-normal uppercase opacity-70">
                RATE YOUR EXPERIENCE WITH {freelancerName}
              </div>
              <div className="flex items-center">
                <div className="text-lg font-normal">Worst</div>
                <div className="flex items-center mx-3 gap-0.5">
                  {Array(5)
                    .fill(1)
                    .map((item: number, index) => (
                      <div key={`star_${index}`} className="cursor-pointer">
                        <AnimatedStar
                          isFilled={index < ratings}
                          onChange={() => setRatings(index + 1)}
                        />
                      </div>
                    ))}
                </div>
                <div className="text-lg font-normal">Best</div>
              </div>
            </div>
            <textarea
              disabled
              rows={4}
              name="description"
              placeholder="Write your feedback here..."
              value={reviewMsg}
              onChange={(e) => setReviewMsg(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg resize-none"
              maxLength={500}
            />
          </>
        ) : (
          <>
            <div>
              <div className="flex flex-col gap-5 p-6 border border-gray-300 rounded-lg">
                <div className="text-base font-normal uppercase opacity-70">
                  RATE YOUR EXPERIENCE WITH {freelancerName}
                </div>
                <div className="flex items-center">
                  <div className="text-lg font-normal">Worst</div>
                  <div className="flex items-center mx-3 gap-0.5">
                    {Array(5)
                      .fill(1)
                      .map((item: number, index) => (
                        <div key={`star_${index}`} className="cursor-pointer">
                          <AnimatedStar
                            isFilled={index < ratings}
                            onChange={() => setRatings(index + 1)}
                          />
                        </div>
                      ))}
                  </div>
                  <div className="text-lg font-normal">Best</div>
                </div>
              </div>
              {error?.ratings && <ErrorMessage message={error.ratings} />}
            </div>
            <div>
              <textarea
                rows={4}
                name="description"
                placeholder="Write your feedback here..."
                value={reviewMsg}
                onChange={(e) => setReviewMsg(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg resize-none"
                maxLength={500}
              />
              {error?.feedback && <ErrorMessage message={error.feedback} />}
            </div>
          </>
        )}
        <div className="flex justify-end">
          <CustomButton
            text="Submit Feedback & Close Project"
            className={`px-8 py-3 rounded-full bg-primary text-black transition-transform duration-200 hover:scale-105`}
            onClick={handleEndJob}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Feedback;
