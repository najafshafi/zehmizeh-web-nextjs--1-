import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import Loader from "@/components/Loader";
import Tabs from "@/components/ui/Tabs";
import NoDataFound from "@/components/ui/NoDataFound";
import WorkInProgressJobCard from "./WorkInProgressJobCard";
import ProspectDraftJobCard from "./ProspectDraftJobCard";
import useDashboardJobs from "./use-dashboard-jobs";
import PlusBlueIcon from "@/public/icons/plus-blue.svg";

const Jobs = () => {
  const [activeTab, setActiveTab] = useState<string>("active");

  // Tabs
  const tabItems = useMemo(
    () => [
      {
        id: 0,
        label: "Projects in Progress",
        key: "active",
      },
      { id: 1, label: "Posted Projects", key: "prospects" },
    ],
    []
  );

  // This will load the Jobs for client dashboard using custom hook
  const { jobs, isLoading, refetch, isRefetching } =
    useDashboardJobs(activeTab);

  const onTabChange = (tab: string) => {
    // This function will be called when the tab is changed
    setActiveTab(tab);
  };

  useEffect(() => {
    // This will refetch the jobs when the tab is changed
    refetch();
  }, [activeTab, refetch]);

  return (
    <div className="rounded-xl shadow-[0_4px_74px_rgba(0,0,0,0.08)] bg-white p-8 min-h-[600px] md:p-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="stat-label text-2xl font-bold">Projects</div>

        <Link
          href="/client-jobs"
          className="text-blue-400 hover:transition-all hover:duration-200 hover:ease-in-out hover:-translate-y-[2px] fs-1rem fw-400 cursor-pointer"
        >
          View All Projects
        </Link>
      </div>

      <div className="tabs mt-3">
        <Tabs
          tabs={tabItems}
          activeTab={activeTab}
          onTabChange={onTabChange}
          breakPoint="1200px"
          className="tabs-container"
        />
      </div>

      {/* The create new template button will be displayed when templates tab is selected */}
      {!isLoading && !isRefetching && activeTab === "template" && (
        <div className="mt-3">
          <Link
            href="/template/create"
            className="text-blue-400 hover:transition-all hover:duration-200 hover:ease-in-out hover:-translate-y-[2px] fs-1rem fw-400 cursor-pointer flex items-center"
          >
            <PlusBlueIcon />
            <div className="mx-1">Create New Template</div>
          </Link>
        </div>
      )}

      {/* Jobs list */}
      <div className="h-[426px] overflow-y-auto mt-2">
        {(isLoading || isRefetching) && <Loader />}

        {!isLoading && !isRefetching && jobs?.length == 0 && <NoDataFound />}

        {!isLoading &&
          !isRefetching &&
          jobs?.length > 0 &&
          jobs?.map((item: any) => (
            <div key={item?.job_post_id || item.post_template_id}>
              {/* Work in progress jobs */}
              {activeTab == "active" && <WorkInProgressJobCard data={item} />}

              {/* Prospects or Draft Jobs */}
              {(activeTab == "prospects" || activeTab == "draft") && (
                <ProspectDraftJobCard data={item} activeTabKey={activeTab} />
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Jobs;
