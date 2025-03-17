import * as T from './style';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { ReactComponent as Clock } from 'assets/icons/clock.svg';
import { useMemo } from 'react';
import { useAuth } from 'helpers/contexts/auth-context';
import moment from 'moment';
import { ChatHeaderButton } from 'pages/messaging/messaging.styled';
import { chatTypeSolidColor } from 'helpers/http/common';
import { RemoteUserProp } from 'redux/slices/talkjs.interface';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';
import ExportChat from './ExportChat';

interface Prop {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setShowChatFilter: React.Dispatch<React.SetStateAction<boolean>>;
  singleConversation?: string;
}

const ChatNavbar = ({ setOpen, singleConversation }: Prop) => {
  const { selectedConversation, activeTab } = useSelector((state: RootState) => state.talkJsChat);

  const { user } = useAuth();

  const remoteUser: RemoteUserProp = useMemo(() => {
    try {
      const keys = ['clientName', 'clientId', 'freelancerId', 'freelancerName', 'freelancerTimezone', 'clientTimezone'];
      const data = selectedConversation?.custom ?? {};
      const results = keys.filter((key) => key in data);

      if (keys.length !== results.length) return 'Missing custom values';
      const {
        clientId,
        clientName,
        clientTimezone,
        freelancerId,
        freelancerName,
        freelancerTimezone,
        projectName,
        type,
      } = data;

      let userData: RemoteUserProp = {
        type,
        projectName,
        userType: user.user_id === data.freelancerId ? 'client' : 'freelancer',
      };

      if (user.user_id === data.freelancerId) {
        // client is remote user
        userData = { ...userData, userId: clientId, username: clientName, timezone: clientTimezone };
      } else {
        // freelancer is remote user
        userData = { ...userData, userId: freelancerId, username: freelancerName, timezone: freelancerTimezone };
      }

      return userData;
    } catch (error) {
      return error.message;
    }
  }, [selectedConversation, user]);

  const hintForMessageLimitInProposal: JSX.Element = useMemo(() => {
    if (!activeTab) return <></>;
    if (activeTab === 'proposals') {
      const jobPostId = selectedConversation.custom.jobPostId;
      const link = user.user_type === 'client' ? `/client-job-details/${jobPostId}` : `/job-details/${jobPostId}`;
      return (
        <span style={{ color: 'blue' }}>
          <b>Note: </b> Projects cannot be completed or paid for on this Messages page. To move this project forward,
          visit its unique page -{' '}
          <Link className="link" to={link} style={{ textDecoration: 'underline' }}>
            HERE
          </Link>
          .
        </span>
      );
    }
  }, [activeTab]);

  const hintForMessageLimitInInvite: JSX.Element = useMemo(() => {
    if (!activeTab || activeTab !== 'invities') return <></>;
    if (user?.user_type === 'freelancer') {
      return (
        <span style={{ color: 'blue' }}>
          <b>NOTE:</b> <b>DO NOT SUBMIT WORK IN THIS CHAT.</b> You have NOT been hired for this project (and cannot be
          paid on ZMZ) until you send your proposal and the client accepts it. You can submit a proposal to the project
          -{' '}
          <Link
            style={{ textDecoration: 'underline' }}
            className="link"
            to={`/offer-details/${selectedConversation.custom.jobPostId}`}
          >
            HERE
          </Link>
        </span>
      );
    } else {
      return (
        <span style={{ color: 'blue' }}>
          <b>NOTE: This freelancer has NOT been hired!</b> First, they have to submit a proposal to the project. Then
          you can hire them by accepting their proposal on your project post page -{' '}
          <Link
            style={{ textDecoration: 'underline' }}
            className="link"
            to={`/client-job-details/${selectedConversation.custom.jobPostId}/invitees`}
          >
            HERE
          </Link>
        </span>
      );
    }
  }, [selectedConversation, user?.user_type]);

  const projectExpirationMessageHandler = useMemo(() => {
    let flag = false;
    if (selectedConversation && selectedConversation.custom) {
      if (selectedConversation.custom.payload) {
        const payload = selectedConversation.custom.payload;
        const todaysDate = moment();
        const jobClosedDate = payload?.job_end_date ? moment(payload?.job_end_date) : moment();
        const daysOfJobClosed = todaysDate.diff(jobClosedDate, 'days');

        flag = payload?.job_status === 'closed' && payload?.job_end_date && daysOfJobClosed < 14;
      }
    }
    return flag;
  }, [selectedConversation]);

  const jobDetailsPage = useMemo(() => {
    if (user.user_type === 'freelancer') return `/job-details/${selectedConversation.custom.jobPostId}`;
    return `/client-job-details/${selectedConversation.custom.jobPostId}`;
  }, [selectedConversation, user]);

  return (
    <>
      <div className="px-3 pt-0">
        {/* changes from here */}
        {projectExpirationMessageHandler && (
          <div id="message-limit-note" className="message-limit-note">
            <span style={{ color: 'blue' }}>
              This project has been closed. The message function for this project will remain open until{' '}
              {moment(selectedConversation?.custom?.payload?.job_end_date ?? '')
                .add(14, 'days')
                .format('MMM DD, YYYY')}
            </span>
          </div>
        )}

        {hintForMessageLimitInProposal && (
          <div id="message-limit-note" className="message-limit-note">
            {hintForMessageLimitInProposal}
          </div>
        )}
        {hintForMessageLimitInInvite && (
          <div id="message-limit-note" className="message-limit-note">
            {hintForMessageLimitInInvite}
          </div>
        )}
      </div>

      <T.Navbar>
        <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
          <div className="left-section">
            {!singleConversation && (
              <T.MobileViewButtons chatType={selectedConversation.custom.type}>
                <button onClick={() => setOpen((prev) => !prev)}>
                  <FaArrowLeft />
                </button>
              </T.MobileViewButtons>
            )}
            <div>
              <h1>{remoteUser.username}</h1>
              <p>{remoteUser.projectName}</p>
            </div>
          </div>
          {!singleConversation && (
            <div className="right-section">
              <ExportChat conversationId={selectedConversation.id} />
              {remoteUser?.timezone && (
                <ChatHeaderButton variantType="secondary" variantColor={selectedConversation.custom.type}>
                  <Clock
                    style={{ position: 'relative', top: '-1px' }}
                    stroke={chatTypeSolidColor(selectedConversation.custom.type)}
                    width={14}
                    height={14}
                  />
                  <span>
                    {remoteUser.userType === 'freelancer' ? 'Freelancer' : 'Client'}
                    's timezone:{' '}
                    {moment()
                      .tz(remoteUser?.timezone ?? '')
                      .format('hh:mm A')}
                  </span>
                </ChatHeaderButton>
              )}
              <Link to={jobDetailsPage}>
                <ChatHeaderButton variantType="primary" variantColor={selectedConversation.custom.type}>
                  View Project
                </ChatHeaderButton>
              </Link>
            </div>
          )}
        </div>
      </T.Navbar>
    </>
  );
};

export default ChatNavbar;
