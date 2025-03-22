import { Modal, Button } from "react-bootstrap";
import { StyledModal } from "components/styled/StyledModal";
import { StyledButton } from "components/forms/Buttons";
import Tooltip from "components/ui/Tooltip";
import { usePayments } from "pages/client-job-details/controllers/usePayments";
import { numberWithCommas } from "helpers/utils/misc";
import { CONSTANTS } from "helpers/const/constants";
import { useQueryData } from "helpers/hooks/useQueryData";
import { queryKeys } from "helpers/const/queryKeys";
import { useParams } from "react-router-dom";
import { TJobDetails } from "helpers/types/job.type";
import classNames from "classnames";

type Props = {
  show: boolean;
  toggle: () => void;
  onConfirm: () => void;
  loading: boolean;
  isReleasePrompt: boolean;
  buttonText?: string;
};

const ConfirmPaymentModal = ({
  show,
  toggle,
  onConfirm,
  loading,
  isReleasePrompt,
  buttonText,
}: Props) => {
  const { id } = useParams<{ id: string }>();
  const { data } = useQueryData<TJobDetails>(queryKeys.jobDetails(id));
  const { amount, jobType } = usePayments();
  const clientAcceptedMilestoneAmount = data?.milestone.reduce((sum, item) => {
    if (item.status === "paid" || item.status === "released") {
      return sum + item.amount;
    }
    return sum;
  }, 0);
  const remainingBudget = data?.proposal?.approved_budget?.amount
    ? data.proposal.approved_budget.amount - clientAcceptedMilestoneAmount
    : data?.budget
    ? data.budget.amount - clientAcceptedMilestoneAmount
    : 0;

  const remainingAmount = `${numberWithCommas(remainingBudget, "USD")}`;
  const isOverBudget = remainingBudget - amount < 0;
  return (
    <StyledModal maxwidth={570} show={show} size="sm" onHide={toggle} centered>
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={toggle}>
          &times;
        </Button>

        {jobType === "hourly" && (
          <>
            <div className="fs-24 font-normal text-center mb-3">
              {CONSTANTS.payment.areYouSureAboutThisTransaction}
            </div>
            <div className="fs-20 font-normal text-center mb-3">
              Clicking “Pay” on this submission means{" "}
              {numberWithCommas(amount, "USD")} (plus ZMZ fee){" "}
              <span className="d-inline-block">
                <Tooltip className="ms-1">
                  <div>
                    <div>When paying with:</div>
                    <div>Credit Card: 4.9%</div>
                    <div>Bank Account: 2.9%</div>
                  </div>
                </Tooltip>
              </span>{" "}
              will be charged from your account. The money will be sent directly
              to the freelancer and there is no way to undo this.
            </div>
            <div className="fs-20 font-normal text-center">
              Be certain that you've checked everything about the work you're
              paying for - that all the elements or features are working
              correctly and that there are no missing parts.
            </div>
          </>
        )}

        {jobType === "fixed" && (
          <>
            <div className="fs-24 font-normal text-center mb-3">
              {isOverBudget
                ? CONSTANTS.payment.theMilestoneGoesOverBudget
                : isReleasePrompt
                ? CONSTANTS.payment.areYouSureAboutThisDelivery
                : CONSTANTS.payment.areYouSureAboutThisTransaction}
            </div>
            {isReleasePrompt ? (
              <>
                <div className="fs-20 font-normal">
                  This will deliver the milestone deposit (
                  {numberWithCommas(amount, "USD")}) directly to the
                  freelancer's bank account and{" "}
                  <b>there is no way to undo this.</b>
                </div>
                <p className="fs-20 font-normal mt-2">
                  Delivering this payment also means you are confirming that{" "}
                  <b>
                    the freelancer has completed the services they committed to
                    in this milestone.
                  </b>
                </p>
                <p className="fs-20 font-normal mt-2">
                  Be certain that you've checked everything about the work
                  you're paying for - that all the elements or features are
                  working correctly and that there are no missing parts.
                </p>
              </>
            ) : (
              <div className="fs-18 font-normal">
                {isOverBudget && (
                  <p className="mb-2">
                    The remaining budget for this project is{" "}
                    <span className="fw-700">{remainingAmount}</span>
                    .
                    <br />
                  </p>
                )}
                <p className={classNames({ "mb-2": isOverBudget })}>
                  If you accept this milestone,{" "}
                  <span className="fw-700">
                    {numberWithCommas(amount, "USD")}{" "}
                  </span>
                  (plus ZMZ fee)
                  <span className="d-inline-block">
                    <Tooltip className="ms-1">
                      <div>
                        <div>When paying with:</div>
                        <div>Credit Card: 4.9%</div>
                        <div>Bank Account: 3%</div>
                      </div>
                    </Tooltip>
                  </span>{" "}
                  will be charged to your account. It will be held by ZMZ until
                  you request to have the payment delivered.
                </p>
                {isOverBudget && (
                  <p>
                    Accepting this milestone will automatically increase the
                    project's budget.
                  </p>
                )}
              </div>
            )}
          </>
        )}
        <div className="flex flex-col flex-md-row justify-center mt-4 gap-2">
          {isReleasePrompt && (
            <StyledButton
              className="fs-16 font-normal"
              variant="outline-dark"
              padding="0.8125rem 2rem"
              onClick={toggle}
            >
              {CONSTANTS.payment.reviewWorkFirst}
            </StyledButton>
          )}
          <StyledButton
            className="fs-16 font-normal"
            variant="primary"
            padding="0.8125rem 2rem"
            onClick={onConfirm}
            disabled={loading}
          >
            {buttonText || "Confirm"}
          </StyledButton>
        </div>
      </Modal.Body>
    </StyledModal>
  );
};

export default ConfirmPaymentModal;
