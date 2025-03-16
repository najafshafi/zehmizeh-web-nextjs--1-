/*
 * This component serves a list of archived invites
 */

import Link from 'next/link';
import { Row, Col } from 'react-bootstrap';
import { ProposalWrapper, TabContent } from './proposals.styled';
import Loader from '@/components/Loader';
import { StatusBadge } from '@/components/styled/Badges';
import NoDataFound from '@/components/ui/NoDataFound';
import BlurredImage from '@/components/ui/BlurredImage';
import useProposals from './use-proposals';
import { convertToTitleCase, showFormattedBudget } from '@/helpers/utils/misc';
import DollarCircleIcon from '@/public/icons/dollar-circle.svg';

const ArchivedProposals = () => {
  const { proposals, isLoading, isRefetching } = useProposals('archived');
  return (
    <TabContent>
      {isLoading || isRefetching ? (
        <Loader />
      ) : proposals?.length > 0 ? (
        proposals.map((item) => (
          <Link
            href={`/offer-details/${item.job_post_id}`}
            key={item.invite_id}
            className="no-hover-effect"
          >
            <ProposalWrapper
              key={item.invite_id}
              className="mt-3 d-flex flex-column pointer"
            >
              <Row className="gy-3">
                <Col md={8} sm={12}>
                  <div className="fs-18 fw-400">
                    {convertToTitleCase(item.job_title)}
                  </div>
                </Col>
                <Col md={4} sm={12}>
                  <div className="d-flex justify-content-md-end">
                    <StatusBadge color="gray">Archived</StatusBadge>
                  </div>
                </Col>
              </Row>

              <div className="proposal__details d-flex align-items-center flex-wrap mt-2">
                {/* Client details */}

                <div className="d-flex align-items-center">
                  <BlurredImage
                    src={item?.user_image || '/images/default_avatar.png'}
                    className="proposal__client-profile-img"
                    height="2.625rem"
                    width="2.625rem"
                    allowToUnblur={false}
                  />
                  <div>
                    <div className="proposal__client-detail-label fs-sm fw-400">
                      Sent by:
                    </div>
                    <div className="fs-1rem fw-400 text-capitalize">
                      {item?.first_name} {item?.last_name}
                    </div>
                  </div>
                </div>

                {/* Divider */}

                <div className="divider d-none d-lg-block" />

                {/* Budget */}
                <div className="proposal__budget d-flex width-fit-content align-items-center flex-wrap">
                  <DollarCircleIcon />
                  <div className="proposal__budget-value fs-1rem fw-400 d-flex light-text">
                    {item?.budget?.isProposal
                      ? 'Open To Proposals'
                      : item?.budget?.type === 'fixed'
                      ? `${showFormattedBudget(item?.budget)} Budget`
                      : showFormattedBudget(item?.budget)}
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

export default ArchivedProposals;
