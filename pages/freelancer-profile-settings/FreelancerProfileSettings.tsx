"use client";
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import {
  FreelancerContent,
  FreelancerProfileWrapper,
  Wrapper,
} from './freelancer-profile-settings.styled';
import Loader from '@/components/Loader';
import BackButton from '@/components/ui/BackButton';
import useProfile from '@/controllers/useProfile';
import { useAuth } from '@/helpers/contexts/auth-context';
import { goBack } from '@/helpers/utils/goBack';
import { Tabs } from './Tabs';
import { Profile } from './Tabs/Profile';
import { Portfolio } from './Tabs/Portfolio';
import { Ratings } from '@/components/Ratings';
import { PaymentDetails } from './Tabs/PaymentDetails';
import { AccountSettings } from './Tabs/AccountSettings';
import { FREELANCER_PROFILE_TABS } from '@/helpers/const/tabs';
import { TFreelancerProfileSettingsPathParams } from '@/helpers/types/pathParams.type';
import { StyledButton } from '@/components/forms/Buttons';
import { useTheme } from 'styled-components';

const INTERCOM_APP_ID = process.env.REACT_APP_INTERCOM_APP_ID || '';

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

const myWindow = window as CustomWindow;

const FreelancerProfileSettings = () => {
  const theme = useTheme();
  const { tabkey } = useParams<TFreelancerProfileSettingsPathParams>();
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
        name: user?.first_name + ' ' + user?.last_name,
        avatar: {
          type: 'avatar',
          image_url: user.user_image,
        },
      };
    }
  }, [user]);

  useEffect(() => {
    /* TODO: Here the #element_id was not working proeprly, I tried lot for that but taking too much time
     * so for now I have added this thing, and working perfectly, if this is not correct will see in e2e testing
     */
    if (!isLoading) {
      const currentLocation = window.location.href;
      const hasCommentAnchor = currentLocation.includes('/#');
      if (hasCommentAnchor) {
        const anchorCommentId = `${currentLocation.substring(
          currentLocation.indexOf('#') + 1
        )}`;
        const anchorComment = document.getElementById(anchorCommentId);
        if (anchorComment) {
          anchorComment.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }, [isLoading]);

  const location = useLocation();

  const navigate = useNavigate();

  const onBack = () => {
    if (location.state?.fromRegister) {
      navigate('/');
    } else {
      goBack(navigate, '/dashboard');
    }
  };

  const tabUI = () => {
    switch (tabkey) {
      /* START ----------------------------------------- Profile */
      case FREELANCER_PROFILE_TABS.PROFILE:
        return <Profile />;
      /* END ------------------------------------------- Profile */
      /* START ----------------------------------------- Portfolio */
      case FREELANCER_PROFILE_TABS.PORTFOLIO:
        return <Portfolio />;
      /* END ------------------------------------------- Portfolio */
      /* START ----------------------------------------- Ratings */
      case FREELANCER_PROFILE_TABS.RATINGS:
        return <Ratings reviews={profileData?.review} />;
      /* END ------------------------------------------- Ratings */
      /* START ----------------------------------------- Payment details */
      case FREELANCER_PROFILE_TABS.PAYMENT_DETAILS:
        return <PaymentDetails />;
      /* END ------------------------------------------- Payment details */
      /* START ----------------------------------------- Account settings */
      case FREELANCER_PROFILE_TABS.ACCOUNT_SETTINGS:
        return <AccountSettings />;
      /* END ------------------------------------------- Account settings */
      default:
        return <></>;
    }
  };

  return (
    <FreelancerProfileWrapper>
      <Tabs />
      <FreelancerContent>
        <Wrapper>
          <div className="d-flex justify-content-between align-items-center">
            <BackButton onBack={onBack}>
              {isRefetching ? (
                <Spinner animation="border" size="sm" className="ms-1" />
              ) : null}
            </BackButton>
            <StyledButton
              background="white"
              variant="light"
              onClick={() => {
                navigate('/search?type=freelancers');
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
