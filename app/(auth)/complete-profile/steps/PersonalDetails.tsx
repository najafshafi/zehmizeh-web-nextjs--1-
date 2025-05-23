import { useState, useCallback, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";

import ErrorMessage from "@/components/ui/ErrorMessage";
import { getYupErrors } from "@/helpers/utils/misc";
import EditPictureModal from "@/components/ui/EditPictureModal";
import EditBlueIcon from "@/public/icons/edit-blue-outline.svg";
import { editUser } from "@/helpers/http/auth";
import toast from "react-hot-toast";
import { SeeMore } from "@/components/ui/SeeMore";
import { IClientDetails } from "@/helpers/types/client.type";
import { IFreelancerDetails } from "@/helpers/types/freelancer.type";
import { completeProfilePersonalDetailsValidation } from "@/helpers/validation/completProfileValidation";
import CustomButton from "@/components/custombutton/CustomButton";

// Profile data contains fields from both client and freelancer interfaces
type ProfileDataType = Partial<IClientDetails & IFreelancerDetails>;

// Define error record type that matches what getYupErrors returns
interface ErrorRecordValue {
  [key: string]: string | ErrorRecordValue;
}

type ErrorRecord = Record<string, string | ErrorRecordValue>;

type Props = {
  onUpdate: (data: ProfileDataType) => void;
  profileData?: ProfileDataType;
  client?: boolean;
  skipForNow: () => void;
};

const PersonalDetails = ({
  onUpdate,
  profileData,
  client = false,
  skipForNow,
}: Props) => {
  const [formState, setFormState] = useState<ProfileDataType>(
    profileData || {}
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [seeMore, setSeeMore] = useState(false);
  const [showEditPictureModal, setShowEditPictureModal] = useState(false);

  useEffect(() => {
    if (profileData) {
      setFormState(profileData);
    }
  }, [profileData]);

  const handleChange = useCallback(
    <K extends keyof ProfileDataType>(field: K, value: ProfileDataType[K]) => {
      setFormState((prevFormState) => {
        return { ...prevFormState, [field]: value };
      });
    },
    []
  );

  const validate = () => {
    setErrors({});
    completeProfilePersonalDetailsValidation
      .validate(formState, { abortEarly: false })
      .then(() => {
        setErrors({});
        onUpdate(formState);
      })
      .catch((err) => {
        const errorData = getYupErrors(err);
        // Convert the error data to the expected format
        const formattedErrors: Record<string, string> = {};

        // Extract string error messages for each field
        Object.entries(errorData).forEach(([key, value]) => {
          if (typeof value === "string") {
            formattedErrors[key] = value;
          } else if (value && typeof value === "object") {
            // Handle nested errors if needed
            const nestedValue = value as Record<string, string>;
            Object.entries(nestedValue).forEach(([nestedKey, nestedValue]) => {
              if (typeof nestedValue === "string") {
                formattedErrors[`${key}.${nestedKey}`] = nestedValue;
              }
            });
          }
        });

        setErrors(formattedErrors);
      });
  };

  const countCharactersWithoutSpaces = (text: string = "") => {
    return text.replace(/\s+/g, "").length;
  };

  const handleImageChange = (uploadedUrl: string) => {
    handleChange("user_image", uploadedUrl);

    const body = {
      user_image: uploadedUrl,
    };

    const promise = editUser(body);

    toast.promise(promise, {
      loading: "Updating your details - please wait...",
      success: (res: { message: string }) => {
        setShowEditPictureModal(false);
        return res.message;
      },
      error: (err) => {
        return err?.response?.data?.message || "error";
      },
    });
  };

  const UI = () => {
    /* START ----------------------------------------- Client */
    if (client) {
      return (
        <>
          <div className="fs-sm font-normal mb-3">
            <b className="fs-18">Profile Pic</b> (Optional)
            <p className="mt-2 mb-0 text-justify fs-18 font-normal">
              To make your profile even more personable, you can add a profile
              pic. Some users share a photo of their face, but it is also common
              to share your professional logo or a cartoon avatar instead.
            </p>
          </div>
          <div className="flex justify-center">
            <div
              className="relative h-[9.5625rem] w-[9.5625rem] rounded-full border border-[#DDDDDD] cursor-pointer"
              onClick={() => setShowEditPictureModal((prev) => !prev)}
            >
              <img
                className="img h-full w-full rounded-full object-cover"
                src={formState?.user_image || "/images/default_avatar.png"}
                alt="freelancer-profile"
              />
              <div className="absolute bg-[#f7faff] h-10 w-10 rounded-full bottom-0 right-0 transition-all duration-300 flex items-center justify-center">
                <EditBlueIcon />
              </div>
            </div>
            <EditPictureModal
              show={showEditPictureModal}
              onUpdate={handleImageChange}
              onClose={() => setShowEditPictureModal((prev) => !prev)}
              profilePic={formState?.user_image || undefined}
            />
          </div>
        </>
      );
    }
    /* END ------------------------------------------- Client */

    /* START ----------------------------------------- Freelancer */
    return (
      <>
        <Row>
          <Col>
            <div className="mt-5">
              <div className="fs-sm font-normal mb-2">
                <b className="fs-18">
                  Headline
                  <span className="mandatory">&nbsp;*</span>
                </b>
                <p className="fs-base mt-2 mb-0 text-justify text-gray-500">
                  Your headline should introduce your work as a freelancer. When
                  clients search for freelancers, they&apos;ll see it directly
                  under your name as a personal subtitle or slogan.
                </p>
                {seeMore && (
                  <p className="fs-base mb-0 mt-2 text-justify text-gray-500">
                    The simplest way to introduce yourself would be to mention
                    your job title (&quot;Ghostwriter&quot; or
                    &quot;Accountant&quot;). Alternatively, you could list your
                    freelancing skills (&quot;Photoshop | Adobe | FinalCut
                    Pro&quot;). Or you could even use a tagline that makes it
                    clear what you do (&quot;Editing You Can Count On&quot;).
                  </p>
                )}
                <SeeMore onClick={() => setSeeMore((prev) => !prev)}>
                  {seeMore ? "See Less" : "See More"}
                </SeeMore>
              </div>
              <Form.Control
                placeholder="Add a tagline to introduce what you do professionally"
                className="mt-1.5 p-4 px-5 rounded-[7px] border border-[#d9d9d9] w-full"
                value={formState?.job_title || ""}
                onChange={(e) => handleChange("job_title", e.target.value)}
                maxLength={150}
              />
              <div className="text-right text-[#f2b420] mt-2.5">
                {150 - countCharactersWithoutSpaces(formState?.job_title)}/150
                characters
              </div>
              {errors?.job_title && <ErrorMessage message={errors.job_title} />}
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            <div className="mt-5">
              <div className="fs-sm font-normal">
                <b className="fs-18">Hourly Rate</b> (Optional)
                <p className="fs-base mt-2 mb-0 text-justify text-gray-500">
                  If you have a standard hourly rate for your services, share it
                  here. If you charge different hourly rates for different
                  projects or if you do not have a standard rate, leave this
                  section blank.
                </p>
              </div>
              <span className="relative text-[#606060]">
                <Form.Control
                  placeholder="Enter your hourly rate"
                  className="mt-1.5 p-4 px-5 rounded-[7px] border border-[#d9d9d9] rate-input w-full items-center flex justify-center text-black pl-[1.625rem]"
                  value={
                    formState?.hourly_rate !== undefined
                      ? String(formState.hourly_rate)
                      : ""
                  }
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    handleChange(
                      "hourly_rate",
                      numericValue ? Number(numericValue) : undefined
                    );
                  }}
                  maxLength={3}
                />
                <span className="absolute top-[30%] left-4 ">$</span>
              </span>
              {errors?.hourly_rate && (
                <ErrorMessage message={errors.hourly_rate} />
              )}
            </div>
          </Col>
        </Row>
      </>
    );
    /* END ------------------------------------------- Freelancer */
  };

  return (
    <div className="flex flex-col gap-8">
      <Container className="mt-3 px-0">{UI()}</Container>

      {!client && (
        <div className="flex justify-center md:justify-end gap-4">
          <CustomButton
            text="Skip"
            className="px-8 py-4 transition-transform duration-200 hover:scale-105 font-normal  rounded-full bg-black text-white text-[18px]"
            onClick={skipForNow}
          />

          <CustomButton
            text="Next"
            className="px-8 py-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px]"
            onClick={validate}
          />
        </div>
      )}
    </div>
  );
};

export default PersonalDetails;
