/*
 * This component lists all the received proposals
 */
import styled from "styled-components";
import Link from "next/link";
import Loader from "@/components/Loader";
import NoDataFound from "@/components/ui/NoDataFound";
import ProposalCard from "./ProposalCard";
import useProposals from "./use-proposals";
import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import ProposalDetailsModal with SSR disabled to prevent "self is not defined" error
const ProposalDetailsModal = dynamic(
  () => import("@/components/jobs/ProposalDetailsModal"),
  { ssr: false }
);

const Wrapper = styled.div`
  border-radius: 0.75rem;
  box-shadow: 0px 4px 74px rgba(0, 0, 0, 0.08);
  background: ${(props) => props.theme.colors.white};
  padding: 2rem;
  min-height: 600px;
  .list {
    height: 500px;
    overflow-y: auto;
  }
  .view-alll-link {
    color: ${(props) => props.theme.colors.lightBlue};
    &:hover {
      transition: all 0.2s ease-in-out;
      transform: translateY(-2px);
    }
  }
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Proposals = () => {
  const { proposals, isLoading, refetch, isRefetching } = useProposals();

  const [showProposalDetails, setShowProposalDetails] =
    useState<boolean>(false);
  const [selectedProposalId, setSelectedProposalId] = useState<string>("");

  const toggleProposalDetailsModal = () => {
    // This will toggle proposal details modal
    setShowProposalDetails(!showProposalDetails);
  };

  const onSelect = (id: string) => () => {
    /* This will store the selected proposal id in <selectedProposalId> variable which can be used
      in the proposal details modal component to fetch proposal details
    */
    setSelectedProposalId(id);
    toggleProposalDetailsModal();
  };

  const onRefetch = (shouldToggleModal = true) => {
    /* When the proposal is accepted this function will close the modal and refetch the proposals and
    also will make the selected proposal as empty for a clean state */
    if (shouldToggleModal) toggleProposalDetailsModal();
    setSelectedProposalId("");
    refetch();
  };

  return (
    <Wrapper>
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div className="stat-label fs-24 fw-700">Proposals Received</div>

        <Link
          href="/client/proposals"
          className="view-alll-link fs-1rem fw-400 pointer"
        >
          View All Proposals
        </Link>
      </div>

      {/* Proposals list */}
      <div className="list mt-2">
        {(isLoading || isRefetching) && <Loader />}

        {!isLoading && !isRefetching && proposals?.length == 0 && (
          <NoDataFound />
        )}

        {!isLoading &&
          !isRefetching &&
          proposals?.length > 0 &&
          proposals?.map((item: any) => (
            <ProposalCard
              data={item}
              key={item?.proposal_id}
              onSelect={onSelect(item?.proposal_id)}
            />
          ))}
      </div>

      {/* Proposal details modal */}

      <ProposalDetailsModal
        show={showProposalDetails}
        toggle={toggleProposalDetailsModal}
        selectedProposalId={selectedProposalId}
        refetch={onRefetch}
        replyOnProjectPageBtn
      />
    </Wrapper>
  );
};

export default Proposals;
