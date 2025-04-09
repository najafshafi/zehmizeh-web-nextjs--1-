import { useInfiniteQuery } from "react-query";
import { clientJobNameSearch } from "@/helpers/http/jobs";

const LIMIT = 10;
// This custom hook fetches the Jobs which are in progress, prospects, drafts and also templates for client dashboard
function useGetAllJobs(deboubcedSearch: string | undefined) {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery<{
    data: any[];
    total: number;
  }>(
    ["get-all-client-search-jobs", deboubcedSearch],
    ({ pageParam = 1 }) =>
      clientJobNameSearch({
        status: "all",
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

export default useGetAllJobs;
