/*
 * This is the main component of this route
  Client side - Jobs list page
 */
"use client";
import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import cns from "classnames";
import dynamic from "next/dynamic";
import Loader from "@/components/Loader";
import Tabs from "@/components/ui/Tabs";
import NoDataFound from "@/components/ui/NoDataFound";
import Tooltip from "@/components/ui/Tooltip";
import { StyledButton } from "@/components/forms/Buttons";
import PaginationComponent from "@/components/ui/Pagination";
import PageTitle from "@/components/styled/PageTitle";
import useOnClickOutside from "@/helpers/hooks/useClickOutside";
import useDebounce from "@/helpers/hooks/useDebounce";
import useStartPageFromTop from "@/helpers/hooks/useStartPageFromTop";
import useResponsive from "@/helpers/hooks/useResponsive";
import { useAuth } from "@/helpers/contexts/auth-context";
import useClientJobs from "./hooks/useClientJobs";
import useGetAllJobs from "./hooks/useGetAllJobs";
import { TABS } from "./consts";
import { useIsAllowedToPostProject } from "@/helpers/hooks/useIsAllowedToPostProject";
import CustomButton from "@/components/custombutton/CustomButton";

// Dynamically import components that might use browser APIs
const Listings = dynamic(() => import("./listings"), { ssr: false });
const JobAutoCompleteSearch = dynamic(
  () => import("@/components/jobs/JobAutoCompleteSearch"),
  { ssr: false }
);

const RECORDS_PER_PAGE = 10;

// Create a client-side only wrapper component
const ClientJobsWrapper = () => {
  // Return early during server-side rendering
  if (typeof window === "undefined") {
    return <div>Loading client jobs...</div>;
  }

  return <ClientJobs />;
};

