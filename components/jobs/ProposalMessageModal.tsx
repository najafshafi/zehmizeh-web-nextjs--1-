import { yupResolver } from '@hookform/resolvers/yup';
import { Modal, Button, Form } from 'react-bootstrap';
import { StyledModal } from '@/components/styled/StyledModal';
import { StyledButton } from '@/components/forms/Buttons';
import { useForm } from 'react-hook-form';
import ErrorMessage from '@/components/ui/ErrorMessage';
import * as yup from 'yup';
import useResponsive from '@/helpers/hooks/useResponsive';
import messageService from '@/helpers/http/message';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { postAJob } from '@/helpers/http/post-job';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/redux/store';
import { AddMessagePayload } from '@/store/redux/slices/chat.interface';
import { useAuth } from '@/helpers/contexts/auth-context';
import { addNewMessage } from '@/store/redux/slices/talkjsSlice';

interface FormProp {
  message: string;
}

type Props = {
  show: boolean;
  setShow: (value: boolean) => void;
  freelancerName: string;
  proposal: any;
  jobId: string;
  messagePopupCount: number;
};

const ProposalMessageModal = ({ show, setShow, freelancerName, proposal, jobId, messagePopupCount }: Props) => {
  const navigate = useNavigate();
  const closeModal = () => setShow(false);
  const dispatch: AppDispatch = useDispatch();
  const schema = yup.object({
    message: yup.string().required('Message is required'),
  });

  const { user } = useAuth();
  const { formState, handleSubmit, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const onSubmit = async ({ message }: FormProp) => {
    // on invite send client ID and on proposal sent the user_id (user_id = freelancer user id)
    const message_text = message.replaceAll('\n', ' <br>');
    const payload: AddMessagePayload = {
      job_post_id: jobId,
      message_text,
      to_user_id: user.user_type === 'freelancer' ? proposal?._client_user_id : proposal?.user_id,
      type: 'TEXT',
      tab: 'invities',
      custom_chat_id: new Date().getTime(),
    };
    if (proposal.invite_id) {
      payload.invite_id = proposal.invite_id;
    } else {
      payload.proposal_id = proposal?.proposal_id;
    }

    toast.loading('sending...');

    dispatch(addNewMessage({ message: payload })).then(() => {
      toast.remove();
      if (proposal?.invite_id) {
        navigate(`/messages-new/invite_${proposal?.invite_id}`);
        return 'Message sent successfully.';
      } else {
        navigate(`/messages-new/proposal_${proposal?.proposal_id}`);
        return 'Message sent successfully.';
      }
    });

    // const promise = messageService.sendMessage(payload);
    // const promiseArray = [promise];
    // if (messagePopupCount < 3 && proposal?.proposal_id) {
    //   const postJobPromise = postAJob({
    //     job_post_id: jobId,
    //     message_freelancer_popup_count: messagePopupCount + 1,
    //   });
    //   promiseArray.push(postJobPromise);
    // }
    // toast.promise(Promise.all(promiseArray), {
    //   loading: 'Sending message...',
    //   success: () => {

    //   },
    //   error: (err) => {
    //     console.log(err.message);
    //     return err?.response?.data?.message || 'error';
    //   },
    // });
  };

  const { isMobile } = useResponsive();

  return (
    <StyledModal maxwidth={767} show={show} size="sm" onHide={closeModal} centered>
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={closeModal}>
          &times;
        </Button>
        <div>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="fs-24 fw-400">
              Write <span className="text-capitalize">{freelancerName}</span> a message
            </div>

            <div className="mt-4">
              <textarea
                className={`form-control p-3 ${errors?.message?.message ? 'border border-danger shadow-none' : ''}`}
                placeholder="Write here..."
                rows={5}
                onChange={(e) => setValue('message', e.target.value, { shouldValidate: true })}
              ></textarea>
              <ErrorMessage>{errors?.message?.message}</ErrorMessage>
            </div>

            <div className="d-flex justify-content-center mt-4">
              <StyledButton style={{ padding: '1rem 4rem' }} className={isMobile ? 'w-100' : null} type="submit">
                Send
              </StyledButton>
            </div>
          </Form>
        </div>
      </Modal.Body>
    </StyledModal>
  );
};

export default ProposalMessageModal;
