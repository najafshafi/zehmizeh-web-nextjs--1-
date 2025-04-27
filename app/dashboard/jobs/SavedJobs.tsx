"use client";
import { useState } from "react";
import moment from "moment";
import Spinner from "@/components/forms/Spin/Spinner";
import Link from "next/link";
import Loader from "@/components/Loader";
import NoDataFound from "@/components/ui/NoDataFound";
import useJobs from "./use-jobs";
import { toggleBookmarkPost } from "@/helpers/http/search";
import { convertToTitleCase, numberWithCommas } from "@/helpers/utils/misc";
import DollarCircleIcon from "@/public/icons/dollar-circle.svg";
import LocationIcon from "@/public/icons/location-blue.svg";
import SavedIcon from "@/public/icons/saved.svg";
import classNames from "classnames";
import { isProjectHiddenForFreelancer } from "@/helpers/utils/helper";

const SavedJobs = () => {
  const { jobs, isLoading, isRefetching, refetch } = useJobs("saved");
  const [loadingId, setLoadingId] = useState<string>("");

  const onBookmarkClick = (e: any, id: string) => {
    e.stopPropagation();
    setLoadingId(id);
    toggleBookmarkPost(id).then(() => {
      setLoadingId(id);
      refetch();
    });
  };

  return (
    <div className="h-[500px] max-h-[500px] overflow-y-auto text-black">
      {isLoading || isRefetching ? (
        <Loader />
      ) : jobs.length > 0 ? (
        jobs.map((item: any) => {
          const isHidden = isProjectHiddenForFreelancer(item);
          return (
            <Link
              href={`/job-details/${item.job_post_id}/gen_details`}
              key={item.job_post_id}
              className={classNames("no-hover-effect", {
                "pe-none": isProjectHiddenForFreelancer(item),
                "pe-auto": !isProjectHiddenForFreelancer(item),
              })}
            >
              <div className="mt-3 flex cursor-pointer gap-2 justify-between no-hover-effect border border-[#dbdbdb] p-5 rounded-lg transition-all">
                <div className="flex flex-col gap-3.5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="text-lg font-normal break-words text-[#212529]">
                      {convertToTitleCase(item.job_title)}
                    </div>
                  </div>

                  <div className="flex items-center flex-wrap gap-2.5">
                    {/* Budget */}
                    <div className="flex items-center justify-center flex-wrap bg-[#fbf5e8] py-1.5 px-2.5 rounded-full">
                      <DollarCircleIcon />
                      <div className="flex ml-1.5 text-[#212529]">
                        {item.budget.type === "fixed" ? (
                          numberWithCommas(item.budget?.amount, "USD")
                        ) : (
                          <>
                            {numberWithCommas(item?.budget?.max_amount, "USD")}
                            <span className="opacity-60">/hr</span>&nbsp;
                          </>
                        )}
                      </div>
                      {item?.budget?.type === "fixed" && (
                        <span className="opacity-63 ms-2">Budget</span>
                      )}
                    </div>

                    {/* Location */}
                    {Array.isArray(item?.preferred_location) &&
                      item?.preferred_location?.length > 0 && (
                        <div className="flex text-[#212529] items-center justify-center flex-wrap bg-[#fbf5e8] py-1.5 px-2.5 rounded-lg">
                          <LocationIcon />
                          <div className="text-base font-normal mx-4">
                            {item.preferred_location.join(", ")}
                          </div>
                        </div>
                      )}
                  </div>

                  <div className="text-sm font-normal opacity-60 text-[#212529]">
                    Posted on{" "}
                    {moment(item?.date_created).format("MMM DD, YYYY")}
                  </div>
                  {isHidden && (
                    <span className="text-[#FF0505]">
                      Client has hidden this post -{" "}
                      {moment(item?.is_hidden?.date).format("MMM DD, YYYY")}
                    </span>
                  )}
                </div>
                <div
                  className="h-[43px] w-[43px] rounded-full bg-[#f5f5f5] text-[#747474] flex justify-center items-center cursor-pointer"
                  onClick={(e) => onBookmarkClick(e, item?.job_post_id)}
                >
                  {loadingId == item?.job_post_id ? <Spinner /> : <SavedIcon />}
                </div>
              </div>
            </Link>
          );
        })
      ) : (
        <NoDataFound />
      )}
    </div>
  );
};

export default SavedJobs;
