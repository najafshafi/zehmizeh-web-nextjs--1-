import { StyledButton } from "@/components/forms/Buttons";
import { StyledModal } from "@/components/styled/StyledModal";
import { queryKeys } from "@/helpers/const/queryKeys";
import { useRefetch } from "@/helpers/hooks/useQueryData";
import { budgetChangeAcceptOrDenied } from "@/helpers/http/proposals";
import { TapiResponse } from "@/helpers/types/apiRequestResponse";
import { TJobDetails } from "@/helpers/types/job.type";
import { useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import styled from "styled-components";

const Wrapper = styled.div`
  .title {
    font-size: 26px;
    font-weight: 400;
    text-align: center;
  }
  .content {
    margin-top: 1.5rem;
    font-size: 1.1rem;
    text-align: center;
    p {
      margin-bottom: 0px;
    }
  }
`;

type Props = {
  jobDetails: TJobDetails;
  userType: "client" | "freelancer";
};

export const ChangeBudgetRequestModal = ({ jobDetails, userType }: Props) => {
  const jobTypeText =
    jobDetails.proposal.approved_budget.type === "fixed"
      ? "budget"
      : "hourly rate";

  const { refetch } = useRefetch(queryKeys.jobDetails(jobDetails.job_post_id));

  const [loading, setLoading] = useState<boolean>(false);

  /*
  1. budget change status is pending
  2. if client requested budget change then currect user should be freelancer and vice versa
  */
  const shouldShowModal = useMemo(() => {
    let isCorrectUser = false;
    if (jobDetails?.proposal?.budget_change?.requested_by === "client")
      isCorrectUser = userType === "freelancer";
    if (jobDetails?.proposal?.budget_change?.requested_by === "freelancer")
      isCorrectUser = userType === "client";

    return (
      jobDetails.proposal.budget_change.status === "pending" && isCorrectUser
    );
  }, [
    jobDetails?.proposal?.budget_change?.requested_by,
    jobDetails?.proposal?.budget_change?.status,
    userType,
  ]);

  // api call
  const apiCall = async (isAccepted: boolean) => {
    const res = await budgetChangeAcceptOrDenied({
      job_post_id: jobDetails.job_post_id,
      status: isAccepted ? "accepted" : "denied",
    });
    await refetch();
    return res;
  };

  const handleSubmit = (isAccepted: boolean) => {
    setLoading(true);

    toast.promise(apiCall(isAccepted), {
      loading: "Please wait...",
      success: (res: TapiResponse<unknown>) => {
        setLoading(false);
        return res?.message;
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || "error";
      },
    });
  };

  const textContent = useMemo(() => {
    let buttons: { text: string; variant: string; onClick: () => void }[],
      note: string,
      header: string,
      contentText: string;

    if (userType === "client") {
      header = `Your Freelancer is Requesting a ${jobTypeText} Increase`;
      contentText = `Your freelancer has requested the project's ${jobTypeText} be raised from <b>$${jobDetails.proposal.approved_budget.amount}</b> to <b>$${jobDetails.proposal.budget_change.amount}</b>.<br/>If you agree to this ${jobTypeText}, click the 'Accept Increase' button
              below.<br/>If you do not want to increase for now, click the 'Decline' button
              below.`;
      buttons = [
        {
          text: "Decline",
          onClick: () => handleSubmit(false),
          variant: "secondary",
        },
        {
          text: "Accept Increase",
          onClick: () => handleSubmit(true),
          variant: "primary",
        },
      ];
    }
    if (userType === "freelancer") {
      header = `Your Client is Requesting a ${jobTypeText} Decrease`;
      contentText = `Your client has requested the project's ${jobTypeText} be reduced from <b>$${jobDetails.proposal.approved_budget.amount}</b> to <b>$${jobDetails.proposal.budget_change.amount}</b> \nIf you agree to this ${jobTypeText}, click the 'Accept Decrease' button
              below.\nIf you do not want to decrease for now, click the 'Decline' button
              below.`;
      buttons = [
        {
          text: "Decline",
          onClick: () => handleSubmit(false),
          variant: "secondary",
        },
        {
          text: "Accept Decrease",
          onClick: () => handleSubmit(true),
          variant: "primary",
        },
      ];
    }
    return { buttons, note, header, contentText };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    jobDetails?.proposal?.approved_budget?.amount,
    jobDetails?.proposal?.budget_change?.amount,
    jobTypeText,
    userType,
  ]);

  return (
    <StyledModal show={shouldShowModal} size="lg" centered>
      <Modal.Body>
        <Wrapper>
          <div className="title">{textContent.header}</div>
          <div className="content">
            <p dangerouslySetInnerHTML={{ __html: textContent.contentText }} />
          </div>
          <div className="mt-4 flex items-center justify-center gap-4">
            {textContent.buttons.map(({ onClick, text, variant }) => (
              <StyledButton
                key={text}
                variant={variant}
                type="submit"
                disabled={loading}
                onClick={() => onClick()}
              >
                {text}
              </StyledButton>
            ))}
          </div>
        </Wrapper>
      </Modal.Body>
    </StyledModal>
  );
};
