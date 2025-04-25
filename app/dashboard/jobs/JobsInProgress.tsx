/*
 * This component serves a list of JOBS - IN PROGRESS
 */

import Loader from "@/components/Loader";
import NoDataFound from "@/components/ui/NoDataFound";
import useJobs from "./use-jobs";
import { convertToTitleCase, numberWithCommas } from "@/helpers/utils/misc";
import DollarCircleIcon from "@/public/icons/dollar-circle.svg";
import BlurredImage from "@/components/ui/BlurredImage";
import Link from "next/link";

const JobsInProgress = () => {
  const { jobs, isLoading, isRefetching } = useJobs("active");
  return (
    <div className="h-[500px] max-h-[500px] overflow-y-auto text-black">
      {isLoading || isRefetching ? (
        <Loader />
      ) : jobs.length > 0 ? (
        jobs.map((item: any) => (
          <Link
            href={`/job-details/${item.job_post_id}/m_stone`}
            key={item.job_post_id}
            className="no-hover-effect"
          >
            <div className="mt-3 flex flex-col cursor-pointer no-hover-effect text-black border border-[#dbdbdb] p-5 rounded-lg transition-all">
              <div className="text-lg font-normal break-words">
                {convertToTitleCase(item.job_title)}
              </div>
              <div className="flex items-center flex-wrap gap-4">
                {/* Client details */}
                <div className="flex items-center mt-2">
                  <BlurredImage
                    src={item?.user_image || "/images/default_avatar.png"}
                    className="mr-2"
                    height="2.625rem"
                    width="2.625rem"
                    allowToUnblur={false}
                    type="small"
                  />
                  <div>
                    <div className="text-sm font-normal opacity-50 mb-0.5">
                      Client:
                    </div>
                    <div className="text-base font-normal capitalize">
                      {item?.first_name} {item?.last_name}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px h-8 bg-[#d1d1d1]" />

                {/* Budget */}
                <div className="flex items-center justify-center flex-wrap bg-[#fbf5e8] py-1.5 px-2.5 rounded-full">
                  <DollarCircleIcon />
                  <div className="flex ml-1.5">
                    <>
                      {numberWithCommas(item?.approved_budget?.amount, "USD")}
                      {item?.approved_budget?.type === "hourly" ? (
                        <span className="opacity-63">/hr</span>
                      ) : (
                        <span className="opacity-63 ms-1">Budget</span>
                      )}
                    </>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <NoDataFound />
      )}
    </div>
  );
};

export default JobsInProgress;
