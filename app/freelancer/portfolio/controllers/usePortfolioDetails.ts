import { useQuery } from "react-query";
import { getPortfolioDetails } from "@/helpers/http/portfolio";

function usePortfolioDetails(portfolio_id: number) {
  const { data, isLoading, refetch, isRefetching } = useQuery(
    ["get-portfolio-details", portfolio_id],
    () => getPortfolioDetails(portfolio_id),
    { enabled: !!portfolio_id }
  );
  return {
    portfolioData: data?.data || {},
    isLoading,
    refetch,
    isRefetching,
  };
}

export default usePortfolioDetails;