const ClientJobs = () => {
  useStartPageFromTop();

  const { isAllowedToPostProject } = useIsAllowedToPostProject();
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { isDesktop, isLaptop } = useResponsive();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchValue, setSearchValue] = useState("");
  const [searchSubmitted, setSearchSubmitted] = useState<boolean>(false);
  const [sortValue, setSortValue] = useState("");

  const ref = useRef<HTMLFormElement>(null);
  const onClose = () => {
    setSearchValue("");
  };
  useOnClickOutside(ref, onClose);

  const [query, setQuery] = useState("");
  const deboubcedSearch = useDebounce(searchValue, 500);

  const { data, isLoading, totalResults, isRefetching } = useClientJobs({
    query,
    limit: RECORDS_PER_PAGE,
  });
  const { jobs, fetchNextPage, hasNextPage, isFetchingNextPage, loading } =
    useGetAllJobs(deboubcedSearch);

  useEffect(() => {
    /* This will set the default or applied filter from the url and
    then will start fetching the data once the query is set */

    let NEW_ACTIVE_TAB = activeTab; // default active tab (number)
    let NEW_PAGE = 1; // default current page = 1
    let KEYWORD = ""; // default keyword = ''
    let QUERY = "";
    let FILTER = "";

    if (searchParams) {
      const params = new URLSearchParams(searchParams.toString());
      const paramsActiveTab = params.get("filter");
      const pageNo = params.get("pg");
      const keyword = params.get("keyword");
      const filter = params.get("sort");

      if (paramsActiveTab) {
        setActiveTab(paramsActiveTab);
        NEW_ACTIVE_TAB = paramsActiveTab;
      }
      if (pageNo) {
        setCurrentPage(Number(pageNo));
        NEW_PAGE = Number(pageNo);
      }
      if (keyword) {
        KEYWORD = keyword;
        setSearchTerm(KEYWORD);
        setSearchValue(KEYWORD);
        setSearchSubmitted(true);
      }
      if (filter) {
        FILTER = filter;
        setSortValue(filter);
        NEW_ACTIVE_TAB = "closed";
      }
    }

    QUERY = `filter=${NEW_ACTIVE_TAB}&pg=${NEW_PAGE}&keyword=${KEYWORD}&sort=${FILTER}`;
    setQuery(QUERY);
  }, [searchParams]);

  const onTabChange = (value: string) => {
    setCurrentPage(1);
    setActiveTab(value);
    let searchQuery = `filter=${value}&pg=1&keyword=${searchTerm}`;
    if (value === "closed") {
      searchQuery = searchQuery.concat(`&sort=${sortValue}`);
    }

    router.push(`?${searchQuery}`);
    setQuery(searchQuery);
    setSearchValue(searchTerm);
  };

  const onPageChange = (page: { selected: number }) => {
    setCurrentPage(page?.selected + 1);
    let searchQuery = `filter=${activeTab}&pg=${
      page?.selected + 1
    }&keyword=${searchTerm}`;

    if (activeTab === "closed") {
      searchQuery = searchQuery.concat(
        `&sort=${sortValue === "all" ? "" : sortValue}`
      );
    }

    router.push(`?${searchQuery}`);
    setQuery(searchQuery);
    setSearchValue(searchTerm);
  };

  const onSearch = (value: string) => {
    setSearchTerm(value);

    let NEW_PAGE = currentPage;
    if (currentPage !== 1) {
      setCurrentPage(1);
      NEW_PAGE = 1;
    }

    let searchQuery = `filter=${activeTab}&pg=${NEW_PAGE}&keyword=${value}`;
    if (activeTab === "closed") {
      searchQuery = searchQuery.concat(
        `&sort=${sortValue === "all" ? "" : sortValue}`
      );
    }

    router.push(`?${searchQuery}`);
    setQuery(searchQuery);
  };

  const onJobClick = (id: string) => () => {
    router.push(`/client-job-details/${id}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
    setSearchSubmitted(true);
  };

  const onSearchValueChange = (val: string) => {
    if (val === "") {
      onSearch(val);
    }
    setSearchSubmitted(false);
    setSearchValue(val);
  };

  const sortBy = (value: string) => {
    setCurrentPage(1);
    setSortValue(value === "all" ? "" : value);
    const searchQuery = `filter=${activeTab}&pg=1&keyword=${searchTerm}&sort=${
      value === "all" ? "" : value
    }`;
    router.push(`?${searchQuery}`);
    setQuery(searchQuery);
  };

  const filteredJobs = useMemo(() => {
    return jobs?.pages || [];
  }, [jobs?.pages]);

  return (
    <div className="w-full max-w-[1170px] mx-auto px-4 lg:px-0 py-[50px] md:py-8">
      {/* Page title */}
      <PageTitle className="text-center mb-3">
        {user?.first_name}&apos;s Projects
      </PageTitle>

      <form onSubmit={handleSubmit} className="" ref={ref}>
        <div className="relative bg-white h-[72px] w-full mt-6 mb-6 rounded-lg shadow-[0_6px_29px_rgba(155,155,155,0.09)] md:w-1/2 md:mx-auto md:mt-8 md:mb-12">
          <JobAutoCompleteSearch
            jobs={jobs?.pages}
            filteredJobs={filteredJobs}
            onJobClick={onJobClick}
            onSearchValueChange={onSearchValueChange}
            searchValue={searchValue}
            hasNextPage={hasNextPage || false}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
            isLoading={loading}
            searchSubmitted={searchSubmitted}
          />
        </div>
      </form>

      {/* Tabs and post a job button */}
      <div
        className={cns("flex justify-between", {
          "flex-col gap-2": !isDesktop && !isLaptop,
        })}
      >
        <Tabs
          className={cns({ "order-2": !isDesktop && !isLaptop })}
          activeTab={activeTab}
          tabs={TABS}
          onTabChange={onTabChange}
          breakPoint="576px"
        />

        {isAllowedToPostProject ? (
          <Link
            href="/search?type=freelancers"
            className={cns({
              "mt-2 block order-1 my-2": !isDesktop && !isLaptop,
            })}
          >
            <CustomButton
              text={"Find Freelancers"}
              className={`px-[2rem] py-[1rem]  transition-transform duration-200 hover:scale-105 font-normal  rounded-full bg-primary text-[18px] mb-2 ${
                !isDesktop && !isLaptop ? "w-full" : ""
              }`}
              onClick={() => {}}
            />
          </Link>
        ) : (
          <Tooltip
            customTrigger={
              <StyledButton
                disabled
                width={200}
                className={!isDesktop && !isLaptop ? "w-full" : ""}
              >
                <Link
                  href="/post-new-job"
                  className={cns({
                    "mt-2 block order-1 my-2": !isDesktop && !isLaptop,
                  })}
                >
                  Post New Project
                </Link>
              </StyledButton>
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
        )}
      </div>

      {isLoading && <Loader />}

      {!isLoading && !isRefetching && data?.length === 0 && (
        <NoDataFound className="py-5" title="No jobs found" />
      )}

      {/* Jobs listings */}
      <div className="mt-4 ">
        {!isLoading && data?.length > 0 && (
          <Listings
            data={data}
            listingType={activeTab}
            sortFilter={sortBy}
            toggleReset={sortValue === "" ? "Filter by" : sortValue}
          />
        )}
      </div>

      {/* Pagination */}
      {data?.length > 0 && (
        <div className="flex justify-center mt-3">
          <PaginationComponent
            total={Math.ceil(totalResults / RECORDS_PER_PAGE)}
            onPageChange={onPageChange}
            currentPage={currentPage}
          />
        </div>
      )}
    </div>
  );
};

export default ClientJobsWrapper;
