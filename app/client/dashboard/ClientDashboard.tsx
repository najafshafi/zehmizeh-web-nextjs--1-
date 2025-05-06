/*
 * This is the main component of this file - Client Dashboard
 */
"use client";
import Link from "next/link";
import Tooltip from "@/components/ui/Tooltip";
import DashboardStats from "./dashboard-stats/DashboardStats";
import Proposals from "./proposals";
import Jobs from "./jobs";
import Freelancers from "./freelancers";
import useStartPageFromTop from "@/helpers/hooks/useStartPageFromTop";
import { useAuth } from "@/helpers/contexts/auth-context";
import { useIsAllowedToPostProject } from "@/helpers/hooks/useIsAllowedToPostProject";
import CustomButton from "@/components/custombutton/CustomButton";

const ClientDashboard = () => {
  useStartPageFromTop();

  const { isAllowedToPostProject } = useIsAllowedToPostProject();

  const { user } = useAuth();

  return (
    <div className="mx-5 md:mx-0 md:w-[88%]">
      <div className="m-auto my-7 max-w-[1170px] mx-auto min-h-[70vh] w-full px-4">
        {/* Title and post a job button */}
        <div className="flex items-center justify-between flex-wrap gap-4 ">
          <div className="md:text-[3.25rem] text-2xl">
            {user?.first_name}&apos;s Dashboard
          </div>

          {!isAllowedToPostProject ? (
            <Tooltip
              customTrigger={
                <CustomButton
                  className="px-9 py-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px]"
                  text="Post New Project"
                  onClick={() => {}}
                />
              }
            >
              <p>
                In order to post a project, add a credit card or verified bank
                account to your profile.
              </p>
              <Link href="/client/account/payments">
                <u>Update my profile</u>
              </Link>
            </Tooltip>
          ) : (
            <Link href="/post-new-job">
              <CustomButton
                className="px-9 py-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px]"
                text="Post New Project"
                onClick={() => {}}
              />
            </Link>
          )}
        </div>

        {/* Dashboard Stats */}

        {/* Dashboard stats */}
        <DashboardStats />

        <div className="jobs-and-proposals my-8">
          {/* Jobs and proposals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-8">
              <Jobs />
            </div>
            <div className="mb-8">
              <Proposals />
            </div>
          </div>

          {/* Freelancers */}
          <div className="w-full">
            <Freelancers />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
