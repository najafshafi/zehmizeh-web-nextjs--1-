/*
 * This component serves the stats the logged in freelancer
 */

// import { Spinner } from 'react-bootstrap';
import Spinner from '@/components/forms/Spin/Spinner';
import styled from 'styled-components';
import StarIcon from '@/public/icons/starYellow.svg';
import { numberWithCommas } from '@/helpers/utils/misc';

const StatBlock = styled.div`
  height: 7.75rem;
  border-radius: 0.75rem;
  box-shadow: 0px 4px 74px rgba(0, 0, 0, 0.08);
  background: ${(props) => props.theme.colors.white};
  padding: 1.5rem;
  .stat-label {
    opacity: 0.6;
    line-height: 21.6px;
  }
  .stat-value {
    line-height: 38.4px;
    letter-spacing: 0.03em;
  }
  @media (max-width: 767px) {
    margin-bottom: 2rem;
    .stat-value {
      font-size: 1.25rem;
    }
  }
`;

type Props = {
  dashboardStats: any;
  isLoading: boolean;
};

const DashboardStats = ({ dashboardStats, isLoading }: Props) => {
  return (
    <div className="mt-3 grid grid-cols-2  lg:grid-cols-3 gap-4 justify-center">
    <div className="xs:w-full md:w-full lg:w-full">
      <StatBlock className="flex flex-col justify-between bg-white rounded-xl shadow-sm p-4">
        <div className="stat-label text-lg text-gray-800 font-normal">Total Projects Done</div>
        {!isLoading ? (
          <div className="stat-value text-3xl font-bold text-gray-900">
            {numberWithCommas(dashboardStats?.donejob)}
          </div>
        ) : (
          <div className="mt-3">
            <Spinner />
          </div>
        )}
      </StatBlock>
    </div>
    <div className="xs:w-full md:w-full lg:w-full">
      <StatBlock className="flex flex-col justify-between bg-white rounded-xl shadow-sm p-4">
        <div className="stat-label  text-lg text-gray-800 font-normal">Total Earnings</div>
        {!isLoading ? (
          <div className="stat-value text-3xl font-bold text-gray-900">
            {numberWithCommas(dashboardStats?.totalEarnings, 'USD')}
          </div>
        ) : (
          <div className="mt-3">
            <Spinner />
          </div>
        )}
      </StatBlock>
    </div>
    <div className="xs:w-full md:w-full lg:w-full sm:col-span-2 lg:col-span-1">
      <StatBlock className="flex flex-col justify-between bg-white rounded-xl shadow-sm p-4">
        <div className="stat-label text-lg text-gray-800 font-normal">Ratings</div>
        {!isLoading ? (
          <div className="stat-value flex items-center gap-1">
            <StarIcon className=" text-yellow-400" />
            <div className="text-3xl font-bold text-gray-900">
              {dashboardStats?.ratings?.average
                ? dashboardStats?.ratings?.average?.toFixed(1)
                : 0}
            </div>
            <div className="text-lg font-medium text-gray-800">
              (
              {dashboardStats?.ratings?.count
                ? numberWithCommas(dashboardStats?.ratings?.count)
                : 0}{' '}
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
  );
};

export default DashboardStats;
