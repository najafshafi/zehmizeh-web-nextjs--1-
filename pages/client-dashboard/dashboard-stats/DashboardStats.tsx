/*
 * This components serves all the Stats of the logged in client like:
  Total jobs done, Earnings, Ratings
 */
import Spinner from "@/components/forms/Spin/Spinner";
import styled from "styled-components";
import useDashboardStats from "./use-dashboard-stats";
import StarIcon from "@/public/icons/starYellow.svg";
import { numberWithCommas } from "@/helpers/utils/misc";
import { breakpoints } from "@/helpers/hooks/useResponsive";

const StatsWrapper = styled.div`
  .col,
  .col-lg-4 {
    // This will add some gap when goes to mobile view
    margin-bottom: 2rem;
  }
`;

const StatBlock = styled.div`
  height: 7.75rem;
  border-radius: 0.75rem;
  box-shadow: 0px 4px 74px rgba(0, 0, 0, 0.08);
  background: ${(props) => props.theme.colors.white};
  padding: 1.5rem;
  .stat-label {
    opacity: 0.6;
    line-height: 21.6px;
    font-size: 1.125rem;
  }
  .stat-value {
    line-height: 38.4px;
    letter-spacing: 0.03em;
    font-size: 2rem;
  }
  @media ${breakpoints.mobile} {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 1rem;
    .stat-label {
      font-size: 1rem;
      text-align: center;
    }
  }
`;

const DashboardStats = () => {
  // This will fetch the dashboard counts from api
  const { dashboardStats, isLoading } = useDashboardStats();

  return (
    <StatsWrapper className="my-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Total Jobs done */}

        <div className="md:col-span-6 lg:col-span-4 col-span-6">
          <StatBlock>
            <div className="stat-label text-lg font-normal opacity-60">
              Total Projects Completed
            </div>
            {!isLoading ? (
              <div className="stat-value text-3xl font-bold mt-3 leading-relaxed tracking-wide">
                {numberWithCommas(dashboardStats?.donejob)}
              </div>
            ) : (
              <div className="mt-3">
                <Spinner />
              </div>
            )}
          </StatBlock>
        </div>

        {/* Total Earnings */}

        <div className="md:col-span-6 lg:col-span-4 col-span-6">
          <StatBlock>
            <div className="stat-label text-lg font-normal opacity-60">
              Total Freelancers Hired
            </div>
            {!isLoading ? (
              <div className="stat-value text-3xl font-bold mt-3 leading-relaxed tracking-wide">
                {dashboardStats?.totalHired
                  ? numberWithCommas(dashboardStats?.totalHired)
                  : 0}
              </div>
            ) : (
              <div className="mt-3">
                <Spinner />
              </div>
            )}
          </StatBlock>
        </div>

        {/* Ratings - Reviews */}

        <div className="lg:col-span-4 col-span-12">
          <StatBlock>
            <div className="stat-label text-lg font-normal opacity-60">
              Ratings
            </div>
            {!isLoading ? (
              <div className="stat-value mt-3 flex items-center gap-1">
                <StarIcon />
                <div className="text-3xl font-bold leading-relaxed tracking-wide">
                  {dashboardStats?.ratings?.average
                    ? dashboardStats?.ratings?.average?.toFixed(1)
                    : 0}
                </div>
                <div className="text-lg font-normal">
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
          </StatBlock>
        </div>
      </div>
    </StatsWrapper>
  );
};

export default DashboardStats;
