import { queryKeys } from 'helpers/const/queryKeys';
import { useAuth } from 'helpers/contexts/auth-context';
import { checkUserHasPaymentMethod } from 'helpers/http/client';
import { checkCardExpiration } from 'helpers/http/common';
import { getToken } from 'helpers/services/auth';
import { useQuery } from 'react-query';

export const useIsAllowedToPostProject = (): {
  isAllowedToPostProject: boolean;
  cardExpirationErrorMessage: string;
} => {
  const { user } = useAuth();

  const isEnabled = () =>
    !!user?.first_name && user?.user_type === 'client' && !!getToken();

  // Getting payment method
  const clientHasPaymentMethod = useQuery(
    queryKeys.clientHasPaymentMethod,
    () => isEnabled() && checkUserHasPaymentMethod(),
    {
      enabled: isEnabled(),
    }
  );

  // Getting card expiration data
  const cardExpiration = useQuery(
    queryKeys.checkCardExpiration,
    () => isEnabled() && checkCardExpiration(),
    {
      enabled: isEnabled(),
    }
  );

  // Extracting data
  const { is_card_added, is_bank_acc_verified } =
    clientHasPaymentMethod?.data?.message || {};

  // loading state
  const isLoadingOrRefetching =
    clientHasPaymentMethod?.isLoading ||
    clientHasPaymentMethod?.isRefetching ||
    cardExpiration?.isLoading ||
    cardExpiration?.isRefetching;

  return {
    // 1. loading is finished
    // 2. card is added and not expired OR bank account verified
    isAllowedToPostProject: !isLoadingOrRefetching
      ? (cardExpiration?.data?.status && is_card_added) || is_bank_acc_verified
      : true,
    cardExpirationErrorMessage:
      is_card_added && !cardExpiration?.data?.status
        ? cardExpiration?.data?.message
        : '',
  };
};
