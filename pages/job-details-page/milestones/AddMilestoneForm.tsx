/*
 * This is the Add milestone form - Freelancer side *
 */

import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import moment from "moment";
import * as yup from "yup";
import { useQuery } from "react-query";
import { Modal, Button, Form, FormLabel } from "react-bootstrap";
import { StyledModal } from "@/components/styled/StyledModal";
import { StyledButton } from "@/components/forms/Buttons";
import ErrorMessage from "@/components/ui/ErrorMessage";
import TextEditor from "@/components/forms/TextEditor";
import CustomDatePicker from "@/components/forms/DatePicker";
import Tooltip from "@/components/ui/Tooltip";
import {
  convertToTitleCase,
  getYupErrors,
  numberWithCommas,
} from "@/helpers/utils/misc";
import { manageMilestone } from "@/helpers/http/jobs";
import { adjustTimezone } from "@/helpers/utils/misc";
import useResponsive from "@/helpers/hooks/useResponsive";
import { FormWrapper } from "./milestones.styled";
import { getPaymentFees } from "@/helpers/http/common";
import { CSSProperties } from "styled-components";
import { REGEX } from "@/helpers/const/regex";
import NewCustomDatePicker from "@/components/forms/NewDatePicker";
import { useAuth } from "@/helpers/contexts/auth-context";

type Props = {
  show: boolean;
  toggle: () => void;
  onSubmit: () => void;
  clientUserId: string;
  jobPostId: string;
  remainingBudget: number;
};

const initialValues = {
  title: "",
  amount: "",
  description: "",
  dueDate: "",
};

