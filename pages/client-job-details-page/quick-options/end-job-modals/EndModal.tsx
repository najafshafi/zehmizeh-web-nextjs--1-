/*
 * This is a modal that asks for review when ending the job
 */

import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import styled from "styled-components";
import { StyledModal } from "@/components/styled/StyledModal";
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

const Wrapper = styled.div``;

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

    // Return null as a fallback
    return null;
  };

  return (
    <StyledModal
      maxwidth={678}
      show={show}
      size="lg"
      onHide={onCloseModal}
      centered
    >
      <Modal.Body>
        {!required && (
          <Button
            variant="transparent"
            className="close"
            onClick={onCloseModal}
          >
            &times;
          </Button>
        )}
        <Wrapper>
          <ModalBody />
        </Wrapper>
      </Modal.Body>
    </StyledModal>
  );
};

export default EndModal;
