import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Button, Form, Spinner, Dropdown } from 'react-bootstrap';
import toast from 'react-hot-toast';
import moment from 'moment';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import TextEditor from '@/components/forms/TextEditor';
import { StyledModal } from '@/components/styled/StyledModal';
import CustomUploader, { TCustomUploaderFile } from '@/components/ui/CustomUploader';
import { StyledButton } from '@/components/forms/Buttons';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { getYupErrors, numberWithCommas } from '@/helpers/utils/misc';
import { validateProposal } from '@/helpers/validation/common';
import { editProposal, submitProposal } from '@/helpers/http/proposals';
import { getPaymentFees } from '@/helpers/http/common';
import { CONSTANTS } from '@/helpers/const/constants';
import { TProposalDetails } from '@/helpers/types/proposal.type';
import { CSSTransition } from 'react-transition-group';
import './submitProposalModal.style.css';
import { StatusBadge } from '@/components/styled/Badges';
import { TJobDetails, TPROPOSAL_ESTIMATION_DURATION } from '@/helpers/types/job.type';
import { SeeMore } from '@/components/ui/SeeMore';
import Tooltip from '@/components/ui/Tooltip';

type Props = {
  show: boolean;
  toggle: () => void;
  data: TProposalDetails & TJobDetails;
  onSubmitProposal: () => void;
};

const FormWrapper = styled.div`
  .subtitle {
    margin-top: 2rem;
  }
  .form {
    margin-top: 1.25rem;
  }
  .form-group {
    margin-bottom: 1.875rem;
    .dropdown {
      display: inline;
      margin-right: 10px;
      .dropdown-toggle {
        border: 1px solid #ced4da;
        border-radius: 7px;
      }
    }
  }
  .form-label {
    margin-bottom: 0.75rem;
    max-width: 80%;
  }
  .proposal-form-input {
    padding: 1rem 1.25rem;
    border-radius: 7px;
  }
  .bottom-buttons {
    margin-top: 2.5rem;
    justify-content: flex-end;
    @media (max-width: 768px) {
      justify-content: center;
    }
  }
  .page-number {
    transform: translate(20px, -20px);
  }
`;

