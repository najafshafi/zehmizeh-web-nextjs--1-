import { useEffect, useState } from "react";
import EndJobStatus from "./EndJobStatus";
import Feedback from "./Feedback";
import { useQueryData } from "@/helpers/hooks/useQueryData";
import { isNotAllowedToSubmitReview } from "@/helpers/utils/helper";
import { CloseProjectWithoutFeedback } from "./CloseProjectWithoutFeedback";
import { queryKeys } from "@/helpers/const/queryKeys";

type Props = {
  show: boolean;
  toggle: () => void;
  freelancerName: string;
  jobPostId: string;
  endJobSelectedStatus?: string;
  onEndJob?: () => void;
  onError: (msg: string) => void;
  required?: boolean;
};

// Define an interface for job details
interface JobDetails {
  [key: string]: any;
}

const EndModal = ({
  show,
  toggle,
  onEndJob,
  freelancerName,
  jobPostId,
  endJobSelectedStatus,
  onError,
  required,
}: Props) => {
  const { data: jobDetails = {} } = (useQueryData(
    queryKeys.jobDetails(jobPostId)
  ) || {}) as { data?: JobDetails };

  const dontAllowToSubmitReview = isNotAllowedToSubmitReview(jobDetails);

  const [endJobStatusState, setEndJobStatusState] = useState<{
    selectedStatus: string;
    endingReason?: string;
    incompleteJobDescription?: string;
  }>({
    selectedStatus: "",
  });

  const onCloseModal = () => {
    if (required) return;
    toggle();
    setEndJobStatusState({
      selectedStatus: "",
      endingReason: "",
      incompleteJobDescription: "",
    });
  };

  const onContinueWithStatus = (endJobState: {
    selectedStatus: string;
    endingReason?: string;
    incompleteJobDescription?: string;
  }) => {
    setEndJobStatusState(endJobState);
  };

  useEffect(() => {
    if (endJobSelectedStatus) {
      setEndJobStatusState({
        selectedStatus: endJobSelectedStatus,
        endingReason: "",
        incompleteJobDescription: "",
      });
    }
  }, [endJobSelectedStatus]);

  const onEndConfim = (onlyToggleModal = false) => {
    toggle();
    if (!onlyToggleModal && onEndJob) {
      onEndJob();
    }
  };

  const handleEndJobError = (msg: string) => {
    toggle();
    onError(msg);
  };

  const ModalBody = () => {
    if (dontAllowToSubmitReview)
      return (
        <CloseProjectWithoutFeedback
          onEndJob={onEndConfim}
          jobPostId={jobPostId}
          onError={handleEndJobError}
          jobDetails={jobDetails}
        />
      );

    if (
      endJobStatusState?.selectedStatus === "" ||
      (endJobStatusState?.selectedStatus === "in-complete" &&
        endJobStatusState?.endingReason === "")
    ) {
      return (
        <EndJobStatus
          endJobSelectedStatus={endJobSelectedStatus || ""}
          onContinue={onContinueWithStatus}
        />
      );
    }

    if (
      endJobStatusState?.selectedStatus === "closed" ||
      (endJobStatusState?.selectedStatus === "in-complete" &&
        endJobStatusState?.endingReason !== "")
    ) {
      return (
        <Feedback
          onEndJob={onEndConfim}
          freelancerName={freelancerName}
          jobPostId={jobPostId}
          endJobState={endJobStatusState}
          onError={handleEndJobError}
        />
      );
    }
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Background backdrop */}
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={onCloseModal}
      ></div>

      {/* Modal panel */}
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
          {/* Close button */}
          {!required && (
            <button
              onClick={onCloseModal}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 focus:outline-none"
              aria-label="Close"
            >
              <span className="text-2xl">&times;</span>
            </button>
          )}

          {/* Modal content */}
          <div className="relative">
            <ModalBody />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndModal;
