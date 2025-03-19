import { useEffect, useMemo, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import styled from "styled-components";
import { StyledModal } from "@/components/styled/StyledModal";
import { StyledButton } from "@/components/forms/Buttons";
import { showErr } from "@/helpers/utils/misc";
import { budgetChangeRequest } from "@/helpers/http/proposals";
import toast from "react-hot-toast";
import { queryKeys } from "@/helpers/const/queryKeys";
import { useRefetch } from "@/helpers/hooks/useQueryData";
import { StatusBadge } from "@/components/styled/Badges";
import { IoChevronBackSharp } from "react-icons/io5";
import { TJobDetails } from "@/helpers/types/job.type";

const StyledWrapper = styled.div`
  .page-number {
    position: absolute;
    top: 10px;
    right: 10px;
  }
  .back-button {
    position: absolute;
    top: 20px;
    cursor: pointer;
    left: 20px;
  }
  text-align: center;
  .input-symbol-euro {
    position: relative;
  }
  .input-symbol-euro:before {
    position: absolute;
    top: 30%;
    bottom: 0;
    content: "$";
    left: 1rem;
  }
`;

type Props = {
  show: boolean;
  toggle: () => void;
  userType: "freelancer" | "client";
  jobDetails: TJobDetails;
};
type TIncOrDec = "INCREASE" | "DECREASE" | "";

const ChangeBudgetModal = ({ show, toggle, userType, jobDetails }: Props) => {
  const approvedBudget = jobDetails.proposal.approved_budget;
  const jobPostId = jobDetails.job_post_id;
  const jobTypeText =
    approvedBudget.type === "fixed" ? "budget" : "hourly rate";

  /* START ----------------------------------------- Edit configuration */
  const isEdit =
    jobDetails?.proposal?.budget_change?.status === "pending" &&
    jobDetails?.proposal?.budget_change?.requested_by === userType;

  const isEditIncreaseOrDecrease: TIncOrDec =
    isEdit &&
    Number(jobDetails.proposal.approved_budget.amount) >
      Number(jobDetails?.proposal?.budget_change?.amount)
      ? "DECREASE"
      : "INCREASE";
  /* END ------------------------------------------- Edit configuration */

  const { refetch } = useRefetch(queryKeys.jobDetails(jobPostId));

  const [step, setStep] = useState(1);
  const [selectedChange, setSelectedChange] = useState<TIncOrDec>("");
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) setStep(2);
    if (isEditIncreaseOrDecrease) setSelectedChange(isEditIncreaseOrDecrease);
  }, [isEdit, isEditIncreaseOrDecrease, show]);

  /* START ----------------------------------------- Set budget to value state and reset state on closing modal */
  useEffect(() => {
    if (show && approvedBudget?.amount) {
      setValue(Number(approvedBudget?.amount));
    }
    return () => {
      setStep(1);
      setSelectedChange("");
    };
  }, [approvedBudget?.amount, show]);
  /* END ------------------------------------------- Set budget to value state and reset state on closing modal */

  // Check entered value is valid for increase and decrease request
  const isValid = () => {
    if (
      selectedChange === "INCREASE" &&
      Number(value) &&
      Number(value) <= Number(approvedBudget?.amount)
    ) {
      showErr(`Please enter a figure greater than the current ${jobTypeText}.`);
      return false;
    }
    if (
      selectedChange === "DECREASE" &&
      Number(value) &&
      Number(value) >= Number(approvedBudget?.amount)
    ) {
      showErr(`Please enter a figure smaller than the current ${jobTypeText}.`);
      return false;
    }
    return true;
  };

  // api call
  const apiCall = async () => {
    const body = {
      amount: Number(value),
      job_post_id: jobPostId,
    };
    const res = await budgetChangeRequest(body);
    await refetch();
    return res;
  };

  const handleUpdate = () => {
    if (!isValid()) return;

    setLoading(true);
    toast.promise(apiCall(), {
      loading: "Please wait...",
      success: () => {
        toggle();
        setLoading(false);
        let message = "";
        if (userType === "client") {
          if (selectedChange === "INCREASE")
            message = `Increased ${jobTypeText} successfully`;
          else message = `Decrease ${jobTypeText} request sent successfully`;
        } else {
          if (selectedChange === "INCREASE")
            message = `Increase ${jobTypeText} request sent successfully`;
          else message = `Decreased ${jobTypeText} successfully`;
        }
        return message;
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || "error";
      },
    });
  };

  // change page and set type is increase or decrease
  const handleIncreaseOrDecrease = (type: typeof selectedChange) => {
    setSelectedChange(type);
    setStep(2);
  };

  const textContent = useMemo(() => {
    let headers: { step1: string; step2: string },
      buttons: {
        step1: { text: string; onClick: () => void }[];
        step2: { text: string; onClick: () => void };
      },
      note: string | undefined;

    /* START ----------------------------------------- Client side contents */
    if (userType === "client") {
      headers = {
        step1: `Would you like to increase the ${jobTypeText} or request a decrease?`,
        step2:
          selectedChange === "INCREASE"
            ? `Increase ${jobTypeText}`
            : `What would you like the freelancer to decrease the ${jobTypeText} to?`,
      };
      buttons = {
        step1: [
          {
            text: "Request Decrease",
            onClick: () => handleIncreaseOrDecrease("DECREASE"),
          },
          {
            text: "Increase",
            onClick: () => handleIncreaseOrDecrease("INCREASE"),
          },
        ],
        step2: {
          text:
            selectedChange === "INCREASE"
              ? `Increase ${jobTypeText}`
              : `${isEdit ? "Edit Request" : "Request Decrease"}`,
          onClick: handleUpdate,
        },
      };
      note =
        selectedChange === "DECREASE" &&
        `Note: Only freelancers can decrease the project ${jobTypeText}.`;
      /* END ------------------------------------------- Client side contents */

      /* START ----------------------------------------- Freelancer side contents */
    } else {
      headers = {
        step1: `Would you like to decrease the ${jobTypeText} or request an increase?`,
        step2:
          selectedChange === "INCREASE"
            ? `What would you like the client to increase the ${jobTypeText} to?`
            : `Decrease ${jobTypeText}`,
      };
      buttons = {
        step1: [
          {
            text: `Decrease`,
            onClick: () => handleIncreaseOrDecrease("DECREASE"),
          },
          {
            text: "Request Increase",
            onClick: () => handleIncreaseOrDecrease("INCREASE"),
          },
        ],
        step2: {
          text:
            selectedChange === "INCREASE"
              ? `${isEdit ? "Edit Request" : "Request Increase"}`
              : `Decrease ${jobTypeText}`,
          onClick: handleUpdate,
        },
      };
      note =
        selectedChange === "INCREASE" &&
        `Note: Only clients can increase the project ${jobTypeText}.`;
    }
    /* END ------------------------------------------- Freelancer side contents */

    return { headers, buttons, note };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobTypeText, selectedChange, userType, value]);

  let StepUI = <></>;
  if (step === 1) {
    StepUI = (
      <div>
        <div className="fs-32 font-normal">{textContent.headers.step1}</div>
        <div className="mt-4 d-flex flex-row justify-content-center gap-4">
          {textContent.buttons.step1.map(({ onClick, text }) => {
            return (
              <StyledButton
                variant="primary"
                onClick={() => onClick()}
                key={text}
              >
                {text}
              </StyledButton>
            );
          })}
        </div>
      </div>
    );
  }
  if (step === 2) {
    StepUI = (
      <div>
        <div className="fs-32 font-normal">{textContent.headers.step2}</div>
        {textContent?.note && <b>{textContent.note}</b>}
        <div className="input-symbol-euro">
          <Form.Control
            required
            placeholder={`Enter new ${jobTypeText}`}
            value={value || ""}
            onChange={(e) => {
              setValue(Number(e.target.value));
            }}
            className="budget-input mt-3 p-3 ps-4"
            maxLength={approvedBudget.type === "fixed" ? 5 : 3}
          />
        </div>
        <div className="mt-4 d-flex align-items-center justify-content-center gap-2">
          <StyledButton
            variant="primary"
            disabled={loading}
            onClick={() => textContent.buttons.step2.onClick()}
          >
            {textContent.buttons.step2.text}
          </StyledButton>
        </div>
      </div>
    );
  }

  return (
    <StyledModal show={show} size="lg" onHide={toggle} centered>
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={toggle}>
          &times;
        </Button>
        <StyledWrapper>
          {!isEdit && (
            <>
              <StatusBadge className="page-number" color="yellow">
                {step}/2
              </StatusBadge>
              {step > 1 && (
                <IoChevronBackSharp
                  className="back-button"
                  onClick={() => setStep((prev) => prev - 1)}
                />
              )}
            </>
          )}
          {StepUI}
        </StyledWrapper>
      </Modal.Body>
    </StyledModal>
  );
};

export default ChangeBudgetModal;
