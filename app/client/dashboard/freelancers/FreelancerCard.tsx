/*
 * This is the card that displays the details of Hired / Saved freelancer
 */
"use client";
import { useState } from "react";
import Spinner from "@/components/forms/Spin/Spinner";
import toast from "react-hot-toast";
import BlurredImage from "@/components/ui/BlurredImage";
import { toggleBookmarkUser } from "@/helpers/http/search";
import DollarCircleIcon from "@/public/icons/dollar-circle.svg";
import StarIcon from "@/public/icons/star-yellow.svg";
import BookmarkIcon from "@/public/icons/saved.svg";
import { numberWithCommas } from "@/helpers/utils/misc";

// Define the FreelancerData interface to fix the any type issue
interface FreelancerData {
  _bm_user_id?: string;
  _freelancer_user_id?: string;
  user_image?: string;
  first_name?: string;
  last_name?: string;
  job_title?: string;
  hourly_rate?: number;
  avg_rate?: number;
  [key: string]: string | number | boolean | object | undefined;
}

const WorkInProgressJobCard = ({
  data,
  activeTabKey,
  refetch,
}: {
  data: FreelancerData;
  activeTabKey: string;
  refetch: () => void;
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const onBookmark = (e: React.MouseEvent) => {
    // This will unsave the saved freelancer
    e.stopPropagation();
    setLoading(true);

    // Add a null check before calling toggleBookmarkUser
    if (!data?._bm_user_id) {
      setLoading(false);
      toast.error("User ID not found");
      return;
    }

    const promise = toggleBookmarkUser(data._bm_user_id);
    toast.promise(promise, {
      loading: "Please wait...",
      success: (res) => {
        setLoading(false);
        refetch();
        return res.message;
      },
      error: (err) => {
        setLoading(false);
        return err?.message || "error";
      },
    });
  };

  const profileHandler = () => {
    // Use window.location for client-side navigation to avoid useRouter issues
    const userId =
      activeTabKey === "saved" ? data?._bm_user_id : data?._freelancer_user_id;
    window.location.href = `/freelancer/${userId}`;
  };

  return (
    <div
      className="cursor-pointer flex flex-wrap gap-4 mt-3 justify-between 
                border border-[#d9d9d9] rounded-lg h-full relative overflow-hidden
                transition-all duration-300"
    >
      <div className="flex gap-4 w-full p-5" onClick={() => profileHandler()}>
        {/* Profile picture */}
        <BlurredImage
          src={data?.user_image || "/images/default_avatar.png"}
          height="67px"
          width="67px"
          // allowToUnblur={false}
        />

        <div>
          {/* Name and designation */}
          <div className="text-base font-normal capitalize">
            {data?.first_name} {data?.last_name}
          </div>
          <div className="text-base font-normal mt-1 text-[#999999] break-words capitalize md:pr-8 pr-7">
            {data?.job_title}
          </div>

          {/* Hourly rate and ratings */}
          <div className="flex gap-2 items-center mt-3 flex-wrap">
            <div className="bg-[#fbf5e8] rounded-2xl py-1.5 px-3 min-w-[4.5rem] text-base font-normal flex items-center">
              <DollarCircleIcon className="mr-1" />
              {data?.hourly_rate ? (
                <>
                  {numberWithCommas(data?.hourly_rate, "USD")}{" "}
                  <span className="opacity-50">/hr</span>
                </>
              ) : (
                <span className="opacity-50">n/a</span>
              )}
            </div>

            <div className="bg-[#fbf5e8] rounded-2xl py-1.5 px-3 min-w-[4.5rem] text-base font-normal flex items-center gap-1">
              <StarIcon /> {data?.avg_rate?.toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Saved Icon */}
      {activeTabKey == "saved" && (
        <div
          className="h-[43px] w-[43px] rounded-full bg-primary text-white absolute top-5 right-5
                    flex justify-center items-center cursor-pointer"
          onClick={onBookmark}
        >
          {loading ? <Spinner /> : <BookmarkIcon />}
        </div>
      )}
    </div>
  );
};

export default WorkInProgressJobCard;
