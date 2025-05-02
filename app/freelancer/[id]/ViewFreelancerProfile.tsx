"use client";
import { usePathname, useRouter } from "next/navigation";
import {
  ViewFreelancerContent,
  ViewFreelancerProfileWrapper,
  Wrapper,
} from "./ViewFreelancerProfile.styled";
import Loader from "@/components/Loader";
import BackButton from "@/components/ui/BackButton";
import { useAuth } from "@/helpers/contexts/auth-context";
import LeftBgImage from "@/public/icons/freelancer-profile-left-bg.svg";
import RightBgImage from "@/public/icons/search-banner-right.svg";
import { useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { goBackNext } from "@/helpers/utils/goBackNext";
import { Profile } from "./Tabs/Profile";
import { JobRatings } from "./Tabs/JobRatings";
import { Portfolio } from "./Tabs/Portfolio";
import Tabs from "./Tabs";
import { usePortfolioList } from "@/controllers/usePortfolioList";
import { useFreelancerDetails } from "@/controllers/useFreelancerDetails";
import { hasClientAddedPaymentDetails } from "@/helpers/utils/helper";
import CustomButton from "@/components/custombutton/CustomButton";
import { useSuppressAuthErrors } from "@/helpers/hooks/useSuppressAuthErrors";
import { isFreelancerProfileRoute } from "@/helpers/utils/routeMatch";

// Check if the current path is a freelancer profile page
const isFreelancerProfilePath = (path: string | null) => {
  if (!path) return false;
  return isFreelancerProfileRoute(path);
};

const useScrollToSection = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Check if there's a hash in the URL
    if (pathname && pathname.includes("#")) {
      const targetId = pathname.split("#")[1];
      const element = document.getElementById(targetId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100); // Small delay to ensure DOM is ready
      }
    }
  }, [pathname]);
};

