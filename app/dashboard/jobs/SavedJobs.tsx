/*
 * This component serves a list of SAVED JOBS
 */
"use client";
import { useState } from 'react';
import moment from 'moment';
import Spinner from '@/components/forms/Spin/Spinner';
import Link from 'next/link';
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
              href={`/job-details/${item.job_post_id}/gen_details`}
              key={item.job_post_id}
              className={classNames('no-hover-effect', {
                'pe-none': isProjectHiddenForFreelancer(item),
                'pe-auto': !isProjectHiddenForFreelancer(item),
              })}
            >
              <ProposalWrapper className="mt-3 flex cursor-pointer gap-2 justify-between no-hover-effect">
                <div className="saved-job--content flex flex-col">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="job-title text-lg font-normal">
                      {convertToTitleCase(item.job_title)}
                    </div>
                  </div>

                  <div className="budget-and-location flex items-center flex-wrap">
                    {/* Budget */}

                    <div className="proposal__budget flex items-center justify-center flex-wrap">
                      <DollarCircleIcon />
                      <div className="proposal__budget-value flex">
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
                        <div className="proposal__budget flex items-center justify-center flex-wrap">
                          <LocationIcon />
                          <div className="text-sm font-normal mx-1">
                            {item.preferred_location.join(', ')}
                          </div>
                        </div>
                      )}
                  </div>

                  <div className="text-sm font-normal applied-date light-text">
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
                  className="flex justify-center items-center cursor-pointer"
                  onClick={(e) => onBookmarkClick(e, item?.job_post_id)}
                >
                  {loadingId == item?.job_post_id ? (
                    <Spinner  />
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
