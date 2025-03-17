/*
 * This is the edit milestone form - Freelancer side
 */

import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import moment from 'moment';
import * as yup from 'yup';
import { Form, FormLabel } from 'react-bootstrap';
import { StyledButton } from '@/components/forms/Buttons';
import { useQuery } from 'react-query';
import TextEditor from '@/components/forms/TextEditor';
import ErrorMessage from '@/components/ui/ErrorMessage';
import CustomDatePicker from '@/components/forms/DatePicker';
import { convertToTitleCase, getYupErrors, numberWithCommas } from '@/helpers/utils/misc';
import { MileStoneListItem } from './milestones.styled';
import { manageMilestone } from '@/helpers/http/jobs';
import { getPaymentFees } from '@/helpers/http/common';
import { adjustTimezone } from '@/helpers/utils/misc';
import { REGEX } from '@/helpers/const/regex';

type Props = {
  onSubmit: () => void;
  cancelEdit: () => void;
  milestoneId: number;
  currentData: any;
  remainingBudget: number;
};

const AddMilestoneForm = ({ onSubmit, cancelEdit, milestoneId, currentData, remainingBudget }: Props) => {
  const [title, setTitle] = useState<string>(currentData?.title);
  const [amount, setAmount] = useState<string>(currentData?.amount);
  const [description, setDescription] = useState<string>(currentData?.description);
  const [dueDate, setDueDate] = useState<any>(currentData?.due_date);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  const { data: paymentData } = useQuery(['get-payment-fees'], () => getPaymentFees(), {
    keepPreviousData: true,
    enabled: true,
  });
  const zehmizehFees = paymentData?.data[0]?.fee_structure?.OTHER?.percentage || 0;

  const calculateFinalAmount = useMemo(() => {
    if (amount) {
      const finalAmount = parseFloat(amount) * ((100 - zehmizehFees) / 100);

      if (isNaN(finalAmount)) return '0';

      return numberWithCommas(finalAmount, 'USD');
    }
  }, [amount, zehmizehFees]);

  const validationSchema = yup
    .object({
      amount: yup
        .number()
        .required()
        .test('Is positive?', 'Milestones must be worth at least $5.', (value) => value >= 5)
        .typeError('Please enter a valid number value'),
      description: yup.string().required('Please enter a description.'),
      title: yup.string().required('Please enter a title'),
      dueDate: yup.string().nullable().required('Please select a due date'),
    })
    .required();

  const onUpdate = (e: any) => {
    e.preventDefault();
    // This will validate the form
    validationSchema.isValid({ title, amount, description, dueDate }).then((valid) => {
      if (!valid) {
        validationSchema.validate({ title, amount, description, dueDate }, { abortEarly: false }).catch((err) => {
          const errors = getYupErrors(err);
          setErrors({ ...errors });
        });
      } else {
        setErrors({});
        onEditMilestone();
      }
    });
  };

  const onEditMilestone = () => {
    // Edit milestone api call

    const body = {
      action: 'edit_milestone',
      milestone_id: milestoneId,
      amount,
      description: description,
      title: convertToTitleCase(title),
      due_date: dueDate,
    };
    setLoading(true);
    const promise = manageMilestone(body);
    toast.promise(promise, {
      loading: 'Loading...',
      success: (res) => {
        setLoading(false);
        onSubmit();
        return res.response;
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || 'error';
      },
    });
  };

  const onDescriptionChange = (data: any) => {
    setDescription(data);
  };

  return (
    <MileStoneListItem>
      <Form onSubmit={onUpdate}>
        <div className="fs-24 fw-400">Edit Milestone</div>
        <div className="form-group">
          <FormLabel className="fs-1rem fw-300">
            Title<span className="mandatory">&nbsp;*</span>
          </FormLabel>
          <Form.Control
            placeholder="Pick a title that indicates what you'll complete in this milestone"
            title="Enter a title that captures what you'll complete in this milestone"
            value={title}
            onChange={(e) => setTitle(e.target.value.replace(REGEX.TITLE, ''))}
            className="form-input"
            maxLength={70}
            autoFocus
          />
          {errors?.title && <ErrorMessage message={errors?.title} />}
        </div>
        <div className="form-group">
          <FormLabel className="fs-1rem fw-300">
            Amount<span className="mandatory">&nbsp;*</span>
            <span className="fw-500 ms-1 fs-sm">(Max {numberWithCommas(remainingBudget, 'USD')})</span>
          </FormLabel>
          <Form.Control
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="form-input"
            maxLength={5}
          />
          {amount !== '' && (
            <div className="mt-2 d-flex align-items-center">
              <div className="fs-1rem fw-400">
                {/* You will get{' '}
                  <span className="fw-700">{calculateFinalAmount}</span> */}
                <table className="mx-4">
                  <tr>
                    <td>ZehMizeh Fee:</td>
                    <td>&nbsp;{zehmizehFees}%</td>
                  </tr>
                  <tr>
                    <td>Your final takeaway:</td>
                    <td className="fw-700">&nbsp;{calculateFinalAmount}</td>
                  </tr>
                </table>
              </div>
              {/* <Tooltip className="ms-1">
                  <div>
                    <div>
                      Your proposed price:{' '}
                      {numberWithCommas(formState.amount, 'USD')}
                    </div>
                    <div className="mt-1">ZehMizeh fees: -{zehmizehFees}%</div>
                    <div className="mt-1">
                      Final takeaway: {calculateFinalAmount}
                    </div>
                  </div>
                </Tooltip> */}
            </div>
          )}
          {errors?.amount && <ErrorMessage message={errors?.amount} />}
        </div>
        <div className="form-group">
          <FormLabel className="fs-1rem fw-300">
            Milestone Description<span className="mandatory">&nbsp;*</span>
          </FormLabel>
          <TextEditor
            value={description}
            onChange={onDescriptionChange}
            placeholder="Describe in detail the work you’ll be delivering in this milestone. What will be done at the end of this process? What content will you deliver to the client? Is this a draft? Is this a segment of the project or the whole thing? Be as specific as you can."
            maxChars={2000}
          />
          {errors?.description && <ErrorMessage message={errors?.description} />}
        </div>

        <div className="form-group">
          <FormLabel className="fs-1rem fw-300">
            Due Date<span className="mandatory">&nbsp;*</span>
          </FormLabel>
          {/* <Form.Control
            type="date"
            id="dob"
            value={dueDate}
            className="appearance-none form-input"
            min={new Date().toISOString().split('T')[0]}
            max={moment().add(3, 'years').toISOString().split('T')[0]}
            onChange={(e) => setDueDate(e.target.value)}
          /> */}
          <CustomDatePicker
            id="due_date"
            placeholderText="Select due date"
            onChange={(value) => setDueDate(adjustTimezone(value))}
            selected={dueDate && new Date(dueDate)}
            minDate={new Date()}
            format="YYYY-MM-DD"
            maxDate={new Date(moment().add(3, 'years').toISOString().split('T')[0])}
            isClearable
          />
          {errors?.dueDate && <ErrorMessage message={errors?.dueDate} />}
        </div>

        <div className="d-flex g-2 bottom-buttons flex-wrap">
          <StyledButton
            className="fs-16 fw-400 btn"
            variant="outline-dark"
            padding="0.8125rem 2rem"
            onClick={cancelEdit}
          >
            Cancel
          </StyledButton>
          <StyledButton
            className="fs-16 fw-400 btn"
            variant="primary"
            padding="0.8125rem 2rem"
            type="submit"
            disabled={loading}
          >
            Save Changes
          </StyledButton>
        </div>
      </Form>
    </MileStoneListItem>
  );
};

export default AddMilestoneForm;
