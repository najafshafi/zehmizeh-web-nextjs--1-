"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import PersonalDetails from "./steps/PersonalDetails";
import AboutMe from "./steps/AboutMe";
import Skills from "./steps/Skills";
import Languages from "./steps/Languages";
import { editUser } from "@/helpers/http/auth";
import { useAuth } from "@/helpers/contexts/auth-context";
import { ProfilePhoto } from "./steps/ProfilePhoto";
import { getCategories, getSkills } from "@/helpers/utils/helper";
import { IClientDetails } from "@/helpers/types/client.type";
import { IFreelancerDetails } from "@/helpers/types/freelancer.type";

// Define skill type
interface Skill {
  category_id?: number;
  category_name?: string;
  skill_id?: number;
  skill_name?: string;
  [key: string]: any;
}

// Import the Language type from IFreelancerDetails
type LanguageType = IFreelancerDetails["languages"][0];

// Define a type for profile data
interface ProfileData {
  about_me: string;
  job_title: string;
  user_image: string;
  hourly_rate: number;
  skills: Skill[];
  languages: LanguageType[];
  [key: string]: any; // Index signature to allow string indexing
}

const CompleteProfile = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [profileData, setProfileData] = useState<ProfileData>({
    about_me: "",
    job_title: "",
    user_image: "",
    hourly_rate: 0,
    skills: [],
    languages: [],
  });
  const [updatingProfile, setUpdatingProfile] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const userData: Partial<ProfileData> = {};
    Object.keys(user).forEach((key) => {
      if (
        Object.keys(profileData).includes(key) &&
        user[key as keyof typeof user]
      ) {
        userData[key as keyof ProfileData] = user[key as keyof typeof user];
      }
    });
    setProfileData((prev) => ({ ...prev, ...userData }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const onPrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const goToNextStep = (data: Partial<IClientDetails & IFreelancerDetails>) => {
    // Use type assertion to resolve compatibility issues
    const newProfileData = { ...profileData, ...data } as ProfileData;

    if (user?.user_type === "client") {
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

  const updateClientProfile = (data: ProfileData) => {
    const body = {
      about_me: data.about_me,
    };
    const promise = editUser(body);
    toast.promise(promise, {
      loading: "Updating your details - please wait...",
      success: (res) => {
        router.push("/client/account/profile");
        return res.message;
      },
      error: (err) => {
        return err?.response?.data?.message || "error";
      },
    });
  };

  const updateFreelancerProfile = (newProfileData: ProfileData) => {
    const { user_image, job_title, hourly_rate, about_me, skills, languages } =
      newProfileData;
    setUpdatingProfile(true);

    // Use type assertion to resolve compatibility issues
    const body: any = {
      user_image: user_image || "/images/default_avatar.png",
    };

    if (job_title) body.job_title = job_title;
    if (parseFloat(hourly_rate?.toString()))
      body.hourly_rate = parseFloat(hourly_rate.toString());
    if (about_me) body.about_me = about_me;
    if (skills?.length > 0) body.skills = skills;
    if (languages?.length > 0) body.languages = languages;

    const promise = editUser(body);
    toast.promise(promise, {
      loading: "Updating your details - please wait...",
      success: (res) => {
        setUpdatingProfile(false);
        // Use Next.js router searchParams instead of state
        router.push("/freelancer/account/profile?fromRegister=true");
        return res.message;
      },
      error: (err) => {
        setUpdatingProfile(false);
        return err?.response?.data?.message || "error";
      },
    });
  };

  const skipForNowHandler = () => {
    if (currentStep >= 5) router.push("/freelancer/account/profile");
    else setCurrentStep((stp) => stp + 1);
  };

  // Use type assertion for component props to resolve compatibility issues
  const ClientUI = () => {
    return (
      user?.user_type === "client" && (
        <>
          <div className="mt-2">
            <PersonalDetails
              client={true}
              onUpdate={goToNextStep}
              profileData={profileData as any}
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
            profileData={profileData as any}
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
            languagesProps={profileData?.languages as any}
            skipForNow={skipForNowHandler}
          />
        );
        break;
      case 5:
        Component = (
          <ProfilePhoto
            profileData={profileData as any}
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
      user?.user_type === "freelancer" && (
        <div className="forms mt-4">{Component}</div>
      )
    );
  };

  return (
    <div className="my-5 md:my-12 mx-auto max-w-[678px] shadow-[0px_4px_60px_rgba(0,0,0,0.05)] bg-white rounded-xl md:p-12 p-4 ">
      <div className="text-[32px] font-bold">Set Your Profile</div>

      <div>
        {user?.user_type !== "client" && (
          <div className="mt-2 bg-[#FBF5E8] px-5 py-2.5 rounded-[3rem] w-max">
            Step {currentStep} of 5
          </div>
        )}

        {ClientUI()}
        {FreelancerUI()}
      </div>
    </div>
  );
};

export default CompleteProfile;
