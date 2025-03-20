import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  Fragment,
} from "react";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import {
  ChevronUpDownIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import Spinner from "@/components/forms/Spin/Spinner";
import toast from "react-hot-toast";
import moment from "moment";
import { useQuery } from "react-query";
import styled from "styled-components";
import TextEditor from "@/components/forms/TextEditor";
import CustomUploader, {
  TCustomUploaderFile,
} from "@/components/ui/CustomUploader";
import { StyledButton } from "@/components/forms/Buttons";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { getYupErrors, numberWithCommas } from "@/helpers/utils/misc";
import { validateProposal } from "@/helpers/validation/common";
import { editProposal, submitProposal } from "@/helpers/http/proposals";
import { getPaymentFees } from "@/helpers/http/common";
import { CONSTANTS } from "@/helpers/const/constants";
import { TProposalDetails } from "@/helpers/types/proposal.type";
import { CSSTransition } from "react-transition-group";
import "./submitProposalModal.style.css";
import { StatusBadge } from "@/components/styled/Badges";
import {
  TJobDetails,
  TPROPOSAL_ESTIMATION_DURATION,
} from "@/helpers/types/job.type";
import { SeeMore } from "@/components/ui/SeeMore";
import Tooltip from "@/components/ui/Tooltip";

type Props = {
  show: boolean;
  toggle: () => void;
  data: TProposalDetails & TJobDetails;
  onSubmitProposal: () => void;
};

type FormState = {
  costOrHourlyRate: string;
  estimation: {
    number: string;
    duration: string;
  };
  proposalMessage: string;
  attachments: { fileUrl: string; fileName?: string }[];
  termsAndConditions: string;
  questions: string;
};

type FormErrors = {
  costOrHourlyRate?: string;
  estimation?: string;
  proposalMessage?: string;
  termsAndConditions?: string;
  questions?: string;
  fileUploadError?: string;
  [key: string]: string | undefined;
};

const FormWrapper = styled.div`
  .subtitle {
    margin-top: 2rem;
  }
  .form {
    margin-top: 1.25rem;
  }
  .form-group {
    margin-bottom: 1.875rem;
  }
  .form-label {
    margin-bottom: 0.75rem;
    max-width: 80%;
  }
  .proposal-form-input {
    padding: 1rem 1.25rem;
    border-radius: 7px;
  }
  .bottom-buttons {
    margin-top: 2.5rem;
    justify-content: flex-end;
    @media (max-width: 768px) {
      justify-content: center;
    }
  }
  .page-number {
    transform: translate(20px, -20px);
  }
`;

const SubmitProposalModal = ({
  show,
  toggle,
  data,
  onSubmitProposal,
}: Props) => {
  const isEdit = data?.proposed_budget;
  const isHourlyJob = isEdit
    ? data?.proposed_budget?.type == "hourly"
    : data?.budget?.type == "hourly";
  const [seeMore, setSeeMore] = useState(false);

  /* START ----------------------------------------- Modifying estimation for project-based projects to accomodate new duration dropdown change */
  let modifiedEstimation = { number: "", duration: "" };
  if (data?.proposed_budget?.time_estimation) {
    const estimation = data?.proposed_budget?.time_estimation
      ?.toString()
      ?.split(" ");
    let estNumber = estimation?.[0] || "";
    let estDuration = estimation?.[1] as TPROPOSAL_ESTIMATION_DURATION;
    if (estNumber && !estDuration)
      estDuration = isHourlyJob ? "hours" : "weeks";
    estNumber = Math.min(10, Number(estNumber) || 1).toString();
    modifiedEstimation = {
      number: estNumber.toString(),
      duration: estDuration,
    };
  }
  /* END ------------------------------------------- Modifying estimation for project-based projects to accomodate new duration dropdown change */

  const initialState: FormState = {
    costOrHourlyRate: data?.proposed_budget?.amount?.toString() || "",
    estimation: modifiedEstimation,
    proposalMessage: (isEdit && data?.description) || "",
    attachments: (isEdit && data?.attachments?.length > 0
      ? data.attachments.map((prev: string) => ({ fileUrl: prev }))
      : []) as { fileUrl: string; fileName?: string }[],
    termsAndConditions: data?.terms_and_conditions || "",
    questions: data?.questions || "",
  };

  /* START ----------------------------------------- States */
  const [errors, setErrors] = useState<FormErrors>({});
  const [step, setStep] = useState<1 | 2>(1);
  const [formState, setFormState] = useState<FormState>(initialState);
  const [loading, setLoading] = useState<boolean>(false);
  const [liveError, setLiveError] = useState<boolean>(false);
  /* END ------------------------------------------- States */

  const { data: paymentData } = useQuery(
    ["get-payment-fees"],
    () => getPaymentFees(),
    {
      keepPreviousData: true,
      enabled: show,
    }
  );
  const zehmizehFees =
    paymentData?.data[0]?.fee_structure?.OTHER?.percentage || 0;

  useEffect(() => {
    return () => {
      setErrors({});
      setStep(1);
      setFormState(initialState);
      setLiveError(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const handleChange = useCallback((field: keyof FormState, value: any) => {
    setFormState((prevFormState) => {
      return { ...prevFormState, [field]: value };
    });
  }, []);

  const handleUploadImage = (files: TCustomUploaderFile[]) => {
    handleChange("attachments", [
      ...formState.attachments,
      ...files.map(({ file, fileName }) => ({
        fileName,
        fileUrl: file,
      })),
    ]);
  };

  const removeAttachment = (index: number) => {
    const attachments = [...formState.attachments];
    attachments.splice(index, 1);
    handleChange("attachments", attachments);
  };

  const onDescriptionChange = (data: string) => {
    handleChange("proposalMessage", data);
  };

  const onTermsAndConditionsChange = (data: string) => {
    handleChange("termsAndConditions", data);
  };

  const onQuestionsChange = (data: string) => {
    handleChange("questions", data);
  };

  const validate = (callAPI = true) => {
    setLiveError(true);
    const newformstate = { ...formState, isHourlyJob };
    validateProposal.isValid(newformstate).then((valid) => {
      if (!valid) {
        validateProposal
          .validate(newformstate, { abortEarly: false })
          .catch((err) => {
            const errors = getYupErrors(err);

            /* START ----------------------------------------- Finding if error is in first page */
            if (
              Object.keys(errors).findIndex((key) =>
                ["proposalMessage", "costOrHourlyRate", "estimation"].includes(
                  key
                )
              ) >= 0
            ) {
              setStep(1);
            }
            /* END ------------------------------------------- Finding if error is in first page */
            setErrors({ ...errors });
          });
      } else {
        setErrors({});
        if (callAPI) submitJobProposal();
      }
    });
  };

  useEffect(() => {
    if (liveError) validate(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState]);

  const submitJobProposal = () => {
    const {
      attachments,
      estimation,
      costOrHourlyRate,
      proposalMessage,
      questions,
      termsAndConditions,
    } = formState;
    let body: Record<string, any> = {};
    body = {
      delivery_time: moment(new Date()).format("DD-MM-YYYY"),
      description: proposalMessage,
      terms_and_conditions: termsAndConditions,
      questions,
    };
    if (isEdit && data.proposed_budget) {
      body = {
        ...body,
        proposal_id: data.proposal_id,
        proposed_budget: {
          time_estimation: Object.values(estimation).every((x) => x)
            ? `${estimation.number} ${estimation.duration}`
            : "",
          amount: costOrHourlyRate,
          type: data.proposed_budget.type,
        },
      };
    } else {
      body = {
        ...body,
        job_id: data.job_post_id,
        invite_id: data.invite_id,
        proposed_budget: {
          time_estimation: Object.values(estimation).every((x) => x)
            ? `${estimation.number} ${estimation.duration}`
            : "",
          amount: costOrHourlyRate,
          type: data.budget.type,
        },
      };
    }
    if (attachments.length > 0) {
      body.attachments = attachments.map((attachment) => {
        if (attachment?.fileName)
          return `${attachment.fileUrl}#docname=${attachment.fileName}`;
        return `${attachment.fileUrl}`;
      });
    }
    const promise = isEdit ? editProposal(body) : submitProposal(body);
    setLoading(true);
    promise
      .then((res) => {
        setLoading(false);
        if (res.status) {
          toast.success(res.message);
          onSubmitProposal();
        } else {
          toast.error(res.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Something went wrong"
        );
      });
  };

  const onCloseModal = () => {
    setLoading(false);
    setErrors({});
    setFormState(initialState);
    toggle();
  };

  const calculateFinalAmount = useMemo(() => {
    const { costOrHourlyRate } = formState;
    if (costOrHourlyRate) {
      const finalAmount =
        parseFloat(costOrHourlyRate) * ((100 - zehmizehFees) / 100);

      if (isNaN(finalAmount)) return "0";

      return numberWithCommas(finalAmount, "USD");
    }
  }, [formState, zehmizehFees]);

  const step1Ref = useRef(null);
  const step2Ref = useRef(null);

  // Number options for dropdown
  const numberOptions = [...Array(10).keys()]
    .map((i) => ({
      id: (i + 1).toString(),
      label: (i + 1).toString(),
    }))
    .concat(
      [15, 20, 30, 50, "100+"].map((num) => ({
        id: num.toString(),
        label: num.toString(),
      }))
    );

  const Step1UI = (
    <CSSTransition
      nodeRef={step1Ref}
      in={step === 1}
      timeout={0}
      classNames="step-one"
      mountOnEnter
    >
      <div ref={step1Ref} className="form">
        {/* START ----------------------------------------- Proposal Description */}
        <div>
          <div className="proposal-heading font-normal mb-2">
            Write your proposal, including all relevant details.
            <span className="mandatory">&nbsp;*</span>
          </div>
          {!isEdit && (
            <p>
              {!seeMore && (
                <SeeMore className="text-sm" onClick={() => setSeeMore(true)}>
                  What&apos;s in a Proposal?
                </SeeMore>
              )}
              {seeMore && (
                <span className="text-sm my-3">
                  Your proposal should describe your approach to the project -
                  how you plan to tackle it, what tools or techniques
                  you&apos;ll use, and how long you think it will take.
                  <p className="my-3">
                    This is also your opportunity to sell yourself as the best
                    freelancer for this project. Try to demonstrate your
                    expertise, show that you understand the client&apos;s needs,
                    and highlight any relevant experience that makes you the
                    ideal candidate.
                  </p>
                  <p className="my-3">
                    And as always - be polite and courteous!
                  </p>
                  <b>
                    Note: You should not be doing anything you would want to be
                    paid for at this point. The client has not committed to pay
                    until he&apos;s hired you, aka accepted your proposal
                  </b>{" "}
                </span>
              )}
              {seeMore && (
                <SeeMore
                  className="text-sm"
                  onClick={() => setSeeMore((prev) => !prev)}
                >
                  {seeMore ? "See Less" : "See More"}
                </SeeMore>
              )}
            </p>
          )}
          <TextEditor
            value={formState.proposalMessage}
            onChange={onDescriptionChange}
            placeholder=""
            maxChars={2000}
          />
          {errors?.proposalMessage && (
            <p className="relative -bottom-10">
              <ErrorMessage message={errors.proposalMessage} />
            </p>
          )}
        </div>
        {/* END ------------------------------------------- Proposal Description */}

        {/* START ----------------------------------------- Your proposed price */}
        <div className="form-group">
          <div className="proposal-heading font-normal mb-2">
            {isHourlyJob
              ? "Your Proposed Hourly Rate (In USD)"
              : "Your Proposed Price (In USD)"}
            <span className="mandatory">&nbsp;*</span>
          </div>
          <div className="flex items-center mx-4 mt-3">
            <div className="mr-5 text-right" style={{ flex: "none" }}>
              <p className="mb-0">
                {isHourlyJob
                  ? "Your Hourly Rate: "
                  : "Total to Complete Project: "}
              </p>

              <p className="font-medium ml-3 text-sm mb-0">
                {isHourlyJob ? "(Max $999/hr)" : "(Max $99,999)"}
              </p>
            </div>
            <input
              type="text"
              placeholder="Enter here"
              value={formState.costOrHourlyRate}
              onChange={(e) =>
                handleChange(
                  "costOrHourlyRate",
                  e.target.value.replace(/\D/g, "")
                )
              }
              className="proposal-form-input w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              maxLength={isHourlyJob ? 3 : 5}
            />
          </div>

          {errors?.costOrHourlyRate && (
            <ErrorMessage message={errors.costOrHourlyRate} />
          )}

          {formState.costOrHourlyRate ? (
            <div className="mt-2 flex items-center">
              <Tooltip className="mr-2">
                <div>
                  <div className="mt-1">
                    Final takeaway: {calculateFinalAmount}
                  </div>
                </div>
              </Tooltip>
              <div className="text-base font-normal mt-1">
                ZehMizeh Fee: &nbsp;{zehmizehFees}%
              </div>
            </div>
          ) : null}
        </div>
        {/* END ----------------------------------------- Your proposed price */}

        {/* START ----------------------------------------- Time estimate */}
        <div className="form-group">
          <div className="proposal-heading font-normal">
            Time Estimation (Optional)
          </div>
          <div className="text-sm font-light mb-2">
            How long would you estimate this project would take you?
          </div>
          <div className="flex items-center">
            {/* START ----------------------------------------- Number */}
            <div className="mr-2">
              <Listbox
                value={formState.estimation.number}
                onChange={(value) =>
                  handleChange("estimation", {
                    ...formState.estimation,
                    number: value,
                  })
                }
              >
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-lg shadow-sm cursor-default focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm">
                    <span className="block truncate">
                      {formState.estimation?.number || "-"}
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronUpDownIcon
                        className="w-5 h-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {numberOptions.map((option) => (
                        <Listbox.Option
                          key={`time-estimate-${option.id}`}
                          className={({ active }) =>
                            `${
                              active
                                ? "text-amber-900 bg-amber-100"
                                : "text-gray-900"
                            }
                            cursor-default select-none relative py-2 pl-10 pr-4`
                          }
                          value={option.id}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={`${
                                  selected ? "font-medium" : "font-normal"
                                } block truncate`}
                              >
                                {option.label}
                              </span>
                              {selected ? (
                                <span
                                  className={`${
                                    active ? "text-amber-600" : "text-amber-600"
                                  }
                                  absolute inset-y-0 left-0 flex items-center pl-3`}
                                >
                                  <CheckIcon
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
            {/* END ------------------------------------------- Number */}
            {/* START ----------------------------------------- Duration */}
            <div className="mr-2">
              <Listbox
                value={formState.estimation.duration}
                onChange={(value) =>
                  handleChange("estimation", {
                    ...formState.estimation,
                    duration: value,
                  })
                }
              >
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-lg shadow-sm cursor-default focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm">
                    <span className="block truncate">
                      {CONSTANTS.ESTIMATION_VALUES.find(
                        (estimation) =>
                          estimation.id === formState.estimation.duration
                      )?.label || "-"}
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronUpDownIcon
                        className="w-5 h-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {CONSTANTS.ESTIMATION_VALUES.map(({ id, label }) => (
                        <Listbox.Option
                          key={id}
                          className={({ active }) =>
                            `${
                              active
                                ? "text-amber-900 bg-amber-100"
                                : "text-gray-900"
                            }
                            cursor-default select-none relative py-2 pl-10 pr-4`
                          }
                          value={id}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={`${
                                  selected ? "font-medium" : "font-normal"
                                } block truncate`}
                              >
                                {label}
                              </span>
                              {selected ? (
                                <span
                                  className={`${
                                    active ? "text-amber-600" : "text-amber-600"
                                  }
                                  absolute inset-y-0 left-0 flex items-center pl-3`}
                                >
                                  <CheckIcon
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
            {/* END ------------------------------------------- Duration */}
            {Object.values(formState.estimation).some((x) => x) && (
              <span
                className="text-sm cursor-pointer text-yellow-500"
                onClick={() => {
                  handleChange("estimation", { duration: "", number: "" });
                }}
              >
                Clear
              </span>
            )}
          </div>
          {errors?.estimation && <ErrorMessage message={errors.estimation} />}
        </div>
        {/* END ----------------------------------------- Time estimate */}
      </div>
    </CSSTransition>
  );

  const Step2UI = (
    <CSSTransition
      nodeRef={step2Ref}
      in={step === 2}
      timeout={0}
      classNames="step-two"
      mountOnEnter
    >
      <div ref={step2Ref} className="form">
        {/* START ----------------------------------------- Special Terms & Conditions */}
        <div>
          <div className="proposal-heading font-normal">
            Special Terms & Conditions (Optional)
          </div>
          <div className="text-sm font-light mb-2">
            If you have specific terms and conditions you would like to add to
            your proposal, add them here.
          </div>
          <TextEditor
            value={formState.termsAndConditions}
            onChange={onTermsAndConditionsChange}
            placeholder="Add additional terms here..."
            maxChars={2000}
          />
          {errors?.termsAndConditions && (
            <p className="relative -bottom-10">
              <ErrorMessage message={errors.termsAndConditions} />
            </p>
          )}
        </div>
        {/* END ------------------------------------------- Special Terms & Conditions */}

        {/* START ----------------------------------------- Questions */}
        <div>
          <div className="proposal-heading font-normal">
            Questions (Optional)
          </div>
          <div className="text-sm font-light mb-2">
            If you have specific questions about the project, submit them here.
            These can be discussed if the client reaches out about your
            proposal.
          </div>
          <TextEditor
            value={formState.questions}
            onChange={onQuestionsChange}
            placeholder=""
            maxChars={2000}
          />
          {errors?.questions && (
            <p className="relative -bottom-10">
              <ErrorMessage message={errors.questions} />
            </p>
          )}
        </div>
        {/* END ------------------------------------------- Questions */}

        {/* START ----------------------------------------- Attachments */}
        <div>
          <div className="proposal-heading font-normal">
            Attachments (Optional)
          </div>
          <div className="text-sm font-light mb-2">
            If you have work samples similar to this project that you&apos;d
            like to share, you can attach them here.
          </div>
          <CustomUploader
            placeholder="Attach file"
            handleMultipleUploadImage={handleUploadImage}
            attachments={formState.attachments}
            removeAttachment={(index) => removeAttachment(index)}
            multiple
            limit={CONSTANTS.ATTACHMENTS_LIMIT}
            acceptedFormats={[
              ...CONSTANTS.DEFAULT_ATTACHMENT_SUPPORTED_TYPES,
              "audio/*",
              "video/*",
            ].join(", ")}
            suggestions="File type: PDF, DOC, DOCX, XLS, XLSX, Image Files, Audio Files, Video Files"
            shouldShowFileNameAndExtension={false}
          />
          {errors?.fileUploadError && (
            <ErrorMessage message={errors.fileUploadError} />
          )}
        </div>
        {/* END ----------------------------------------- Attachments */}
      </div>
    </CSSTransition>
  );

  const title = isEdit ? "Edit Proposal" : "Submit Proposal";

  return (
    <>
      <Transition appear show={show} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onCloseModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <button
                    type="button"
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-500"
                    onClick={onCloseModal}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>

                  <div className="overflow-hidden">
                    <FormWrapper>
                      <div className="content">
                        <div className="flex flex-row justify-between">
                          <h3 className="text-2xl font-bold">{title}</h3>
                          <StatusBadge className="page-number" color="yellow">
                            Page {step}/2
                          </StatusBadge>
                        </div>
                        {step === 1 && (
                          <div className="subtitle text-2xl font-normal">
                            Enter the details of your proposal below.{" "}
                          </div>
                        )}
                        {Step1UI}
                        {Step2UI}
                      </div>
                      <div className="bottom-buttons flex">
                        {step === 2 && (
                          <StyledButton
                            className="text-sm font-normal mr-5"
                            variant="secondary"
                            padding="0.8125rem 2rem"
                            disabled={loading}
                            onClick={() => setStep(1)}
                          >
                            Back
                          </StyledButton>
                        )}
                        <StyledButton
                          className="text-sm font-normal"
                          variant="primary"
                          padding="0.8125rem 2rem"
                          disabled={loading}
                          onClick={() => (step === 1 ? setStep(2) : validate())}
                        >
                          {step === 1 ? (
                            <span>Next</span>
                          ) : (
                            <span>
                              {loading ? (
                                <div className="flex items-center">
                                  <Spinner loadingText="Submitting..." />
                                </div>
                              ) : (
                                "Submit"
                              )}
                            </span>
                          )}
                        </StyledButton>
                      </div>
                    </FormWrapper>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default SubmitProposalModal;
