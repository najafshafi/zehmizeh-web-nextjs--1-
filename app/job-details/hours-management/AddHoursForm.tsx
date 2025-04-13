"use client";

/*
 * This is the Add / Edit hours form - Freelancer side
 */

import { useEffect, useMemo, useState, useCallback } from "react";
import toast from "react-hot-toast";
import * as yup from "yup";
import { useQuery } from "react-query";
import { convertToTitleCase, getYupErrors } from "@/helpers/utils/misc";
import TextEditor from "@/components/forms/TextEditor";
import CustomUploader from "@/components/ui/CustomUploader";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { numberWithCommas } from "@/helpers/utils/misc";
import { manageHours } from "@/helpers/http/jobs";
import useResponsive from "@/helpers/hooks/useResponsive";
import { getPaymentFees } from "@/helpers/http/common";
import { REGEX } from "@/helpers/const/regex";
import { CONSTANTS } from "@/helpers/const/constants";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

type Props = {
  show: boolean;
  toggle: () => void;
  onSubmit: () => void;
  jobPostId: string;
  selectedMilestone?: any;
  hourlyRate: any;
  isFinalHours?: any;
};

interface FormState {
  screenshot_link: Array<{
    fileUrl?: string;
    fileName?: string;
  }>;
}

interface UploadedFile {
  file: string;
  fileName?: string;
  fileUrl?: string;
}

interface PaymentData {
  data: Array<{
    fee_structure: {
      OTHER: {
        percentage: number;
      };
    };
  }>;
}

interface ErrorRecordValue {
  message: string;
}

