"use client";

/*
 * This is the Add milestone form - Freelancer side *
 */

import { useCallback, useMemo, useState, useEffect } from "react";
import toast from "react-hot-toast";
import moment from "moment";
import * as yup from "yup";
import { useQuery } from "react-query";

import { VscClose } from "react-icons/vsc";
import ErrorMessage from "@/components/ui/ErrorMessage";
import TextEditor from "@/components/forms/TextEditor";

import Tooltip from "@/components/ui/Tooltip";
import {
  convertToTitleCase,
  getYupErrors,
  numberWithCommas,
} from "@/helpers/utils/misc";
import { manageMilestone } from "@/helpers/http/jobs";
import { adjustTimezone } from "@/helpers/utils/misc";
import useResponsive from "@/helpers/hooks/useResponsive";
import { getPaymentFees } from "@/helpers/http/common";
import { REGEX } from "@/helpers/const/regex";
import NewCustomDatePicker from "@/components/forms/NewDatePicker";

// import { useAuth } from "@/helpers/contexts/auth-context";


interface FormState {
  title: string;
  amount: string;
  description: string;
  dueDate: string;
}

interface FormErrors {
  title?: string;
  amount?: string;
  description?: string;
  dueDate?: string;
}

interface Props {
  show: boolean;
  toggle: () => void;
  onSubmit: () => void;
  clientUserId: string;
  jobPostId: string;
  remainingBudget: number;
}

const initialValues: FormState = {
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
}: Props) => {
  const { isMobile } = useResponsive();
  const [formState, setFormState] = useState<FormState>(initialValues);
  const [isMaxLimitReached] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = useCallback((field: keyof FormState, value: string) => {
    setFormState((prevFormState) => ({
      ...prevFormState,
      [field]: value,
    }));
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

  const onCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const { title, amount, description, dueDate } = formState;

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
              setErrors(errors as FormErrors);
            });
        } else {
          setErrors({});
          if (isMaxLimitReached) {
            toast.error("Maximum 2000 characters are allowed for description");
            return;
          }
          addNewMilestone();
        }
      });
  };

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

  useEffect(() => {
    if (show) {
      // Store current scroll position and body padding
      const scrollY = window.scrollY;
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      // Prevent content shift when scrollbar disappears
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      // Fix the body
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
    } else {
      // Restore scroll position and body padding
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.paddingRight = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }

    return () => {
      // Cleanup in case component unmounts while modal is open
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.paddingRight = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    };
  }, [show]);

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

  const onDescriptionChange = (data: string) => {
    handleChange("description", data);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={closeModal}
      />

      {/* Modal Container with scroll */}
      <div className="absolute inset-0 overflow-y-auto hide-scrollbar">
        <div className="min-h-full flex items-center justify-center p-4">
          {/* Modal Content */}
          <div className="relative bg-white rounded-xl w-full max-w-[570px] my-8">
            <button
              type="button"
              className="absolute right-4 top-4 md:top-0 md:-right-8 md:text-white text-gray-500 hover:text-gray-700 transition-colors duration-200 z-10"
              onClick={closeModal}
              aria-label="Close modal"
            >
              <VscClose size={24} />
            </button>

            <div className="px-6 py-8 md:p-12">
              <form onSubmit={onCreate} className="flex flex-col gap-6">
                <h2 className="text-2xl font-normal">Propose Milestone</h2>

                <div className="space-y-2">
                  <label className="block text-base font-semibold">
                    Title<span className="text-red-500">&nbsp;*</span>
                  </label>
                  <input
                    placeholder="Pick a title that indicates what you'll do for this milestone"
                    title="Enter a title that captures what you'll complete in this milestone"
                    value={formState.title}
                    onChange={(e) =>
                      handleChange(
                        "title",
                        e.target.value.replace(REGEX.TITLE, "")
                      )
                    }
                    className="w-full px-5 py-4 border rounded-md focus:outline-none border-gray-400 focus:ring-4 focus:ring-[#0d6efd40] transition-all"
                    maxLength={70}
                    autoFocus
                  />
                  {errors?.title && <ErrorMessage message={errors.title} />}
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-base font-semibold">
                      Milestone Fee<span className="text-red-500">&nbsp;*</span>
                      <span className="ml-1 text-sm font-medium">(Min $5)</span>
                    </label>
                    <p className="text-sm text-gray-600">
                      How much would you like to be paid to complete this part
                      of the project?
                    </p>
                  </div>
                  <input
                    placeholder="Enter amount"
                    value={formState.amount}
                    onChange={(e) => handleChange("amount", e.target.value)}
                    className="w-full px-5 py-4 border rounded-md focus:outline-none border-gray-400 focus:ring-4 focus:ring-[#0d6efd40] transition-all"
                    maxLength={5}
                  />
                  {formState.amount !== "" && (
                    <div className="flex items-center gap-2 text-sm">
                      <Tooltip>
                        <div>Final takeaway: {calculateFinalAmount}</div>
                      </Tooltip>
                      <div>ZehMizeh Fee: {zehmizehFees}%</div>
                    </div>
                  )}
                  {errors?.amount && <ErrorMessage message={errors.amount} />}
                </div>

                <div className="space-y-2">
                  <label className="block text-base font-semibold">
                    Milestone Description
                    <span className="text-red-500">&nbsp;*</span>
                  </label>
                  <p className="text-sm text-gray-600">
                    Describe the work you&apos;ll deliver in this milestone.
                    What will be done when you&apos;re finished? What content
                    will you deliver? Is this a draft, a segment, a complete
                    project?
                  </p>
                  <TextEditor
                    value={formState.description}
                    onChange={onDescriptionChange}
                    placeholder="Write the milestone description here."
                    maxChars={2000}
                  />
                  {errors?.description && (
                    <ErrorMessage message={errors.description} />
                  )}
                </div>

                <div className="w-full space-y-2">
                  <label className="block text-base font-semibold">
                    Due Date<span className="text-red-500">&nbsp;*</span>
                  </label>
                  <NewCustomDatePicker
                    id="due_date"
                    placeholderText="Select due date"
                    onChange={(value: Date | null) =>
                      handleChange(
                        "dueDate",
                        value ? adjustTimezone(value).toString() : ""
                      )
                    }
                    selected={
                      formState?.dueDate ? new Date(formState.dueDate) : null
                    }
                    minDate={new Date()}
                    format="YYYY-MM-DD"
                    maxDate={new Date(moment().add(3, "years").toISOString())}
                    isClearable={!!formState?.dueDate}
                  />
                  {errors?.dueDate && <ErrorMessage message={errors.dueDate} />}
                </div>


                <div
                  className={`${isMobile ? "w-full" : "w-fit"} flex self-end`}
                >
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#f2b420] text-[#212529] px-9 py-[1.15rem] hover:scale-105 duration-300 text-lg rounded-full disabled:opacity-70 "
                  >
                    Propose New Milestone
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMilestoneForm;
