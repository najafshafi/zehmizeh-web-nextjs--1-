// import { useState, useMemo, useEffect } from "react";
// import { Modal, Button } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import styled from "styled-components";
// import { StyledModal } from "@/components/styled/StyledModal";
// import { StyledButton } from "@/components/forms/Buttons";
// import { StatusBadge } from "@/components/styled/Badges";
// import Loader from "@/components/Loader";
// import Search from "@/components/forms/Search";
// import useMyJobs from "@/controllers/use-jobs";
// import useDebounce from "@/helpers/hooks/useDebounce";
// import { breakpoints } from "@/helpers/hooks/useResponsive";
// import StyledHtmlText from "@/components/ui/StyledHtmlText";
// import NoDataFound from "@/components/ui/NoDataFound";
// import { convertToTitleCase, showFormattedBudget } from "@/helpers/utils/misc";
// import { checkIsProposalExists } from "@/helpers/http/proposals";

// type Props = {
//   show: boolean;
//   toggle: () => void;
//   freelancerName: string;
//   onNext: (jobId: string, proposalExists: boolean) => void;
//   freelancerId?: string;
// };

// const Wrapper = styled.div`
//   .job-item__details__title {
//     word-wrap: break-word;
//     max-width: 100%;
//   }
//   .search-box {
//     max-width: 100% !important;
//     margin-top: 2.5rem;
//   }
//   .job-list {
//     height: 50vh;
//     overflow-y: auto;
//   }
//   .close {
//     position: absolute;
//     top: 0;
//     right: 0;
//     padding: 0;
//     color: white;
//     transform: translate(30px, -10px);
//     font-size: 1.75rem;
//     font-weight: 200;
//     @media ${breakpoints.mobile} {
//       transform: translate(0, 0);
//       right: 10px;
//       color: #000;
//     }
//   }
//   .job-item {
//     padding: 1.5rem;
//     margin: 1.25rem 0 0 0;
//     border-radius: 14px;
//     border: ${(props) => `2px solid ${props.theme.colors.gray5}`};
//   }
//   .job-item__details__description {
//     opacity: 0.7;
//   }
//   .skills {
//     margin-top: 0.875rem;
//   }
//   .job-item__budget {
//     margin-top: 1.25rem;
//   }
//   .active {
//     border: ${(props) => `2px solid ${props.theme.statusColors.blue.color}`};
//   }
// `;

// const SelectJobModal = ({
//   show,
//   toggle,
//   freelancerName,
//   onNext,
//   freelancerId,
// }: Props) => {
//   const [selectedJobId, setSelectedJobId] = useState<string>("");
//   const COLORS = useMemo(() => ["orange", "green", "blue"], []);
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const debouncedSearchQuery = useDebounce(searchTerm, 500);
//   const { myJobs, isLoading, refetch, isRefetching } = useMyJobs(
//     "prospects",
//     debouncedSearchQuery,
//     freelancerId
//   );

//   const navigate = useNavigate();

//   const selectJob = (id: string) => {
//     setSelectedJobId(id);
//   };

//   const onContinue = async () => {
//     if (selectedJobId == "") {
//       toast.error("Please select a project.");
//       return;
//     }

//     const payload = {
//       _freelancer_user_id: freelancerId,
//       _job_post_id: selectedJobId,
//     };

//     const promise = checkIsProposalExists(payload);
//     toast.promise(promise, {
//       loading: "please wait...",
//       error: (error) => {
//         return error.message;
//       },
//       success: ({ proposal }) => {
//         onNext(selectedJobId, !!proposal);
//         return proposal ? "Proposal already exists" : null;
//       },
//     });
//   };

//   const onCreateNewJob = () => {
//     navigate("/post-new-job", {
//       state: {
//         freelancerId: freelancerId,
//         freelancerName: freelancerName,
//       },
//     });
//   };

//   useEffect(() => {
//     if (debouncedSearchQuery !== null && !!freelancerId) {
//       refetch();
//     }
//   }, [debouncedSearchQuery, refetch, freelancerId]);