let timeoutRef: ReturnType<typeof setTimeout> | null = null;
const ViewFreelancerProfile = () => {
  const pathname = usePathname();
  const router = useRouter();

  // // Add debug logging
  // console.log("Current pathname:", pathname);
  // console.log("Is freelancer profile path:", isFreelancerProfilePath(pathname));

  // Apply error suppression for this page
  useSuppressAuthErrors();

  // Check if we're on a freelancer profile page
  const isOnFreelancerProfilePage = isFreelancerProfilePath(pathname);

  // Extract freelancerId from the pathname
  const freelancerId = pathname ? pathname.split("/").pop() || "" : "";

  useScrollToSection();
  const { user } = useAuth();
  const freelancerQuery = useFreelancerDetails(freelancerId);

  // We need portfolioQuery data for the Portfolio component
  const portfolioQuery = usePortfolioList(freelancerId);

  // Track if the user is authenticated
  const isAuthenticated = !!user;

  // Function to handle interactions that require authentication
  const handleAuthenticatedAction = useCallback(() => {
    if (!isAuthenticated) {
      // Redirect to login with the current URL as the return destination
      const currentUrl = window.location.pathname;
      router.push(`/login?from=${encodeURIComponent(currentUrl)}`);
      toast.error("Please log in to interact with freelancers");
      return false;
    }

    // For client users, check payment details
    if (
      isAuthenticated &&
      user?.user_type === "client" &&
      !hasClientAddedPaymentDetails(user)
    ) {
      toast.error(
        "To interact with ZMZ&apos;s freelancers, add at least one payment method to your profile."
      );
      goBackNext(router, "/client/account/settings");
      return false;
    }

    return true;
  }, [isAuthenticated, user, router]);

  /* START ----------------------------------------- Checking client added payment details or not. If not,then navigating to profile page */
  useEffect(() => {
    // Only perform this check for authenticated client users
    if (
      isAuthenticated &&
      user?.user_type === "client" &&
      !hasClientAddedPaymentDetails(user)
    ) {
      timeoutRef = setTimeout(() => {
        if (timeoutRef) clearTimeout(timeoutRef);
        toast.error(
          "To access ZMZ&apos;s freelancers, add at least one payment method to your profile."
        );
      }, 500);
      goBackNext(router, "/client/account/settings");
    }
    return () => {
      if (timeoutRef) clearTimeout(timeoutRef);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* END ------------------------------------------- Checking client added payment details or not. If not,then navigating to profile page */

  useEffect(() => {
    /* TODO: Here the #element_id was not working proeprly, I tried lot for that but taking too much time
     * so for now I have added this thing, and working perfectly, if this is not correct will see in e2e testing
     */
    if (!freelancerQuery.isLoading && !freelancerQuery.isRefetching) {
      const currentLocation = window.location.href;
      const hasCommentAnchor = currentLocation.includes("/#");
      if (hasCommentAnchor) {
        const anchorCommentId = `${currentLocation.substring(
          currentLocation.indexOf("#") + 1
        )}`;
        const anchorComment = document.getElementById(anchorCommentId);
        if (anchorComment) {
          anchorComment.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }, [freelancerQuery.isLoading, freelancerQuery.isRefetching]);

  // If this component is rendered on a page that's not a freelancer profile page,
  // redirect to login if not authenticated
  useEffect(() => {
    // console.log("Route protection effect running");
    // console.log("isOnFreelancerProfilePage:", isOnFreelancerProfilePage);
    // console.log("pathname:", pathname);

    // Add broader check for freelancer URLs to prevent redirects
    if (pathname && pathname.includes("/freelancer/")) {
      // console.log("Detected freelancer path, preventing redirect");
      return;
    }

    if (!isOnFreelancerProfilePage && !isAuthenticated) {
      // console.log("Redirecting to login");
      router.push(`/login?from=${encodeURIComponent(pathname || "")}`);
    }
  }, [isOnFreelancerProfilePage, isAuthenticated, router, pathname]);

  return (
    <ViewFreelancerProfileWrapper>
      <Tabs />
      <ViewFreelancerContent>
        <Wrapper className="content-hfill">
          <LeftBgImage className="banner-left-bg" />
          <RightBgImage className="banner-right-bg" />

          <div className="content">
            <BackButton
              route={
                user && user.user_type == "client"
                  ? "/client/dashboard"
                  : user?.user_type === "freelancer"
                    ? "/dashboard"
                    : "/home"
              }
            />

            {!isAuthenticated && (
              <div className="w-full flex justify-center items-center px-5">
                <div className="w-fit bg-blue-50 p-4 rounded-md shadow mt-4 flex justify-between items-center">
                  <p className="text-blue-800">
                    You are viewing this profile as a guest. To interact with
                    this freelancer, please log in.
                  </p>
                </div>
              </div>
            )}

            {freelancerQuery.isLoading ? (
              <Loader />
            ) : freelancerQuery.error ? (
              <div className="bg-red-50 p-8 rounded-md text-center">
                <h3 className="text-xl font-semibold text-red-700 mb-2">
                  Error Loading Profile
                </h3>
                <p className="text-gray-700 mb-4">
                  We&apos;re having trouble loading this freelancer&apos;s
                  profile. This may be a temporary issue.
                </p>
                <CustomButton
                  text="Try Again"
                  onClick={() => freelancerQuery.refetch()}
                  className="bg-primary text-white mx-auto"
                />
              </div>
            ) : !freelancerQuery.freelancerData ? (
              <div className="bg-yellow-50 p-8 rounded-md text-center">
                <h3 className="text-xl font-semibold text-yellow-700 mb-2">
                  Profile Not Available
                </h3>
                <p className="text-gray-700 mb-4">
                  This freelancer&apos;s profile is currently unavailable or may
                  have been removed.
                </p>
                <CustomButton
                  text="Back to Home"
                  onClick={() => router.push("/home")}
                  className="bg-primary text-white mx-auto"
                />
              </div>
            ) : (
              <>
                {/* Profile Section */}
                <div id="profile-profile">
                  <Profile
                    handleAuthenticatedAction={handleAuthenticatedAction}
                  />
                </div>

                {/* Portfolio Section - Modified to show for public users */}
                <div id="profile-portfolio" className="mt-6">
                  <Portfolio
                    allowEdit={
                      isAuthenticated &&
                      user?.user_type === "freelancer" &&
                      user?.user_id === freelancerId
                    }
                    handleAuthenticatedAction={handleAuthenticatedAction}
                    isAuthenticated={isAuthenticated}
                  />
                </div>

                {/* Ratings Section - Make sure it's always shown */}
                <div id="profile-ratings" className="mt-6">
                  <JobRatings
                    handleAuthenticatedAction={handleAuthenticatedAction}
                  />
                </div>
              </>
            )}
          </div>
        </Wrapper>
      </ViewFreelancerContent>
    </ViewFreelancerProfileWrapper>
  );
};

export default ViewFreelancerProfile;
