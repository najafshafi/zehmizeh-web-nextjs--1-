/*
 * This component displays list of submitted proposals, invites, archived invites
 */

"use client";
import { useState } from "react";
import styled from "styled-components";
import Tabs from "@/components/ui/Tabs";
import InviteReceived from "./InviteReceived";
import SubmittedProposals from "./SubmittedProposals";
import ArchivedProposals from "./ArchivedProposals";

const Wrapper = styled.div`
  border-radius: 0.75rem;
  box-shadow: 0px 4px 74px rgba(0, 0, 0, 0.08);
  background: ${(props) => props.theme.colors.white};
  padding: 2rem;
  .tabs-content {
    margin-top: 4px;
  }
  .tabs-container {
    .tab {
      font-size: 1rem;
      padding: 0.75rem 1.25rem;
      height: 48px;
    }
    .active {
      box-shadow: 0px 4px 26px rgba(0, 0, 0, 0.09);
    }
  }
`;

const TABS = [
  { id: 1, label: "Project Invites", key: "invites_received" },
  { id: 2, label: "Sent Proposals", key: "submitted" },
  { id: 3, label: "Invite Archive", key: "archived" },
];

const Proposals = () => {
  const [activeTab, setActiveTab] = useState("invites_received");
  return (
    <Wrapper>
      <div className="stat-label text-2xl font-bold">Invites & Proposals</div>
      <div className="tabs mt-4">
        <Tabs
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={(item) => setActiveTab(item)}
          breakPoint="1200px"
          className="tabs-container cursor-pointer"
        />
      </div>
      <div className="tabs-content">
        {activeTab == "invites_received" && <InviteReceived />}
        {activeTab == "submitted" && <SubmittedProposals />}
        {activeTab == "archived" && <ArchivedProposals />}
      </div>
    </Wrapper>
  );
};

export default Proposals;
