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
    <div className="rounded-xl shadow-[0_4px_74px_rgba(0,0,0,0.08)] bg-white p-8 min-h-[600px] md:p-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="stat-label text-2xl font-bold">Proposals Received</div>

        <Link
          href="/client/proposals"
          className="text-blue-400 hover:transition-all hover:duration-200 hover:ease-in-out hover:-translate-y-[2px] fs-1rem fw-400 cursor-pointer"
        >
          View All Proposals
        </Link>
      </div>

      {/* Proposals list */}
      <div className="h-[500px] overflow-y-auto mt-2">
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
    </div>
  );
};

export default Proposals;
