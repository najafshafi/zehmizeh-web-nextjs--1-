/*
 * This components serves all the Stats of the logged in client like:
  Total jobs done, Earnings, Ratings
 */
import Spinner from "@/components/forms/Spin/Spinner";
import useDashboardStats from "./use-dashboard-stats";
import StarIcon from "@/public/icons/starYellow.svg";
import { numberWithCommas } from "@/helpers/utils/misc";

const DashboardStats = () => {
  const { dashboardStats, isLoading } = useDashboardStats();

  return (
    <div className="my-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Total Jobs done */}

        <div className="md:col-span-6 lg:col-span-4 col-span-6 mb-8">
          <div
            className="h-[7.75rem] rounded-xl shadow-[0px_4px_74px_rgba(0,0,0,0.08)] bg-white p-6
                        md:block md:p-6 flex flex-col justify-center items-center"
          >
            <div className="text-lg font-normal opacity-60 md:text-left text-center leading-[21.6px]">
              Total Projects Completed
            </div>
            {!isLoading ? (
              <div className="text-3xl font-bold mt-3 leading-relaxed tracking-wide">
                {numberWithCommas(dashboardStats?.donejob || 0)}
              </div>
            ) : (
              <div className="mt-3">
                <Spinner />
              </div>
            )}
          </div>
        </div>

        {/* Total Earnings */}

        <div className="md:col-span-6 lg:col-span-4 col-span-6 mb-8">
          <div
            className="h-[7.75rem] rounded-xl shadow-[0px_4px_74px_rgba(0,0,0,0.08)] bg-white p-6
                        md:block md:p-6 flex flex-col justify-center items-center"
          >
            <div className="text-lg font-normal opacity-60 md:text-left text-center leading-[21.6px]">
              Total Freelancers Hired
            </div>
            {!isLoading ? (
              <div className="text-3xl font-bold mt-3 leading-relaxed tracking-wide">
                {dashboardStats?.totalHired
                  ? numberWithCommas(dashboardStats.totalHired)
                  : 0}
              </div>
            ) : (
              <div className="mt-3">
                <Spinner />
              </div>
            )}
          </div>
        </div>

        {/* Ratings - Reviews */}

        <div className="lg:col-span-4 col-span-12 mb-8">
          <div
            className="h-[7.75rem] rounded-xl shadow-[0px_4px_74px_rgba(0,0,0,0.08)] bg-white p-6
                        md:block md:p-6 flex flex-col justify-center items-center"
          >
            <div className="text-lg font-normal opacity-60 md:text-left text-center leading-[21.6px]">
              Ratings
            </div>
            {!isLoading ? (
              <div className="mt-3 flex items-center gap-1 md:justify-start justify-center">
                <StarIcon />
                <div className="text-3xl font-bold leading-relaxed tracking-wide">
                  {dashboardStats?.ratings?.average
                    ? dashboardStats.ratings.average.toFixed(1)
                    : 0}
                </div>
                <div className="text-lg font-normal">
                  (
                  {dashboardStats?.ratings?.count
                    ? numberWithCommas(dashboardStats.ratings.count)
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
    </div>
  );
};

export default DashboardStats;
