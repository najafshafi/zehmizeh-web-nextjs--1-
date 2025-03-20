/*
 * This component do the listings of the jobs and renders the listings components *
 */

// import { useMemo, useState } from 'react';
// import { Dropdown } from 'react-bootstrap';
// import ListingFooter from './ListingFooter';
// import { ListingItem } from './listings.styled';
// import StatusAndDateSection from './StatusAndDateSection';
// import { toggleBookmarkPost } from '@/helpers/http/search';
// import StyledHtmlText from '@/components/ui/StyledHtmlText';
// import { convertToTitleCase } from '@/helpers/utils/misc';
// import classNames from 'classnames';
// import moment from 'moment';
// import { isProjectHiddenForFreelancer } from '@/helpers/utils/helper';

// interface Props {
//   data: any;
//   listingType: string;
//   refetch: () => void;
//   sortFilter: any;
//   toggleReset: string;
// }

// const JobProposalStatuses = {
//   Pending: 'pending',
//   Declined: 'denied',
//   All: 'all',
//   Canceled_by_client: 'canceled_by_client',
// };

// const Listings = ({ data, listingType, refetch, sortFilter, toggleReset }: Props) => {
//   const [toggleName, setToggleName] = useState('Filter by');
//   const [disableLink, setDisableLink] = useState<boolean>(false);

//   const onBookmarkClick = (id: string) => {
//     toggleBookmarkPost(id).then(() => {
//       refetch();
//     });
//   };

//   const filterJobProposals = (status: string) => () => {
//     sortFilter(JobProposalStatuses[status]);
//     setToggleName(JobProposalStatuses[status]);
//   };

//   const toggleResetValue = useMemo(() => {
//     switch (toggleReset) {
//       case 'pending':
//         return 'Pending';
//       case 'denied':
//         return 'Declined';
//       case 'canceled_by_client':
//         return 'Canceled by Client';
//       default:
//         return toggleReset;
//     }
//   }, [toggleReset]);

//   return (
//     <div>
//       {listingType === 'applied_job' && (
//         <>
//           <Dropdown>
//             <Dropdown.Toggle variant="" id="dropdown-basic">
//               {toggleResetValue ?? toggleName}
//             </Dropdown.Toggle>

//             <Dropdown.Menu>
//               <Dropdown.Item onClick={filterJobProposals('All')}>All</Dropdown.Item>
//               <Dropdown.Item onClick={filterJobProposals('Pending')}>Pending</Dropdown.Item>
//               <Dropdown.Item onClick={filterJobProposals('Declined')}>Declined</Dropdown.Item>
//               <Dropdown.Item onClick={filterJobProposals('Canceled_by_client')}>Canceled by Client</Dropdown.Item>
//             </Dropdown.Menu>
//           </Dropdown>
//           <br />
//         </>
//       )}
//       {data?.map((item: any) => (
//         <ListingItem
//           onClick={(e) => {
//             if (disableLink) return e.preventDefault();
//           }}
//           to={
//             item?.proposal?.status === 'pending'
//               ? `/job-details/${item.job_post_id}/proposal_sent`
//               : item?.status === 'prospects'
//               ? `/job-details/${item.job_post_id}/gen_details`
//               : `/job-details/${item.job_post_id}`
//           }
//           key={item.job_post_id}
//           className={classNames(
//             'pointer flex flex-column flex-md-row justify-between gap-3 no-hover-effect',
//             {
//               'pe-none': isProjectHiddenForFreelancer(item),
//               'pe-auto': !isProjectHiddenForFreelancer(item),
//             }
//           )}
//         >
//           {isProjectHiddenForFreelancer(item) && (
//             <span className="client-hidden-post-banner">
//               Client has hidden this post - {moment(item?.is_hidden?.date).format('MMM DD, YYYY')}
//             </span>
//           )}
//           {/* Left section */}
//           <div className="content flex-1">
//             <header className="title fs-24 font-normal">{convertToTitleCase(item.job_title)}</header>

//             {item?.status !== 'active' && item?.status !== 'closed' ? (
//               <div className="description light-text fs-18 font-normal">
//                 <StyledHtmlText
//                   htmlString={item.job_description}
//                   id={`jobs_${item.job_post_id}`}
//                   needToBeShorten={true}
//                 />
//               </div>
//             ) : null}

//             <ListingFooter item={item} />
//           </div>

