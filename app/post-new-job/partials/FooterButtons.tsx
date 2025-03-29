"use client";
import { StyledButton } from "@/components/forms/Buttons";
import useResponsive from "@/helpers/hooks/useResponsive";
import { usePostJobContext } from "../context";
import toast from "react-hot-toast";
import { POST_JOB_STEPS } from "@/helpers/const/constants";
import {
  projectDescriptionStepValidation,
  projectPaymentStepValidation,
  projectPreferenceStepValidation,
  projectSkillsStepValidation,
  projectTimingStepValidation,
} from "@/helpers/validation/postJobStepsValidation";
import { getYupErrors } from "@/helpers/utils/misc";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { PostVisibilityModal } from "../modals/PostVisibilityModal";

interface FooterButtonsProps {
  params?: { id?: string; type?: string };
}

export const FooterButtons = ({ params }: FooterButtonsProps = {}) => {
  const router = useRouter();
  const { isMobile } = useResponsive();

  const {
    step,
    setErrors,
    setStep,
    selectedOption,
    selectedPost,
    formData,
    setFormData,
    handlePostJob,
    handleSaveAsDraft,
    handleAddEditTemplate,
    isLoading,
    restructureFormDataFromExistingData,
  } = usePostJobContext();

  const [isPostVisibilityModalOpen, setIsPostVisibilityModalOpen] =
    useState(false);

  const isLastPage = step === POST_JOB_STEPS.PROJECT_PAYMENT.number;

  // Using any here for compatibility with getYupErrors
  const handleError = (err: any) => {
    const errors = getYupErrors(err);
    toast.error("Missing required details");
    setErrors({ ...errors });
  };

  const validation = (manualStep?: number) => {
    switch (manualStep ?? step) {
      case POST_JOB_STEPS.CHOOSE_TEMPLATE_OR_DRAFT.number:
        if (!selectedPost && ["draft", "template"].includes(selectedOption)) {
          toast.error("Please select a template.");
          return false;
        }
        if (["draft", "template"].includes(selectedOption) && step === 0) {
          if (selectedPost) {
            const newFormData =
              restructureFormDataFromExistingData(selectedPost);
            setFormData({ ...newFormData });
          }
        }
        return true;
      case POST_JOB_STEPS.PROJECT_DESCRIPTION.number:
        try {
          projectDescriptionStepValidation.validateSync(formData, {
            abortEarly: false,
          });
          return true;
        } catch (error) {
          handleError(error);
          return false;
        }
      case POST_JOB_STEPS.SKILLS.number:
        try {
          projectSkillsStepValidation.validateSync(formData, {
            abortEarly: false,
          });
          return true;
        } catch (error) {
          handleError(error);
          return false;
        }
      case POST_JOB_STEPS.PROJECT_TIMING.number:
        try {
          projectTimingStepValidation.validateSync(formData, {
            abortEarly: false,
          });
          return true;
        } catch (error) {
          handleError(error);
          return false;
        }
      case POST_JOB_STEPS.PROJECT_PREFERENCES.number:
        try {
          projectPreferenceStepValidation.validateSync(formData, {
            abortEarly: false,
          });
          return true;
        } catch (error) {
          handleError(error);
          return false;
        }
      case POST_JOB_STEPS.PROJECT_PAYMENT.number:
        try {
          projectPaymentStepValidation.validateSync(formData, {
            abortEarly: false,
          });
          return true;
        } catch (error) {
          handleError(error);
          return false;
        }
      default:
        return true;
    }
  };

  const onNext = (visibility?: "public" | "hidden") => {
    if (!validation()) return;

    // Validating all steps when submitting post
    if (isLastPage) {
      const failedStep = Object.values(POST_JOB_STEPS).find((step) => {
        return !validation(step.number);
      });
      if (failedStep) {
        setStep(failedStep.number);
        return;
      }
    }

    setErrors({});

    if (isLastPage) {
      const type = params?.type;
      const id = params?.id;

      if (type === "create" || type === "template") {
        handleAddEditTemplate();
      } else {
        /* START ----------------------------------------- If post visibility isnt there then open modal and get confirmation */
        // else post job if value is there
        if (type === "job" && id && formData.is_draft === 0) {
          handlePostJob();
        } else {
          if (!visibility) setIsPostVisibilityModalOpen(true);
          else handlePostJob(visibility);
        }
        /* END ------------------------------------------- If post visibility isnt there then open modal and get confirmation */
      }
    } else {
      setStep((prev) => {
        if (prev === -1) {
          if (selectedOption === "new-job")
            return POST_JOB_STEPS.PROJECT_DESCRIPTION.number;
          else return POST_JOB_STEPS.CHOOSE_TEMPLATE_OR_DRAFT.number;
        }
        if (prev < POST_JOB_STEPS.PROJECT_PAYMENT.number) return prev + 1;
        else return -1;
      });
    }
  };

  const onPrevious = () => {
    setStep((prev) => {
      if (
        prev >= POST_JOB_STEPS.CHOOSE_TEMPLATE_OR_DRAFT.number &&
        ["draft", "template"].includes(selectedOption)
      )
        return prev - 1;
      if (
        prev === POST_JOB_STEPS.PROJECT_DESCRIPTION.number &&
        selectedOption === "new-job"
      )
        return prev - 2;
      if (
        prev > POST_JOB_STEPS.PROJECT_DESCRIPTION.number &&
        selectedOption === "new-job"
      )
        return prev - 1;
      return prev;
    });
  };

  const nextButtonText = useMemo(() => {
    const type = params?.type;
    const id = params?.id;

    if (isLastPage) {
      if (
        type === "template" ||
        type === "create" ||
        (type === "job" && id && formData.is_draft === 0)
      ) {
        return "Save";
      }
      return "Post Project";
    }
    return "Next Step";
  }, [params, formData.is_draft, isLastPage]);

  const MiddleButtonUI = () => {
    const type = params?.type;

    if (
      type === "template" ||
      type === "create" ||
      (type === "job" && formData.is_draft === 0)
    ) {
      return <></>;
    }
    if (
      step === POST_JOB_STEPS.CHOOSE_TEMPLATE_OR_DRAFT.number &&
      selectedOption === "template"
    ) {
      return (
        <StyledButton
          padding="1.125rem 2.25rem"
          variant="outline-dark"
          disabled={isLoading}
          onClick={() => {
            router.push("/template/create");
          }}
          className={isMobile ? "w-full" : ""}
        >
          Create New Template
        </StyledButton>
      );
    }
    if (step > POST_JOB_STEPS.CHOOSE_TEMPLATE_OR_DRAFT.number) {
      return (
        <StyledButton
          padding="1.125rem 2.25rem"
          variant="outline-dark"
          disabled={isLoading}
          onClick={() => {
            if (!validation()) return;

            // Validating first page because it is necessary to save draft
            if (!validation(POST_JOB_STEPS.PROJECT_DESCRIPTION.number)) {
              setStep(POST_JOB_STEPS.PROJECT_DESCRIPTION.number);
              return;
            }

            setErrors({});
            handleSaveAsDraft();
          }}
          className={isMobile ? "w-full" : ""}
        >
          Save as Draft
        </StyledButton>
      );
    }
    return <></>;
  };

  return (
    <div
      className="flex flex-wrap buttons justify-center gap-4"
      style={{ marginTop: "3rem" }}
    >
      {step >= POST_JOB_STEPS.CHOOSE_TEMPLATE_OR_DRAFT.number && (
        <StyledButton
          padding="1.125rem 2.25rem"
          variant="outline-dark"
          disabled={isLoading}
          onClick={onPrevious}
          className={isMobile ? "w-full" : ""}
        >
          Previous
        </StyledButton>
      )}
      {MiddleButtonUI()}
      <StyledButton
        padding="1.125rem 2.25rem"
        disabled={isLoading}
        onClick={() => onNext()}
        className={isMobile ? "w-full" : ""}
      >
        {nextButtonText}
      </StyledButton>
      <PostVisibilityModal
        isLoading={isLoading}
        show={isPostVisibilityModalOpen}
        onCloseModal={() => setIsPostVisibilityModalOpen(false)}
        handleClick={(value) => onNext(value)}
      />
    </div>
  );
};
