/*
 * This is the main component of the milestones on freelacner side that displays the list of milestones *
 */

import { useState } from 'react';
import moment from 'moment';
import toast from 'react-hot-toast';
import { Spinner } from 'react-bootstrap';
import { MilestonesWrapper, MileStoneListItem } from './milestones.styled';
import { StatusBadge } from '@/components/styled/Badges';
import { StyledButton } from '@/components/forms/Buttons';
import StripeCompleteWarning from '@/components/jobs/StripeCompleteWarning';
import StyledHtmlText from '@/components/ui/StyledHtmlText';
import AttachmentPreview from '@/components/ui/AttachmentPreview';
import AddMilestoneForm from './AddMilestoneForm';
import EditMilestoneForm from './EditMilestoneForm';
import CancelMileStoneModal from './CancelMilestoneModal';
import MoreButton from './MoreButton';
import { convertToTitleCase, formatLocalDate, numberWithCommas } from '@/helpers/utils/misc';
import { manageMilestone } from '@/helpers/http/jobs';
import { getUser } from '@/helpers/http/auth';
import AttachmentSubmitModal, { FileAttachment } from '../modals/AttachmentSubmitModal';
import { MilestoneTypes } from '@/helpers/types/milestone.type';
import Info  from '@/public/icons/info-octashape.svg';
import { paymentProcessingStatusHandler } from '@/helpers/validation/common';
import styled from 'styled-components';
import MarkMilestoneAsCompleted from './MarkMilestoneAsCompletedModal';
import { Link } from 'react-router-dom';

const MilestoneHintText = styled('p')`
  color: ${(props) => props.theme.colors.yellow};
`;

const PAYMENT_STATUS = {
  released: {
    color: 'green',
    label: 'Paid',
  },
  paid: {
    color: 'green',
    label: 'Milestone Accepted',
  },
  under_dispute: {
    color: 'darkPink',
    label: 'Under Dispute',
  },
  waiting_for_release: {
    color: 'yellow',
    label: 'Waiting for Work Approval',
  },
  decline: {
    color: 'darkPink',
    label: 'Client has terminated milestone',
  },
  payment_processing: {
    color: 'yellow',
    label: 'Payment Processing',
  },
  cancelled: {
    color: 'darkPink',
    label: 'Canceled by Freelancer',
  },
  request_revision: {
    color: 'yellow',
    label: 'Revisions Requested',
  },
  pending: {
    color: 'yellow',
    label: 'Milestone Proposal Pending',
  },
  decline_dispute: {
    color: 'darkPink',
    label: '',
  },
  completed_by_freelancer: {
    color: 'yellow',
    label: 'Milestone Completed - Awaiting Payment',
  },
};

