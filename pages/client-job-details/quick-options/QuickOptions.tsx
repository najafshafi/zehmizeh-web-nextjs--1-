import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { StyledButton } from 'components/forms/Buttons';
import SelectJobModal from 'components/invite-flow-modals/SelectJobModal';
import InviteFreelancerMessageModal from 'components/invite-flow-modals/InviteFreelancerMessageModal';
import InviteFreelancer from './InviteFreelancer';
import JobEndedSuccessModal from './JobEndedSuccessModal';
import EndJobErrorModal from 'components/jobs/EndJobErrorModal';
import FreelancerClosureRequestModal from './FreelancerClosureRequestModal';
import EndModal from './end-job-modals/EndModal';
import DeletePropmpt from 'components/ui/DeletePropmpt';
import { deleteJob } from 'helpers/http/client';
import { inviteFreelancer, jobClosureRequest, manageHours, manageMilestoneNew } from 'helpers/http/jobs';
import useResponsive from 'helpers/hooks/useResponsive';
import { transition } from 'styles/transitions';
import PaymentModal from '../partials/payment/PaymentModal';
import { usePayments } from '../controllers/usePayments';
import { MilestoneListModal } from '../partials/milestones/milestoneListModal';
import ConfirmPaymentModal from '../partials/payment/ConfirmPaymentModal';
import { goBack } from 'helpers/utils/goBack';
import { isNotAllowedToSubmitReview } from 'helpers/utils/helper';
import ProposalExistsModal from 'components/invite-flow-modals/ProposalExistsModa';
import { TcomponentConnectorRef } from '../ClientJobDetails';
import { AcceptAndPaynowModal } from '../partials/payment/AcceptAndPaynowModal';

const QuickOptionWrapper = styled.div`
  gap: 12px;
  .round-button {
    height: 3.25rem;
    width: 3.25rem;
    border-radius: 3.75rem;
    background: ${(props) => props.theme.colors.white};
    ${() => transition()};
  }
`;

type Props = {
  jobData: {
    status: string;
    jobPostId: string;
    jobType: string;
    freelancerUserId: string;
    freelancerData;
    isClosureRequest: number;
    closureReqBy: string;
    isFinalMilestonePosted: boolean;
    openEndJobStatusModal: boolean;
    enableEndJobButton: boolean;
    milestones;
    endJobStatus?: string;
    activeTab?: string;
    is_client_feedback?: boolean;
    job_reason?: string;
    is_completed?: 0 | 1;
  };
  refetch: any;
  goToMilestonesTab: () => void;
  onEndJobModal: (status: string) => void;
  payAllBtn?: boolean;
  componentConnectorRef?: TcomponentConnectorRef;
};

