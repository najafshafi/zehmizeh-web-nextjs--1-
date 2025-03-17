import { ChatUser } from '@/store/redux/slices/talkjs.interface';
import { Link } from 'react-router-dom';
import { formatDate } from '@/helpers/utils/formatter';
import moment from 'moment';

interface MessageDisabledProps {
  selectedConversation: ChatUser | null;
  userType: string;
}

export function messageDisabled({ selectedConversation, userType }: MessageDisabledProps): JSX.Element | null {
  if (!selectedConversation) return null;
  const activeChat = selectedConversation.custom.payload;
  const conversationType = selectedConversation.custom.type;

  if (conversationType === 'proposal') {
    switch (activeChat?.job_status) {
      case 'deleted': {
        if (!activeChat?.job_date_modified) return null;
        if (userType === 'freelancer')
          return <span>The client canceled this project post - {formatDate(activeChat.job_date_modified)}</span>;
        return <span>You canceled this project post - {formatDate(activeChat.job_date_modified)}</span>;
      }
      case 'closed':
      case 'active': {
        if (!activeChat?.job_start_date) return null;
        if (userType === 'freelancer' && activeChat?.proposal_status === 'accept') {
          return (
            <span>
              The client accepted your proposal on {formatDate(activeChat.proposal_date_modified)}! This conversation
              has since been moved to the "Projects" tab.{' '}
              <Link
                style={{ textDecoration: 'underline' }}
                className="link"
                to={`/messages-new/${activeChat.job_post_id}`}
              >
                HERE.
              </Link>
            </span>
          );
        } else if (userType === 'client' && activeChat?.proposal_status === 'accept') {
          return (
            <span>
              When you accepted this freelancer's project proposal on {formatDate(activeChat.proposal_date_modified)},
              this conversation was moved to the "Projects" tab {''}
              <Link
                style={{ textDecoration: 'underline' }}
                className="link"
                to={`/messages-new/${activeChat.job_post_id}`}
              >
                HERE.
              </Link>
            </span>
          );
        } else if (userType === 'freelancer') {
          return (
            <span>The client awarded the project to another freelancer - {formatDate(activeChat.job_start_date)}</span>
          );
        } else {
          return <span>You awarded this project to another freelancer - {formatDate(activeChat.job_start_date)}</span>;
        }
      }
      case 'prospects': {
        if (activeChat?.proposal_status !== 'denied') return null;
        if (!activeChat?.proposal_date_modified) return null;
        if (userType === 'freelancer')
          return (
            <span>The client has declined your project proposal - {formatDate(activeChat.proposal_date_modified)}</span>
          );
        return <span>You declined this proposal - {formatDate(activeChat.proposal_date_modified)}</span>;
      }
      default:
        return null;
    }
  }

  if (conversationType === 'invite') {
    switch (activeChat?.job_status) {
      case 'deleted': {
        if (!activeChat?.job_date_modified) return null;
        if (userType === 'freelancer')
          return <span>The client canceled this project post - {formatDate(activeChat.job_date_modified)}</span>;
        return <span>You canceled this project post - {formatDate(activeChat.job_date_modified)}</span>;
      }
      case 'closed':
      case 'active': {
        if (!activeChat?.job_start_date) return null;
        if (userType === 'freelancer')
          return (
            <span>The client awarded the project to another freelancer - {formatDate(activeChat.job_start_date)}</span>
          );
        return <span>You awarded this project to another freelancer - {formatDate(activeChat.job_start_date)}</span>;
      }
      case 'prospects': {
        if (!activeChat?.invite_date_modified) return null;
        if (userType === 'freelancer' && activeChat?.invite_status === 'accepted') {
          return (
            <span>
              When you submitted a proposal to this project {formatDate(activeChat.invite_date_modified)}, this
              conversation was moved to the "Proposals" tab{' '}
              <Link style={{ textDecoration: 'underline' }} className="link" to={`/messages-new`}>
                HERE.
              </Link>{' '}
              You can continue to speak to the client there!
            </span>
          );
        } else if (userType === 'client' && activeChat?.invite_status === 'accepted') {
          return (
            <span>
              The freelancer submitted a proposal to this project on {formatDate(activeChat.invite_date_modified)}, so
              this conversation was moved to the "Proposals" tab.{' '}
              <Link style={{ textDecoration: 'underline' }} className="link" to={`/messages-new`}>
                HERE.
              </Link>{' '}
              You can continue to speak to them there!
            </span>
          );
        } else if (userType === 'freelancer' && activeChat?.invite_status === 'canceled') {
          return <span>The client has canceled your invitation - {formatDate(activeChat.invite_date_modified)}</span>;
        } else {
          return <span>You have canceled the invitation. - {formatDate(activeChat.invite_date_modified)}</span>;
        }
      }
      default:
        return null;
    }
  }

  /* Check if job closed more than two weeks ago */
  const payload = selectedConversation.custom.payload;
  const todaysDate = moment();
  const jobClosedDate = payload?.job_end_date ? moment(payload?.job_end_date) : moment();
  const daysOfJobClosed = todaysDate.diff(jobClosedDate, 'days');

  if (activeChat?.job_status === 'closed' && activeChat?.job_end_date && daysOfJobClosed >= 14) {
    return (
      <span>Two weeks have passed since this project was completed. The project's message window is now closed.</span>
    );
  }

  return undefined;
}
