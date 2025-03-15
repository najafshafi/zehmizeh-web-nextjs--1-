/*
 * This component serves a list of SAVED JOBS
 */
"use client";
import { useState } from 'react';
import moment from 'moment';
import { Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ProposalWrapper, BookmarkIcon, TabContent } from './jobs.styled';
import Loader from '@/components/Loader';
import NoDataFound from '@/components/ui/NoDataFound';
import useJobs from './use-jobs';
import { toggleBookmarkPost } from '@/helpers/http/search';
import { convertToTitleCase, numberWithCommas } from '@/helpers/utils/misc';
import DollarCircleIcon from '@/public/icons/dollar-circle.svg';
import LocationIcon from '@/public/icons/location-blue.svg';  
import SavedIcon from '@/public/icons/saved.svg';
import classNames from 'classnames';
import { isProjectHiddenForFreelancer } from '@/helpers/utils/helper';

const SavedJobs = () => {
  const { jobs, isLoading, isRefetching, refetch } = useJobs('saved');
  const [loadingId, setLoadingId] = useState<string>('');

  const onBookmarkClick = (e: any, id: string) => {
    e.stopPropagation();
    setLoadingId(id);
    toggleBookmarkPost(id).then(() => {
      setLoadingId(id);
      refetch();
    });
  };

  return (
    <TabContent>
      {isLoading || isRefetching ? (
        <Loader />
      ) : jobs.length > 0 ? (
        jobs.map((item: any) => {
          const isHidden = isProjectHiddenForFreelancer(item);
          return (
            <Link
              to={`/job-details/${item.job_post_id}/gen_details`}
              key={item.job_post_id}
              className={classNames('no-hover-effect', {
                'pe-none': isProjectHiddenForFreelancer(item),
                'pe-auto': !isProjectHiddenForFreelancer(item),
              })}
            >
              <ProposalWrapper className="mt-3 d-flex pointer gap-2 justify-content-between no-hover-effect">
                <div className="saved-job--content d-flex flex-column">
                  <div className="d-flex align-items-center justify-content-between flex-wrap g-2">
                    <div className="job-title fs-18 fw-400">
                      {convertToTitleCase(item.job_title)}
                    </div>
                  </div>

                  <div className="budget-and-location d-flex align-items-center flex-wrap">
                    {/* Budget */}

                    <div className="proposal__budget d-flex width-fit-content justify-content-center align-items-center flex-wrap">
                      <DollarCircleIcon />
                      <div className="proposal__budget-value fs-1rem fw-400 d-flex">
                        {item.budget.type === 'fixed' ? (
                          numberWithCommas(item.budget?.amount, 'USD')
                        ) : (
                          <>
                            {numberWithCommas(item?.budget?.max_amount, 'USD')}
                            <span className="light-text">/hr</span>&nbsp;
                            {/* -&nbsp;{numberWithCommas(item?.budget?.max_amount, 'USD')}
                          <span className="light-text">/hr</span> */}
                          </>
                        )}
                      </div>
                      {item?.budget?.type === 'fixed' && (
                        <span className="light-text ms-2">Budget</span>
                      )}
                    </div>

                    {/* Location */}

                    {Array.isArray(item?.preferred_location) &&
                      item?.preferred_location?.length > 0 && (
                        <div className="proposal__budget d-flex width-fit-content justify-content-center align-items-center flex-wrap">
                          <LocationIcon />
                          <div className="fs-1rem fw-400 mx-1">
                            {item.preferred_location.join(', ')}
                          </div>
                        </div>
                      )}
                  </div>

                  <div className="fs-1rem fw-400 applied-date light-text">
                    Posted on{' '}
                    {moment(item?.date_created).format('MMM DD, YYYY')}
                  </div>
                  {isHidden && (
                    <span className="text-danger">
                      Client has hidden this post -{' '}
                      {moment(item?.is_hidden?.date).format('MMM DD, YYYY')}
                    </span>
                  )}
                </div>
                <BookmarkIcon
                  className="d-flex justify-content-center align-items-center pointer"
                  onClick={(e) => onBookmarkClick(e, item?.job_post_id)}
                >
                  {loadingId == item?.job_post_id ? (
                    <Spinner animation="border" />
                  ) : (
                    <SavedIcon />
                  )}
                </BookmarkIcon>
              </ProposalWrapper>
            </Link>
          );
        })
      ) : (
        <NoDataFound />
      )}
    </TabContent>
  );
};

export default SavedJobs;
