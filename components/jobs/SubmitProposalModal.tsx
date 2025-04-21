"use client";

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
import TextEditor from "@/components/forms/TextEditor";
import CustomUploader, {
  TCustomUploaderFile,
} from "@/components/ui/CustomUploader";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { getYupErrors, numberWithCommas } from "@/helpers/utils/misc";
import { validateProposal } from "@/helpers/validation/common";
import { editProposal, submitProposal } from "@/helpers/http/proposals";
import { getPaymentFees } from "@/helpers/http/common";
import { CONSTANTS } from "@/helpers/const/constants";
import { TProposalDetails } from "@/helpers/types/proposal.type";
import { StatusBadge } from "@/components/styled/Badges";
import {
  TJobDetails,
  TPROPOSAL_ESTIMATION_DURATION,
} from "@/helpers/types/job.type";
import { SeeMore } from "@/components/ui/SeeMore";
import Tooltip from "@/components/ui/Tooltip";
import CustomButton from "../custombutton/CustomButton";

interface Props {
  show: boolean;
  toggle: () => void;
  data: TProposalDetails & TJobDetails;
  onSubmitProposal: () => void;
}

interface FormState {
  costOrHourlyRate: string;
  estimation: {
    number: string;
    duration: string;
  };
  proposalMessage: string;
  attachments: { fileUrl: string; fileName?: string }[];
  termsAndConditions: string;
  questions: string;
}