const AddHoursForm = ({
  show,
  toggle,
  onSubmit,
  jobPostId,
  selectedMilestone,
  hourlyRate,
  isFinalHours,
}: Props) => {
  const { isMobile } = useResponsive();
  const [hoursWorked, setHoursWorked] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, ErrorRecordValue>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [formState, setFormState] = useState<FormState>({
    screenshot_link: [],
  });

  const { data: paymentData } = useQuery<PaymentData>(
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
    if (show && selectedMilestone) {
      // This will prefill the selected milestone details

      setHoursWorked(selectedMilestone?.logged_hour);
      setAmount(selectedMilestone?.total_amount);
      setDescription(selectedMilestone?.description);
      setTitle(selectedMilestone?.title);

      if (selectedMilestone?.attachments) {
        const attachments: { fileUrl?: string; fileName?: string }[] =
          selectedMilestone?.attachments?.split(",").map((dt: string) => {
            return {
              fileName: dt.split("#docname=")[1],
              fileUrl: dt.split("#docname=")[0],
            };
          });

        setFormState({ screenshot_link: attachments });
      }
    }

    // if (jobTitle) {
    //   setTitle(jobTitle);
    // }
    return () => {
      // This will make the form empty when closing the modal

      setHoursWorked("");
      setTitle("");
      setAmount("");
      setDescription("");
      setErrors({});
      setLoading(false);
      setFormState({ screenshot_link: [] });
    };
  }, [show, selectedMilestone]);

  const validationSchema = yup
    .object({
      hoursWorked: yup
        .number()
        .required()
        .test(
          "Is positive?",
          "Please enter a number greater than 0",
          (value) => value > 0
        )
        .typeError("Please enter a valid number value"),
      amount: yup
        .number()
        .required()
        .test(
          "Is positive?",
          "Please enter a number greater than 5",
          (value) => value > 4.99 && value < 99999
        )
        .typeError("Please enter a valid number value"),
      description: yup.string().required("Please enter a description."),
      title: yup.string().required("Please enter a title"),
    })
    .required();

  const validate = (e: React.FormEvent) => {
    e.preventDefault();
    validationSchema
      .isValid({ hoursWorked, title, amount, description })
      .then((valid) => {
        if (!valid) {
          validationSchema
            .validate(
              { hoursWorked, title, amount, description },
              { abortEarly: false }
            )
            .catch((err) => {
              const yupErrors = getYupErrors(err);
              const typedErrors: Record<string, ErrorRecordValue> = {};
              Object.keys(yupErrors).forEach((key) => {
                typedErrors[key] = { message: String(yupErrors[key]) };
              });
              setErrors(typedErrors);
            });
        } else {
          setErrors({});
          submitHours();
        }
      });
  };

  const submitHours = () => {
    // This will edit / add hours

    const multipleAttachments = formState?.screenshot_link.map((file) => {
      return `${file.fileUrl}#docname=${file.fileName}`;
    });

    const body: any = {
      action: selectedMilestone ? "edit_hours" : "add_hours",
      description: description,
      title: convertToTitleCase(title),
      logged_hour: parseFloat(hoursWorked),
      attachments: multipleAttachments.join(","),
    };

    if (selectedMilestone) {
      body.hourly_id = selectedMilestone?.hourly_id;
    } else {
      body.job_post_id = jobPostId;
    }

    if (isFinalHours) {
      body.is_final_milestone = 1;
    }

    setLoading(true);
    const promise = manageHours(body);
    toast.promise(promise, {
      loading: "Loading...",
      success: (res) => {
        setLoading(false);
        toggle();
        onSubmit();
        return selectedMilestone ? res.response : res.message;
      },
      error: (err) => {
        setLoading(false);
        return selectedMilestone
          ? err.response
          : err?.response?.data?.message || "error";
      },
    });
  };

  const closeModal = () => {
    setLoading(false);
    setAmount("");
    setTitle("");
    setDescription("");
    setErrors({});
    setFormState({ screenshot_link: [] });
    toggle();
  };

  const changeHours = (value: string) => {
    // This will make sure only numeric value is entered and calculate the total amount
    if (!isNaN(Number(value))) {
      const hourlyValue =
        value.indexOf(".") >= 0
          ? value.substr(0, value.indexOf(".")) +
            value.substr(value.indexOf("."), 3)
          : value;
      setHoursWorked(hourlyValue);
      const totalAmount = Number(hourlyValue) * hourlyRate;
      setAmount(totalAmount + "");
    }
  };

  const calculateFinalAmount = useMemo(() => {
    if (amount) {
      const finalAmount = parseFloat(amount) * ((100 - zehmizehFees) / 100);

      if (isNaN(finalAmount)) return "0";

      return numberWithCommas(finalAmount, "USD");
    }
  }, [amount, zehmizehFees]);

  const onDescriptionChange = (data: any) => {
    setDescription(data);
  };

  const handleChange = useCallback(
    (field: keyof FormState, value: FormState[keyof FormState]) => {
      setFormState((prevFormState: FormState) => {
        return { ...prevFormState, [field]: value };
      });
    },
    []
  );

  const handleUploadImage = (file: Partial<UploadedFile>) => {
    if (!file.file) return;
    handleChange("screenshot_link", [
      ...formState.screenshot_link,
      { fileUrl: file.file, fileName: file.fileName },
    ]);
  };

  const removeAttachment = (index?: number, fileUrl?: string) => {
    if (index === undefined) return;
    const newAttachments = [...formState.screenshot_link];
    newAttachments.splice(index, 1);
    handleChange("screenshot_link", newAttachments);
  };

  const handleMultipleUploadImage = (files: Partial<UploadedFile>[]) => {
    const newUploadedFiles = files
      .filter((file): file is UploadedFile => file.file !== undefined)
      .map(({ file, fileName }) => {
        return { fileUrl: file, fileName };
      });

    handleChange("screenshot_link", [
      ...formState.screenshot_link,
      ...newUploadedFiles,
    ]);
  };

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white px-4 py-8 md:p-12 shadow-xl transition-all">
                <div className="absolute right-4 top-4 md:top-0 md:-right-8 ">
                  <button
                    type="button"
                    className="rounded-md text-gray-400 md:text-white focus:outline-none"
                    onClick={closeModal}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={validate} className="space-y-6">
                  <Dialog.Title className="text-2xl font-normal">
                    {selectedMilestone
                      ? "Edit Hours"
                      : isFinalHours
                        ? "Submit Final Hours"
                        : "Add Hours"}
                  </Dialog.Title>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-light">
                        Title<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Pick a title that describes what you did during these hours"
                        value={title}
                        onChange={(e) =>
                          setTitle(e.target.value.replace(REGEX.TITLE, ""))
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                        autoFocus
                      />
                      {errors?.title && (
                        <ErrorMessage message={errors?.title.message} />
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-light">
                        Total Hours Worked
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter the number of hours worked (Ex. 30.5 or 0.85)"
                        value={hoursWorked}
                        onChange={(e) => changeHours(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                      />
                      {errors?.hoursWorked && (
                        <ErrorMessage message={errors?.hoursWorked.message} />
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-light">
                        Hourly Rate
                      </label>
                      <div className="relative mt-1">
                        <input
                          type="text"
                          value={hourlyRate}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                          disabled
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-light">
                        Invoice Total
                      </label>
                      <div className="relative mt-1">
                        <input
                          type="text"
                          value={numberWithCommas(amount)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                          disabled
                        />
                      </div>
                      {amount !== "" && (
                        <div className="mt-2">
                          <div className="text-sm font-normal">
                            <table className="mx-4">
                              <tbody>
                                <tr>
                                  <td>ZehMizeh Fee:</td>
                                  <td>&nbsp;{zehmizehFees}%</td>
                                </tr>
                                <tr>
                                  <td>Your final takeaway:</td>
                                  <td className="font-bold">
                                    &nbsp;{calculateFinalAmount}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                      {amount != "" && parseFloat(amount) > 99999 ? (
                        <ErrorMessage message="Invoice total exceeded stripe payment limit." />
                      ) : null}
                      {amount != "" && parseFloat(amount) < 5 ? (
                        <ErrorMessage message="Hours submissions must be worth at least $5." />
                      ) : null}
                    </div>

                    <div>
                      <label className="block text-sm font-light">
                        Description of Hours
                        <span className="text-red-500">*</span>
                      </label>
                      <TextEditor
                        value={description}
                        onChange={onDescriptionChange}
                        placeholder="Explain in detail the work you completed during these hours and where the project stands now."
                        maxChars={2000}
                      />
                      {errors?.description && (
                        <ErrorMessage message={errors?.description.message} />
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-light">
                        Attach any completed work below. (Even research, notes,
                        or incomplete drafts may be worth sharing.)
                      </label>
                      <CustomUploader
                        handleUploadImage={handleUploadImage}
                        attachments={formState?.screenshot_link || []}
                        removeAttachment={removeAttachment}
                        placeholder="Attach doc"
                        acceptedFormats={[
                          ...CONSTANTS.DEFAULT_ATTACHMENT_SUPPORTED_TYPES,
                          "audio/*",
                          "video/*",
                        ].join(", ")}
                        suggestions="File type: PDF, DOC, DOCX, XLS, XLSX, Image Files, Audio Files, Video Files"
                        shouldShowFileNameAndExtension={false}
                        handleMultipleUploadImage={handleMultipleUploadImage}
                        limit={5}
                        multiple
                      />
                      {errors?.screenshot_link && (
                        <ErrorMessage
                          message={errors.screenshot_link.message}
                        />
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full rounded-full bg-amber-500 px-8 py-4 text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                        isMobile ? "text-base" : "text-base"
                      }`}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        </div>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddHoursForm;