const QuickOptions = ({ jobData, refetch, goToMilestonesTab, onEndJobModal, componentConnectorRef }: Props) => {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  const [loading, setLoading] = useState<boolean>(false);
  const [sendingInvite, setSendingInvite] = useState<boolean>(false);
  const [showJobsModal, setShowJobsModal] = useState<boolean>(false);
  const [proposalExistModal, setProposalExistModal] = useState<boolean>(false);
  const [showInviteMessageModal, setShowInviteMessageModal] = useState<boolean>(false);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [endJobStatusModal, setEndJobStatusModal] = useState<{
    show: boolean;
    endJobSelectedStatus?: string;
  }>({
    show: false,
  });

  const [endJobSuccessModal, setEndJobSuccessModal] = useState<boolean>(false);
  const [freelancersModal, setFreelancersModal] = useState<boolean>(false);
  const [selectedFreelancer, setSelectedFreelancer] = useState<any>(null);

  const [freelancerClosureRequestModal, setFreelancerClosureRequestModal] = useState<boolean>(false);

  const [showEndJobErrorModalState, setShowEndJobErrorModalState] = useState<{
    show: boolean;
    error?: string;
  }>({
    show: false,
    error: '',
  });
  const [showDeleteJobModal, setShowDeleteJobModal] = useState<boolean>(false);

  const { setAmount, setJobType, selectedPaymentMethod, payDirectlyToFreelancer } = usePayments();
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentProcessing, setPaymentProcessing] = useState<boolean>();
  const [unPaidMilestones, setUnpaidMilestones] = useState<any[]>();
  const [isOpenMilestoneListModal, setIsOpenMilestoneListModal] = useState(false);
  const [selectedMilestones, setSelectedMilestones] = useState<any[]>([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
  const [showPayNowModal, setShowPayNowModal] = useState<boolean>(false);
  const [disputeMilestone, setDisputeMileStone] = useState<any>();
  const [isPayNow, setIsPayNow] = useState(false);

  // If job was closed by cron in 3 weeks duration
  // and freelancer was paid then client has to submit feedback
  // 1. job type is hourly = because only in hourly project it'll require for feedback
  // 2. status is closed = project is already closed by cron job or manually
  // 3. job is incomplete = job should be incomplete because on cron it'll be marked incomplete and won't have job reason
  // 4. has job reason for closure
  //             if closed by cron it won't have reason and client required to submit feedback when he/she opens it
  //             if closed manually then it'll have job reason and modal won't show again
  // 5. If there aren't any milestone then job should be incomplete because no work has been done.
  //    it'll show different popup notifying that it'll be marked as incomplete and can't submit feedback
  //    here job reason will be "freelancer hasnt been paid at all"
  const requireFeedbackHourlyClosedJob =
    jobData?.jobType === 'hourly' &&
    jobData?.status === 'closed' &&
    Number(jobData?.is_completed) === 0 &&
    !jobData?.job_reason &&
    !isNotAllowedToSubmitReview({ milestone: jobData.milestones });

  useEffect(() => {
    if (jobData) {
      if (jobData?.status === 'active' && jobData?.openEndJobStatusModal) {
        setEndJobStatusModal({
          show: true,
          endJobSelectedStatus: jobData?.endJobStatus,
        });
      }
    }
  }, [jobData]);

  const toggleDeleteJobModal = () => {
    setShowDeleteJobModal(!showDeleteJobModal);
  };

  const onDelete = () => {
    setLoading(true);
    const promise = deleteJob(jobData?.jobPostId);

    toast.promise(promise, {
      loading: 'Deleting the project...',
      success: (res) => {
        goBack(navigate, '/client-jobs');
        setLoading(false);
        return res.response;
      },
      error: (err) => {
        setLoading(false);
        return err?.response || 'error';
      },
    });
  };

  const toggleJobsModal = () => {
    setShowJobsModal(!showJobsModal);
  };

  const toggleInviteMessageModal = () => {
    setShowInviteMessageModal(!showInviteMessageModal);
  };

  const toggleEndJobSuccessModal = () => {
    setEndJobSuccessModal(!endJobSuccessModal);
    if (endJobSuccessModal) {
      refetch('feedback')();
    }
    // else {
    //   setEndJobModal(false);
    // }
    onEndJobModal('success');
  };

  const onSelectJobAndContinue = (jobId, proposalExists: boolean) => {
    toggleJobsModal();
    setSelectedJobId(jobId);
    if (!proposalExists) toggleInviteMessageModal();
    else setProposalExistModal(true);
  };

  const onInvite = (msg: string) => {
    const body: any = {
      job_post_id: selectedJobId,
      freelancer_user_id: selectedFreelancer ? selectedFreelancer : [jobData?.freelancerUserId],
    };
    setSendingInvite(true);
    if (msg !== '') {
      body.message = msg;
    }
    inviteFreelancer(body)
      .then((res) => {
        setSendingInvite(false);

        if (res.message === 'PROPOSAL_EXIST') {
          toggleInviteMessageModal();
          setProposalExistModal(true);
          setSelectedJobId(body.job_post_id);
          return;
        }

        if (res.status) {
          toast.success(`Invitation sent successfully!`);
          toggleInviteMessageModal();
          setSelectedJobId('');
          setSelectedFreelancer([]);
        } else {
          setSelectedFreelancer([]);
          toast.error(res?.message ? res?.message : 'Invitation not sent successfully!');
        }
      })
      .catch(() => {
        setSelectedFreelancer([]);
        setSendingInvite(false);
      });
  };

  const openEndJobModal = () => {
    setEndJobStatusModal({
      show: true,
    });
  };

  const openEndJobErrorModal = () => {
    setShowEndJobErrorModalState({
      show: true,
    });
  };

  const closeEndJobModal = () => {
    const final_milestone = jobData?.milestones?.filter((jb) => jb.is_final_milestone);
    const status_arr = ['paid', 'released', 'payment_processing'];
    if (
      final_milestone.length > 0 &&
      status_arr.includes(final_milestone[0]?.hourly_status) &&
      jobData?.status === 'active' &&
      !jobData?.milestones?.filter((data: any) => status_arr.includes(data?.hourly_status)).includes(false)
    ) {
      onEndJobModal('open');
      setEndJobStatusModal({
        show: true,
      });
    } else {
      onEndJobModal('close');
      setEndJobStatusModal({
        show: false,
      });
    }
  };
  const toggleFreelancerClosureRequest = () => {
    setFreelancerClosureRequestModal(!freelancerClosureRequestModal);
  };

  const onConfirm = () => {
    setLoading(true);
    const body: any = {
      job_id: jobData?.jobPostId,
    };

    toast.loading('Please wait...');

    jobClosureRequest(body)
      .then((res) => {
        toast.dismiss();
        setLoading(false);
        if (res.status) {
          toggleFreelancerClosureRequest();
          toast.success(res.response);
          refetch('m_stone')();
        } else {
          toggleFreelancerClosureRequest();
          setShowEndJobErrorModalState({ show: true, error: res.message });
        }
      })
      .catch((err) => {
        toast.dismiss();
        setLoading(false);
        toggleFreelancerClosureRequest();
        setShowEndJobErrorModalState({
          show: true,
          error: err?.response?.data?.message,
        });
      });
  };

  const toggleEndJobModal = () => {
    onEndJobModal('show');
  };

  const toggleFreelancersModal = () => {
    setFreelancersModal(!freelancersModal);
  };

  const openInviteMessageModal = (selected) => {
    toggleFreelancersModal();
    setSelectedFreelancer(selected);
    toggleInviteMessageModal();
  };

  const onEndJobError = (msg: string) => {
    toggleEndJobModal();
    setShowEndJobErrorModalState({ show: true, error: msg });
  };

  const goToMilestones = () => {
    closeEndJobErrorModal();
    goToMilestonesTab();
  };

  const closeEndJobErrorModal = () => {
    setShowEndJobErrorModalState({
      show: false,
      error: '',
    });
    onEndJobModal('error');
  };

  const checkAnyOpenMilestone = (cb: () => void) => () => {
    const jobType = jobData?.jobType;
    let allowedStatus = [];
    if (jobType === 'hourly') {
      allowedStatus = ['paid', 'decline', 'released', 'under_dispute', 'cancelled', 'decline_dispute'];
    } else {
      allowedStatus = ['pending', 'released', 'decline', 'under_dispute', 'cancelled', 'decline_dispute'];
    }
    const notPaidMilestone = jobData.milestones?.findIndex(
      (item) => !allowedStatus.includes(jobType === 'hourly' ? item.hourly_status : item.status)
    );

    const jobTypeFlag = jobType === 'hourly' ? 'hourly_status' : 'status';
    let isAnyDisputePresent = false;

    jobData?.milestones?.forEach((dt) => {
      if (!isAnyDisputePresent) isAnyDisputePresent = ['under_dispute'].includes(dt[jobTypeFlag]);
    });

    if (notPaidMilestone !== -1 || isAnyDisputePresent) {
      setShowEndJobErrorModalState({
        show: true,
        error:
          jobType === 'hourly'
            ? 'You cannot close the project while there are unpaid hour submissions or while payments for hours are still processing.'
            : 'You cannot close the project while there are unpaid milestones or while payments for milestones are still processing.',
      });
    } else {
      cb();
    }
  };

  const handlePayAllHourlySubmissions = async (tokenId: string) => {
    setPaymentProcessing(true);

    // need this code
    // const hourly_id_arr = unPaidMilestones?.map(
    //   ({ hourly_id, is_final_milestone }) =>
    //     is_final_milestone === 0 && hourly_id
    // );
    let hourly_id_arr = unPaidMilestones?.filter(({ is_final_milestone }) => is_final_milestone === 0);

    hourly_id_arr = hourly_id_arr?.map(({ hourly_id }) => hourly_id);

    const promise = Promise.all(
      hourly_id_arr.map(async (milestone) => {
        const payload =
          hourly_id_arr?.length > 1
            ? {
                action: 'edit_hours',
                status: 'paid',
                hourly_id: milestone,
                hourly_id_arr,
                token: tokenId,
                payment_method: selectedPaymentMethod,
              }
            : {
                action: 'edit_hours',
                status: 'paid',
                hourly_id: milestone,
                token: tokenId,
                payment_method: selectedPaymentMethod,
              };

        const { status, response } = await manageHours(payload);
        return { status, response };
      })
    );

    toast.promise(promise, {
      loading: 'Loading...',
      success: (res) => {
        setShowPaymentModal(false);
        setPaymentProcessing(false);
        setIsOpenMilestoneListModal(false);
        refetch('m_stone')();
        return res[0]?.response;
      },
      error: (err) => {
        console.log('Error: ', err.toString());
        return err.toString();
      },
    });
  };

  const handlePayAllMilestonesSubmissions = async (token: string) => {
    setPaymentProcessing(true);

    const milestone_id_arr = unPaidMilestones.map(({ milestone_id }) => milestone_id);
    const promise = Promise.all(
      unPaidMilestones.map(async ({ milestone_id }) => {
        const body: any = {
          action: 'edit_milestone',
          status: 'paid',
          milestone_id,
          token,
          milestone_id_arr,
          payment_method: selectedPaymentMethod,
        };

        const promise = isPayNow
          ? payDirectlyToFreelancer(milestone_id, token, milestone_id_arr)
          : manageMilestoneNew(body);
        const { data } = await promise;
        return { ...data };
      })
    );

    toast.promise(promise, {
      loading: 'Loading...',
      success: (res) => {
        setShowPaymentModal(false);
        setPaymentProcessing(false);
        setIsOpenMilestoneListModal(false);
        refetch('m_stone')();
        return res[0]?.response;
      },
      error: (err) => {
        console.log('Error: ', err.toString());
        return err.toString();
      },
    });
  };

  const calculateTotalAmount = () => {
    const job_amount = jobData.jobType === 'hourly' ? 'total_amount' : 'amount';

    setUnpaidMilestones(selectedMilestones);

    let totalUnpaidMilestoneAmt: number[] | number | any = selectedMilestones.map((submission: any) => {
      return submission?.is_final_milestone === 1 ? null : +submission[job_amount];
    });
    totalUnpaidMilestoneAmt = totalUnpaidMilestoneAmt.reduce(
      (accumulator: number, currentValue: number) => accumulator + currentValue,
      0
    );
    // Use Payments
    setAmount(totalUnpaidMilestoneAmt);
    setJobType(jobData.jobType);
  };

  const onPayAllSubmissions = (type?: 'PAY_NOW' | '') => {
    if (type === 'PAY_NOW') {
      setIsPayNow(true);
    }
    calculateTotalAmount();
    setShowConfirmationModal(false);
    setShowPayNowModal(false);

    // Payment Modal
    setShowPaymentModal(true);
  };

  const isAnyPaymentPending = () => {
    const job_status = jobData.jobType === 'hourly' ? 'hourly_status' : 'status';
    const unpaidMilestones: any[] = jobData.milestones.filter((job: any) => job[job_status] === 'pending');
    return unpaidMilestones.length > 0;
  };

  // First this will ask for confirmation... Are you sure?
  const askForConfirmation = (type: 'PAY_NOW' | 'DEPOSIT') => () => {
    calculateTotalAmount();
    // Payment Modal
    setIsOpenMilestoneListModal(false);
    if (type === 'PAY_NOW') {
      setShowPayNowModal(true);
      return;
    }
    setShowConfirmationModal(true);
  };

  const isFinalHourSubmitted = (jobdetails) => {
    if (!jobdetails) return false;
    if (jobdetails?.jobType !== 'hourly') return false;
    if (!Array.isArray(jobdetails?.milestones)) return false;

    let final_milestone = false;
    jobdetails?.milestones?.forEach(({ is_final_milestone }) => {
      if (!final_milestone) final_milestone = !!is_final_milestone;
    });

    return final_milestone;
  };

  useEffect(() => {
    if (jobData.milestones) {
      jobData?.milestones?.map((item: any) => {
        setDisputeMileStone(item.status);
      });
    }
  }, [jobData.milestones]);

  // Attaching function to ref so it can be used by other components
  useEffect(() => {
    if (componentConnectorRef?.current?.openMilestoneListModal)
      componentConnectorRef.current.openMilestoneListModal = () => {
        setIsOpenMilestoneListModal(true);
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isOpenMilestoneListModal && !showConfirmationModal && !showPayNowModal) {
      setSelectedMilestones([]);
    }
  }, [isOpenMilestoneListModal, showConfirmationModal, showPayNowModal]);

  return (
    <>
      {isOpenMilestoneListModal && (
        <MilestoneListModal
          jobdetails={jobData}
          setShow={setIsOpenMilestoneListModal}
          show={isOpenMilestoneListModal}
          setSelectedMilestones={setSelectedMilestones}
          selectedMilestones={selectedMilestones}
          milestones={jobData?.milestones}
          askForConfirmation={(type) => askForConfirmation(type)}
        />
      )}
      <QuickOptionWrapper className="d-flex align-items-center flex-wrap justify-content-center">
        {jobData?.status === 'closed' && (
          <StyledButton
            padding="1rem 2rem"
            className={isMobile ? 'mt-4 w-100' : ''}
            variant="outline-dark"
            onClick={toggleJobsModal}
          >
            Invite to another project
          </StyledButton>
        )}

        {jobData?.activeTab === 'm_stone' && jobData?.status === 'active' && jobData?.closureReqBy !== 'CLIENT' ? (
          <>
            {jobData && isFinalHourSubmitted(jobData) === false && (
              <StyledButton
                padding="1rem 2rem"
                className={isMobile ? 'mt-4 w-100' : ''}
                disabled={!isAnyPaymentPending()}
                // variant="outline-dark"
                onClick={() => {
                  if (!isAnyPaymentPending()) {
                    toast.error(
                      jobData?.jobType === 'hourly'
                        ? "The freelancer hasn't submitted any hours yet!"
                        : 'No milestones to pay!'
                    );
                    return;
                  }
                  setIsOpenMilestoneListModal(true);
                }}
              >
                {jobData?.jobType === 'hourly' ? 'Pay for Hours' : 'Accept Milestones'}
              </StyledButton>
            )}

            {!jobData?.isClosureRequest ? (
              <>
                <StyledButton
                  padding="1rem 2rem"
                  className={isMobile ? 'mt-4 w-100' : ''}
                  variant="outline-dark"
                  onClick={
                    checkAnyOpenMilestone(
                      jobData?.jobType === 'hourly'
                        ? toggleFreelancerClosureRequest
                        : disputeMilestone === 'under_dispute'
                        ? openEndJobErrorModal
                        : openEndJobModal
                    )
                    // jobData?.jobType === 'hourly'
                    //   ? toggleFreelancerClosureRequest
                    //   : toggleEndJobStatusModal
                  }
                >
                  Close Project
                </StyledButton>
              </>
            ) : null}

            {jobData?.activeTab === 'm_stone' && jobData?.isClosureRequest && jobData?.closureReqBy === 'CLIENT' ? (
              <>
                {jobData?.jobType === 'hourly' && jobData?.isFinalMilestonePosted && jobData?.enableEndJobButton ? (
                  <StyledButton
                    padding="1rem 2rem"
                    className="mt-4 w-100"
                    variant="outline-dark"
                    onClick={checkAnyOpenMilestone(openEndJobModal)}
                  >
                    Close Project
                  </StyledButton>
                ) : null}
              </>
            ) : null}
          </>
        ) : null}
      </QuickOptionWrapper>

      <SelectJobModal
        show={showJobsModal}
        toggle={toggleJobsModal}
        onNext={onSelectJobAndContinue}
        freelancerName={jobData?.freelancerData?.first_name + ' ' + jobData?.freelancerData?.last_name}
        freelancerId={jobData?.freelancerUserId}
      />
      <InviteFreelancerMessageModal
        show={showInviteMessageModal}
        toggle={toggleInviteMessageModal}
        freelancerName={
          selectedFreelancer == null
            ? jobData?.freelancerData?.first_name + ' ' + jobData?.freelancerData?.last_name
            : null
        }
        onInvite={onInvite}
        loading={sendingInvite}
      />

      <EndModal
        show={endJobStatusModal.show || requireFeedbackHourlyClosedJob}
        endJobSelectedStatus={endJobStatusModal?.endJobSelectedStatus}
        toggle={closeEndJobModal}
        jobPostId={jobData?.jobPostId}
        onEndJob={toggleEndJobSuccessModal}
        onError={onEndJobError}
        freelancerName={jobData?.freelancerData?.first_name + ' ' + jobData?.freelancerData?.last_name}
        required={requireFeedbackHourlyClosedJob}
      />
      <JobEndedSuccessModal show={endJobSuccessModal} toggle={toggleEndJobSuccessModal} />
      <EndJobErrorModal
        show={showEndJobErrorModalState.show}
        toggle={closeEndJobErrorModal}
        goToMilestones={goToMilestones}
        error={showEndJobErrorModalState.error}
      />
      <InviteFreelancer
        show={freelancersModal}
        toggle={toggleFreelancersModal}
        onNext={openInviteMessageModal}
        jobPostId={jobData?.jobPostId}
      />
      <DeletePropmpt
        show={showDeleteJobModal}
        toggle={toggleDeleteJobModal}
        onDelete={onDelete}
        loading={loading}
        text={
          jobData?.status === 'draft'
            ? 'Are you sure you want to delete this draft? This cannot be undone.'
            : 'Are you sure you want to delete this project posting? This cannot be undone.'
        }
      />

      <FreelancerClosureRequestModal
        show={freelancerClosureRequestModal}
        toggle={toggleFreelancerClosureRequest}
        onConfirm={onConfirm}
        loading={loading}
      />

      {showPaymentModal && (
        <PaymentModal
          show={showPaymentModal}
          onCancel={() => setShowPaymentModal(!showPaymentModal)}
          onPay={jobData.jobType === 'hourly' ? handlePayAllHourlySubmissions : handlePayAllMilestonesSubmissions}
          processingPayment={paymentProcessing}
        />
      )}
      {showConfirmationModal && (
        <ConfirmPaymentModal
          show={showConfirmationModal}
          isReleasePrompt={false}
          toggle={() => setShowConfirmationModal(!showConfirmationModal)}
          onConfirm={() => onPayAllSubmissions()}
          loading={loading}
          buttonText={jobData.jobType === 'hourly' ? 'Pay' : 'Accept & Deposit'}
        />
      )}

      {showPayNowModal && (
        <AcceptAndPaynowModal
          show={showPayNowModal}
          toggle={() => setShowPayNowModal((prev) => !prev)}
          handlePayment={() => onPayAllSubmissions('PAY_NOW')}
        />
      )}

      {/* Proposal Exists Modal */}
      <ProposalExistsModal
        job_post_id={selectedJobId}
        show={proposalExistModal}
        toggle={() => {
          setSelectedJobId('');
          setProposalExistModal((prev) => !prev);
        }}
      />
    </>
  );
};
export default QuickOptions;