//           {/* Right side section */}
//           <StatusAndDateSection
//             setDisableLink={setDisableLink}
//             item={item}
//             listingType={listingType}
//             onBookmarkClick={() => onBookmarkClick(item.job_post_id)}
//             refetch={refetch}
//           />
//         </ListingItem>
//       ))}
//     </div>
//   );
// };

// export default Listings;

"use client";
import { useMemo, useState } from "react";
import ListingFooter from "./ListingFooter";
import { ListingItem } from "./listings.styled";
import StatusAndDateSection from "./StatusAndDateSection";
import { toggleBookmarkPost } from "@/helpers/http/search";
import StyledHtmlText from "@/components/ui/StyledHtmlText";
import { convertToTitleCase } from "@/helpers/utils/misc";
import classNames from "classnames";
import moment from "moment";
import { isProjectHiddenForFreelancer } from "@/helpers/utils/helper";
import Link from "next/link";

interface Props {
  data: any;
  listingType: string;
  refetch: () => void;
  sortFilter: any;
  toggleReset: string;
}

const JobProposalStatuses = {
  Pending: "pending",
  Declined: "denied",
  All: "all",
  Canceled_by_client: "canceled_by_client",
};

const Listings = ({
  data,
  listingType,
  refetch,
  sortFilter,
  toggleReset,
}: Props) => {
  const [toggleName, setToggleName] = useState("Filter by");
  const [disableLink, setDisableLink] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility

  const onBookmarkClick = (id: string) => {
    toggleBookmarkPost(id).then(() => {
      refetch();
    });
  };

  const filterJobProposals = (status: string) => () => {
    sortFilter(JobProposalStatuses[status]);
    setToggleName(JobProposalStatuses[status]);
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  const toggleResetValue = useMemo(() => {
    switch (toggleReset) {
      case "pending":
        return "Pending";
      case "denied":
        return "Declined";
      case "canceled_by_client":
        return "Canceled by Client";
      default:
        return toggleReset;
    }
  }, [toggleReset]);

  return (
    <div>
      {listingType === "applied_job" && (
        <>
          <div className="relative inline-block">
            {/* Dropdown Toggle Button */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="px-4 py-2  text-gray-700"
            >
              {toggleResetValue ?? toggleName}
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-md z-10">
                <div
                  onClick={filterJobProposals("All")}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  All
                </div>
                <div
                  onClick={filterJobProposals("Pending")}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Pending
                </div>
                <div
                  onClick={filterJobProposals("Declined")}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Declined
                </div>
                <div
                  onClick={filterJobProposals("Canceled_by_client")}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Canceled by Client
                </div>
              </div>
            )}
          </div>
          <br />
        </>
      )}
      {data?.map((item: any) => {
        const linkHref =
          item?.proposal?.status === "pending"
            ? `/job-details/${item.job_post_id}/proposal_sent`
            : item?.status === "prospects"
            ? `/job-details/${item.job_post_id}/gen_details`
            : `/job-details/${item.job_post_id}`;

        return (
          <Link href={linkHref} key={item.job_post_id} passHref>
            <ListingItem
              onClick={(e) => {
                if (disableLink) return e.preventDefault();
              }}
              className={classNames(
                "pointer flex flex-col md:flex-row justify-between gap-3 no-hover-effect",
                {
                  "pe-none": isProjectHiddenForFreelancer(item),
                  "pe-auto": !isProjectHiddenForFreelancer(item),
                }
              )}
            >
              {isProjectHiddenForFreelancer(item) && (
                <span className="client-hidden-post-banner">
                  Client has hidden this post -{" "}
                  {moment(item?.is_hidden?.date).format("MMM DD, YYYY")}
                </span>
              )}
              {/* Left section */}
              <div className="content flex-1">
                <header className="title fs-24 font-normal">
                  {convertToTitleCase(item.job_title)}
                </header>

                {item?.status !== "active" && item?.status !== "closed" ? (
                  <div className="description light-text fs-18 font-normal">
                    <StyledHtmlText
                      htmlString={item.job_description}
                      id={`jobs_${item.job_post_id}`}
                      needToBeShorten={true}
                    />
                  </div>
                ) : null}

                <ListingFooter item={item} />
              </div>

              {/* Right side section */}
              <StatusAndDateSection
                setDisableLink={setDisableLink}
                item={item}
                listingType={listingType}
                onBookmarkClick={() => onBookmarkClick(item.job_post_id)}
                refetch={refetch}
              />
            </ListingItem>
          </Link>
        );
      })}
    </div>
  );
};

export default Listings;