const Milestones = ({
  milestone,
  refetch,
  clientUserId,
  jobPostId,
  restrictPostingMilestone = false,
  remainingBudget,
}: {
  milestone: any;
  jobStatus: string;
  refetch: () => void;
  clientUserId: string;
  jobPostId: string;
  restrictPostingMilestone: boolean;
  remainingBudget: number;
}) => {
  const [showMilestoneForm, setShowMilestoneForm] = useState<boolean>(false);
  const [showMarkMilestoneAsCompleted, setShowMarkMilestoneAsCompleted] = useState<{
    show: boolean;
    loading: boolean;
  }>({
    show: false,
    loading: false,
  });

  const [selectedMilestoneId, setSelectedMilestoneId] = useState<number>(0);
  const [editIndex, setEditIndex] = useState<number>(-1);
  const [showAttachmentSubmitModal, setShowAttachmentSubmitModal] = useState<{
    show: boolean;
    loading?: boolean;
  }>({
    show: false,
  });
  const [cancelMilestoneModalState, setCancelMilestoneModalState] = useState<{
    show: boolean;
    milesotne?;
    canceling?: boolean;
  }>({
    show: false,
    canceling: false,
  });

  const [stripeWarningModalState, setStripeModalWarningState] = useState<any>({
    show: false,
    stripeStatus: '',
  });

  const toggleMilestoneForm = () => {
    setShowMilestoneForm(!showMilestoneForm);
  };

  const onDelete = (selectedMilestone: MilestoneTypes) => () => {
    setCancelMilestoneModalState({
      show: true,
      milesotne: selectedMilestone,
    });
  };

  const [postedWork, setPostedWork] = useState<string>('');

  const handleEdit = (index: number) => () => {
    setEditIndex(index);
  };

  const onSubmit = () => {
    setEditIndex(-1);
    refetch();
  };

  const updateMilestoneStatus = (milestoneId: number, fileURL: string) => () => {
    setSelectedMilestoneId(milestoneId);
    const body = {
      action: 'revision_confirm',
      milestone_id: milestoneId,
      attachments: fileURL,
    };
    const promise = manageMilestone(body);
    toast.promise(promise, {
      loading: 'Loading...',
      success: (res) => {
        setSelectedMilestoneId(0);
        setShowAttachmentSubmitModal({ show: false });
        refetch();
        return res.response;
      },
      error: (err) => {
        setShowAttachmentSubmitModal({ show: false });
        setSelectedMilestoneId(0);
        return err?.response?.data?.message || 'error';
      },
    });
  };

  const markMilestoneCompleted = () => {
    setShowMarkMilestoneAsCompleted({
      ...showMarkMilestoneAsCompleted,
      loading: true,
    });

    const body = {
      action: 'completed_by_freelancer',
      milestone_id: selectedMilestoneId,
    };

    const promise = manageMilestone(body);
    toast.promise(promise, {
      loading: 'Loading...',
      success: (res) => {
        setShowMarkMilestoneAsCompleted({ show: false, loading: false });
        refetch();
        return res.message;
      },
      error: (err) => {
        setShowMarkMilestoneAsCompleted({ show: false, loading: false });
        return err?.message;
      },
    });
  };

  const showStripeWarning = (status) => {
    setStripeModalWarningState({
      show: true,
      stripeStatus: status,
    });
  };

  const closeStripeModal = () => {
    setStripeModalWarningState({
      show: false,
      stripeStatus: '',
    });
  };

  const closeCancelMileStoneModal = () => {
    setCancelMilestoneModalState({ show: false });
  };

  const onConfirmDeletion = () => {
    // Delete milestone api call
    const body = {
      action: 'delete_milestone',
      milestone_id: cancelMilestoneModalState.milesotne.milestone_id,
    };
    setCancelMilestoneModalState({
      ...cancelMilestoneModalState,
      canceling: true,
    });

    const promise = manageMilestone(body);
    toast.promise(promise, {
      loading: 'Loading...',
      success: (res) => {
        refetch();
        setCancelMilestoneModalState({ show: false });
        return res?.status === true && 'Your Milestone Canceled Successfully';
      },
      error: (err) => {
        return err?.response?.data?.message || 'error';
      },
    });
  };

  const checkStripeStatus = (milestoneId: number) => {
    /* This will check first if bank account is added or not
     * If not added, it will open the Stripe warning modal and ask to complete that first
     * If adddd, user will be able to cashout
     */
    setSelectedMilestoneId(milestoneId);
    getUser().then((res) => {
      const accounts = res?.data?.account;
      if (accounts?.length > 0) {
        setShowAttachmentSubmitModal({ show: true });
      } else {
        /* This will show that stripe warning popup */
        setSelectedMilestoneId(0);
        showStripeWarning(res?.data?.stp_account_status);
      }
    });
  };

  const closeAttachmentSubmitModal = () => {
    setShowAttachmentSubmitModal({ show: false });
    setPostedWork('');
    setSelectedMilestoneId(0);
  };

  const onConfirm = (attachments: FileAttachment[]) => {
    /* This will request for cashout directly as bank details are added */
    setShowAttachmentSubmitModal({
      ...showAttachmentSubmitModal,
      loading: true,
    });

    let url: string | null = '';
    attachments.map(({ fileName, fileUrl }) => {
      url += `,${fileUrl}#docname=${fileName}`;
    });
    url = url.slice(1);

    return updateMilestoneStatus(selectedMilestoneId, url)();
  };

  const getDateLabel = (milestoneStatus: string) => {
    let label = '';
    switch (milestoneStatus) {
      case 'released':
        label = 'Paid on';
        break;
      case 'paid':
        label = 'Payment Deposited on ';
        break;
      case 'request_revision':
        label = 'Requested Revision on';
        break;
    }
    return label;
  };

  const getDate = (item: MilestoneTypes) => {
    let date = '';
    const milestoneStatus = item.status;
    switch (milestoneStatus) {
      case 'paid':
        date = moment(item?.paid_date).format('MMM DD, YYYY');
        break;
      case 'released':
        date = moment(item?.released_date).format('MMM DD, YYYY');
        break;
      case 'request_revision':
        date = moment(item?.revision_date).format('MMM DD, YYYY');
        break;
    }
    return date;
  };

  return (
    <MilestonesWrapper>
      {milestone?.length == 0 && !restrictPostingMilestone && (
        <div>
          <h4 className="text-center">How To Do Project-Based Projects</h4>
          <b className="fs-18">What are milestones?</b>
          <p className="mt-2">
            In project-based projects, freelancers submit 'milestones' <b>BEFORE they do any work.</b>
          </p>
          <p>
            Milestones are mini-project-proposals, where you propose what work you’ll do for a certain percentage of the
            budget. So if you were going to make three flyers for $300, you could send three milestones, each valued at
            $100.
          </p>
          <p>
            Alternatively, you don’t have to break the budget up. If you’re happy to be paid in one payment at the end
            of the project, you can send one milestone that represents the whole project in exchange for the whole
            project’s budget.
          </p>
          <b className="fs-18">Doing the Project</b>
          <p className="mt-2">
            When you send a milestone and the client accepts it, he will be charged the fee he promised to pay. ZMZ will
            hold that fee for you while you do the work.
          </p>
          <p>
            After submitting the work here in the milestone tab, the client confirms he received what he asked for and
            clicks the “Deliver Payment” button. The fee will then be released and sent on its way to the freelancer’s
            bank account.
          </p>
          <p>
            <b>For more information</b> , check <Link to="/support/faq/working_a_project">Working a Project FAQs</Link>{' '}
            section or by clicking the yellow icon in the bottom right corner.
          </p>
        </div>
      )}

      {milestone?.length > 0 &&
        milestone?.map((item: MilestoneTypes, index: number) =>
          editIndex !== index ? (
            <MileStoneListItem
              key={item?.milestone_id}
              className="d-flex flex-column milestone-item"
              data-milestone-status={item.status}
            >
              <div className="d-flex flex-md-row flex-column justify-content-between gap-3">
                <div className="d-flex justify-content-between">
                  <div>
                    <div className="heading fs-20 fw-400 capital-first-ltr">{convertToTitleCase(item.title)}</div>
                    <div className="fs-32 fw-400 mt-md-2">{numberWithCommas(item.amount, 'USD')}</div>
                  </div>
                  {['request_revision', 'pending'].includes(item?.status) ? (
                    <div className="d-md-none d-block">
                      <MoreButton
                        onDelete={onDelete(item)}
                        handleEdit={handleEdit(index)}
                        isEditEnabled={item?.status === 'request_revision' && false}
                      />
                    </div>
                  ) : item?.status === 'paid' || item?.status === 'request_revision' ? (
                    <div className="d-md-none d-block">
                      <MoreButton onDelete={onDelete(item)} handleEdit={handleEdit(index)} isEditEnabled={false} />
                    </div>
                  ) : null}
                </div>
                <div className="d-flex flex-column align-items-md-end">
                  <div className="d-flex gap-3 align-items-center justify-content-between">
                    <StatusBadge color={PAYMENT_STATUS[item?.status]?.color || 'green'}>
                      {['decline_dispute'].includes(item.status) && item?.dispute_submitted_by === 'CLIENT'
                        ? 'Closed by Client'
                        : ['decline_dispute'].includes(item.status) && item?.dispute_submitted_by === 'FREELANCER'
                        ? 'Canceled'
                        : item?.status === 'payment_processing'
                        ? paymentProcessingStatusHandler(item?.payment_method)
                        : PAYMENT_STATUS[item?.status]?.label}
                    </StatusBadge>

                    {/* This will be hidden from here in mobile */}
                    {['pending'].includes(item?.status) ? (
                      <div className="d-md-block d-none">
                        <MoreButton onDelete={onDelete(item)} handleEdit={handleEdit(index)} />
                      </div>
                    ) : item?.status === 'paid' ? (
                      <div className="d-md-block d-none">
                        <MoreButton onDelete={onDelete(item)} handleEdit={handleEdit(index)} isEditEnabled={false} />
                      </div>
                    ) : item?.status === 'request_revision' ? (
                      <div className="d-md-block d-none">
                        <MoreButton onDelete={onDelete(item)} handleEdit={handleEdit(index)} isEditEnabled={false} />
                      </div>
                    ) : null}
                  </div>

                  {!['pending', 'waiting_for_release', 'cancelled'].includes(item?.status) ? (
                    <div className="mt-3">
                      {!!item.date_created && (
                        <div className="fs-18 fw-400">
                          Submitted on {item.date_created ? moment(item.date_created).format('MMM DD, YYYY') : ''}
                        </div>
                      )}
                      {!!item.cancelled_date && (
                        <div className="fs-18 fw-400">
                          Closed on {item.cancelled_date ? moment(item.cancelled_date).format('MMM DD, YYYY') : ''}
                        </div>
                      )}
                      {
                        <div className="fs-18 fw-400">
                          {getDateLabel(item.status)} {getDate(item)}
                        </div>
                      }
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Description | due date | Attachment | Submit work & Payment button */}
              {/* <div className="d-flex flex-md-row flex-column justify-content-between gap-3 mt-1 align-items-md-end"> */}
              <div>
                <div className="flex-1">
                  <StyledHtmlText needToBeShorten htmlString={item.description} id={`mstone_${item.milestone_id}`} />
                  {item.due_date && item.status !== 'cancelled' && (
                    <div className="mt-md-1 mt-2">Due on {formatLocalDate(item.due_date, 'MMM DD, YYYY')}</div>
                  )}
                  {item?.attachments && (
                    <div className="d-flex align-items-center gap-4 flex-wrap mt-3">
                      {item?.attachments.split(',').map((attachment, index: number) => (
                        <div key={`milestone-${index}`}>
                          <AttachmentPreview
                            uploadedFile={attachment}
                            removable={false}
                            shouldShowFileNameAndExtension={false}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {['paid', 'request_revision', 'waiting_for_release'].includes(item.status) && (
                  <div className="mt-2 d-flex align-items-center justify-content-end gap-3">
                    <StyledButton
                      className="payment-btn py-md-3 px-md-4 p-1"
                      disabled={item?.milestone_id == selectedMilestoneId}
                      onClick={() => {
                        checkStripeStatus(item?.milestone_id);
                        setPostedWork(item.attachments);
                      }}
                    >
                      Post Work
                      {!showMarkMilestoneAsCompleted.show && item?.milestone_id == selectedMilestoneId && (
                        <Spinner size="sm" animation="grow" />
                      )}
                    </StyledButton>

                    <StyledButton
                      className="payment-btn py-md-3 px-md-4 p-1"
                      onClick={() => {
                        setSelectedMilestoneId(item?.milestone_id);
                        setShowMarkMilestoneAsCompleted({
                          ...showMarkMilestoneAsCompleted,
                          show: true,
                        });
                      }}
                    >
                      Mark Milestone as ‘Complete’
                    </StyledButton>
                  </div>
                )}
              </div>

              {/* Hint text to dont start working until milestone is approved */}
              {item.status === 'pending' && (
                <MilestoneHintText className="mb-0 mt-4 text-center fs-20">
                  <b>NOTE:</b> This milestone is pending.
                  <br />
                  <b>Do NOT begin work</b> on it until the client has accepted.
                </MilestoneHintText>
              )}

              {(item.status === 'paid' || (item.revision_date && item.status == 'request_revision')) &&
                item?.status === 'request_revision' && (
                  <div className="revision-banner d-flex align-items-center gap-3 mt-4 rounded-lg p-md-3 p-2">
                    <span>
                      <Info />
                    </span>
                    <span className="ms-2 fs-16 fw-400">Client has requested revisions on this milestone.</span>
                  </div>
                )}
            </MileStoneListItem>
          ) : (
            /* Edit milestone form */
            <EditMilestoneForm
              key={item?.milestone_id}
              onSubmit={onSubmit}
              currentData={item}
              milestoneId={item?.milestone_id}
              cancelEdit={() => setEditIndex(-1)}
              remainingBudget={remainingBudget}
            />
          )
        )}

      {/* Add milestone button */}

      {/* Add milestone form */}
      <AddMilestoneForm
        show={showMilestoneForm}
        toggle={toggleMilestoneForm}
        onSubmit={refetch}
        clientUserId={clientUserId}
        jobPostId={jobPostId}
        remainingBudget={remainingBudget}
      />

      <StripeCompleteWarning
        show={stripeWarningModalState?.show}
        stripeStatus={stripeWarningModalState?.stripeStatus}
        toggle={closeStripeModal}
      />

      <AttachmentSubmitModal
        postedWork={postedWork}
        show={showAttachmentSubmitModal.show}
        toggle={closeAttachmentSubmitModal}
        onConfirm={onConfirm}
        loading={showAttachmentSubmitModal.loading}
      />

      <CancelMileStoneModal
        toggle={closeCancelMileStoneModal}
        onConfirm={onConfirmDeletion}
        cancelStateData={{
          show: cancelMilestoneModalState.show,
          loading: cancelMilestoneModalState.canceling,
          milestoneStatus: cancelMilestoneModalState.milesotne?.status,
        }}
      />

      <MarkMilestoneAsCompleted
        onConfirm={markMilestoneCompleted}
        stateData={showMarkMilestoneAsCompleted}
        toggle={() => {
          setSelectedMilestoneId(0);
          setShowMarkMilestoneAsCompleted({
            loading: false,
            show: false,
          });
        }}
      />
    </MilestonesWrapper>
  );
};

export default Milestones;
