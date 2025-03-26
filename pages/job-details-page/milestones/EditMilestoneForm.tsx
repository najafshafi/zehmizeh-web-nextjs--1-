"use client";

/*
 * This is the edit milestone form - Freelancer side
 */

import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import moment from "moment";
import * as yup from "yup";
import { useQuery } from "react-query";
import TextEditor from "@/components/forms/TextEditor";
import ErrorMessage from "@/components/ui/ErrorMessage";
import NewCustomDatePicker from "@/components/forms/NewDatePicker";
import {
  convertToTitleCase,
  getYupErrors,
  numberWithCommas,
} from "@/helpers/utils/misc";
import { manageMilestone } from "@/helpers/http/jobs";
import { getPaymentFees } from "@/helpers/http/common";
import { adjustTimezone } from "@/helpers/utils/misc";
import { REGEX } from "@/helpers/const/regex";

interface MilestoneData {
  title: string;
  amount: string;
  description: string;
  due_date: string;
}

interface FormErrors {
  title?: string;
  amount?: string;
  description?: string;
  dueDate?: string;
}

interface Props {
  onSubmit: () => void;
  cancelEdit: () => void;
  milestoneId: number;
  currentData: MilestoneData;
  remainingBudget: number;
}

const EditMilestoneForm = ({
  onSubmit,
  cancelEdit,
  milestoneId,
  currentData,
  remainingBudget,
}: Props) => {
  const [title, setTitle] = useState<string>(currentData?.title || "");
  const [amount, setAmount] = useState<string>(currentData?.amount || "");
  const [description, setDescription] = useState<string>(
    currentData?.description || ""
  );
  const [dueDate, setDueDate] = useState<string>(currentData?.due_date || "");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const { data: paymentData } = useQuery(
    ["get-payment-fees"],
    () => getPaymentFees(),
    {
      keepPreviousData: true,
      enabled: true,
    }
  );

  const zehmizehFees =
    paymentData?.data[0]?.fee_structure?.OTHER?.percentage || 0;

  const calculateFinalAmount = useMemo(() => {
    if (amount) {
      const finalAmount = parseFloat(amount) * ((100 - zehmizehFees) / 100);
      if (isNaN(finalAmount)) return "0";
      return numberWithCommas(finalAmount, "USD");
    }
  }, [amount, zehmizehFees]);

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
      description: yup.string().required("Please enter a description."),
      title: yup.string().required("Please enter a title"),
      dueDate: yup.string().nullable().required("Please select a due date"),
    })
    .required();

  const onUpdate = (e: React.FormEvent) => {
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
              setErrors(errors as FormErrors);
            });
        } else {
          setErrors({});
          onEditMilestone();
        }
      });
  };

  const onEditMilestone = () => {
    const body = {
      action: "edit_milestone",
      milestone_id: milestoneId,
      amount,
      description,
      title: convertToTitleCase(title),
      due_date: dueDate,
    };

    setLoading(true);
    const promise = manageMilestone(body);
    toast.promise(promise, {
      loading: "Loading...",
      success: (res) => {
        setLoading(false);
        onSubmit();
        return res.response;
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || "error";
      },
    });
  };

  const onDescriptionChange = (data: string) => {
    setDescription(data);
  };

  return (
    <div className="bg-white rounded-xl p-6 md:p-8">
      <form onSubmit={onUpdate} className="flex flex-col gap-6">
        <h2 className="text-2xl font-normal">Edit Milestone</h2>

        <div className="space-y-2">
          <label className="block text-base font-semibold">
            Title<span className="text-red-500">&nbsp;*</span>
          </label>
          <input
            placeholder="Pick a title that indicates what you'll complete in this milestone"
            title="Enter a title that captures what you'll complete in this milestone"
            value={title}
            onChange={(e) => setTitle(e.target.value.replace(REGEX.TITLE, ""))}
            className="w-full px-5 py-4 border rounded-md focus:outline-none border-gray-400 focus:ring-4 focus:ring-[#0d6efd40] transition-all"
            maxLength={70}
            autoFocus
          />
          {errors?.title && <ErrorMessage message={errors.title} />}
        </div>

        <div className="space-y-2">
          <div>
            <label className="block text-base font-semibold">
              Amount<span className="text-red-500">&nbsp;*</span>
              <span className="ml-1 text-sm font-medium">
                (Max {numberWithCommas(remainingBudget, "USD")})
              </span>
            </label>
          </div>
          <input
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-5 py-4 border rounded-md focus:outline-none border-gray-400 focus:ring-4 focus:ring-[#0d6efd40] transition-all"
            maxLength={5}
          />
          {amount !== "" && (
            <div className="mt-2">
              <table className="mx-7">
                <tbody>
                  <tr>
                    <td>ZehMizeh Fee:</td>
                    <td>&nbsp;{zehmizehFees}%</td>
                  </tr>
                  <tr>
                    <td>Your final takeaway:</td>
                    <td className="font-bold">&nbsp;{calculateFinalAmount}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          {errors?.amount && <ErrorMessage message={errors.amount} />}
        </div>

        <div className="space-y-2">
          <label className="block text-base font-semibold">
            Milestone Description<span className="text-red-500">&nbsp;*</span>
          </label>
          <TextEditor
            value={description}
            onChange={onDescriptionChange}
            placeholder="Describe in detail the work you'll be delivering in this milestone. What will be done at the end of this process? What content will you deliver to the client? Is this a draft? Is this a segment of the project or the whole thing? Be as specific as you can."
            maxChars={2000}
          />
          {errors?.description && <ErrorMessage message={errors.description} />}
        </div>

        <div className="space-y-2">
          <label className="block text-base font-semibold">
            Due Date<span className="text-red-500">&nbsp;*</span>
          </label>
          <NewCustomDatePicker
            id="due_date"
            placeholderText="Select due date"
            onChange={(value: Date | null) =>
              setDueDate(value ? adjustTimezone(value).toString() : "")
            }
            selected={dueDate ? new Date(dueDate) : null}
            minDate={new Date()}
            maxDate={new Date(moment().add(3, "years").toISOString())}
            isClearable={!!dueDate}
          />
          {errors?.dueDate && <ErrorMessage message={errors.dueDate} />}
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={cancelEdit}
            className="px-8 py-3 text-base font-normal border-2 border-gray-800 text-gray-800 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 text-base font-normal bg-[#F2B420] text-[#212529] rounded-full hover:scale-105 transition-transform duration-200 disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMilestoneForm;
