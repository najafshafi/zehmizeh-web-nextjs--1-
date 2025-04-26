// app/freelancer/dashboard/page.tsx
"use client";

import DashboardStats from "./DashboardStats";
import Proposals from "./proposals";
import Jobs from "./jobs";
import useDashboardStats from "./use-dashboard-stats";
import TopRatedIcon from "@/public/icons/top-rated.svg";
import useStartPageFromTop from "@/helpers/hooks/useStartPageFromTop";
import { useAuth } from "@/helpers/contexts/auth-context";
import PageTitle from "@/components/styled/PageTitle";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { Container } from "react-bootstrap";

export default function FreelancerDashboard() {
  useStartPageFromTop();

  const { user } = useAuth();
  const { dashboardStats, isLoading } = useDashboardStats();

  // If freelancer's account isn't approved, redirect to profile page
  useEffect(() => {
    if (
      user?.is_account_approved === null ||
      typeof user?.is_account_approved === "undefined"
    ) {
      redirect("/freelancer/account/Profile");
    }
  }, [user?.is_account_approved]);

  return (
    <Container className="relative">
      <div className="max-w-[1170px] mx-auto min-h-[70vh] relative">
        {/* Title and top rated badge */}
        <div
          className={`flex justify-between items-center ${
            dashboardStats?.ratings?.average <= 4.5 ? "mt-5" : ""
          }`}
        >
          <PageTitle>{user?.first_name}'s Dashboard</PageTitle>
          {dashboardStats?.ratings?.average > 4.5 && (
            <div className="flex flex-col bg-white gap-2 p-5 pt-9 h-36 rounded-t-none rounded-b-[74px]">
              <div className="text-sm font-normal">Top Rated</div>
              <TopRatedIcon />
            </div>
          )}
        </div>

        {/* Freelancer's stats */}
        <DashboardStats dashboardStats={dashboardStats} isLoading={isLoading} />

        {/* Proposal and jobs */}
        <div className="my-8 mb-25 lg:my-8 lg:mb-25">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="mb-5">
              <Proposals />
            </div>
            <div className="mb-5">
              <Jobs />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
