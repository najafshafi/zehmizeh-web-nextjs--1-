"use client";

import { useInfiniteQuery } from "react-query";
import { freelancerJobNameSearch } from "@/helpers/http/jobs";

const LIMIT = 10;
// This custom hook fetches the Jobs which are in progress, prospects, drafts and also templates for client dashboard
function useGetAllFreelancerJobs(deboubcedSearch: string | undefined) {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery<{
    job_post_id: string;
    job_title: string;
    data: any;
    isLoading: boolean;
    fetchNextPage: boolean;
    hasNextPage: boolean;
    isFetching: boolean;
    isFetchingNextPage: boolean;
    refetch: any;
    total: number;
  }>(
    ["get-all-freelancer-search-jobs", deboubcedSearch],
    ({ pageParam = 1 }) =>
      freelancerJobNameSearch({
        status: "all_jobs",
        text: deboubcedSearch || "",
        page: pageParam,
        limit: LIMIT,
      }),
    {
      getNextPageParam: (lastPage, allPages) => {
        const currentDataCount = allPages.reduce(
          (sum, item) => (sum += item?.data?.length),
          0
        );
        const total = allPages[0]?.total;
        const hasNext =
          Number(currentDataCount) < Number(total)
            ? Math.ceil(Number(currentDataCount) / LIMIT) + 1
            : false;
        return hasNext;
      },
      enabled: !!deboubcedSearch,
      select: (data) => ({
        pages: data.pages.flatMap((x) => x?.data),
        pageParams: data.pageParams,
      }),
    }
  );
  return {
    jobs: data,
    fetchNextPage: fetchNextPage,
    hasNextPage: hasNextPage,
    isFetching: isFetching,
    isFetchingNextPage: isFetchingNextPage,
    refetch: refetch,
    loading: isLoading,
  };
}

export default useGetAllFreelancerJobs;
