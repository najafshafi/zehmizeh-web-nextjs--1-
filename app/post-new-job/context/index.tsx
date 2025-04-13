"use client";
import useClientProfile from "@/controllers/useClientProfile";
import { POST_JOB_OPTIONS } from "@/helpers/const/postJobOptions";
import useStartPageFromTop from "@/helpers/hooks/useStartPageFromTop";
import { getJobDetails, inviteFreelancer } from "@/helpers/http/jobs";
import { postAJob } from "@/helpers/http/post-job";
import { TJobDetails } from "@/helpers/types/job.type";
import { convertToTitleCase } from "@/helpers/utils/misc";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
// Define TEditJobTemplatePathParams directly since we're migrating from React Router
export interface TEditJobTemplatePathParams {
  id?: string;
  type?: string;
}
import {
  AddEditTemplate,
  TAddEditTemplatePayload,
  manageTemplate,
} from "@/helpers/http/templates";
import { CONSTANTS, POST_JOB_STEPS } from "@/helpers/const/constants";
import { useIsAllowedToPostProject } from "@/helpers/hooks/useIsAllowedToPostProject";
import { StyledModal } from "@/components/styled/StyledModal";
import { StyledButton } from "@/components/forms/Buttons";
import { editUser } from "@/helpers/http/auth";

type TContextType = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  formData: Partial<TJobDetails> & { is_draft: 0 | 1 };
  setFormData: (data: Partial<TContextType["formData"]>) => void;
  errors: Partial<
    Record<keyof TContextType["formData"], string> & { categories: string } & {
      budget: {
        type: string;
        amount: string;
        min_amount: string;
        max_amount: string;
        isProposal: false;
      };
    }
  >;
  setErrors: React.Dispatch<React.SetStateAction<TContextType["errors"]>>;
  selectedOption: (typeof POST_JOB_OPTIONS)[number]["key"];
  setSelectedOption: React.Dispatch<
    React.SetStateAction<TContextType["selectedOption"]>
  >;
  selectedPost: Partial<TJobDetails> | undefined;
  setSelectedPost: React.Dispatch<
    React.SetStateAction<TContextType["selectedPost"]>
  >;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handlePostJob: (visibility?: "public" | "hidden") => void;
  handleSaveAsDraft: () => void;
  proposalExistModal: boolean;
  setProposalExistModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddEditTemplate: () => void;
  restructureFormDataFromExistingData: (
    data: Partial<TJobDetails>
  ) => Partial<TContextType["formData"]>;
  isImageUploading: boolean;
  setIsImageUploading: React.Dispatch<React.SetStateAction<boolean>>;
};

const initialState: TContextType = {
  step: -1,
  setStep: () => {
    //
  },
  formData: {
    job_title: "",
    job_description: "",
    skills: [],
    due_date: "",
    preferred_location: [],
    time_scope: "",
    expected_delivery_date: "",
    languages: [],
    attachments: [],
    budget: {
      type: "fixed",
      amount: 0,
      min_amount: 0,
      max_amount: 0,
      isProposal: false,
    },
    is_draft: 0,
    job_post_id: "",
    reference_attachments: [],
    reference_links: [],
  },
  setFormData: () => {
    //
  },
  errors: {},
  setErrors: () => {
    //
  },
  selectedOption: "new-job",
  setSelectedOption: () => {
    //
  },
  selectedPost: undefined,
  setSelectedPost: () => {
    //
  },
  isLoading: false,
  setIsLoading: () => {
    //
  },
  handlePostJob: () => {
    //
  },
  handleSaveAsDraft: () => {
    //
  },
  proposalExistModal: false,
  setProposalExistModal: () => {
    //
  },
  handleAddEditTemplate: () => {
    //
  },
  restructureFormDataFromExistingData: (data) => {
    return data;
  },
  isImageUploading: false,
  setIsImageUploading: () => {
    //
  },
};

const PostJobContext = createContext(initialState);

interface PostJobContextProviderProps {
  children: React.ReactNode;
  params: TEditJobTemplatePathParams;
}

