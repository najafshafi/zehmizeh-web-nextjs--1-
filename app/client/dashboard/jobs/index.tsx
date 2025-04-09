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

const Wrapper = styled.div`
  border-radius: 0.75rem;
  box-shadow: 0px 4px 74px rgba(0, 0, 0, 0.08);
  background: ${(props) => props.theme.colors.white};
  padding: 2rem;
  min-height: 600px;
  .list {
    height: 426px;
    overflow-y: auto;
  }
  .view-alll-link {
    color: ${(props) => props.theme.colors.lightBlue};
    &:hover {
      transition: all 0.2s ease-in-out;
      transform: translateY(-2px);
    }
  }
  .tabs-container {
    .tab {
      font-size: 1rem;
      padding: 0.5rem;
      height: 48px;
    }
    .active {
      box-shadow: 0px 4px 26px rgba(0, 0, 0, 0.09);
    }
  }
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

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
    <Wrapper>
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div className="stat-label fs-24 fw-700">Projects</div>

        <Link
          href="/client-jobs"
          className="view-alll-link fs-1rem fw-400 pointer"
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
            className="view-alll-link fs-1rem fw-400 pointer d-flex align-items-center"
          >
            <PlusBlueIcon />
            <div className="mx-1">Create New Template</div>
          </Link>
        </div>
      )}

      {/* Jobs list */}
      <div className="list mt-2">
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
    </Wrapper>
  );
};

export default Jobs;
