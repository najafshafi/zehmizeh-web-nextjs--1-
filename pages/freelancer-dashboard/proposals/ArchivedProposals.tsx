/*
 * This component serves a list of archived invites
 */

// import Link from 'next/link';
// import { Row, Col } from 'react-bootstrap';
// import { ProposalWrapper, TabContent } from './proposals.styled';
// import Loader from '@/components/Loader';
// import { StatusBadge } from '@/components/styled/Badges';
// import NoDataFound from '@/components/ui/NoDataFound';
// import BlurredImage from '@/components/ui/BlurredImage';
// import useProposals from './use-proposals';
// import { convertToTitleCase, showFormattedBudget } from '@/helpers/utils/misc';
// import DollarCircleIcon from '@/public/icons/dollar-circle.svg';

// const ArchivedProposals = () => {
//   const { proposals, isLoading, isRefetching } = useProposals('archived');
//   return (
//     <TabContent>
//       {isLoading || isRefetching ? (
//         <Loader />
//       ) : proposals?.length > 0 ? (
//         proposals.map((item: any) => (
//           <Link
//             href={`/offer-details/${item.job_post_id}`}
//             key={item.invite_id}
//             className="no-hover-effect"
//           >
//             <ProposalWrapper
//               key={item.invite_id}
//               className="mt-3 flex flex-col cursor-pointer"
//             >
//               <Row className="gy-3">
//                 <Col md={8} sm={12}>
//                   <div className="text-lg font-normal">
//                     {convertToTitleCase(item.job_title)}
//                   </div>
//                 </Col>
//                 <Col md={4} sm={12}>
//                   <div className="flex justify-end">
//                     <StatusBadge color="gray">Archived</StatusBadge>
//                   </div>
//                 </Col>
//               </Row>

//               <div className="proposal__details flex items-center flex-wrap mt-2">
//                 {/* Client details */}

//                 <div className="flex items-center">
//                   <BlurredImage
//                     src={item?.user_image || '/images/default_avatar.png'}
//                     className="proposal__client-profile-img"
//                     height="2.625rem"
//                     width="2.625rem"
//                     allowToUnblur={false}
//                   />
//                   <div>
//                     <div className="proposal__client-detail-label text-sm font-normal">
//                       Sent by:
//                     </div>
//                     <div className="text-sm font-normal capitalize">
//                       {item?.first_name} {item?.last_name}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Divider */}

//                 <div className="divider hidden lg:block" />

//                 {/* Budget */}
//                 <div className="proposal__budget flex items-center flex-wrap">
//                   <DollarCircleIcon />
//                   <div className="proposal__budget-value text-lg font-normal light-text">
//                     {item?.budget?.isProposal
//                       ? 'Open To Proposals'
//                       : item?.budget?.type === 'fixed'
//                       ? `${showFormattedBudget(item?.budget)} Budget`
//                       : showFormattedBudget(item?.budget)}
//                   </div>
//                 </div>
//                 {/* -- */}
//               </div>
//             </ProposalWrapper>
//           </Link>
//         ))
//       ) : (
//         <NoDataFound />
//       )}
//     </TabContent>
//   );
// };

// export default ArchivedProposals;

import Link from 'next/link';
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
        proposals.map((item: any) => (
          <Link
            href={`/offer-details/${item.job_post_id}`}
            key={item.invite_id}
            className="no-hover-effect"
          >
            <ProposalWrapper
              key={item.invite_id}
              className="mt-3 flex flex-col cursor-pointer"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-3">
                <div className="lg:col-span-8">
                  <div className="text-lg font-normal">
                    {convertToTitleCase(item.job_title)}
                  </div>
                </div>
                <div className="lg:col-span-4">
                  <div className="flex justify-end">
                    <StatusBadge color="gray">Archived</StatusBadge>
                  </div>
                </div>
              </div>

              <div className="flex items-center flex-wrap mt-2 gap-4">
                {/* Client details */}
                <div className="flex items-center">
                  <BlurredImage
                    src={item?.user_image || '/images/default_avatar.png'}
                    className="proposal__client-profile-img"
                    height="2.625rem"
                    width="2.625rem"
                    allowToUnblur={false}
                  />
                  <div className="ml-2">
                    <div className="text-sm font-normal">Sent by:</div>
                    <div className="text-sm font-normal capitalize">
                      {item?.first_name} {item?.last_name}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px h-6 bg-gray-300" />

                {/* Budget */}
                <div className="flex items-center flex-wrap gap-2">
                  <DollarCircleIcon />
                  <div className="text-lg font-normal text-gray-500">
                    {item?.budget?.isProposal
                      ? 'Open To Proposals'
                      : item?.budget?.type === 'fixed'
                      ? `${showFormattedBudget(item?.budget)} Budget`
                      : showFormattedBudget(item?.budget)}
                  </div>
                </div>
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