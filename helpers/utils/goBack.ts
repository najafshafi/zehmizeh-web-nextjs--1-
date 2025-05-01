import { getStorageUser } from "@/helpers/services/auth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const goBack = (router: AppRouterInstance, route?: string) => {
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

  // In Next.js, we don't have direct access to history state index
  // We can use the built-in back() function, or redirect to default route
  if (window?.history?.length <= 1) {
    router.push(defaultRoute);
  } else {
    router.back();
  }
};
