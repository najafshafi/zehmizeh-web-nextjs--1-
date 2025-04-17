/*
 * This is a prompt modal for editing due date
 */
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import moment from "moment";
import { adjustTimezone } from "@/helpers/utils/misc";
import NewCustomDatePicker from "@/components/forms/NewDatePicker";
import CustomButton from "@/components/custombutton/CustomButton";
import { VscClose } from "react-icons/vsc";

import { editJobDueDate } from "@/helpers/http/post-job";

type Props = {
  show: boolean;
  toggle: () => void;
  update?: () => void;
  data?: {
    jobId?: string;
    dueDate?: string;
  };
};

const EditDueDate = ({ show, toggle, update, data }: Props) => {
  const [dueDate, setDueDate] = React.useState<Date | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    if (show && data?.dueDate) {
      const currentSetDate = new Date(data?.dueDate);
      setDueDate(currentSetDate);
    }
  }, [data?.dueDate, show]);

  /** @function This will set the entered due date into the state */
  const handleDueDateChange = (value: Date) => {
    if (value) {
      setDueDate(adjustTimezone(value) as Date);
    } else {
      setDueDate(null);
    }
  };

  /** @function This will call an api to update the due date */
  const handleUpdate = () => {
    setLoading(true);

    // Ensure job_post_id is defined
    if (!data?.jobId) {
      toast.error("Job ID is required");
      setLoading(false);
      return;
    }

    const body = {
      due_date: moment(dueDate).format("YYYY-MM-DD"),
      job_post_id: data.jobId,
    };

    const promise = editJobDueDate(body);
    toast.promise(promise, {
      loading: "Please wait...",
      success: (res) => {
        if (update) {
          update();
        }
        toggle();
        setLoading(false);
        return res.response || "Due date updated successfully";
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || "error";
      },
    });
  };

  const isDateSelectable = (date: Date) => {
    if (!dueDate) return new Date();
    const oneWeekLater = new Date(dueDate);
    oneWeekLater.setDate(dueDate.getDate() + 7);
    return date >= oneWeekLater;
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={toggle}
      />
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div className="relative w-full max-w-[570px] transform rounded-2xl bg-white px-6 py-8 text-left align-middle shadow-xl transition-all">
            <button
              onClick={toggle}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <VscClose className="h-6 w-6" />
            </button>

            <div className="text-3xl font-normal mb-4">Edit Due Date</div>

            <NewCustomDatePicker
              placeholderText="Due Date"
              onChange={handleDueDateChange}
              selected={dueDate}
              minDate={dueDate ? dueDate : new Date()}
              format="YYYY-MM-DD"
              filterDate={isDateSelectable}
              maxDate={
                new Date(moment().add(3, "years").toISOString().split("T")[0])
              }
              isClearable={!!dueDate}
            />

            <div className="mt-4 flex items-center justify-end gap-2">
              <CustomButton
                text="Update"
                className="px-[2rem] py-[1rem] transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[16px] border border-primary"
                disabled={loading || !dueDate}
                onClick={handleUpdate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDueDate;
