/*
 * This is the main component that lists all the components of jobs list
 */
"use client";
import { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import Tabs from '@/components/ui/Tabs';
import JobsInProgress from './JobsInProgress';
import SavedJobs from './SavedJobs';

const Wrapper = styled.div`
  border-radius: 0.75rem;
  box-shadow: 0px 4px 74px rgba(0, 0, 0, 0.08);
  background: ${(props) => props.theme.colors.white};
  padding: 2rem;
  .tabs {
    margin-top: 1.5rem;
  }
  a {
    color: ${(props) => props.theme.colors.lightBlue};
  }
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
  { id: 1, label: 'Work in Progress', key: 'work_in_progress' },
  { id: 2, label: 'Saved', key: 'saved' },
];

const Jobs = () => {
  const [activeTab, setActiveTab] = useState('work_in_progress');
  return (
    <Wrapper>
      <div className="flex items-center justify-between">
        <div className="stat-label text-2xl font-bold">Projects</div>
        <Link href="/jobs" className="text-base font-normal">
          View All Projects
        </Link>
      </div>
      <div className="tabs ">
        <Tabs
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={(item) => setActiveTab(item)}
          breakPoint="576px"
          className="tabs-container cursor-pointer"
        />
      </div>
      <div className="tabs-content">
        {activeTab == 'work_in_progress' && <JobsInProgress />}
        {activeTab == 'saved' && <SavedJobs />}
      </div>
    </Wrapper>
  );
};

export default Jobs;
