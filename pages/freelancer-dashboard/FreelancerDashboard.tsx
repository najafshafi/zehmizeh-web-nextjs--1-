// app/freelancer/dashboard/page.tsx
'use client';

import { Row, Col } from 'react-bootstrap';
import DashboardStats from './DashboardStats';
import Proposals from './proposals';
import Jobs from './jobs';
import useDashboardStats from './use-dashboard-stats';
import { MainContainer, Wrapper } from './freelancerDashboard.styled';
import TopRatedIcon from '@/public/icons/top-rated.svg';
import useStartPageFromTop from '@/helpers/hooks/useStartPageFromTop';
import { useAuth } from '@/helpers/contexts/auth-context';
import PageTitle from '@/components/styled/PageTitle';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';

export default function FreelancerDashboard() {
  useStartPageFromTop();
  
  const { user } = useAuth();
  const { dashboardStats, isLoading } = useDashboardStats();

  // If freelancer's account isn't approved, redirect to profile page
  useEffect(() => {
    if (user?.is_account_approved === null || typeof user?.is_account_approved === 'undefined') {
      redirect('/freelancer/account/Profile');
    }
  }, [user?.is_account_approved]);

  return (
    <MainContainer>
    <Wrapper>
      {/* Title and top rated badge */}
      <div
        className={`flex justify-between items-center ${
          dashboardStats?.ratings?.average <= 4.5 ? 'mt-5' : ''
        }`}
      >
        <PageTitle>{user?.first_name}’s Dashboard</PageTitle>
        {dashboardStats?.ratings?.average > 4.5 && (
          <div className="top-rated-badge flex flex-col">
            <div className="top-rated__label text-sm font-normal">Top Rated</div>
            <TopRatedIcon />
          </div>
        )}
      </div>
  
      {/* Freelancer's stats */}
      <DashboardStats dashboardStats={dashboardStats} isLoading={isLoading} />
  
      {/* Proposal and jobs */}
      <div className="proposals-and-jobs">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="mb-5">
            <Proposals />
          </div>
          <div className="mb-5">
            <Jobs />
          </div>
        </div>
      </div>
    </Wrapper>
  </MainContainer>
  );
}