interface FormErrors {
  costOrHourlyRate?: string;
  estimation?: string;
  proposalMessage?: string;
  termsAndConditions?: string;
  questions?: string;
  fileUploadError?: string;
  [key: string]: string | undefined;
}

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

            // Convert errors to FormErrors type by ensuring all values are strings or undefined
            const formErrors: FormErrors = {};
            Object.keys(errors).forEach((key) => {
              const value = errors[key];
              formErrors[key] = typeof value === "string" ? value : undefined;
            });

            setErrors(formErrors);
          });
      } else {
        setErrors({});
        if (callAPI) submitJobProposal();
      }
    });
  };

  useEffect(() => {
    if (liveError) validate(false);
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

  const title = isEdit ? "Edit Proposal" : "Submit Proposal";

  return (
    <Dialog as="div" className="relative z-50" onClose={() => {}} open={show}>
      <div className="fixed inset-0 bg-black/25" aria-hidden="true" />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl transform  rounded-2xl bg-white px-4 py-8 md:p-12 text-left align-middle shadow-xl transition-all">
            <button
              type="button"
              className="absolute top-4 right-4 md:top-0 md:-right-8 md:text-white text-gray-400 hover:text-gray-500"
              onClick={onCloseModal}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-bold text-gray-900"
                >
                  {title}
                </Dialog.Title>
                <StatusBadge color="yellow">Page {step}/2</StatusBadge>
              </div>

              {step === 1 && (
                <p className="text-2xl font-normal text-gray-600">
                  Enter the details of your proposal below.
                </p>
              )}

              {/* Step 1 Content */}
              {step === 1 && (
                <div className="space-y-6">
                  {/* Proposal Description */}
                  <div className="space-y-2">
                    <div className="text-lg font-normal">
                      Write your proposal, including all relevant details.
                      <span className="text-red-500">*</span>
                    </div>
                    {!isEdit && (
                      <div className="space-y-3">
                        {!seeMore && (
                          <SeeMore
                            className="text-sm text-primary hover:text-primary cursor-pointer"
                            onClick={() => setSeeMore(true)}
                          >
                            What's in a Proposal?
                          </SeeMore>
                        )}
                        {seeMore && (
                          <div className="space-y-3 text-sm text-gray-600">
                            <p>
                              Your proposal should describe your approach to the
                              project - how you plan to tackle it, what tools or
                              techniques you'll use, and how long you think it
                              will take.
                            </p>
                            <p>
                              This is also your opportunity to sell yourself as
                              the best freelancer for this project. Try to
                              demonstrate your expertise, show that you
                              understand the client's needs, and highlight any
                              relevant experience that makes you the ideal
                              candidate.
                            </p>
                            <p>And as always - be polite and courteous!</p>
                            <p className="font-bold">
                              Note: You should not be doing anything you would
                              want to be paid for at this point. The client has
                              not committed to pay until he's hired you, aka
                              accepted your proposal
                            </p>
                            <SeeMore
                              className="text-primary  cursor-pointer"
                              onClick={() => setSeeMore(false)}
                            >
                              See Less
                            </SeeMore>
                          </div>
                        )}
                      </div>
                    )}
                    <TextEditor
                      value={formState.proposalMessage}
                      onChange={onDescriptionChange}
                      placeholder=""
                      maxChars={2000}
                    />
                    {errors?.proposalMessage && (
                      <ErrorMessage message={errors.proposalMessage} />
                    )}
                  </div>

                  {/* Price Input */}
                  <div className="space-y-2">
                    <div className="text-lg font-normal">
                      {isHourlyJob
                        ? "Your Proposed Hourly Rate (In USD)"
                        : "Your Proposed Price (In USD)"}
                      <span className="text-red-500">*</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-gray-600">
                          {isHourlyJob
                            ? "Your Hourly Rate: "
                            : "Total to Complete Project: "}
                        </p>
                        <p className="text-sm font-medium text-gray-500">
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        maxLength={isHourlyJob ? 3 : 5}
                      />
                    </div>
                    {errors?.costOrHourlyRate && (
                      <ErrorMessage message={errors.costOrHourlyRate} />
                    )}
                    {formState.costOrHourlyRate && (
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <div className="text-sm">
                            Final takeaway: {calculateFinalAmount}
                          </div>
                        </Tooltip>
                        <div className="text-sm text-gray-600">
                          ZehMizeh Fee: {zehmizehFees}%
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Time Estimation */}
                  <div className="space-y-2">
                    <div className="text-lg font-normal">
                      Time Estimation (Optional)
                    </div>
                    <p className="text-sm text-gray-600">
                      How long would you estimate this project would take you?
                    </p>
                    <div className="flex items-center gap-2">
                      <Listbox
                        value={formState.estimation.number}
                        onChange={(value) =>
                          handleChange("estimation", {
                            ...formState.estimation,
                            number: value,
                          })
                        }
                      >
                        <div className="relative">
                          <Listbox.Button className="relative w-24 py-2 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-lg shadow-sm cursor-default focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm">
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
                            <Listbox.Options className="absolute z-10 w-24 py-1 bottom-full mb-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {numberOptions.map((option) => (
                                <Listbox.Option
                                  key={option.id}
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
                                          selected
                                            ? "font-medium"
                                            : "font-normal"
                                        } block truncate`}
                                      >
                                        {option.label}
                                      </span>
                                      {selected ? (
                                        <span
                                          className={`${
                                            active
                                              ? "text-primary"
                                              : "text-primary"
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

                      <Listbox
                        value={formState.estimation.duration}
                        onChange={(value) =>
                          handleChange("estimation", {
                            ...formState.estimation,
                            duration: value,
                          })
                        }
                      >
                        <div className="relative">
                          <Listbox.Button className="relative w-32 py-2 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-lg shadow-sm cursor-default focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm">
                            <span className="block truncate">
                              {CONSTANTS.ESTIMATION_VALUES.find(
                                (estimation) =>
                                  estimation.id ===
                                  formState.estimation.duration
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
                            <Listbox.Options className="absolute z-10 w-32 py-1 bottom-full mb-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {CONSTANTS.ESTIMATION_VALUES.map(
                                ({ id, label }) => (
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
                                            selected
                                              ? "font-medium"
                                              : "font-normal"
                                          } block truncate`}
                                        >
                                          {label}
                                        </span>
                                        {selected ? (
                                          <span
                                            className={`${
                                              active
                                                ? "text-primary"
                                                : "text-primary"
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
                                )
                              )}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>

                      {Object.values(formState.estimation).some((x) => x) && (
                        <button
                          type="button"
                          className="text-sm text-primary hover:text-primary"
                          onClick={() => {
                            handleChange("estimation", {
                              duration: "",
                              number: "",
                            });
                          }}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    {errors?.estimation && (
                      <ErrorMessage message={errors.estimation} />
                    )}
                  </div>
                </div>
              )}

              {/* Step 2 Content */}
              {step === 2 && (
                <div className="space-y-6">
                  {/* Terms and Conditions */}
                  <div className="space-y-2">
                    <div className="text-lg font-normal">
                      Special Terms & Conditions (Optional)
                    </div>
                    <p className="text-sm text-gray-600">
                      If you have specific terms and conditions you would like
                      to add to your proposal, add them here.
                    </p>
                    <TextEditor
                      value={formState.termsAndConditions}
                      onChange={onTermsAndConditionsChange}
                      placeholder="Add additional terms here..."
                      maxChars={2000}
                    />
                    {errors?.termsAndConditions && (
                      <ErrorMessage message={errors.termsAndConditions} />
                    )}
                  </div>

                  {/* Questions */}
                  <div className="space-y-2">
                    <div className="text-lg font-normal">
                      Questions (Optional)
                    </div>
                    <p className="text-sm text-gray-600">
                      If you have specific questions about the project, submit
                      them here. These can be discussed if the client reaches
                      out about your proposal.
                    </p>
                    <TextEditor
                      value={formState.questions}
                      onChange={onQuestionsChange}
                      placeholder="Write here..."
                      maxChars={2000}
                    />

                    {errors?.questions && (
                      <ErrorMessage message={errors.questions} />
                    )}
                  </div>

                  {/* Attachments */}
                  <div className="space-y-2">
                    <div className="text-lg font-normal">
                      Attachments (Optional)
                    </div>
                    <p className="text-sm text-gray-600">
                      If you have work samples similar to this project that
                      you'd like to share, you can attach them here.
                    </p>
                    <CustomUploader
                      placeholder="Attach file"
                      handleMultipleUploadImage={handleUploadImage}
                      attachments={formState.attachments}
                      removeAttachment={(index: number | undefined) => {
                        if (typeof index === "number") {
                          removeAttachment(index);
                        }
                      }}
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
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-end gap-4">
                {step === 2 && (
                  // <button
                  //   type="button"
                  //   className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  //   disabled={loading}
                  //   onClick={() => setStep(1)}
                  // >
                  //   Back
                  // </button>

                  <CustomButton
                    className="px-8 py-4 text-center  transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-[#E7E7E7] text-[18px]"
                    disabled={loading}
                    onClick={() => setStep(1)}
                    text={"Back"}
                  />
                )}
                {/* <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                  onClick={() => (step === 1 ? setStep(2) : validate())}
                >
                  {step === 1 ? (
                    "Next"
                  ) : loading ? (
                    <div className="flex items-center gap-2">
                      <Spinner loadingText="Submitting..." />
                    </div>
                  ) : (
                    "Submit"
                  )}
                </button> */}

                <CustomButton
                  className="px-8 py-4 text-center  transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px]"
                  disabled={loading}
                  onClick={() => (step === 1 ? setStep(2) : validate())}
                  text={step === 1 ? "Next" : loading ? <Spinner /> : "Submit"}
                />
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default SubmitProposalModal;
