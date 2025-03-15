"use client"
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation'; // Changed from react-router-dom
import { Wrapper, StepIndicator } from './complete-profile.styled';
import PersonalDetails from './steps/PersonalDetails';
import AboutMe from './steps/AboutMe';
import Skills from './steps/Skills';
import Languages from './steps/Languages';
import { editUser } from '@/helpers/http/auth';
import { useAuth } from '@/helpers/contexts/auth-context';
import { ProfilePhoto } from './steps/ProfilePhoto';
import { getCategories, getSkills } from '@/helpers/utils/helper';

const CompleteProfile = () => {
  const router = useRouter(); // Changed from useNavigate
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [profileData, setProfileData] = useState({
    about_me: '',
    job_title: '',
    user_image: '',
    hourly_rate: 0,
    skills: [],
    languages: [],
  });
  const [updatingProfile, setUpdatingProfile] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    const userData = {};
    Object.keys(user || {}).forEach((key) => {
      if (Object.keys(profileData).includes(key) && user[key]) {
        userData[key] = user[key];
      }
    });
    setProfileData((prev) => ({ ...prev, ...userData }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const onPrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const goToNextStep = (data: typeof user) => {
    const newProfileData = { ...profileData, ...data };

    if (user.user_type === 'client') {
      updateClientProfile(newProfileData);
    } else {
      setProfileData(newProfileData);
    }

    if (newProfileData?.skills == null) newProfileData.skills = [];
    if (newProfileData?.languages == null) newProfileData.languages = [];
    if (currentStep == 5) {
      updateFreelancerProfile(newProfileData);
    } else {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
    }
  };

  const updateClientProfile = (data: typeof user) => {
    const body = {
      about_me: data.about_me,
    };
    const promise = editUser(body);
    toast.promise(promise, {
      loading: 'Updating your details - please wait...',
      success: (res) => {
        router.push('/client/account/profile'); // Changed from navigate
        return res.message;
      },
      error: (err) => {
        return err?.response?.data?.message || 'error';
      },
    });
  };

  const updateFreelancerProfile = (newProfileData: typeof user) => {
    const { user_image, job_title, hourly_rate, about_me, skills, languages } =
      newProfileData;
    setUpdatingProfile(true);
    const body: Partial<typeof profileData> = {
      user_image: user_image || '/images/default_avatar.png',
    };
    if (job_title) body.job_title = job_title;
    if (parseFloat(hourly_rate?.toString()))
      body.hourly_rate = parseFloat(hourly_rate.toString());
    if (about_me) body.about_me = about_me;
    if (skills?.length > 0) body.skills = skills;
    if (languages?.length > 0) body.languages = languages;

    const promise = editUser(body);
    toast.promise(promise, {
      loading: 'Updating your details - please wait...',
      success: (res) => {
        setUpdatingProfile(false);
        router.push('/freelancer/account/profile', { // Changed from navigate
          state: {
            fromRegister: true,
          },
        });
        return res.message;
      },
      error: (err) => {
        setUpdatingProfile(false);
        return err?.response?.data?.message || 'error';
      },
    });
  };

  const skipForNowHandler = () => {
    if (currentStep >= 5) router.push('/freelancer/account/profile'); // Changed from navigate
    else setCurrentStep((stp) => stp + 1);
  };

  const ClientUI = () => {
    return (
      user?.user_type === 'client' && (
        <>
          <div className="mt-2">
            <PersonalDetails
              client={true}
              onUpdate={goToNextStep}
              profileData={profileData}
              skipForNow={skipForNowHandler}
            />
          </div>
          <div className="mt-4">
            <AboutMe
              onUpdate={goToNextStep}
              onPrevious={onPrevious}
              aboutMe={profileData?.about_me}
              skipForNow={skipForNowHandler}
            />
          </div>
        </>
      )
    );
  };

  const FreelancerUI = () => {
    let Component = <></>;
    switch (currentStep) {
      case 1:
        Component = (
          <PersonalDetails
            onUpdate={goToNextStep}
            profileData={profileData}
            skipForNow={skipForNowHandler}
          />
        );
        break;
      case 2:
        Component = (
          <AboutMe
            onUpdate={goToNextStep}
            onPrevious={onPrevious}
            aboutMe={profileData?.about_me}
            skipForNow={skipForNowHandler}
          />
        );
        break;
      case 3:
        Component = (
          <Skills
            onUpdate={goToNextStep}
            onPrevious={onPrevious}
            selectedCategories={getCategories(profileData?.skills || [])}
            selectedSkills={getSkills(profileData?.skills || [])}
            skipForNow={skipForNowHandler}
          />
        );
        break;
      case 4:
        Component = (
          <Languages
            onUpdate={goToNextStep}
            onPrevious={onPrevious}
            languagesProps={profileData?.languages}
            skipForNow={skipForNowHandler}
          />
        );
        break;
      case 5:
        Component = (
          <ProfilePhoto
            profileData={profileData}
            onUpdate={goToNextStep}
            onPrevious={onPrevious}
            updatingProfile={updatingProfile}
          />
        );
        break;

      default:
        break;
    }
    return (
      user?.user_type === 'freelancer' && (
        <div className="forms mt-4">{Component}</div>
      )
    );
  };

  return (
    <Wrapper className="my-5 mx-auto">
      <div className="fs-32 fw-700">Set Your Profile</div>

      <div>
        {user?.user_type !== 'client' && (
          <StepIndicator className="mt-2">
            Step {currentStep} of 5
          </StepIndicator>
        )}

        {ClientUI()}
        {FreelancerUI()}
      </div>
    </Wrapper>
  );
};

export default CompleteProfile;