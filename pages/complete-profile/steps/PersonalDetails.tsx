import { useState, useCallback, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { StyledFormGroup, FormWrapper } from "./steps.styled";
import { StyledButton } from "@/components/forms/Buttons";
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
              className="profile__img pointer"
              onClick={() => setShowEditPictureModal((prev) => !prev)}
            >
              <img
                className="img"
                src={formState?.user_image || "/images/default_avatar.png"}
                alt="freelancer-profile"
              />
              <div className="edit-picture-btn flex items-center justify-center">
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
            <StyledFormGroup>
              <div className="fs-sm font-normal mb-2">
                <b className="fs-18">
                  Headline
                  <span className="mandatory">&nbsp;*</span>
                </b>
                <p className="fs-base mt-2 mb-0 text-justify text-secondary">
                  Your headline should introduce your work as a freelancer. When
                  clients search for freelancers, they&apos;ll see it directly under
                  your name as a personal subtitle or slogan.
                </p>
                {seeMore && (
                  <p className="fs-base mb-0 mt-2 text-justify text-secondary">
                    The simplest way to introduce yourself would be to mention
                    your job title (&quot;Ghostwriter&quot; or &quot;Accountant&quot;).
                    Alternatively, you could list your freelancing skills
                    (&quot;Photoshop | Adobe | FinalCut Pro&quot;). Or you could even use
                    a tagline that makes it clear what you do (&quot;Editing You Can
                    Count On&quot;).
                  </p>
                )}
                <SeeMore onClick={() => setSeeMore((prev) => !prev)}>
                  {seeMore ? "See Less" : "See More"}
                </SeeMore>
              </div>
              <Form.Control
                placeholder="Add a tagline to introduce what you do professionally"
                className="form-input"
                value={formState?.job_title || ""}
                onChange={(e) => handleChange("job_title", e.target.value)}
                maxLength={150}
              />
              <div className="character-counter">
                {150 - countCharactersWithoutSpaces(formState?.job_title)}/150
                characters
              </div>
              {errors?.job_title && <ErrorMessage message={errors.job_title} />}
            </StyledFormGroup>
          </Col>
        </Row>

        <Row>
          <Col>
            <StyledFormGroup>
              <div className="fs-sm font-normal">
                <b className="fs-18">Hourly Rate</b> (Optional)
                <p className="fs-base mt-2 mb-0 text-justify text-secondary">
                  If you have a standard hourly rate for your services, share it
                  here. If you charge different hourly rates for different
                  projects or if you do not have a standard rate, leave this
                  section blank.
                </p>
              </div>
              <span className="input-symbol-euro">
                <Form.Control
                  placeholder="Enter your hourly rate"
                  className="form-input rate-input"
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
              </span>
              {errors?.hourly_rate && (
                <ErrorMessage message={errors.hourly_rate} />
              )}
            </StyledFormGroup>
          </Col>
        </Row>
      </>
    );
    /* END ------------------------------------------- Freelancer */
  };

  return (
    <FormWrapper className="flex flex-col">
      <Container className="mt-3 px-0">{UI()}</Container>

      {!client && (
        <div className="flex justify-center justify-content-md-end gap-3">
          <StyledButton variant="dark" onClick={skipForNow}>
            Skip
          </StyledButton>
          <StyledButton variant="primary" onClick={validate}>
            Next
          </StyledButton>
        </div>
      )}
    </FormWrapper>
  );
};

export default PersonalDetails;