//   return (
//     <StyledModal show={show} size="lg" onHide={toggle} centered>
//       <Modal.Body>
//         <Button variant="transparent" className="close" onClick={toggle}>
//           &times;
//         </Button>
//         <Wrapper>
//           <div className="my-jobs">
//             <h3 className="fs-36 fw-700">Select Posted Project</h3>
//             <div className="fs-20 fw-400">
//               Select the project you would like{" "}
//               <span className="fw-700 text-capitalize">{freelancerName}</span>{" "}
//               to submit a proposal for. (Projects the freelancer{" "}
//               <span className="fw-700">has already submitted proposals to</span>{" "}
//               are excluded from the list below.)
//             </div>
//             <div className="search">
//               <Search
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 containerClassName="search-box"
//               />
//             </div>
//             {isLoading || isRefetching ? (
//               <Loader />
//             ) : (
//               <div className="job-list">
//                 {myJobs?.length ? (
//                   myJobs?.map((item) => (
//                     <div
//                       key={item.job_post_id}
//                       className={`job-item pointer ${
//                         selectedJobId == item.job_post_id ? " active" : ""
//                       }`}
//                       onClick={() => selectJob(item.job_post_id)}
//                     >
//                       <div className="flex flex-wrap justify-between">
//                         <div className="job-item__details__title fs-24 fw-400">
//                           {convertToTitleCase(item.job_title)}
//                         </div>
//                       </div>
//                       <div className="job-item__details__description fs-16 fw-300 mt-1">
//                         <StyledHtmlText
//                           htmlString={item?.job_description}
//                           id={`invite_job_${item.job_post_id}`}
//                           needToBeShorten={true}
//                         />
//                       </div>
//                       <div className="skills flex items-center flex-wrap gap-2">
//                         {item?.skills?.map(
//                           (skill, index: number) =>
//                             (skill.label || skill.name) && (
//                               <StatusBadge
//                                 key={skill.id}
//                                 color={COLORS[index % COLORS.length]}
//                               >
//                                 {skill.name ?? skill?.label}
//                               </StatusBadge>
//                             )
//                         )}
//                       </div>
//                       <div className="job-item__budget">
//                         <BudgetAndDate
//                           budget={item?.budget}
//                           isProposal={item?.budget?.isProposal ?? false}
//                           expectedDate={item?.expected_delivery_date}
//                         />
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   // <div className="no-data mt-4 fs-1rem fw-400 flex items-center justify-center">
//                   //   No data found for '{searchTerm}'
//                   // </div>
//                   <NoDataFound
//                     className="h-100"
//                     title={
//                       searchTerm
//                         ? `No projects found for '${searchTerm}'.`
//                         : 'You have no projects posted! To post a new project, click the "Post Project" button in the corner.'
//                     }
//                   />
//                 )}
//               </div>
//             )}
//           </div>
//           <div className="flex g-2 bottom-buttons flex-wrap">
//             <StyledButton
//               className="fs-16 fw-400"
//               variant="outline-dark"
//               padding="0.8125rem 2rem"
//               onClick={onCreateNewJob}
//             >
//               Create New Project
//             </StyledButton>
//             <StyledButton
//               className="fs-16 fw-400"
//               variant="primary"
//               padding="0.8125rem 2rem"
//               onClick={onContinue}
//             >
//               Continue
//             </StyledButton>
//           </div>
//         </Wrapper>
//       </Modal.Body>
//     </StyledModal>
//   );
// };

// export default SelectJobModal;

// const BudgetAndDate = ({ budget, expectedDate, isProposal }: any) => {
//   if (isProposal) {
//     return (
//       <div className="budget-row fs-20 fw-400">
//         Open to Proposals (
//         {budget.type === "fixed" ? "Project-Based" : "Hourly"})
//       </div>
//     );
//   }
//   if (budget.type == "fixed") {
//     return (
//       <div className="budget-row fs-20 fw-400">
//         {showFormattedBudget(budget)} ({budget.type})
//       </div>
//     );
//   } else if (budget.type == "hourly") {
//     return (
//       <div className="budget-row fs-20 fw-400">
//         {showFormattedBudget(budget)} ({budget.type})
//         {expectedDate && <span>&nbsp; | &nbsp;{expectedDate}</span>}
//       </div>
//     );
//   } else return null;
// };

"use client";

