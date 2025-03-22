/*
 * This is the card that displays the details of Hired / Saved freelancer
 */
"use client";
import { useState } from "react";
import styled from "styled-components";
import Spinner from "@/components/forms/Spin/Spinner";
import toast from "react-hot-toast";
import BlurredImage from "@/components/ui/BlurredImage";
import { transition } from "@/styles/transitions";
import { toggleBookmarkUser } from "@/helpers/http/search";
import DollarCircleIcon from "@/public/icons/dollar-circle.svg";
import StarIcon from "@/public/icons/star-yellow.svg";
import BookmarkIcon from "@/public/icons/saved.svg";
import { numberWithCommas } from "@/helpers/utils/misc";

const Wrapper = styled.div`
  border: 1px solid #d9d9d9;
  border-radius: 0.5rem;
  height: 100%;
  position: relative;
  overflow: hidden;
  .freelancer-context {
    padding: 1.25rem;
  }
  .designation {
    color: #999999;
    word-break: break-word;
  }
  .light-text {
    opacity: 0.5;
  }
  .budget {
    background-color: #fbf5e8;
    border-radius: 1rem;
    padding: 0.375rem 0.75rem;
    min-width: 4.5rem;
  }
  .details {
    margin-top: 0.75rem;
  }
  ${() => transition()};
`;

export const Bookmark = styled.div`
  height: 43px;
  width: 43px;
  border-radius: 2rem;
  background: ${(props) => props.theme.colors.yellow};
  color: #fff;
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
`;

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
    <Wrapper
      className="cursor-pointer flex flex-wrap gap-4 mt-3 justify-between no-hover-effect "
      // to={`/freelancer/${
      //   activeTabKey === 'saved' ? data?._bm_user_id : data?._freelancer_user_id
      // }`}
      // onClick={goToFreelancerProfile}
    >
      <div
        className="flex gap-4 w-100 freelancer-context"
        onClick={() => profileHandler()}
      >
        {/* Profile picture */}
        <BlurredImage
          src={data?.user_image || "/images/default_avatar.png"}
          height="67px"
          width="67px"
          // allowToUnblur={false}
        />

        <div>
          {/* Name and designation */}
          <div className="text-base font-normal title text-capitalize">
            {data?.first_name} {data?.last_name}
          </div>
          <div className="text-base font-normal mt-1 designation capital-first-ltr  md:pr-8 pr-7">
            {data?.job_title}
          </div>

          {/* Hourly rate and ratings */}
          <div className="flex gap-2 items-center mt-2 flex-wrap">
            <div className="budget text-base font-normal flex items-center">
              <DollarCircleIcon className="mr-1" />
              {data?.hourly_rate ? (
                <>
                  {numberWithCommas(data?.hourly_rate, "USD")}{" "}
                  <span className="light-text">/hr</span>
                </>
              ) : (
                <span className="light-text">n/a</span>
              )}
            </div>

            <div className="budget text-base font-normal flex items-center gap-1">
              <StarIcon /> {data?.avg_rate?.toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Saved Icon */}
      {activeTabKey == "saved" && (
        <Bookmark
          className="flex justify-center items-center pointer"
          onClick={onBookmark}
        >
          {loading ? <Spinner /> : <BookmarkIcon />}
        </Bookmark>
      )}
    </Wrapper>
  );
};

export default WorkInProgressJobCard;
