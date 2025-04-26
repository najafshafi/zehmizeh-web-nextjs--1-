/*
 * This is the main component that lists all the components of jobs list
 */
"use client";
import { useState } from "react";
import Link from "next/link";
import Tabs from "@/components/ui/Tabs";
import JobsInProgress from "./JobsInProgress";
import SavedJobs from "./SavedJobs";

const TABS = [
  { id: 1, label: "Work in Progress", key: "work_in_progress" },
  { id: 2, label: "Saved", key: "saved" },
];

const Jobs = () => {
  const [activeTab, setActiveTab] = useState("work_in_progress");
  return (
    <div className="rounded-xl shadow-[0px_4px_74px_rgba(0,0,0,0.08)] bg-white p-8">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">Projects</div>
        <Link href="/jobs" className="text-base font-normal text-blue-600">
          View All Projects
        </Link>
      </div>
      <div className="mt-6 !text-base">
        <Tabs
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={(item) => setActiveTab(item)}
          breakPoint="576px"
          className="cursor-pointer"
        />
      </div>
      <div className="mt-1">
        {activeTab == "work_in_progress" && <JobsInProgress />}
        {activeTab == "saved" && <SavedJobs />}
      </div>
    </div>
  );
};

export default Jobs;
