import { getStorageUser } from '@/helpers/services/auth';
import { NavigateFunction } from 'react-router-dom';

export const goBack = (navigate: NavigateFunction, route?: string) => {
  let defaultRoute = route;
  if (!defaultRoute) {
    const user = getStorageUser();
    if (user?.user_type === 'client') {
      defaultRoute = '/client/dashboard';
    } else if (user?.user_type === 'freelancer') {
      defaultRoute = '/frelancer/account/profile';
    } else {
      defaultRoute = '/';
    }
  }
  // getting history stack and checking idx if its greater than 0
  // it means there is a page in stack else navigating to home page
  if (window?.history?.state?.idx === 0) {
    navigate(defaultRoute);
  } else {
    navigate(-1);
  }
};
