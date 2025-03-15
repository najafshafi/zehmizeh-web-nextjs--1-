/*
 * This component serves a list of JOBS - IN PROGRESS
 */

import { ProposalWrapper, TabContent } from './jobs.styled';
import Loader from '@/components/Loader';
import NoDataFound from '@/components/ui/NoDataFound';
import useJobs from './use-jobs';
import { convertToTitleCase, numberWithCommas } from '@/helpers/utils/misc';
import DollarCircleIcon from '@/public/icons/dollar-circle.svg';
import BlurredImage from '@/components/ui/BlurredImage';
import { Link } from 'react-router-dom';

const JobsInProgress = () => {
  const { jobs, isLoading, isRefetching } = useJobs('active');
  return (
    <TabContent>
      {isLoading || isRefetching ? (
        <Loader />
      ) : jobs.length > 0 ? (
        jobs.map((item: any) => (
          <Link
            to={`/job-details/${item.job_post_id}/m_stone`}
            key={item.job_post_id}
            className="no-hover-effect"
          >
            <ProposalWrapper className="mt-3 d-flex flex-column pointer no-hover-effect">
              <div className="job-title fs-18 fw-400">
                {convertToTitleCase(item.job_title)}
              </div>
              <div className="proposal__details d-flex align-items-center flex-wrap">
                {/* Client details */}
                <div className="d-flex align-items-center mt-2">
                  <BlurredImage
                    src={item?.user_image || '/images/default_avatar.png'}
                    className="proposal__client-profile-img"
                    height="2.625rem"
                    width="2.625rem"
                    allowToUnblur={false}
                    type="small"
                  />
                  <div>
                    <div className="proposal__client-detail-label fs-sm fw-400">
                      Client:
                    </div>
                    <div className="fs-1rem fw-400 text-capitalize">
                      {item?.first_name} {item?.last_name}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="divider d-none d-lg-block" />

                {/* Budget */}

                <div className="proposal__budget d-flex width-fit-content justify-content-center align-items-center flex-wrap">
                  <DollarCircleIcon />
                  <div className="proposal__budget-value fs-1rem fw-400 d-flex">
                    <>
                      {numberWithCommas(item?.approved_budget?.amount, 'USD')}
                      {item?.approved_budget?.type === 'hourly' ? (
                        <span className="light-text">/hr</span>
                      ) : (
                        <span className="light-text ms-1">Budget</span>
                      )}
                    </>
                  </div>
                </div>
                {/* -- */}
              </div>
            </ProposalWrapper>
          </Link>
        ))
      ) : (
        <NoDataFound />
      )}
    </TabContent>
  );
};

export default JobsInProgress;
