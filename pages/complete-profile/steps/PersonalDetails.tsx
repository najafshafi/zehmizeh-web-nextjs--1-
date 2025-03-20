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

type Props = {
  onUpdate: (data: Partial<IClientDetails & IFreelancerDetails>) => void;
  profileData?: Partial<IClientDetails & IFreelancerDetails>;
  client?: boolean;
  skipForNow: () => void;
};

const PersonalDetails = ({
  onUpdate,
  profileData,
  client = false,
  skipForNow,
}: Props) => {
  const [formState, setFormState] = useState(profileData);
  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof profileData, string>>
  >({});
  const [seeMore, setSeeMore] = useState(false);
  const [showEditPictureModal, setShowEditPictureModal] = useState(false);

  useEffect(() => {
    setFormState(profileData);
  }, [profileData]);

  const handleChange = useCallback((field: keyof typeof profileData, value) => {
    setFormState((prevFormState) => {
      return { ...prevFormState, [field]: value };
    });
  }, []);

  const validate = () => {
    setErrors({});
    completeProfilePersonalDetailsValidation
      .validate(formState, { abortEarly: false })
      .then(() => {
        setErrors({});
        onUpdate(formState);
      })
      .catch((err) => {
        const errors = getYupErrors(err);
        setErrors({ ...errors });
      });
  };

  const countCharactersWithoutSpaces = (text) => {
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
              profilePic={formState?.user_image || null}
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
                  clients search for freelancers, they'll see it directly under
                  your name as a personal subtitle or slogan.
                </p>
                {seeMore && (
                  <p className="fs-base mb-0 mt-2 text-justify text-secondary">
                    The simplest way to introduce yourself would be to mention
                    your job title (“Ghostwriter” or “Accountant”).
                    Alternatively, you could list your freelancing skills
                    (“Photoshop | Adobe | FinalCut Pro”). Or you could even use
                    a tagline that makes it clear what you do (“Editing You Can
                    Count On”).
                  </p>
                )}
                <SeeMore onClick={() => setSeeMore((prev) => !prev)}>
                  {seeMore ? "See Less" : "See More"}
                </SeeMore>
              </div>
              <Form.Control
                placeholder="Add a tagline to introduce what you do professionally"
                className="form-input"
                value={formState?.job_title}
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
                  value={formState?.hourly_rate}
                  onChange={(e) =>
                    handleChange(
                      "hourly_rate",
                      e.target.value.replace(/\D/g, "")
                    )
                  }
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
    <FormWrapper className="flex flex-column">
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
