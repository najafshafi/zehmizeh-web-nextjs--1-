/*
 * This component serves the stats the logged in freelancer
 */

import Spinner from "@/components/forms/Spin/Spinner";
import StarIcon from "@/public/icons/starYellow.svg";
import { numberWithCommas } from "@/helpers/utils/misc";

type Props = {
  dashboardStats: any;
  isLoading: boolean;
};

const DashboardStats = ({ dashboardStats, isLoading }: Props) => {
  return (
    <div className="mt-3 grid grid-cols-2 lg:grid-cols-3 gap-4 justify-center">
      <div className="xs:w-full md:w-full lg:w-full">
        <div className="h-[7.75rem] rounded-xl shadow-custom-lg bg-white p-6 flex flex-col justify-between md:mb-0 mb-8">
          <div className="text-lg text-gray-800 opacity-60 font-normal leading-[21.6px]">
            Total Projects Done
          </div>
          {!isLoading ? (
            <div className="text-3xl font-bold text-gray-900 leading-[38.4px] tracking-[0.03em] md:text-3xl ">
              {numberWithCommas(dashboardStats?.donejob)}
            </div>
          ) : (
            <div className="mt-3">
              <Spinner />
            </div>
          )}
        </div>
      </div>
      <div className="xs:w-full md:w-full lg:w-full">
        <div className="h-[7.75rem] rounded-xl shadow-custom-lg bg-white p-6 flex flex-col justify-between md:mb-0 mb-8">
          <div className="text-lg text-gray-800 opacity-60 font-normal leading-[21.6px]">
            Total Earnings
          </div>
          {!isLoading ? (
            <div className="text-3xl font-bold text-gray-900 leading-[38.4px] tracking-[0.03em] md:text-3xl ">
              {numberWithCommas(dashboardStats?.totalEarnings, "USD")}
            </div>
          ) : (
            <div className="mt-3">
              <Spinner />
            </div>
          )}
        </div>
      </div>
      <div className="xs:w-full md:w-full lg:w-full sm:col-span-2 lg:col-span-1">
        <div className="h-[7.75rem] rounded-xl shadow-custom-lg bg-white p-6 flex flex-col justify-between md:mb-0 mb-8">
          <div className="text-lg text-gray-800 opacity-60 font-normal leading-[21.6px]">
            Ratings
          </div>
          {!isLoading ? (
            <div className="flex items-center gap-1 leading-[38.4px] tracking-[0.03em]">
              <StarIcon className="text-yellow-400" />
              <div className="text-3xl font-bold text-gray-900">
                {dashboardStats?.ratings?.average
                  ? dashboardStats?.ratings?.average?.toFixed(1)
                  : 0}
              </div>
              <div className="text-lg font-medium text-gray-800">
                (
                {dashboardStats?.ratings?.count
                  ? numberWithCommas(dashboardStats?.ratings?.count)
                  : 0}{" "}
                reviews)
              </div>
            </div>
          ) : (
            <div className="mt-3">
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
