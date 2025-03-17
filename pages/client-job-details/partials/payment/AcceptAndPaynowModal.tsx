import React from 'react';
import { StyledModal } from 'components/styled/StyledModal';
import { Button, Modal } from 'react-bootstrap';
import Tooltip from 'components/ui/Tooltip';
import { CONSTANTS } from 'helpers/const/constants';
import { numberWithCommas } from 'helpers/utils/misc';
import { usePayments } from 'pages/client-job-details/controllers/usePayments';
import { useQueryData } from 'helpers/hooks/useQueryData';
import { TJobDetails } from 'helpers/types/job.type';
import { queryKeys } from 'helpers/const/queryKeys';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';
import { StyledButton } from 'components/forms/Buttons';

type Props = {
  show: boolean;
  toggle: () => void;
  handlePayment: () => void;
};

export const AcceptAndPaynowModal = ({ show, toggle, handlePayment }: Props) => {
  const { id } = useParams<{ id: string }>();
  const { amount } = usePayments();
  const { data } = useQueryData<TJobDetails>(queryKeys.jobDetails(id));

  const clientAcceptedMilestoneAmount = data?.milestone.reduce((sum, item) => {
    if (item.status === 'paid' || item.status === 'released') {
      return sum + item.amount;
    }
    return sum;
  }, 0);

  const remainingBudget = data?.proposal?.approved_budget?.amount
    ? data.proposal.approved_budget.amount - clientAcceptedMilestoneAmount
    : data?.budget
    ? data.budget.amount - clientAcceptedMilestoneAmount
    : 0;

  const remainingAmount = `${numberWithCommas(remainingBudget, 'USD')}`;
  const isOverBudget = remainingBudget - amount < 0;

  return (
    <StyledModal maxwidth={570} show={show} size="sm" onHide={toggle} centered>
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={toggle}>
          &times;
        </Button>
        <div className="fs-24 fw-400 text-center mb-3">{CONSTANTS.payment.areYouSureAboutThisTransaction}</div>
        <div className="fs-18 fw-400">
          {isOverBudget && (
            <p className="mb-2">
              The remaining budget for this project is <span className="fw-700">{remainingAmount}</span>
              .
              <br />
            </p>
          )}
          <p className={classNames({ 'mb-2': isOverBudget })}>
            If you accept this milestone, <span className="fw-700">{numberWithCommas(amount, 'USD')} </span>
            (plus ZMZ fee)
            <span className="d-inline-block">
              <Tooltip className="ms-1">
                <div>
                  <div>When paying with:</div>
                  <div>Credit Card: 4.9%</div>
                  <div>Bank Account: 3%</div>
                </div>
              </Tooltip>
            </span>{' '}
            will be charged to your account and it will be sent directly to freelancer's account. Because{' '}
            <b>there is no way to undo this</b>, we recommend using 'Send Payment' only{' '}
            <b>after the freelancer has submitted work.</b>
            <br />
            <p className="mt-4">
              Be certain that you've checked everything about the work you're paying for - that all the elements or
              features are working correctly and that there are no missing parts.
            </p>
          </p>
          {isOverBudget && <p>Accepting this milestone will automatically increase the project's budget.</p>}
        </div>
        <div className="d-flex flex-row gap-4 mt-4">
          <StyledButton variant="secondary" onClick={toggle}>
            I'll Review the Work First
          </StyledButton>
          <StyledButton onClick={handlePayment}>Send Payment</StyledButton>
        </div>
      </Modal.Body>
    </StyledModal>
  );
};
