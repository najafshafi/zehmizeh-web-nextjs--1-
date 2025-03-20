/*
 * This is the Add / Edit hours form - Freelancer side
 */

import { useEffect, useMemo, useState, useCallback } from "react";
import { Modal, Button, Form, FormLabel } from "react-bootstrap";
import toast from "react-hot-toast";
import * as yup from "yup";
import { useQuery } from "react-query";
import { convertToTitleCase, getYupErrors } from "@/helpers/utils/misc";
import { StyledModal } from "@/components/styled/StyledModal";
import TextEditor from "@/components/forms/TextEditor";
import CustomUploader from "@/components/ui/CustomUploader";
import { FormWrapper, StyledFormGroup } from "./hours-management.styled";
import { StyledButton } from "@/components/forms/Buttons";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { numberWithCommas } from "@/helpers/utils/misc";
import { manageHours } from "@/helpers/http/jobs";
import useResponsive from "@/helpers/hooks/useResponsive";
import { getPaymentFees } from "@/helpers/http/common";
import { REGEX } from "@/helpers/const/regex";
import { CONSTANTS } from "@/helpers/const/constants";
import { useAuth } from "@/helpers/contexts/auth-context";

type Props = {
  show: boolean;
  toggle: () => void;
  onSubmit: () => void;
  jobPostId: string;
  selectedMilestone?: any;
  hourlyRate: any;
  isFinalHours?: any;
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
  const [formState, setFormState] = useState<{
    screenshot_link: { fileUrl?: string; fileName?: string }[];
  }>({
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

  const changeHours = (value) => {
    // This will make sure only numeric value is entered and calculate the total amount
    if (!isNaN(value)) {
      const hourlyValue =
        value.indexOf(".") >= 0
          ? value.substr(0, value.indexOf(".")) +
            value.substr(value.indexOf("."), 3)
          : value;
      setHoursWorked(hourlyValue);
      const totalAmount = hourlyValue * hourlyRate;
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

  const handleChange = useCallback((field, value) => {
    setFormState((prevFormState: any) => {
      return { ...prevFormState, [field]: value };
    });
  }, []);

  const handleUploadImage = ({
    file,
    fileName,
  }: {
    file: string;
    fileName?: string;
  }) => {
    handleChange("screenshot_link", [
      ...formState.screenshot_link,
      { fileUrl: file, fileName },
    ]);
  };

  const removeAttachment = (index: number) => {
    formState.screenshot_link.splice(index, 1);
    handleChange("screenshot_link", formState.screenshot_link);
  };

  const handleMultipleUploadImage = (
    files: { file: string; fileName?: string }[]
  ) => {
    const newUploadedFiles = files.map(({ file, fileName }) => {
      return { fileUrl: file, fileName };
    });

    handleChange("screenshot_link", [
      ...formState.screenshot_link,
      ...newUploadedFiles,
    ]);
  };

  return (
    <StyledModal
      maxwidth={570}
      show={show}
      size="sm"
      onHide={closeModal}
      centered
    >
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={closeModal}>
          &times;
        </Button>
        <FormWrapper onSubmit={validate}>
          <div className="fs-24 font-normal">
            {selectedMilestone
              ? "Edit Hours"
              : isFinalHours
              ? "Submit Final Hours"
              : "Add Hours"}
          </div>
          <StyledFormGroup>
            <div className="fs-1rem fw-300">
              Title<span className="mandatory">&nbsp;*</span>
            </div>
            <Form.Control
              placeholder="Pick a title that describes what you did during these hours"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value.replace(REGEX.TITLE, ""))
              }
              className="form-input"
              autoFocus
              //disabled={jobTitle != ''}
            />
            {errors?.title && <ErrorMessage message={errors?.title} />}
          </StyledFormGroup>
          <StyledFormGroup>
            <FormLabel className="fs-1rem fw-300">
              Total Hours Worked<span className="mandatory">&nbsp;*</span>
            </FormLabel>
            <Form.Control
              placeholder="Enter the number of hours worked (Ex. 30.5 or 0.85)"
              value={hoursWorked}
              onChange={(e) => changeHours(e.target.value)}
              className="form-input"
            />
            {errors?.hoursWorked && (
              <ErrorMessage message={errors?.hoursWorked} />
            )}
          </StyledFormGroup>
          <StyledFormGroup>
            <div className="fs-1rem fw-300">Hourly Rate</div>
            <span className="input-symbol-euro">
              <Form.Control
                placeholder="Enter hourly rate"
                value={hourlyRate}
                className="form-input rate-input"
                disabled
              />
            </span>
          </StyledFormGroup>
          <StyledFormGroup>
            <div className="fs-1rem fw-300">Invoice Total</div>
            <span className="input-symbol-euro">
              <Form.Control
                placeholder="Enter amount"
                value={numberWithCommas(amount)}
                onChange={(e) => setAmount(e.target.value)}
                className="form-input rate-input"
                disabled
              />
            </span>
            {amount !== "" && (
              <div className="mt-2 flex items-center">
                <div className="fs-1rem font-normal">
                  {/* You will get{' '}
                  <span className="fw-700">{calculateFinalAmount}</span> */}
                  <table className="mx-4">
                    <tr>
                      <td>ZehMizeh Fee:</td>
                      <td>&nbsp;{zehmizehFees}%</td>
                    </tr>
                    <tr>
                      <td>Your final takeaway:</td>
                      <td className="fw-700">&nbsp;{calculateFinalAmount}</td>
                    </tr>
                  </table>
                </div>
                {/* <Tooltip className="ms-1">
                  <div>
                    <div>
                      Your proposed price: {numberWithCommas(amount, 'USD')}
                    </div>
                    <div className="mt-1">ZehMizeh fees: -{zehmizehFees}%</div>
                    <div className="mt-1">
                      Final takeaway: {calculateFinalAmount}
                    </div>
                  </div>
                </Tooltip> */}
              </div>
            )}
            {amount != "" && parseFloat(amount) > 99999 ? (
              <ErrorMessage message="Invoice total exceeded stripe payment limit." />
            ) : null}
            {amount != "" && parseFloat(amount) < 5 ? (
              <ErrorMessage message="Hours submissions must be worth at least $5." />
            ) : null}
            {/* {errors?.amount && <ErrorMessage message={errors?.amount} />} */}
          </StyledFormGroup>
          <StyledFormGroup>
            <FormLabel className="fs-1rem fw-300">
              Description of Hours<span className="mandatory">&nbsp;*</span>
            </FormLabel>
            <TextEditor
              value={description}
              onChange={onDescriptionChange}
              placeholder="Explain in detail the work you completed during these hours and where the project stands now."
              maxChars={2000}
            />
            {errors?.description && (
              <ErrorMessage message={errors?.description} />
            )}
          </StyledFormGroup>
          <StyledFormGroup>
            <FormLabel className="fs-1rem fw-300">
              Attach any completed work below. (Even research, notes, or
              incomplete drafts may be worth sharing.)
            </FormLabel>
            <CustomUploader
              handleUploadImage={handleUploadImage}
              attachments={
                formState?.screenshot_link ? formState?.screenshot_link : []
              }
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
              <ErrorMessage message={errors.screenshot_link} />
            )}
          </StyledFormGroup>
          <div className="flex g-2 bottom-buttons flex-wrap">
            <StyledButton
              className={
                isMobile ? "fs-16 font-normal w-100" : "fs-16 font-normal"
              }
              variant="primary"
              padding="0.8125rem 2rem"
              type="submit"
              disabled={loading}
            >
              Submit
            </StyledButton>
          </div>
        </FormWrapper>
      </Modal.Body>
    </StyledModal>
  );
};

export default AddHoursForm;