const PostJobContextProvider = ({
  children,
  params,
}: PostJobContextProviderProps) => {
  // Access params properties directly since they're not actually a Promise in this component
  // In Next.js App Router, params might be a Promise in server components but not in client components
  const { id, type } = params;

  // Next.js doesn't have a useBlocker equivalent, we'll handle this differently
  const [isNavigationBlocked, setIsNavigationBlocked] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const freelancerId = searchParams?.get("freelancerId") || "";
  const freelancerName = searchParams?.get("freelancerName") || "";

  const { profileData, refetchData } = useClientProfile();

  /* START ----------------------------------------- React states */
  const [step, setStep] = useState<TContextType["step"]>(initialState.step);
  const [formData, setForm] = useState<TContextType["formData"]>(
    initialState.formData
  );
  const [selectedOption, setSelectedOption] = useState<
    TContextType["selectedOption"]
  >(POST_JOB_OPTIONS[0].key);
  const [selectedPost, setSelectedPost] = useState<
    TContextType["selectedPost"]
  >(initialState.selectedPost);
  const [isLoading, setIsLoading] = useState(initialState.isLoading);
  const [proposalExistModal, setProposalExistModal] = useState(
    initialState.proposalExistModal
  );
  const [errors, setErrors] = useState<TContextType["errors"]>({});
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  /* END ------------------------------------------- React states */

  // To store function which need to be called if user selects continue in confirmation modal
  const confirmationModalCallbackRef = useRef<(() => void) | undefined>(
    undefined
  );

  const setFormData = useCallback((data: Partial<typeof formData>) => {
    setForm((prev) => ({ ...prev, ...data }));
  }, []);

  useStartPageFromTop();
  const { isAllowedToPostProject, cardExpirationErrorMessage } =
    useIsAllowedToPostProject();

  /* START ----------------------------------------- Checking client has added payment method or card is not expired */
  useEffect(() => {
    if (!isAllowedToPostProject) {
      toast.error(
        "In order to post a project, add payment method to your profile."
      );
    }

    if (cardExpirationErrorMessage) {
      toast.error(cardExpirationErrorMessage);
    }
  }, [isAllowedToPostProject, cardExpirationErrorMessage]);
  /* END ------------------------------------------- Checking client has added payment method or card is not expired */

  useEffect(() => {
    if (step === -1) setFormData(initialState.formData);
  }, [setFormData, step]);

  /* START ----------------------------------------- Get details of job/template */
  const getDetails = () => {
    let promise = null;
    if (type === "job" && id) {
      // If it's edit job
      promise = getJobDetails(id);
    } else if (type === "template" && id) {
      // If it is edit Template
      promise = manageTemplate({
        action: "get_template_detail",
        post_template_id: id,
      });
    }
    if (promise) {
      // If it is edit job / template
      setIsLoading(true);
      promise.then((res) => {
        if (res.data) {
          const newFormData = restructureFormDataFromExistingData(res?.data);
          setForm({ ...initialState.formData, ...newFormData });
          setIsLoading(false);
        }
      });
    }
  };

  useEffect(() => {
    getDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* END ------------------------------------------- Get details of job/template */

  useEffect(() => {
    if (type) {
      setStep(POST_JOB_STEPS.PROJECT_DESCRIPTION.number);
    }
  }, [type]);

  /* START ----------------------------------------- Navigation callback after api finish */
  const navigationCallback = () => {
    let navigateLink = "/search?type=freelancers";
    if (
      Number(profileData?.settings?.do_not_show_post_project_modal || 0) !== 1
    ) {
      navigateLink = navigateLink.concat(
        `#${CONSTANTS.PROJECT_POSTED_HASH_VALUE}`
      );
    }
    router.push(navigateLink);
  };

  /* END ------------------------------------------- Navigation callback after api finish */

  const updatePostedProjectCountInSettings = async () => {
    try {
      /* START ----------------------------------------- Update user api call */
      // if posted_project_count is less than 5 and do not show post project modal again is not 1 then
      // calling api to increment posted project value
      // else navigating user without api call
      if (
        Number(profileData?.settings?.posted_project_count || 0) <
          CONSTANTS.VALUE_TO_SHOW_POSTED_PROJECT_MODAL_CHECKBOX &&
        Number(profileData?.settings?.do_not_show_post_project_modal || 0) !== 1
      ) {
        await editUser({
          settings: {
            posted_project_count:
              Number(profileData?.settings?.posted_project_count || 0) + 1,
          },
        });
        refetchData();
        navigationCallback();
      } else {
        navigationCallback();
      }
      /* END ------------------------------------------- Update user api call */
    } catch (error) {
      navigationCallback();
      // eslint-disable-next-line no-console
      console.error("Updated posted project count:", error);
    }
  };

  const restructureFormDataFromExistingData = (data: Partial<TJobDetails>) => {
    const newFormData: Partial<typeof formData> = {};
    Object.keys(formData).forEach((item) => {
      /* START ----------------------------------------- Setting budget min and max value from amount */
      const key = item as keyof typeof formData;
      const minOrMaxAmountLessThan1 =
        Number(data?.budget?.min_amount || "") <= 1 ||
        Number(data?.budget?.max_amount || "") <= 1;

      const amountOrMaxAmountExist =
        Number(data?.budget?.amount) > 1 ||
        Number(data?.budget?.max_amount) > 1;

      if (
        key === "budget" &&
        amountOrMaxAmountExist &&
        minOrMaxAmountLessThan1 &&
        data.budget
      ) {
        let amount = 0;

        if (Number(data.budget.amount) > 1) amount = Number(data.budget.amount);

        if (Number(data.budget.max_amount) > 1)
          amount = Number(data.budget.max_amount);

        const newBudget: TJobDetails["budget"] = {
          ...data.budget,
          min_amount: amount,
          max_amount: amount,
        };
        newFormData.budget = newBudget;
        /* END ------------------------------------------- Setting budget min and max value from amount */
      } else {
        if (key === "is_draft") {
          newFormData.is_draft = data?.status === "draft" ? 1 : 0;
        } else if (
          ![null, undefined].includes(data[key as keyof typeof data] as any)
        ) {
          (newFormData as any)[key] = data[key as keyof typeof data];
        }
      }
    });
    return newFormData;
  };

  const handlePostJob: TContextType["handlePostJob"] = (visibility) => {
    const body = { ...formData };

    if (!body.is_draft || body.is_draft === 1) {
      body.is_draft = 0;
    }

    if (body?.budget?.type === "fixed") {
      body.budget = {
        ...body.budget,
        amount: body.budget?.amount || 0,
      };
    } else {
      if (body.budget && "amount" in body.budget) {
        delete body.budget.amount;
      }
    }

    body.due_date = body.due_date ? body.due_date : "";

    /* START ----------------------------------------- Get job id */
    if (selectedPost?.job_post_id) {
      body.job_post_id = selectedPost.job_post_id;
    }
    if (id) body.job_post_id = id;
    if (!body?.job_post_id) delete body.job_post_id;
    /* END ------------------------------------------- Get job id */

    // Converting job title to title case
    if (body?.job_title) {
      body.job_title = convertToTitleCase(body.job_title);
    }

    if (visibility) {
      body.is_hidden = visibility === "hidden" ? 1 : 0;
    }

    setIsLoading(true);
    toast.loading("Posting a project...");
    postAJob(body)
      .then(async (res) => {
        if (res.status) {
          if (freelancerId && freelancerName) {
            handleInviteFreelancer({
              freelancerId,
              freelancerName,
              jobId: res.id,
            });
          } else {
            // If project is not edit and not posted as draft then navigating to find freelancers page
            // else navigating to job details page
            const isEdit = formData.is_draft === 0 && id;
            if (body.is_draft === 0 && !isEdit) {
              await updatePostedProjectCountInSettings();
            } else {
              router.push(`/client-job-details/${res.id}`);
            }
          }
          toast.success(res.response);
        } else {
          toast.error(res.response);
        }
        toast.dismiss();
        setIsLoading(false);
      })
      .catch((err) => {
        toast.dismiss();
        // eslint-disable-next-line no-console
        console.error("Post job->", err);
        toast.error("Something went wrong while posting job");
        setIsLoading(false);
      });
  };

  const handleInviteFreelancer = ({
    freelancerId,
    freelancerName,
    jobId,
  }: {
    freelancerId: string;
    freelancerName: string;
    jobId: string;
  }) => {
    const body = {
      job_post_id: jobId,
      freelancer_user_id: [freelancerId],
    };
    toast.loading(
      "The project is posted. Inviting the selected freelancer(s)…"
    );
    setIsLoading(true);
    inviteFreelancer(body)
      .then((res) => {
        toast.dismiss();
        if (res.message === "PROPOSAL_EXIST") {
          setProposalExistModal(true);
          setSelectedPost({ job_post_id: jobId });
          return;
        }
        toast.dismiss();
        setIsLoading(false);
        if (res.status) {
          toast.success(`Invitation to ${freelancerName} sent successfully!`);
          router.push(`/client-job-details/${jobId}`);
        } else {
          toast.error(
            res?.message ? res?.message : "Invitation not sent successfully!"
          );
        }
      })
      .catch((err) => {
        toast.dismiss();
        toast.error(err + "");
        setIsLoading(false);
      });
  };

  const handleSaveAsDraft = () => {
    const body = { ...formData };

    body.is_draft = 1;
    body.due_date = body.due_date || "";
    if (body?.budget?.type === "fixed") {
      body.budget = {
        ...body.budget,
        amount: body?.budget?.amount || 0,
      };
    } else {
      if (body.budget && "amount" in body.budget) {
        delete body.budget.amount;
      }
    }

    /* START ----------------------------------------- Get job id */
    if (selectedPost?.job_post_id) {
      body.job_post_id = selectedPost.job_post_id;
    }
    if (id) body.job_post_id = id;
    if (!body?.job_post_id) delete body.job_post_id;
    /* END ------------------------------------------- Get job id */

    // Converting job title to title case
    if (body?.job_title) {
      body.job_title = convertToTitleCase(body.job_title);
    }

    setIsLoading(true);
    toast.loading("Saving as draft...");

    postAJob(body)
      .then((res) => {
        toast.dismiss();
        if (res.status) {
          toast.success(res.response);
        } else {
          toast.error(res.response);
        }
        setIsLoading(false);
        router.push(`/client-job-details/${res.id}`);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error("Save draft->", error);
        toast.dismiss();
        toast.error("Something went wrong while saving draft");
        setIsLoading(false);
      });
  };

  const handleAddEditTemplate = () => {
    const body: TAddEditTemplatePayload = {
      ...formData,
      post_template_id: id || "",
      action: "add_template",
    };

    if (body.budget?.isProposal) {
      body.budget.isProposal = true;
    }

    if (!body.expected_delivery_date) delete body.expected_delivery_date;

    if (body?.budget?.type === "fixed") {
      if (body.budget?.isProposal) {
        body.budget = {
          type: "fixed",
          amount: body?.budget?.amount || 0,
          isProposal: true,
        };
      } else {
        body.budget = {
          ...body.budget,
          amount: body?.budget?.amount || 0,
        };
      }
    } else {
      if (body.budget && "amount" in body.budget) {
        delete body.budget.amount;
      }
    }

    if (!body.due_date) {
      body.due_date = "";
    }

    if (type !== "create") {
      body.action = "edit_template";
    } else {
      if (body.post_template_id) {
        const { post_template_id, ...restBody } = body;
        Object.assign(body, restBody);
      }
      body.action = "add_template";
    }

    setIsLoading(true);
    const promise = AddEditTemplate(body);
    toast.promise(promise, {
      loading: "Loading...",
      success: (res) => {
        router.push(id ? `/template-details/${id}` : "/client-jobs");
        setIsLoading(false);
        return res.response || res.message;
      },
      error: (err) => {
        setIsLoading(false);
        return err?.response?.data?.message || "error";
      },
    });
  };

  // It checks if image is uploading or not
  // if uploading then show confirmation modal and store function passed in argument to be called using ref
  // else calls the function passed in argument
  const imageUploadChecker = (callback: () => void) => {
    if (isImageUploading) {
      setShowConfirmationModal(true);
      confirmationModalCallbackRef.current = callback;
      return;
    }
    callback();
  };

  // Confirmation modal to stop user from navigating away when files are uploading
  const navigateAwayConfirmationModal = (
    <StyledModal
      maxwidth={718}
      show={showConfirmationModal || isNavigationBlocked}
      size="lg"
      centered
    >
      <div className="p-4">
        <div className="text-center">
          <h5 className="text-lg font-medium mb-4">
            File upload in progress. Leaving this page will interrupt the
            upload. Do you want to continue?
          </h5>
          <div className="mt-4 flex justify-center gap-4">
            <StyledButton
              className="text-base font-normal"
              variant="secondary"
              padding="0.8125rem 2rem"
              onClick={() => {
                setIsNavigationBlocked(false);
                setShowConfirmationModal(false);
                confirmationModalCallbackRef.current = undefined;
              }}
            >
              Cancel
            </StyledButton>
            <StyledButton
              className="text-base font-normal"
              variant="danger"
              padding="0.8125rem 2rem"
              onClick={() => {
                setIsNavigationBlocked(false);
                confirmationModalCallbackRef.current?.();
                setShowConfirmationModal(false);
                confirmationModalCallbackRef.current = undefined;
              }}
            >
              Confirm
            </StyledButton>
          </div>
        </div>
      </div>
    </StyledModal>
  );

  if (!isAllowedToPostProject) {
    router.push("/client/account/payments");
    return null;
  }

  return (
    <PostJobContext.Provider
      value={{
        step,
        setFormData,
        setStep: (value) => {
          imageUploadChecker(() => setStep(value));
        },
        formData,
        errors,
        setErrors,
        selectedOption,
        setSelectedOption,
        isLoading,
        selectedPost,
        setIsLoading,
        setSelectedPost,
        handlePostJob,
        handleSaveAsDraft: () => {
          imageUploadChecker(() => handleSaveAsDraft());
        },
        proposalExistModal,
        setProposalExistModal,
        handleAddEditTemplate,
        restructureFormDataFromExistingData,
        isImageUploading,
        setIsImageUploading,
      }}
    >
      {children}
      {navigateAwayConfirmationModal}
    </PostJobContext.Provider>
  );
};

function usePostJobContext() {
  return useContext(PostJobContext);
}

export { PostJobContextProvider, usePostJobContext };
