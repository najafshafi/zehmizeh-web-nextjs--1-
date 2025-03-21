import { getStorageUser } from "@/helpers/services/auth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const goBackNext = (router: AppRouterInstance, route?: string) => {
  let defaultRoute = route;
  if (!defaultRoute) {
    const user = getStorageUser();
    if (user?.user_type === "client") {
      defaultRoute = "/client/dashboard";
    } else if (user?.user_type === "freelancer") {
      defaultRoute = "/dashboard";
    } else {
      defaultRoute = "/";
    }
  }
  // getting history stack and checking if we can go back
  if (window?.history?.state?.idx === 0) {
    router.push(defaultRoute);
  } else {
    router.back();
  }
};
