/*
 * This is the main comonent of freelncers list
 */

import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Loader from "@/components/Loader";
import Tabs from "@/components/ui/Tabs";
import NoDataFound from "@/components/ui/NoDataFound";
import FreelancerCard from "./FreelancerCard";
import useDashboardFreelancers from "./use-dashboard-freelancers";

const Wrapper = styled.div`
  border-radius: 0.75rem;
  box-shadow: 0px 4px 74px rgba(0, 0, 0, 0.08);
  background: ${(props) => props.theme.colors.white};
  padding: 2rem;
  .list {
    max-height: 390px;
    overflow-y: auto;
  }
  .tabs-container {
    .tab {
      font-size: 1rem;
      padding: 0.75rem;
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

// Define an interface for the freelancer item
interface FreelancerItem {
  bookmark_id?: string;
  job_post_id?: string;
  [key: string]: string | number | boolean | object | undefined;
}

const Freelancers = () => {
  // Tabs
  const tabItems = useMemo(
    () => [
      {
        id: 0,
        label: "Current Hires",
        key: "hired_user",
      },
      {
        id: 1,
        label: "Saved Profiles",
        key: "saved",
        tooltip: "Freelancers don't know when their profiles are saved",
      },
    ],
    []
  );

  // Active tab
  const [activeTab, setActiveTab] = useState<string>("hired_user");

  /* This will fetch freelancers which are hired / saved by the client */
  const { freelancers, isLoading, refetch, isRefetching } =
    useDashboardFreelancers(activeTab);

  const onTabChange = (tab: string) => {
    // When onther tab is clicked, this will be called
    setActiveTab(tab);
  };

  useEffect(() => {
    // When tab is changed, it will refetch the freelancers
    refetch();
  }, [activeTab, refetch]);

  return (
    <Wrapper>
      <div className="flex justify-between flex-wrap gap-2">
        <div className="stat-label text-2xl font-bold">Freelancers</div>
        {/* Tabs */}
        <Tabs
          tabs={tabItems}
          activeTab={activeTab}
          onTabChange={onTabChange}
          className="tabs-container"
          breakPoint="576px"
        />
      </div>

      {(isLoading || isRefetching) && <Loader />}

      {/* Freelancers list */}

      {!isLoading &&
        !isRefetching &&
        (freelancers?.length > 0 ? (
          <div className="list mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            {freelancers?.map((item: FreelancerItem) => (
              <div
                key={
                  activeTab == "current_hires"
                    ? item?.job_post_id
                    : item?.bookmark_id
                }
                className="mb-3"
              >
                <FreelancerCard
                  data={item}
                  activeTabKey={activeTab}
                  refetch={refetch}
                />
              </div>
            ))}
          </div>
        ) : (
          // When there is no data, this component will be displayed
          <div className="list flex justify-center items-center">
            <NoDataFound className="py-5" />
          </div>
        ))}
    </Wrapper>
  );
};

export default Freelancers;