import { useState, useMemo, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import styled from "styled-components";
import { StyledModal } from "@/components/styled/StyledModal";
import { StyledButton } from "@/components/forms/Buttons";
import { StatusBadge } from "@/components/styled/Badges";
import Loader from "@/components/Loader";
import Search from "@/components/forms/Search";
import useMyJobs from "@/controllers/use-jobs";
import useDebounce from "@/helpers/hooks/useDebounce";
import { breakpoints } from "@/helpers/hooks/useResponsive";
import StyledHtmlText from "@/components/ui/StyledHtmlText";
import NoDataFound from "@/components/ui/NoDataFound";
import { convertToTitleCase, showFormattedBudget } from "@/helpers/utils/misc";
import { checkIsProposalExists } from "@/helpers/http/proposals";

type Props = {
  show: boolean;
  toggle: () => void;
  freelancerName: string;
  onNext: (jobId: string, proposalExists: boolean) => void;
  freelancerId?: string;
};

const Wrapper = styled.div`
  .job-item__details__title {
    word-wrap: break-word;
    max-width: 100%;
  }
  .search-box {
    max-width: 100% !important;
    margin-top: 2.5rem;
  }
  .job-list {
    height: 50vh;
    overflow-y: auto;
  }
  .close {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0;
    color: white;
    transform: translate(30px, -10px);
    font-size: 1.75rem;
    font-weight: 200;
    @media ${breakpoints.mobile} {
      transform: translate(0, 0);
      right: 10px;
      color: #000;
    }
  }
  .job-item {
    padding: 1.5rem;
    margin: 1.25rem 0 0 0;
    border-radius: 14px;
    border: ${(props) => `2px solid ${props.theme.colors.gray5}`};
  }
  .job-item__details__description {
    opacity: 0.7;
  }
  .skills {
    margin-top: 0.875rem;
  }
  .job-item__budget {
    margin-top: 1.25rem;
  }
  .active {
    border: ${(props) => `2px solid ${props.theme.statusColors.blue.color}`};
  }
`;

const SelectJobModal = ({
  show,
  toggle,
  freelancerName,
  onNext,
  freelancerId,
}: Props) => {
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const COLORS = useMemo(() => ["orange", "green", "blue"], []);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchTerm, 500);
  const { myJobs, isLoading, refetch, isRefetching } = useMyJobs(
    "prospects",
    debouncedSearchQuery,
    freelancerId
  );

  const router = useRouter();

  const selectJob = (id: string) => {
    setSelectedJobId(id);
  };

  const onContinue = async () => {
    if (selectedJobId == "") {
      toast.error("Please select a project.");
      return;
    }

    const payload = {
      _freelancer_user_id: freelancerId,
      _job_post_id: selectedJobId,
    };

    const promise = checkIsProposalExists(payload);
    toast.promise(promise, {
      loading: "please wait...",
      error: (error) => {
        return error.message;
      },
      success: ({ proposal }) => {
        onNext(selectedJobId, !!proposal);
        return proposal ? "Proposal already exists" : null;
      },
    });
  };

  const onCreateNewJob = () => {
    router.push({
      pathname: "/post-new-job",
      query: { freelancerId, freelancerName },
    });
  };

  useEffect(() => {
    if (debouncedSearchQuery !== null && !!freelancerId) {
      refetch();
    }
  }, [debouncedSearchQuery, refetch, freelancerId]);

  return (
    <StyledModal show={show} size="lg" onHide={toggle} centered>
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={toggle}>
          ×
        </Button>
        <Wrapper>
          <div className="my-jobs">
            <h3 className="fs-36 fw-700">Select Posted Project</h3>
            <div className="fs-20 fw-400">
              Select the project you would like{" "}
              <span className="fw-700 text-capitalize">{freelancerName}</span>{" "}
              to submit a proposal for. (Projects the freelancer{" "}
              <span className="fw-700">has already submitted proposals to</span>{" "}
              are excluded from the list below.)
            </div>
            <div className="search">
              <Search
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                containerClassName="search-box"
              />
            </div>
            {isLoading || isRefetching ? (
              <Loader />
            ) : (
              <div className="job-list">
                {myJobs?.length ? (
                  myJobs?.map((item) => (
                    <div
                      key={item.job_post_id}
                      className={`job-item pointer ${
                        selectedJobId == item.job_post_id ? " active" : ""
                      }`}
                      onClick={() => selectJob(item.job_post_id)}
                    >
                      <div className="flex flex-wrap justify-between">
                        <div className="job-item__details__title fs-24 fw-400">
                          {convertToTitleCase(item.job_title)}
                        </div>
                      </div>
                      <div className="job-item__details__description fs-16 fw-300 mt-1">
                        <StyledHtmlText
                          htmlString={item?.job_description}
                          id={`invite_job_${item.job_post_id}`}
                          needToBeShorten={true}
                        />
                      </div>
                      <div className="skills flex items-center flex-wrap gap-2">
                        {item?.skills?.map(
                          (skill, index: number) =>
                            (skill.label || skill.name) && (
                              <StatusBadge
                                key={skill.id}
                                color={COLORS[index % COLORS.length]}
                              >
                                {skill.name ?? skill?.label}
                              </StatusBadge>
                            )
                        )}
                      </div>
                      <div className="job-item__budget">
                        <BudgetAndDate
                          budget={item?.budget}
                          isProposal={item?.budget?.isProposal ?? false}
                          expectedDate={item?.expected_delivery_date}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <NoDataFound
                    className="h-100"
                    title={
                      searchTerm
                        ? `No projects found for '${searchTerm}'.`
                        : 'You have no projects posted! To post a new project, click the "Post Project" button in the corner.'
                    }
                  />
                )}
              </div>
            )}
          </div>
          <div className="flex g-2 bottom-buttons flex-wrap">
            <StyledButton
              className="fs-16 fw-400"
              variant="outline-dark"
              padding="0.8125rem 2rem"
              onClick={onCreateNewJob}
            >
              Create New Project
            </StyledButton>
            <StyledButton
              className="fs-16 fw-400"
              variant="primary"
              padding="0.8125rem 2rem"
              onClick={onContinue}
            >
              Continue
            </StyledButton>
          </div>
        </Wrapper>
      </Modal.Body>
    </StyledModal>
  );
};

export default SelectJobModal;

const BudgetAndDate = ({ budget, expectedDate, isProposal }: any) => {
  if (isProposal) {
    return (
      <div className="budget-row fs-20 fw-400">
        Open to Proposals (
        {budget.type === "fixed" ? "Project-Based" : "Hourly"})
      </div>
    );
  }
  if (budget.type == "fixed") {
    return (
      <div className="budget-row fs-20 fw-400">
        {showFormattedBudget(budget)} ({budget.type})
      </div>
    );
  } else if (budget.type == "hourly") {
    return (
      <div className="budget-row fs-20 fw-400">
        {showFormattedBudget(budget)} ({budget.type})
        {expectedDate && <span> | {expectedDate}</span>}
      </div>
    );
  } else return null;
};
