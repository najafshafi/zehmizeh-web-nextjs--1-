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
import { useEffect } from "react";
import toast from "react-hot-toast";
import { goBackNext } from "@/helpers/utils/goBackNext";
import { Profile } from "./Tabs/Profile";
import { JobRatings } from "./Tabs/JobRatings";
import { Portfolio } from "./Tabs/Portfolio";
import Tabs from "./Tabs";
import { usePortfolioList } from "@/controllers/usePortfolioList";
import { useFreelancerDetails } from "@/controllers/useFreelancerDetails";
import { hasClientAddedPaymentDetails } from "@/helpers/utils/helper";

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

  // Extract freelancerId from the pathname
  const freelancerId = pathname ? pathname.split("/").pop() || "" : "";

  useScrollToSection();
  const { user } = useAuth();
  const freelancerQuery = useFreelancerDetails(freelancerId);
  const portfolioQuery = usePortfolioList(freelancerId);

  /* START ----------------------------------------- Checking client added payment details or not. If not,then navigating to profile page */
  useEffect(() => {
    if (!hasClientAddedPaymentDetails(user)) {
      timeoutRef = setTimeout(() => {
        if (timeoutRef) clearTimeout(timeoutRef);
        toast.error(
          "To access ZMZ's freelancers, add at least one payment method to your profile."
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
                  : "/dashboard"
              }
            />

            {freelancerQuery.isLoading ? (
              <Loader />
            ) : (
              freelancerQuery.freelancerData && (
                <>
                  {/* Profile Section */}
                  <div id="profile-profile">
                    <Profile />
                  </div>

                  {/* Portfolio Section */}
                  {portfolioQuery?.portfolioData &&
                    portfolioQuery.portfolioData.length > 0 && (
                      <div id="profile-portfolio" className="mt-6">
                        <Portfolio allowEdit={false} />
                      </div>
                    )}

                  {/* Ratings Section - Make sure it's always shown */}
                  <div id="profile-ratings" className="mt-6">
                    <JobRatings />
                  </div>
                </>
              )
            )}
          </div>
        </Wrapper>
      </ViewFreelancerContent>
    </ViewFreelancerProfileWrapper>
  );
};

export default ViewFreelancerProfile;
