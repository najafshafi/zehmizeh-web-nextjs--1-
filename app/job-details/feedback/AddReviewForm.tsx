/*
 * This is the add review form
 */

import { useState } from "react";
import { Form } from "react-bootstrap";
import toast from "react-hot-toast";
import AnimatedStar from "@/components/ui/AnimatedStar";
import { manageFeedback } from "@/helpers/http/jobs";
import CustomButton from "@/components/custombutton/CustomButton";

const AddReviewForm = ({
  jobPostId,
  clientUserId,
  freelancerUserId,
  onSubmitFeedback,
  clientName,
}: {
  jobPostId: string;
  clientUserId: string;
  freelancerUserId: string;
  onSubmitFeedback: () => void;
  clientName: string;
}) => {
  const [ratings, setRatings] = useState<number>(0); //feedbackData?.client?.rate
  const [reviewMsg, setReviewMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const addFeedback = () => {
    if (ratings == 0) {
      toast.error("Please provide ratings.");
      return;
    }
    if (reviewMsg == "") {
      toast.error("Please provide your feedback.");
      return;
    }

    setLoading(true);
    const data = {
      action: "add_feedback",
      job_post_id: jobPostId,
      client_user_id: clientUserId,
      freelancer_user_id: freelancerUserId,
      submitted_by: "freelancer",
      rate: ratings,
      description: reviewMsg,
    };
    const promise = manageFeedback(data);
    toast.promise(promise, {
      loading: "Loading...",
      success: (res) => {
        onSubmitFeedback();
        setLoading(false);
        return res.message;
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || "error";
      },
    });
  };

  return (
    <div className="mt-11 flex flex-col gap-6 rounded-[1rem] bg-[rgba(255,255,255,0.7)] p-8 shadow-[0px_4px_54px_rgba(0,0,0,0.04)]">
      <div className="text-2xl font-normal">Freelancer&apos;s Review</div>
      <div className="flex flex-col gap-5 rounded-[0.5rem] border border-[#d7d7d7] p-6">
        <div className="text-base font-normal uppercase opacity-70">
          RATE YOUR EXPERIENCE WITH {clientName}
        </div>
        <div className="flex items-center">
          <div className="text-lg font-normal">Worst</div>
          <div className="mx-3 flex items-center gap-[3px]">
            {Array(5)
              .fill(1)
              .map((item: any, index) => (
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
      <Form.Control
        as="textarea"
        rows={4}
        name="description"
        placeholder="Describe your experience with the client here..."
        value={reviewMsg}
        onChange={(e) => setReviewMsg(e.target.value)}
        className="rounded-[7px] p-4 border border-[#d7d7d7] focus:outline-none focus:ring-4 focus:ring-blue-400/70"
        maxLength={500}
      />
      <div className="flex justify-end">
        <CustomButton
          text={"Submit Review"}
          className={`px-[2rem] py-[0.85rem] text-lg text-center font-normal bg-[#f2b420] text-black rounded-full hover:scale-105 transition-transform duration-300`}
          disabled={loading}
          onClick={addFeedback}
        />
      </div>
    </div>
  );
};

export default AddReviewForm;
