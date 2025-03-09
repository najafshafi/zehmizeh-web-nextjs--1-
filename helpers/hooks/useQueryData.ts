import { QueryKey, UseQueryResult, useQueryClient } from 'react-query';

// Get data from react query cache storage
export const useQueryData = <T>(key: QueryKey): UseQueryResult<T> => {
  const clientQuery = useQueryClient();

  const data = clientQuery.getQueryData(key);
  return data as UseQueryResult<T>;
};

export const useRefetch = (key: QueryKey): { refetch: () => void } => {
  const clientQuery = useQueryClient();

  return {
    refetch: () => clientQuery.refetchQueries({ queryKey: key }),
  };
};
