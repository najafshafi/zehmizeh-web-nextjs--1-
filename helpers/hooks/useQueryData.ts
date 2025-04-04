import { QueryKey, UseQueryResult, useQueryClient } from "react-query";

// Get data from react query cache storage
export const useQueryData = <T>(key: QueryKey): T | undefined => {
  const clientQuery = useQueryClient();

  return clientQuery.getQueryData(key);
};

export const useRefetch = (key: QueryKey): { refetch: () => void } => {
  const clientQuery = useQueryClient();

  return {
    refetch: () => clientQuery.refetchQueries({ queryKey: key }),
  };
};
