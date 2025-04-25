"use client";

import { ChooseTemplateOrDraft } from "./steps/ChooseTemplateOrDraft";
import ProposalExistsModal from "@/components/invite-flow-modals/ProposalExistsModa";
import { POST_JOB_OPTIONS } from "@/helpers/const/postJobOptions";
import { usePostJobContext } from "./context";
import { ProjectDescription } from "./steps/ProjectDescription";
import { ProjectPayment } from "./steps/ProjectPayment";
import { ProjectPreferences } from "./steps/ProjectPreferences";
import { ProjectTiming } from "./steps/ProjectTiming";
import { Skills } from "./steps/Skills";
import { FooterButtons } from "./partials/FooterButtons";
import { POST_JOB_STEPS } from "@/helpers/const/constants";
import { Stepper } from "@/components/stepper/Stepper";
import useResponsive from "@/helpers/hooks/useResponsive";
import BackButton from "@/components/ui/BackButton";
import { useRouter } from "next/navigation";

export default function PostJob({
  params,
}: {
  params: { id?: string; type?: string };
}) {
  const router = useRouter();
  const {
    step,
    setStep,
    selectedOption,
    setSelectedOption,
    proposalExistModal,
    setProposalExistModal,
    selectedPost,
    setSelectedPost,
  } = usePostJobContext();

  const { isMobile } = useResponsive();

  const handleCancel = () => {
    router.back();
  };

  const ChooseOption = (
    <div className="text-center">
      <p className="md:text-4xl text-3xl font-bold">
        What would you like to do?
      </p>
      <div className="flex justify-center flex-wrap">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {POST_JOB_OPTIONS.map((item) => (
            <div key={item.id} className="flex justify-center items-center">
              <div
                className={`w-[200px] h-[200px] border rounded-[0.875rem] cursor-pointer p-8 m-[1.875rem_0_0_0] transition-all flex flex-col justify-center items-center ${
                  selectedOption === item.key
                    ? "border-3 border-primary"
                    : "border-[#d9d9d9]"
                }`}
                onClick={() => {
                  setSelectedOption(item.key);
                }}
              >
                <div className="icon-style">{item.icon}</div>
                <div className="text-[1.2rem] leading-[1.24rem] tracking-[0.03em] font-normal mt-2">
                  {item.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <FooterButtons params={params} />
    </div>
  );

  const StepUI = () => {
    switch (step) {
      case POST_JOB_STEPS.CHOOSE_TEMPLATE_OR_DRAFT.number:
        return <ChooseTemplateOrDraft />;
      case POST_JOB_STEPS.PROJECT_DESCRIPTION.number:
        return <ProjectDescription />;
      case POST_JOB_STEPS.SKILLS.number:
        return <Skills />;
      case POST_JOB_STEPS.PROJECT_TIMING.number:
        return <ProjectTiming />;
      case POST_JOB_STEPS.PROJECT_PREFERENCES.number:
        return <ProjectPreferences />;
      case POST_JOB_STEPS.PROJECT_PAYMENT.number:
        return <ProjectPayment />;
      default:
        return ChooseOption;
    }
  };

  const HeaderUI = () => {
    const heading = (
      <h1 className="text-[2.3rem] font-bold mt-8 mb-[0.875rem]">
        {Object.values(POST_JOB_STEPS).find((x) => x.number === step)?.label ||
          ""}
      </h1>
    );
    if (step <= 0) return <></>;

    const headingWrapper = (text: string, subText: string = "") => {
      return (
        <div>
          {heading}
          {!!subText && <p>{subText}</p>}
        </div>
      );
    };

    if (params.id || params.type) {
      // if it has job and id then it means its for edit
      if (params.type === "job" && params.id) {
        return headingWrapper(`Edit Project Details - Page ${step}/5`);
      }
      // only template sends type create
      if (params.type === "create") {
        return headingWrapper(`Create Template - Page ${step}/5`);
      }
      // if it has template and id then edit template
      if (params.type === "template" && params.id) {
        return headingWrapper(`Edit Template - Page ${step}/5`);
      }
    }
    if (selectedOption === "new-job") {
      return headingWrapper(`Post Project - Page ${step}/5`);
    }
    if (selectedOption === "draft") {
      return headingWrapper(
        `Edit Draft - Page ${step}/5`,
        "Review the draft. Make any adjustments necessary for your project."
      );
    }
    if (selectedOption === "template") {
      return headingWrapper(
        `Post Template - Page ${step}/5`,
        "Review the template's default settings. Make any adjustments necessary for your project."
      );
    }
    return null;
  };

  // Create a filtered version of steps without CHOOSE_TEMPLATE_OR_DRAFT
  const steps = Object.fromEntries(
    Object.entries(POST_JOB_STEPS).filter(
      ([key]) => key !== "CHOOSE_TEMPLATE_OR_DRAFT"
    )
  ) as typeof POST_JOB_STEPS;

  return (
    <div className="max-w-[719px] mx-auto my-[7.5rem] md:my-[7.5rem] md:mx-auto mobile:my-0 mobile:mt-4">
      <div className="flex justify-between">
        <BackButton className={isMobile ? "ml-3" : ""} />
        <button
          className="text-red-500 rounded px-4 py-2 mr-3 hover:scale-105 transition-all duration-300 hover:bg-secondary hover:text-black"
          onClick={handleCancel}
        >
          Cancel Project Post
        </button>
      </div>

      <div className="bg-white rounded-[17px] p-[4.3125rem_4rem] mobile:bg-body mobile:p-4">
        {step > 0 && (
          <Stepper
            activeStep={step}
            setActiveStep={(value) => setStep(value)}
            steps={Object.values(steps)}
          />
        )}
        {HeaderUI()}
        {StepUI()}
      </div>

      {/* START ----------------------------------------- Proposal exist modal */}
      <ProposalExistsModal
        job_post_id={selectedPost?.job_post_id || ""}
        show={proposalExistModal}
        toggle={() => {
          setSelectedPost({});
          setProposalExistModal((prev) => !prev);
        }}
      />
      {/* END ------------------------------------------- Proposal exist modal */}
    </div>
  );
}