const AddMilestoneForm = ({
  show,
  toggle,
  onSubmit,
  clientUserId,
  jobPostId,
  remainingBudget,
}: Props) => {
  const { isMobile } = useResponsive();
  const [formState, setFormState] = useState(initialValues);
  const [isMaxLimitReached] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const auth = useAuth();

  const handleChange = useCallback((field, value) => {
    setFormState((prevFormState: any) => {
      return { ...prevFormState, [field]: value };
    });
  }, []);

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

  const validationSchema = yup
    .object({
      amount: yup
        .number()
        .required()
        .test(
          "Is positive?",
          "Milestones must be worth at least $5.",
          (value) => value >= 5
        )
        .typeError("Please enter a valid number value"),
      title: yup.string().required("Please enter a title"),
      description: yup.string().required("Please enter a description."),
      dueDate: yup.string().nullable().required("Please select a due date"),
    })
    .required();

  const onCreate = (e: any) => {
    const { title, amount, description, dueDate } = formState;
    e.preventDefault();
    validationSchema
      .isValid({ title, amount, description, dueDate })
      .then((valid) => {
        if (!valid) {
          validationSchema
            .validate(
              { title, amount, description, dueDate },
              { abortEarly: false }
            )
            .catch((err) => {
              const errors = getYupErrors(err);
              setErrors({ ...errors });
            });
        } else {
          setErrors({});
          if (isMaxLimitReached) {
            toast.error(`Maximum 2000 characters are allowed for description`);
            return;
          }
          addNewMilestone();
        }
      });
  };

  // Create milestone api call
  const addNewMilestone = () => {
    const { title, amount, description, dueDate } = formState;

    const body = {
      action: "add_milestone",
      client_user_id: clientUserId,
      job_post_id: jobPostId,
      amount: amount,
      description: description,
      title: convertToTitleCase(title),
      due_date: dueDate,
    };

    setLoading(true);
    const promise = manageMilestone(body);

    toast.promise(promise, {
      loading: "Loading...",
      success: (res: { message: string }) => {
        setLoading(false);
        toggle();
        onSubmit();
        setFormState(initialValues);
        return res.message;
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || "error";
      },
    });
  };

  const closeModal = () => {
    setLoading(false);
    setFormState(initialValues);
    setErrors({});
    toggle();
  };

  const calculateFinalAmount = useMemo(() => {
    const { amount } = formState;
    if (amount) {
      const finalAmount = parseFloat(amount) * ((100 - zehmizehFees) / 100);

      if (isNaN(finalAmount)) return "0";

      return numberWithCommas(finalAmount, "USD");
    }
  }, [formState, zehmizehFees]);

  const onDescriptionChange = (data: any) => {
    handleChange("description", data);
  };

  const tooltipStyle: CSSProperties = {
    position: "relative",
    top: "-3px",
    left: "3px",
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
        <FormWrapper onSubmit={onCreate}>
          <div className="fs-24 font-normal">Propose Milestone</div>
          <div className="form-group">
            <FormLabel className="fs-1rem fw-600">
              Title<span className="mandatory">&nbsp;*</span>
            </FormLabel>
            <Form.Control
              placeholder="Pick a title that indicates what you'll do for this milestone"
              title="Enter a title that captures what you'll complete in this milestone"
              value={formState.title}
              onChange={(e) =>
                handleChange("title", e.target.value.replace(REGEX.TITLE, ""))
              }
              className="form-input"
              maxLength={70}
              autoFocus
            />
            {errors?.title && <ErrorMessage message={errors?.title} />}
          </div>
          <div className="form-group">
            <FormLabel className="fs-1rem fw-300">
              <div className="flex items-center">
                <p className="mb-0 fw-600">
                  Milestone Fee<span className="mandatory">&nbsp;*</span>
                </p>
                {/* <div>
                  <div style={tooltipStyle}>
                    <Tooltip>
                      Write how much you would like to be paid to complete this
                      part of the project.
                    </Tooltip>
                  </div>
                </div> */}
                <span className="fw-500 ms-1 fs-sm">(Min $5)</span>
              </div>
              <p className="fs-14 mb-0 fw-300">
                How much would you like to be paid to complete this part of the
                project?
              </p>
            </FormLabel>
            <Form.Control
              placeholder="Enter amount"
              value={formState.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              className="form-input"
              maxLength={5}
            />
            {formState.amount !== "" && (
              <div className="mt-2 flex items-center">
                <Tooltip className="me-2">
                  <div>
                    <div className="mt-1">
                      Final takeaway: {calculateFinalAmount}
                    </div>
                  </div>
                </Tooltip>
                <div className="fs-1rem font-normal mt-1">
                  ZehMizeh Fee: &nbsp;{zehmizehFees}%
                </div>
              </div>
            )}
            {errors?.amount && <ErrorMessage message={errors?.amount} />}
          </div>

          <div className="form-group">
            <FormLabel className="fs-1rem fw-600">
              Milestone Description<span className="mandatory">&nbsp;*</span>
            </FormLabel>
            <p className="fs-14 fw-300">
              Describe the work you'll deliver in this milestone. What will be
              done when you're finished? What content will you deliver? Is this
              a draft, a segment, a complete project?
            </p>
            <TextEditor
              value={formState.description}
              onChange={onDescriptionChange}
              // placeholder="Describe in detail the work you’ll be delivering in this milestone. What will be done at the end of this process? What content will you deliver to the client? Is this a draft? Is this a segment of the project or the whole thing? Be as specific as you can."
              placeholder="Write the milestone description here."
              maxChars={2000}
            />
            {errors?.description && (
              <ErrorMessage message={errors?.description} />
            )}
          </div>

          <div className="form-group">
            <FormLabel className="fs-1rem fw-600">
              Due Date<span className="mandatory">&nbsp;*</span>
            </FormLabel>
            {/* <Form.Control
              type="date"
              id="dob"
              className="appearance-none form-input"
              min={new Date().toISOString().split('T')[0]}
              max={moment().add(3, 'years').toISOString().split('T')[0]}
              onChange={(e) => handleChange('dueDate', e.target.value)}
            /> */}
            <NewCustomDatePicker
              id="due_date"
              placeholderText="Select due date"
              onChange={(value) =>
                handleChange("dueDate", adjustTimezone(value))
              }
              selected={formState?.dueDate && new Date(formState?.dueDate)}
              minDate={new Date()}
              format="YYYY-MM-DD"
              maxDate={
                new Date(moment().add(3, "years").toISOString().split("T")[0])
              }
              isClearable={!!formState?.dueDate}
            />
            {errors?.dueDate && <ErrorMessage message={errors?.dueDate} />}
          </div>

          <div className="flex g-2 bottom-buttons">
            <StyledButton
              className={
                isMobile ? "fs-16 font-normal w-100" : "fs-16 font-normal"
              }
              padding="0.8125rem 2rem"
              type="submit"
              disabled={loading}
            >
              {/* Create */}
              Propose New Milestone
            </StyledButton>
          </div>
        </FormWrapper>
      </Modal.Body>
    </StyledModal>
  );
};

export default AddMilestoneForm;
