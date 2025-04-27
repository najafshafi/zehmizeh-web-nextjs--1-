"use client"; // Ensure this is a client component

import { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Spinner from "@/components/forms/Spin/Spinner";
import {
  FreelancerContent,
  FreelancerProfileWrapper,
  Wrapper,
} from "./freelancer-profile-settings.styled";
import Loader from "@/components/Loader";
import BackButton from "@/components/ui/BackButton";
import useProfile from "@/controllers/useProfile";
import { useAuth } from "@/helpers/contexts/auth-context";
import { Tabs } from "./Tabs";
import { Profile } from "./Tabs/Profile";
import { Portfolio } from "./Tabs/Portfolio";
import { Ratings } from "@/components/Ratings";
import { PaymentDetails } from "./Tabs/PaymentDetails";
import { AccountSettings } from "./Tabs/AccountSettings";
import { FREELANCER_PROFILE_TABS } from "@/helpers/const/tabs";
import { StyledButton } from "@/components/forms/Buttons";
import { useTheme } from "styled-components";

const INTERCOM_APP_ID = process.env.NEXT_PUBLIC_INTERCOM_APP_ID || "";

// Define Intercom settings interface
interface IntercomSettings {
  appId: string;
  email: string;
  user_id: string;
  name: string;
  avatar: {
    type: string;
    image_url: string;
  };
}

// Use type assertion for the window object
type CustomWindow = Window & {
  intercomSettings?: IntercomSettings;
};

const FreelancerProfileSettings = () => {
  const theme = useTheme();
  const params = useParams<{ tabkey: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, user } = useAuth();

  const decodedTabKey = params
    ? decodeURIComponent(params.tabkey)
    : FREELANCER_PROFILE_TABS.PROFILE;
  const { profileData, isLoading, isRefetching, refetch } = useProfile();

  useEffect(() => {
    if (profileData) {
      setUser(profileData);
    }
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, setUser]);

  useEffect(() => {
    if (user) {
      // Use type assertion
      (window as CustomWindow).intercomSettings = {
        appId: INTERCOM_APP_ID,
        email: user?.u_email_id || "",
        user_id: user?.user_id || "",
        name: `${user?.first_name || ""} ${user?.last_name || ""}`,
        avatar: {
          type: "avatar",
          image_url: user.user_image || "",
        },
      };
    }
  }, [user]);

  useEffect(() => {
    if (!isLoading) {
      const hash = window.location.hash;
      if (hash) {
        const anchorCommentId = hash.substring(1);
        const anchorComment = document.getElementById(anchorCommentId);
        if (anchorComment) {
          anchorComment.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }, [isLoading]);

  const onBack = () => {
    const fromRegister = searchParams?.get("fromRegister");
    if (fromRegister) {
      router.push("/");
    } else {
      router.back();
    }
  };

  const tabUI = () => {
    switch (decodedTabKey) {
      case FREELANCER_PROFILE_TABS.PROFILE:
        return <Profile />;
      case FREELANCER_PROFILE_TABS.PORTFOLIO:
        return <Portfolio />;
      case FREELANCER_PROFILE_TABS.RATINGS:
        return <Ratings reviews={profileData?.review} />;
      case FREELANCER_PROFILE_TABS.PAYMENT_DETAILS:
        return <PaymentDetails />;
      case FREELANCER_PROFILE_TABS.ACCOUNT_SETTINGS:
        return <AccountSettings />;
      default:
        return <></>;
    }
  };

  return (
    <FreelancerProfileWrapper>
      <Tabs />
      <FreelancerContent>
        <Wrapper>
          <div className="flex justify-between items-center">
            <BackButton onBack={onBack}>
              {isRefetching ? <Spinner className="ms-1" /> : null}
            </BackButton>

            <StyledButton
              className="hover:scale-105 transition-all duration-300 hover:shadow-sm"
              background="white"
              variant="light"
              onClick={() => {
                router.push("/search?type=freelancers");
              }}
              style={{ border: `1px solid ${theme.colors.primary} ` }}
            >
              See Other Freelancer Profiles
            </StyledButton>
          </div>

          {isLoading && <Loader />}

          {!isLoading && tabUI()}
        </Wrapper>
      </FreelancerContent>
    </FreelancerProfileWrapper>
  );
};

export default FreelancerProfileSettings;
