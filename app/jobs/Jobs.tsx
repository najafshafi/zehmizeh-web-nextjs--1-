/*
 * This is the main component of this route
 */

"use client";
import { useEffect, useState, useMemo, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import cns from "classnames";
import Loader from "@/components/Loader";
import Tabs from "@/components/ui/Tabs";
import NoDataFound from "@/components/ui/NoDataFound";
import JobAutoCompleteSearch from "@/components/jobs/JobAutoCompleteSearch";
import PaginationComponent from "@/components/ui/Pagination";
import Listings from "./listings";
import useStartPageFromTop from "@/helpers/hooks/useStartPageFromTop";
import useDebounce from "@/helpers/hooks/useDebounce";
import useResponsive from "@/helpers/hooks/useResponsive";
import useOnClickOutside from "@/helpers/hooks/useClickOutside";
import { useAuth } from "@/helpers/contexts/auth-context";
import useFreelancerJobs from "./hooks/useFreelancerJobs";
import useGetAllFreelancerJobs from "./hooks/useGetAllFreelancerJobs";
import { TABS } from "./consts";
import PageTitle from "@/components/styled/PageTitle";

const RECORDS_PER_PAGE = 10;

// Client component that uses useSearchParams
const JobsClient = () => {
  useStartPageFromTop();

  const { user } = useAuth();
  const { isDesktop, isLaptop } = useResponsive();

  const [activeTab, setActiveTab] = useState<string>("active");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortValue, setSortValue] = useState<string>("");
  const [searchSubmitted, setSearchSubmitted] = useState<boolean>(false);
  const ref = useRef(null);

  const onClose = () => {
    setSearchValue("");
  };
  useOnClickOutside(ref, onClose);

  const [query, setQuery] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);

  const { data, isLoading, totalResults, refetch, isRefetching } =
    useFreelancerJobs({
      query,
      limit: RECORDS_PER_PAGE,
    });

  const { jobs, fetchNextPage, hasNextPage, isFetchingNextPage, loading } =
    useGetAllFreelancerJobs(debouncedSearch);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    let NEW_ACTIVE_TAB = "active";
    let NEW_PAGE = 1;
    let KEYWORD = "";
    let QUERY = "";
    let FILTER = "";

    if (searchParams) {
      const paramsActiveTab = searchParams.get("filter");
      const pageNo = searchParams.get("pg");
      const keyword = searchParams.get("keyword");
      const filter = searchParams.get("sort");

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
        NEW_ACTIVE_TAB = "applied_job";
      }
    }

    QUERY = `filter=${NEW_ACTIVE_TAB}&pg=${NEW_PAGE}&keyword=${KEYWORD}&sort=${FILTER}`;
    setQuery(QUERY);
  }, [searchParams]);

  const onSearch = (value: string) => {
    setSearchTerm(value);
    let NEW_PAGE = currentPage;
    if (currentPage !== 1) {
      setCurrentPage(1);
      NEW_PAGE = 1;
    }
    const searchQuery = `filter=${activeTab}&pg=${NEW_PAGE}&keyword=${value}`;
    router.push(`?${searchQuery}`);
    setQuery(searchQuery);
  };

  const onTabChange = (value: string) => {
    setCurrentPage(1);
    setActiveTab(value);
    let searchQuery = `filter=${value}&pg=1&keyword=${searchTerm}`;
    if (value === "applied_job") {
      searchQuery += `&sort=${sortValue}`;
    }
    router.push(`?${searchQuery}`);
    setQuery(searchQuery);
    setSearchValue(searchTerm);
  };

  const onPageChange = (page: { selected: number }) => {
    setCurrentPage(page.selected + 1);
    const searchQuery = `filter=${activeTab}&pg=${
      page.selected + 1
    }&keyword=${searchTerm}&sort=${sortValue === "all" ? "" : sortValue}`;
    router.push(`?${searchQuery}`);
    setQuery(searchQuery);
    setSearchValue(searchTerm);
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

  const onJobClick = (id: string) => () => {
    router.push(`/job-details/${id}`);
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

  const filteredJobs = useMemo(() => {
    return jobs?.pages || [];
  }, [jobs?.pages]);

  return (
    <div className="w-full py-[4.375rem] px-0 max-w-[1170px] mx-auto md:py-8 md:px-4">
      <PageTitle className="text-center">
        {user?.first_name}&apos;s Projects
      </PageTitle>
      <form
        onSubmit={handleSubmit}
        className="bg-white relative h-[72px] w-full mt-6 mb-8 rounded-lg shadow-[0_6px_29px_rgba(155,155,155,0.09)] md:w-1/2 md:mx-auto md:mt-8 md:mb-12 "
        ref={ref}
      >
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
      </form>
      <div
        className={cns("flex justify-center", {
          "flex-col gap-2": !isDesktop && !isLaptop,
        })}
      >
        <Tabs activeTab={activeTab} tabs={TABS} onTabChange={onTabChange} />
      </div>

      {(isLoading || isRefetching) && <Loader />}

      {!isLoading && !isRefetching && (
        <div className="listings mt-4">
          <Listings
            data={data}
            listingType={activeTab}
            refetch={refetch}
            sortFilter={sortBy}
            toggleReset={sortValue === "" ? "Filter by" : sortValue}
          />
        </div>
      )}

      {!isLoading && !isRefetching && data?.length === 0 && (
        <NoDataFound className="py-12" />
      )}

      {!isRefetching && !isLoading && data?.length > 0 && (
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

// Loading component for Suspense fallback
const JobsLoading = () => (
  <div className="flex justify-center items-center p-8">
    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    <p className="ml-2">Loading jobs content...</p>
  </div>
);

// Main component that wraps the client component in Suspense
const Jobs = () => {
  return (
    <Suspense fallback={<JobsLoading />}>
      <JobsClient />
    </Suspense>
  );
};

export default Jobs;
