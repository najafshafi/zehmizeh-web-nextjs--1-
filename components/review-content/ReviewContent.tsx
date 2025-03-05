"use client";

import { FC } from "react";

type Review = {
  rate: number;
  description: string;
  date_created: string;
};

type Props = {
  review: Review;
};

const ReviewContent: FC<Props> = ({ review }) => {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(review.date_created));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center flex-wrap">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: review?.rate || 0 }, (_, i) => (
              <svg
                key={`star_${i}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="gold"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 17.75l-5.471 2.863a1 1 0 01-1.451-1.054l1.044-6.086-4.427-4.315a1 1 0 01.554-1.707l6.117-.89L11.17 1.75a1 1 0 011.659 0l2.734 5.51 6.117.89a1 1 0 01.554 1.707l-4.427 4.315 1.044 6.086a1 1 0 01-1.451 1.054L12 17.75z"
                />
              </svg>
            ))}
          </div>
          <span className="text-lg font-medium">{review?.rate?.toFixed(1) || "N/A"}</span>
        </div>
        <div className="text-gray-500 text-sm">{formattedDate}</div>
      </div>

      <p className="text-xl font-medium text-gray-800">&quot;{review?.description}&quot;</p>
    </div>
  );
};

export default ReviewContent;