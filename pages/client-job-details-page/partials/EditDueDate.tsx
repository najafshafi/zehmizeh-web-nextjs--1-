/*
 * This is a prompt modal for deleting..
 */
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import moment from "moment";
import { Modal, Button } from "react-bootstrap";
import { StyledModal } from "@/components/styled/StyledModal";
import { StyledButton } from "@/components/forms/Buttons";
import { editJobDueDate } from "@/helpers/http/post-job";
import { adjustTimezone } from "@/helpers/utils/misc";
import NewCustomDatePicker from "@/components/forms/NewDatePicker";

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
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <StyledModal
      maxwidth={570}
      show={show}
      size="lg"
      onHide={toggle}
      centered
      onSubmit={handleUpdate}
    >
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={toggle}>
          &times;
        </Button>
        <form>
          <div className="fs-32 font-normal">Edit Due Date</div>
          {/* <Form.Control
            type="date"
            className="p-3 mt-3"
            value={dueDate}
            onChange={handleDueDateChange}
            min={new Date().toISOString().split('T')[0]}
            max={moment().add(3, 'years').toISOString().split('T')[0]}
          /> */}
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
            <StyledButton
              variant="primary"
              type="submit"
              disabled={loading || !dueDate}
            >
              Update
            </StyledButton>
          </div>
        </form>
      </Modal.Body>
    </StyledModal>
  );
};

export default EditDueDate;