const SubmitProposalModal = ({ show, toggle, data, onSubmitProposal }: Props) => {
  const isEdit = data?.proposed_budget;
  const isHourlyJob = isEdit ? data?.proposed_budget?.type == 'hourly' : data?.budget?.type == 'hourly';
  const [seeMore, setSeeMore] = useState(false);

  /* START ----------------------------------------- Modifying estimation for project-based projects to accomodate new duration dropdown change */
  let modifiedEstimation = { number: '', duration: '' };
  if (data?.proposed_budget?.time_estimation) {
    const estimation = data?.proposed_budget?.time_estimation?.toString()?.split(' ');
    let estNumber = estimation?.[0] || '';
    let estDuration = estimation?.[1] as TPROPOSAL_ESTIMATION_DURATION;
    if (estNumber && !estDuration) estDuration = isHourlyJob ? 'hours' : 'weeks';
    estNumber = Math.min(10, Number(estNumber) || 1).toString();
    modifiedEstimation = {
      number: estNumber.toString(),
      duration: estDuration,
    };
  }
  /* END ------------------------------------------- Modifying estimation for project-based projects to accomodate new duration dropdown change */

  const initialState = {
    costOrHourlyRate: data?.proposed_budget?.amount?.toString() || '',
    estimation: modifiedEstimation,
    proposalMessage: (isEdit && data?.description) || '',
    attachments: (isEdit && data?.attachments?.length > 0
      ? data.attachments.map((prev) => ({ fileUrl: prev }))
      : []) as { fileUrl: string; fileName: string }[],
    // attachments: [],
    termsAndConditions: data?.terms_and_conditions || '',
    questions: data?.questions || '',
  };

  /* START ----------------------------------------- States */
  const [errors, setErrors] = useState<any>({});
  const [step, setStep] = useState<1 | 2>(1);
  const [formState, setFormState] = useState(initialState);
  const [loading, setLoading] = useState<boolean>(false);
  const [liveError, setLiveError] = useState<boolean>(false);
  /* END ------------------------------------------- States */

  const { data: paymentData } = useQuery(['get-payment-fees'], () => getPaymentFees(), {
    keepPreviousData: true,
    enabled: show,
  });
  const zehmizehFees = paymentData?.data[0]?.fee_structure?.OTHER?.percentage || 0;

  useEffect(() => {
    return () => {
      setErrors({});
      setStep(1);
      setFormState(initialState);
      setLiveError(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const handleChange = useCallback((field, value) => {
    setFormState((prevFormState: any) => {
      return { ...prevFormState, [field]: value };
    });
  }, []);

  const handleUploadImage = (files: TCustomUploaderFile[]) => {
    handleChange('attachments', [
      ...formState.attachments,
      ...files.map(({ file, fileName }) => ({
        fileName,
        fileUrl: file,
      })),
    ]);
  };

  const removeAttachment = (index: number) => {
    const attachments = [...formState.attachments];
    attachments.splice(index, 1);
    handleChange('attachments', attachments);
  };

  const onDescriptionChange = (data: any) => {
    handleChange('proposalMessage', data);
  };

  const onTermsAndConditionsChange = (data) => {
    handleChange('termsAndConditions', data);
  };

  const onQuestionsChange = (data) => {
    handleChange('questions', data);
  };

  const validate = (callAPI = true) => {
    setLiveError(true);
    const newformstate = { ...formState, isHourlyJob };
    validateProposal.isValid(newformstate).then((valid) => {
      if (!valid) {
        validateProposal.validate(newformstate, { abortEarly: false }).catch((err) => {
          const errors = getYupErrors(err);

          /* START ----------------------------------------- Finding if error is in first page */
          if (
            Object.keys(errors).findIndex((key) =>
              ['proposalMessage', 'costOrHourlyRate', 'estimation'].includes(key)
            ) >= 0
          ) {
            setStep(1);
          }
          /* END ------------------------------------------- Finding if error is in first page */
          setErrors({ ...errors });
        });
      } else {
        setErrors({});
        if (callAPI) submitJobProposal();
      }
    });
  };

  useEffect(() => {
    if (liveError) validate(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState]);

  const submitJobProposal = () => {
    const { attachments, estimation, costOrHourlyRate, proposalMessage, questions, termsAndConditions } = formState;
    let body: any = {};
    body = {
      delivery_time: moment(new Date()).format('DD-MM-YYYY'),
      description: proposalMessage,
      terms_and_conditions: termsAndConditions,
      questions,
    };
    if (isEdit) {
      body = {
        ...body,
        proposal_id: data.proposal_id,
        proposed_budget: {
          time_estimation: Object.values(estimation).every((x) => x)
            ? `${estimation.number} ${estimation.duration}`
            : '',
          amount: costOrHourlyRate,
          type: data.proposed_budget.type,
        },
      };
    } else {
      body = {
        ...body,
        job_id: data.job_post_id,
        invite_id: data.invite_id,
        proposed_budget: {
          time_estimation: Object.values(estimation).every((x) => x)
            ? `${estimation.number} ${estimation.duration}`
            : '',
          amount: costOrHourlyRate,
          type: data.budget.type,
        },
      };
    }
    if (attachments.length > 0) {
      body.attachments = attachments.map((attachment) => {
        if (attachment?.fileName) return `${attachment.fileUrl}#docname=${attachment.fileName}`;
        return `${attachment.fileUrl}`;
      });
    }
    const promise = isEdit ? editProposal(body) : submitProposal(body);
    setLoading(true);
    promise
      .then((res) => {
        setLoading(false);
        if (res.status) {
          toast.success(res.message);
          onSubmitProposal();
        } else {
          toast.error(res.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error?.response?.data?.message || error?.message || 'Something went wrong');
      });
  };

  const onCloseModal = () => {
    setLoading(false);
    setErrors({});
    setFormState(initialState);
    toggle();
  };

  const calculateFinalAmount = useMemo(() => {
    const { costOrHourlyRate } = formState;
    if (costOrHourlyRate) {
      const finalAmount = parseFloat(costOrHourlyRate) * ((100 - zehmizehFees) / 100);

      if (isNaN(finalAmount)) return '0';

      return numberWithCommas(finalAmount, 'USD');
    }
  }, [formState, zehmizehFees]);

  const step1Ref = useRef(null);
  const step2Ref = useRef(null);

  const Step1UI = (
    <CSSTransition nodeRef={step1Ref} in={step === 1} timeout={0} classNames="step-one" mountOnEnter>
      <div ref={step1Ref} className="form">
        {/* START ----------------------------------------- Proposal Description */}
        <div>
          <div className="proposal-heading fw-400 mb-2">
            Write your proposal, including all relevant details.
            <span className="mandatory">&nbsp;*</span>
          </div>
          {!isEdit && (
            <p>
              {!seeMore && (
                <SeeMore className="fs-14" onClick={() => setSeeMore(true)}>
                  What&apos;s in a Proposal?
                </SeeMore>
              )}
              {seeMore && (
                <span className="fs-14 my-2">
                  Your proposal should describe your approach to the project - how you plan to tackle it, what tools or
                  techniques you’ll use, and how long you think it will take.
                  <p className="my-2">
                    This is also your opportunity to sell yourself as the best freelancer for this project. Try to
                    demonstrate your expertise, show that you understand the client&apos;s needs, and highlight any relevant
                    experience that makes you the ideal candidate.
                  </p>
                  <p className="my-2">And as always - be polite and courteous!</p>
                  <b>
                    Note: You should not be doing anything you would want to be paid for at this point. The client has
                    not committed to pay until he&apos;s hired you, aka accepted your proposal
                  </b>{' '}
                </span>
              )}
              {seeMore && (
                <SeeMore className="fs-14" onClick={() => setSeeMore((prev) => !prev)}>
                  {seeMore ? 'See Less' : 'See More'}
                </SeeMore>
              )}
            </p>
          )}
          <TextEditor value={formState.proposalMessage} onChange={onDescriptionChange} placeholder="" maxChars={2000} />
          {errors?.proposalMessage && (
            <p style={{ position: 'relative', bottom: '40px' }}>
              <ErrorMessage message={errors.proposalMessage} />
            </p>
          )}
        </div>
        {/* END ------------------------------------------- Proposal Description */}

        {/* START ----------------------------------------- Your proposed price */}
        <div className="form-group">
          <div className="proposal-heading fw-400 mb-2">
            {isHourlyJob ? 'Your Proposed Hourly Rate (In USD)' : 'Your Proposed Price (In USD)'}
            <span className="mandatory">&nbsp;*</span>
          </div>
          <div className="flex items-center mx-4 mt-3">
            <div className="me-4 text-end" style={{ flex: 'none' }}>
              <p className="mb-0">{isHourlyJob ? 'Your Hourly Rate: ' : 'Total to Complete Project: '}</p>

              <p className="fw-500 ms-2 fs-sm mb-0">{isHourlyJob ? '(Max $999/hr)' : '(Max $99,999)'}</p>
            </div>
            <Form.Control
              placeholder="Enter here"
              value={formState.costOrHourlyRate}
              onChange={(e) => handleChange('costOrHourlyRate', e.target.value.replace(/\D/g, ''))}
              className="proposal-form-input"
              maxLength={isHourlyJob ? 3 : 5}
            />
          </div>

          {errors?.costOrHourlyRate && <ErrorMessage message={errors.costOrHourlyRate} />}

          {formState.costOrHourlyRate ? (
            <div className="mt-2 flex items-center">
              <Tooltip className="me-2">
                <div>
                  <div className="mt-1">Final takeaway: {calculateFinalAmount}</div>
                </div>
              </Tooltip>
              <div className="fs-1rem fw-400 mt-1">ZehMizeh Fee: &nbsp;{zehmizehFees}%</div>
            </div>
          ) : null}
        </div>
        {/* END ----------------------------------------- Your proposed price */}

        {/* START ----------------------------------------- Time estimate */}
        <div className="form-group">
          <div className="proposal-heading fw-400">Time Estimation (Optional)</div>
          <div className="fs-1rem fw-300 mb-2">How long would you estimate this project would take you?</div>
          <div className="flex items-center">
            {/* START ----------------------------------------- Number */}
            <Dropdown>
              <Dropdown.Toggle variant="" id="estimation-time">
                {formState.estimation?.number || '-'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {new Array(10).fill(null).map((_, index) => {
                  const num = index + 1;
                  return (
                    <Dropdown.Item
                      onClick={() =>
                        handleChange('estimation', {
                          ...formState.estimation,
                          number: num,
                        })
                      }
                      key={`time-estimate-${num}`}
                    >
                      {num}
                    </Dropdown.Item>
                  );
                })}

                {[15, 20, 30, 50, '100+'].map((num) => (
                  <Dropdown.Item
                    onClick={() =>
                      handleChange('estimation', {
                        ...formState.estimation,
                        number: num,
                      })
                    }
                    key={`time-estimate-${num}`}
                  >
                    {num}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            {/* END ------------------------------------------- Number */}
            {/* START ----------------------------------------- Duration */}
            <Dropdown>
              <Dropdown.Toggle variant="" id="dropdown-time-duration">
                {CONSTANTS.ESTIMATION_VALUES.find((estimation) => estimation.id === formState.estimation.duration)
                  ?.label || '-'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {CONSTANTS.ESTIMATION_VALUES.map(({ id, label }) => (
                  <Dropdown.Item
                    onClick={() =>
                      handleChange('estimation', {
                        ...formState.estimation,
                        duration: id,
                      })
                    }
                    key={id}
                  >
                    {label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            {/* END ------------------------------------------- Duration */}
            {Object.values(formState.estimation).some((x) => x) && (
              <span
                className="fs-14 pointer text-warning"
                onClick={() => {
                  handleChange('estimation', { duration: '', number: '' });
                }}
              >
                Clear
              </span>
            )}
          </div>
          {errors?.estimation && <ErrorMessage message={errors.estimation} />}
        </div>
        {/* END ----------------------------------------- Time estimate */}
      </div>
    </CSSTransition>
  );

  const Step2UI = (
    <CSSTransition nodeRef={step2Ref} in={step === 2} timeout={0} classNames="step-two" mountOnEnter>
      <div ref={step2Ref} className="form">
        {/* START ----------------------------------------- Special Terms & Conditions */}
        <div>
          <div className="proposal-heading fw-400">Special Terms & Conditions (Optional)</div>
          <div className="fs-1rem fw-300 mb-2">
            If you have specific terms and conditions you would like to add to your proposal, add them here.
          </div>
          <TextEditor
            value={formState.termsAndConditions}
            onChange={onTermsAndConditionsChange}
            placeholder="Add additional terms here..."
            maxChars={2000}
          />
          {errors?.termsAndConditions && (
            <p style={{ position: 'relative', bottom: '40px' }}>
              <ErrorMessage message={errors.termsAndConditions} />
            </p>
          )}
        </div>
        {/* END ------------------------------------------- Special Terms & Conditions */}

        {/* START ----------------------------------------- Questions */}
        <div>
          <div className="proposal-heading fw-400">Questions (Optional)</div>
          <div className="fs-1rem fw-300 mb-2">
            If you have specific questions about the project, submit them here. These can be discussed if the client
            reaches out about your proposal.
          </div>
          <TextEditor value={formState.questions} onChange={onQuestionsChange} placeholder="" maxChars={2000} />
          {errors?.questions && (
            <p style={{ position: 'relative', bottom: '40px' }}>
              <ErrorMessage message={errors.questions} />
            </p>
          )}
        </div>
        {/* END ------------------------------------------- Questions */}

        {/* START ----------------------------------------- Attachments */}
        <div>
          <div className="proposal-heading fw-400">Attachments (Optional)</div>
          <div className="fs-1rem fw-300 mb-2">
            If you have work samples similar to this project that you&apos;d like to share, you can attach them here.
          </div>
          <CustomUploader
            placeholder="Attach file"
            handleMultipleUploadImage={handleUploadImage}
            attachments={formState.attachments}
            removeAttachment={removeAttachment}
            multiple
            limit={CONSTANTS.ATTACHMENTS_LIMIT}
            acceptedFormats={[...CONSTANTS.DEFAULT_ATTACHMENT_SUPPORTED_TYPES, 'audio/*', 'video/*'].join(', ')}
            suggestions="File type: PDF, DOC, DOCX, XLS, XLSX, Image Files, Audio Files, Video Files"
            shouldShowFileNameAndExtension={false}
          />
          {errors?.fileUploadError && <ErrorMessage message={errors.fileUploadError} />}
        </div>
        {/* END ----------------------------------------- Attachments */}
      </div>
    </CSSTransition>
  );

  const title = isEdit ? 'Edit Proposal' : 'Submit Proposal';

  return (
    <>
      <StyledModal maxwidth={718} show={show} size="lg" onHide={onCloseModal} centered>
        <Button variant="transparent" className="close" onClick={onCloseModal}>
          &times;
        </Button>
        <Modal.Body className="overflow-hidden">
          <FormWrapper>
            <div className="content">
              <div className="d-flex flex-direction-row justify-content-between">
                <h3 className="fs-36 fw-700">{title}</h3>
                <StatusBadge className="page-number" color="yellow">
                  Page {step}/2
                </StatusBadge>
              </div>
              {step === 1 && <div className="subtitle fs-24 fw-400">Enter the details of your proposal below. </div>}
              {Step1UI}
              {Step2UI}
            </div>
            <div className="bottom-buttons d-flex">
              {step === 2 && (
                <StyledButton
                  className="fs-16 fw-400 me-4"
                  variant="secondary"
                  padding="0.8125rem 2rem"
                  disabled={loading}
                  onClick={() => setStep(1)}
                >
                  Back
                </StyledButton>
              )}
              <StyledButton
                className="fs-16 fw-400"
                variant="primary"
                padding="0.8125rem 2rem"
                disabled={loading}
                onClick={() => (step === 1 ? setStep(2) : validate())}
              >
                {step === 1 ? <span>Next</span> : <span>{loading ? <Spinner animation="border" /> : 'Submit'}</span>}
              </StyledButton>
            </div>
          </FormWrapper>
        </Modal.Body>
      </StyledModal>
    </>
  );
};

export default SubmitProposalModal;
