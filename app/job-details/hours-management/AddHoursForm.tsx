"use client";

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
import { useAuth } from "@/helpers/contexts/auth-context";
import CustomButton from "@/components/custombutton/CustomButton";

type Props = {
  show: boolean;
  toggle: () => void;
  onSubmit: () => void;
  jobPostId: string;
  selectedMilestone?: any;
  hourlyRate: any;
  isFinalHours?: any;
};

type FormStateType = {
  screenshot_link: { fileUrl?: string; fileName?: string }[];
};

type FileType = {
  file: string;
  fileName?: string;
};

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
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [formState, setFormState] = useState<FormStateType>({
    screenshot_link: [],
  });
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
  const auth = useAuth();

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

  const validate = (e: any) => {
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
              const errors = getYupErrors(err);
              setErrors({ ...errors });
            });
        } else {
          setErrors({});
          // create milestone
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

  const handleChange = useCallback((field: string, value: any) => {
    setFormState((prevFormState: FormStateType) => {
      return { ...prevFormState, [field]: value };
    });
  }, []);

  const handleUploadImage = ({ file, fileName }: FileType) => {
    handleChange("screenshot_link", [
      ...formState.screenshot_link,
      { fileUrl: file, fileName },
    ]);
  };

  const removeAttachment = (index: number) => {
    formState.screenshot_link.splice(index, 1);
    handleChange("screenshot_link", formState.screenshot_link);
  };

  const handleMultipleUploadImage = (files: FileType[]) => {
    const newUploadedFiles = files.map(({ file, fileName }) => {
      return { fileUrl: file, fileName };
    });

    handleChange("screenshot_link", [
      ...formState.screenshot_link,
      ...newUploadedFiles,
    ]);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-start justify-center z-[9999] bg-black bg-opacity-50 overflow-y-auto">
      <div className="absolute inset-0" onClick={closeModal}></div>
      <div
        className="relative bg-white my-[50px] rounded-lg shadow-lg max-w-[570px] w-full mx-4"
        style={{ minWidth: "300px" }}
      >
        <div className="relative px-4 py-8 md:p-12">
          <button
            className="absolute top-4 right-4 md:top-0 md:-right-8 md:text-white text-gray-500 hover:text-opacity-70 text-2xl font-light focus:outline-none"
            onClick={closeModal}
          >
            &times;
          </button>
          <form onSubmit={validate} className="overflow-x-hidden">
            <div className="text-2xl font-normal">
              {selectedMilestone
                ? "Edit Hours"
                : isFinalHours
                  ? "Submit Final Hours"
                  : "Add Hours"}
            </div>
            <div className="mt-5">
              <div className="text-base font-light">
                Title<span className="text-red-500">&nbsp;*</span>
              </div>
              <input
                placeholder="Pick a title that describes what you did during these hours"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value.replace(REGEX.TITLE, ""))
                }
                className="w-full px-5 py-4 mt-1.5 rounded-[7px] border border-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              {errors?.title && <ErrorMessage message={errors?.title} />}
            </div>
            <div className="mt-5">
              <label className="text-base font-light block">
                Total Hours Worked<span className="text-red-500">&nbsp;*</span>
              </label>
              <input
                placeholder="Enter the number of hours worked (Ex. 30.5 or 0.85)"
                value={hoursWorked}
                onChange={(e) => changeHours(e.target.value)}
                className="w-full px-5 py-4 mt-1.5 rounded-[7px] border border-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors?.hoursWorked && (
                <ErrorMessage message={errors?.hoursWorked} />
              )}
            </div>
            <div className="mt-5">
              <div className="text-base font-light">Hourly Rate</div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2">
                  $
                </span>
                <input
                  placeholder="Enter hourly rate"
                  value={hourlyRate}
                  className="w-full px-10 py-4 mt-1.5 rounded-[7px] border border-black focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                  disabled
                />
              </div>
            </div>
            <div className="mt-5">
              <div className="text-base font-light">Invoice Total</div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2">
                  $
                </span>
                <input
                  placeholder="Enter amount"
                  value={numberWithCommas(amount)}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-10 py-4 mt-1.5 rounded-[7px] border border-black focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                  disabled
                />
              </div>
              {amount !== "" && (
                <div className="mt-2 flex items-center">
                  <div className="text-base font-normal">
                    <table className="mx-4">
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
            <div className="mt-5">
              <label className="text-base font-light block">
                Description of Hours
                <span className="text-red-500">&nbsp;*</span>
              </label>
              <TextEditor
                value={description}
                onChange={onDescriptionChange}
                placeholder="Explain in detail the work you completed during these hours and where the project stands now."
                maxChars={2000}
              />
              {errors?.description && (
                <ErrorMessage message={errors?.description} />
              )}
            </div>
            <div className="mt-5">
              <label className="text-base font-light block">
                Attach any completed work below. (Even research, notes, or
                incomplete drafts may be worth sharing.)
              </label>
              <CustomUploader
                handleUploadImage={handleUploadImage as any}
                attachments={
                  formState?.screenshot_link ? formState?.screenshot_link : []
                }
                removeAttachment={removeAttachment as any}
                placeholder="Attach doc"
                acceptedFormats={[
                  ...CONSTANTS.DEFAULT_ATTACHMENT_SUPPORTED_TYPES,
                  "audio/*",
                  "video/*",
                ].join(", ")}
                suggestions="File type: PDF, DOC, DOCX, XLS, XLSX, Image Files, Audio Files, Video Files"
                shouldShowFileNameAndExtension={false}
                handleMultipleUploadImage={handleMultipleUploadImage as any}
                limit={5}
                multiple
              />
              {errors?.screenshot_link && (
                <ErrorMessage message={errors.screenshot_link} />
              )}
            </div>
            <div className="flex gap-2 mt-5 flex-wrap md:justify-end">
              <CustomButton
                className={`
                  px-[2rem] py-[0.8125rem] transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-base
                  ${isMobile ? "w-full" : ""}`}
                text="Submit"
                disabled={loading}
                onClick={() => {}}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddHoursForm;
