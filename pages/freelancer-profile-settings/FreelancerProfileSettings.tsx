"use client"; // Ensure this is a client component

import { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "react-bootstrap";
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

const INTERCOM_APP_ID = process.env.NEXT_PUBLIC_INTERCOM_APP_ID;

interface CustomWindow extends Window {
  intercomSettings?: {
    appId: string;
    email: string;
    user_id: string;
    name: string;
    avatar: {
      type: string;
      image_url: string;
    };
  };
}

const myWindow: CustomWindow = window as CustomWindow;

const FreelancerProfileSettings = () => {
  const theme = useTheme();
  const params = useParams<{ tabkey: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, user } = useAuth();

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
      myWindow.intercomSettings = {
        appId: INTERCOM_APP_ID,
        email: user?.u_email_id,
        user_id: user?.user_id,
        name: user?.first_name + " " + user?.last_name,
        avatar: {
          type: "avatar",
          image_url: user.user_image,
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
    const fromRegister = searchParams.get("fromRegister");
    if (fromRegister) {
      router.push("/");
    } else {
      router.back();
    }
  };

  const tabUI = () => {
    switch (params.tabkey) {
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
              {isRefetching ? (
                <Spinner animation="border" size="sm" className="ms-1" />
              ) : null}
            </BackButton>
            <StyledButton
              background="white"
              variant="light"
              onClick={() => {
                router.push("/search?type=freelancers");
              }}
              style={{ border: `1px solid ${theme.colors.primary}` }}
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

// "use client"; // Ensure this is a client component

// import { useEffect } from "react";
// import { useParams, useRouter } from "next/navigation"; // Replace react-router-dom hooks
// import { Spinner } from "react-bootstrap";
// import {
//   FreelancerContent,
//   FreelancerProfileWrapper,
//   Wrapper,
// } from "./freelancer-profile-settings.styled";
// import Loader from "@/components/Loader";
// import BackButton from "@/components/ui/BackButton";
// import useProfile from "@/controllers/useProfile";
// // import { useAuth } from "@/helpers/contexts/auth-context";
// import { setUser } from "@/store/slices/authSlice";
// import { RootState } from "@/store"; // Import RootState for typing
// import { Tabs } from "./Tabs";
// import { Profile } from "./Tabs/Profile";
// import { Portfolio } from "./Tabs/Portfolio";
// import { Ratings } from "@/components/Ratings";
// import { PaymentDetails } from "./Tabs/PaymentDetails";
// import { AccountSettings } from "./Tabs/AccountSettings";
// import { FREELANCER_PROFILE_TABS } from "@/helpers/const/tabs";
// import { TFreelancerProfileSettingsPathParams } from "@/helpers/types/pathParams.type";
// import { StyledButton } from "@/components/forms/Buttons";
// import { ThemeProvider } from "styled-components";
// import { useSelector } from "react-redux"; // Replace useAuth with Redux

// // Intercom setup (same as in your original code)
// const INTERCOM_APP_ID = process.env.NEXT_PUBLIC_INTERCOM_APP_ID || "";

// interface CustomWindow extends Window {
//   intercomSettings?: {
//     appId: string;
//     email: string;
//     user_id: string;
//     name: string;
//     avatar: {
//       type: string;
//       image_url: string;
//     };
//   };
// }

// const myWindow = typeof window !== "undefined" ? (window as CustomWindow) : undefined;

// const FreelancerProfileSettings = () => {
//   const localTheme = {
//     colors: {
//       primary: "#007bff",
//       secondary: "#6c757d",
//     },
//   };
//   const { user } = useSelector((state: RootState) => state.auth); // Get user from Redux store
//   const { tabkey } = useParams() as TFreelancerProfileSettingsPathParams; // Get dynamic route param
//   // const { setUser, user } = useAuth();
//   const { profileData, isLoading, isRefetching, refetch } = useProfile();
//   const router = useRouter(); // Use Next.js router

//   useEffect(() => {
//     if (profileData) {
//       setUser(profileData);
//     }
//     refetch();
//   }, [profileData, setUser, refetch]);

//   useEffect(() => {
//     if (user && myWindow) {
//       myWindow.intercomSettings = {
//         appId: INTERCOM_APP_ID,
//         email: user?.u_email_id,
//         user_id: user?.user_id,
//         name: user?.first_name + " " + user?.last_name,
//         avatar: {
//           type: "avatar",
//           image_url: user.user_image,
//         },
//       };
//     }
//   }, [user]);

//   useEffect(() => {
//     if (!isLoading && typeof window !== "undefined") {
//       const currentLocation = window.location.href;
//       const hasCommentAnchor = currentLocation.includes("/#");
//       if (hasCommentAnchor) {
//         const anchorCommentId = `${currentLocation.substring(currentLocation.indexOf("#") + 1)}`;
//         const anchorComment = document.getElementById(anchorCommentId);
//         if (anchorComment) {
//           anchorComment.scrollIntoView({ behavior: "smooth" });
//         }
//       }
//     }
//   }, [isLoading]);

//   const onBack = () => {
//     // Replace goBack logic with router.back() or router.push()
//     router.back(); // Go back to the previous page
//   };

//   const tabUI = () => {
//     switch (tabkey) {
//       case FREELANCER_PROFILE_TABS.PROFILE:
//         return <Profile />;
//       case FREELANCER_PROFILE_TABS.PORTFOLIO:
//         return <Portfolio />;
//       case FREELANCER_PROFILE_TABS.RATINGS:
//         return <Ratings reviews={profileData?.review} />;
//       case FREELANCER_PROFILE_TABS.PAYMENT_DETAILS:
//         return <PaymentDetails />;
//       case FREELANCER_PROFILE_TABS.ACCOUNT_SETTINGS:
//         return <AccountSettings />;
//       default:
//         return <></>;
//     }
//   };

//   return (
//     <ThemeProvider theme={localTheme}>
//       <FreelancerProfileWrapper>
//         <Tabs />
//         <FreelancerContent>
//           <Wrapper>
//             <div className="flex justify-content-between items-center">
//               <BackButton onBack={onBack}>
//                 {isRefetching ? <Spinner animation="border" size="sm" className="ms-1" /> : null}
//               </BackButton>
//               <StyledButton
//                 background="white"
//                 variant="light"
//                 onClick={() => {
//                   router.push("/search?type=freelancers");
//                 }}
//                 style={{ border: `1px solid ${localTheme.colors.primary}` }}
//               >
//                 See Other Freelancer Profiles
//               </StyledButton>
//             </div>

//             {isLoading && <Loader />}

//             {!isLoading && tabUI()}
//           </Wrapper>
//         </FreelancerContent>
//       </FreelancerProfileWrapper>
//     </ThemeProvider>
//   );
// };

// export default FreelancerProfileSettings;

// "use client"; // Ensure this is a client component

// import { useEffect } from "react";
// import { useParams, useRouter } from "next/navigation"; // Replace react-router-dom hooks
// import { Spinner } from "react-bootstrap";
// import {
//   FreelancerContent,
//   FreelancerProfileWrapper,
//   Wrapper,
// } from "./freelancer-profile-settings.styled";
// import Loader from "@/components/Loader";
// import BackButton from "@/components/ui/BackButton";
// import useProfile from "@/controllers/useProfile";
// import { useDispatch, useSelector } from "react-redux"; // Replace useAuth with Redux
// import { setUser } from "@/store/slices/authSlice"; // Import setUser action
// import { RootState } from "@/store"; // Import RootState for typing
// import { Tabs } from "./Tabs";
// import { Profile } from "./Tabs/Profile";
// import { Portfolio } from "./Tabs/Portfolio";
// import { Ratings } from "@/components/Ratings";
// import { PaymentDetails } from "./Tabs/PaymentDetails";
// import { AccountSettings } from "./Tabs/AccountSettings";
// import { FREELANCER_PROFILE_TABS } from "@/helpers/const/tabs";
// import { TFreelancerProfileSettingsPathParams } from "@/helpers/types/pathParams.type";
// import { StyledButton } from "@/components/forms/Buttons";
// import { ThemeProvider } from "styled-components";

// // Intercom setup (same as in your original code)
// const INTERCOM_APP_ID = process.env.NEXT_PUBLIC_INTERCOM_APP_ID || "";

// interface CustomWindow extends Window {
//   intercomSettings?: {
//     appId: string;
//     email: string;
//     user_id: string;
//     name: string;
//     avatar: {
//       type: string;
//       image_url: string;
//     };
//   };
// }

// const myWindow = typeof window !== "undefined" ? (window as CustomWindow) : undefined;

// const FreelancerProfileSettings = () => {
//   const localTheme = {
//     colors: {
//       primary: "#007bff",
//       secondary: "#6c757d",
//     },
//   };

//   const { tabkey } = useParams() as TFreelancerProfileSettingsPathParams; // Get dynamic route param
//   const dispatch = useDispatch(); // Replace setUser from useAuth
//   const { user } = useSelector((state: RootState) => state.auth); // Get user from Redux store
//   const { profileData, isLoading, isRefetching, refetch } = useProfile();
//   const router = useRouter(); // Use Next.js router

//   useEffect(() => {
//     if (profileData) {
//       dispatch(setUser(profileData)); // Dispatch setUser action to update Redux store
//     }
//     refetch();
//   }, [profileData, dispatch, refetch]);

//   useEffect(() => {
//     if (user && myWindow) {
//       myWindow.intercomSettings = {
//         appId: INTERCOM_APP_ID,
//         email: user?.u_email_id,
//         user_id: user?.user_id,
//         name: user?.first_name + " " + user?.last_name,
//         avatar: {
//           type: "avatar",
//           image_url: user.user_image,
//         },
//       };
//     }
//   }, [user]);

//   useEffect(() => {
//     if (!isLoading && typeof window !== "undefined") {
//       const currentLocation = window.location.href;
//       const hasCommentAnchor = currentLocation.includes("/#");
//       if (hasCommentAnchor) {
//         const anchorCommentId = `${currentLocation.substring(currentLocation.indexOf("#") + 1)}`;
//         const anchorComment = document.getElementById(anchorCommentId);
//         if (anchorComment) {
//           anchorComment.scrollIntoView({ behavior: "smooth" });
//         }
//       }
//     }
//   }, [isLoading]);

//   const onBack = () => {
//     router.back(); // Go back to the previous page
//   };

//   const tabUI = () => {
//     switch (tabkey) {
//       case FREELANCER_PROFILE_TABS.PROFILE:
//         return <Profile />;
//       case FREELANCER_PROFILE_TABS.PORTFOLIO:
//         return <Portfolio />;
//       case FREELANCER_PROFILE_TABS.RATINGS:
//         return <Ratings reviews={profileData?.review} />;
//       case FREELANCER_PROFILE_TABS.PAYMENT_DETAILS:
//         return <PaymentDetails />;
//       case FREELANCER_PROFILE_TABS.ACCOUNT_SETTINGS:
//         return <AccountSettings />;
//       default:
//         return <></>;
//     }
//   };

//   return (
//     <ThemeProvider theme={localTheme}>
//       <FreelancerProfileWrapper>
//         <Tabs />

//         <FreelancerContent>
//           <Wrapper>
//             <div className="flex justify-content-between items-center">
//               <BackButton onBack={onBack}>
//                 {isRefetching ? <Spinner animation="border" size="sm" className="ms-1" /> : null}
//               </BackButton>
//               <StyledButton
//                 background="white"
//                 variant="light"
//                 onClick={() => {
//                   router.push("/search?type=freelancers");
//                 }}
//                 style={{ border: `1px solid #F2B420` }}
//               >
//                 See Other Freelancer Profiles
//               </StyledButton>
//             </div>

//             {isLoading && <Loader />}

//             {!isLoading && tabUI()}
//           </Wrapper>
//         </FreelancerContent>
//       </FreelancerProfileWrapper>
//     </ThemeProvider>
//   );
// };

// export default FreelancerProfileSettings;
