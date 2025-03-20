import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import styled from "@/styled-components";
import { pxToRem } from "@/helpers/utils/misc";
import Conversation from "./Conversation";
import CreateMessage from "./CreateMessage";
import { getUserName } from "../controllers/useUsers";
import SearchMessagesModal from "./SearchMessagesModal";
import Search from "@/public/icons/searchIcon.svg";
import CrossIcon from "@/public/icons/cross-black.svg";
import { MessageProps } from "../messaging.types";
import BackArrow from "@/public/icons/back-arrow.svg";
import MessageIcon from "@/public/icons/MessageIcon.svg";
import useResponsive, { breakpoints } from "@/helpers/hooks/useResponsive";
import { useAuth } from "@/helpers/contexts/auth-context";
import { Link, useNavigate } from "react-router-dom";
import { MdErrorOutline } from "react-icons/md";
import { formatDate } from "@/helpers/utils/formatter";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/redux/store";
import { resetActiveChat } from "@/store/redux/slices/chatSlice";
import { useDispatch } from "react-redux";
import { StyledButton } from "@/components/forms/Buttons";
import { TimezoneUI } from "./TimezoneUI";
import { ChatHeaderButton, ChatPanelWrapper } from "../messaging.styled";

function ChatPanel({
  ignoreMessageLoading,
  showMilestoneAlert = true,
  isFromSingleMessaging = false,
}: any) {
  const navigate = useNavigate();
  const { isDesktop } = useResponsive();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedChat, setSearchedChat] = useState(null);
  const [showSearchModal, setSearchModal] = useState(false);
  const dispatch: AppDispatch = useDispatch();

  const { user } = useAuth();
  const { loading, activeChat, activeTab, errors, chatList } = useSelector(
    (state: RootState) => state.chat
  );
  const remoteUser =
    user?.user_id !== activeChat?._from_user_data.user_id
      ? activeChat?._from_user_data
      : activeChat?._to_user_data;

  const toggleSearchModal = () => {
    setSearchModal((prev) => !prev);
  };

  const onSearch = (searchText: string) => {
    setSearchTerm(searchText);
  };

  const closeModalAndCancelSearch = () => {
    setSearchTerm("");
    toggleSearchModal();
    setSearchedChat(null);
  };

  const onClearSearch = () => {
    setSearchTerm("");
    setSearchedChat(null);
  };

  const onSelectMessage = (chat: MessageProps) => {
    const selectedChat = {
      searchTerm,
      ...chat,
    };
    setSearchedChat(selectedChat);
  };

  const backToUserList = () => dispatch(resetActiveChat());

  useEffect(() => {
    onClearSearch();
  }, [activeChat]);

  const isProposalConversation =
    activeTab === "proposals" &&
    activeChat?.job_status === "prospects" &&
    activeChat?.proposal_status === "pending";

  const isInviteConversation =
    activeTab === "invities" &&
    activeChat?.job_status === "prospects" &&
    activeChat?.invite_status === "read";

  const todaysDate = moment();
  const jobClosedDate = activeChat?.job_end_date
    ? moment(activeChat?.job_end_date)
    : moment();
  const daysOfJobClosed = todaysDate.diff(jobClosedDate, "days");

  const hintForMessageLimitInProposal: JSX.Element = useMemo(() => {
    if (!activeChat) return <></>;
    if (user?.user_type === "client" && activeTab === "proposals") {
      return (
        // <span>
        //   <b>NOTE:</b> Users can only send 20 messages before the freelancer's
        //   proposal is accepted. To hire this freelancer, click the "Accept
        //   Proposal" button on their proposal{' '}
        //   <Link
        //     className="link"
        //     to={`/client-job-details/${activeChat._job_post_id}/applicants`}
        //   >
        //     here
        //   </Link>
        //   .
        // </span>
        <span style={{ color: "blue" }}>
          <b>NOTE: This freelancer has NOT been hired!</b>
          <br />
          ‘Proposal’ chats are only meant to help you pick a freelancer -{" "}
          <b>not to work on projects.</b>
          <br />
          To hire this freelancer, click the ‘Accept Proposal’ button on their
          proposal{" "}
          <Link
            style={{ textDecoration: "underline" }}
            className="link"
            to={`/client-job-details/${activeChat._job_post_id}/applicants`}
          >
            HERE
          </Link>
        </span>
      );
    } else {
      return (
        // <span>
        //   <b>NOTE:</b> Users can only send 20 messages before the freelancer's
        //   proposal is accepted. Before the client hires the freelancer (by
        //   accepting the proposal) - the freelancer will not be able to be paid
        //   on ZehMizeh.
        // </span>
        <span style={{ color: "blue" }}>
          <b>NOTE: DO NOT SUBMIT WORK IN THIS CHAT.</b> You have NOT been hired
          to this project (and cannot be paid on ZMZ) until the client accepts
          your proposal.
        </span>
      );
    }
  }, [activeChat, user?.user_type]);

  const hintForMessageLimitInInvite: JSX.Element = useMemo(() => {
    if (!activeChat || activeTab !== "invities") return <></>;
    if (user?.user_type === "freelancer") {
      return (
        <span style={{ color: "blue" }}>
          <b>NOTE:</b> <b>DO NOT SUBMIT WORK IN THIS CHAT.</b> You have NOT been
          hired for this project (and cannot be paid on ZMZ) until you send your
          proposal and the client accepts it. You can submit a proposal to the
          project -{" "}
          <Link
            style={{ textDecoration: "underline" }}
            className="link"
            to={`/offer-details/${activeChat._job_post_id}`}
          >
            HERE
          </Link>
        </span>
      );
    } else {
      return (
        <span style={{ color: "blue" }}>
          <b>NOTE: This freelancer has NOT been hired!</b> First, they have to
          submit a proposal to the project. Then you can hire them by accepting
          their proposal on your project post page -{" "}
          <Link
            style={{ textDecoration: "underline" }}
            className="link"
            to={`/client-job-details/${activeChat._job_post_id}/applicants`}
          >
            HERE
          </Link>
        </span>
      );
    }
  }, [activeChat, user?.user_type]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getProposalId = (jobPostId: string, remoteUserId: string) => {
    const proposal = chatList["proposals"].find((chat) => {
      const condOne =
        chat._from_user_data.user_id === remoteUserId &&
        chat._to_user_data.user_id === user.user_id;
      const condTwo =
        chat._from_user_data.user_id === user.user_id &&
        chat._to_user_data.user_id === remoteUserId;
      const condThree = chat._job_post_id === jobPostId;
      return (condOne || condTwo) && condThree;
    });

    if (!proposal) return "";

    return `?proposal_id=${proposal.proposal_id}`;
  };

  /* START ----------------------------------------- Back to proposal / invite / project button */
  const backToProposalInviteJobButton = {
    text: "",
    onClick: () => {
      //
    },
  };
  if (activeTab === "proposals") {
    if (user?.user_type === "freelancer") {
      backToProposalInviteJobButton.onClick = () =>
        navigate(`/job-details/${activeChat._job_post_id}/proposal_sent`);
      backToProposalInviteJobButton.text = "See My Proposal";
    } else {
      backToProposalInviteJobButton.text = "See All Proposals";
      backToProposalInviteJobButton.onClick = () =>
        navigate(`/client-job-details/${activeChat._job_post_id}/applicants`);
    }
  } else if (activeTab === "invities") {
    if (user?.user_type === "freelancer") {
      backToProposalInviteJobButton.text = "Go to Invite";
      backToProposalInviteJobButton.onClick = () =>
        navigate(`/offer-details/${activeChat._job_post_id}`);
    } else {
      backToProposalInviteJobButton.text = "Go to Invites";
      backToProposalInviteJobButton.onClick = () =>
        navigate(`/client-job-details/${activeChat._job_post_id}/invitees`);
    }
  } else {
    if (user?.user_type === "freelancer") {
      backToProposalInviteJobButton.text = "Go to Project";
      backToProposalInviteJobButton.onClick = () =>
        navigate(`/job-details/${activeChat._job_post_id}`);
    } else {
      backToProposalInviteJobButton.text = "Go to Project";
      backToProposalInviteJobButton.onClick = () =>
        navigate(`/client-job-details/${activeChat._job_post_id}`);
    }
  }
  /* END ------------------------------------------- Back to proposal / invite / project button */

  const sendMessageDisabledText = useMemo(() => {
    if (activeTab === "proposals") {
      switch (activeChat?.job_status) {
        case "deleted": {
          if (!activeChat?.date_modified) return undefined;
          if (user?.user_type === "freelancer")
            return (
              <span>
                The client canceled this project post -{" "}
                {formatDate(activeChat.date_modified)}
              </span>
            );
          return (
            <span>
              You canceled this project post -{" "}
              {formatDate(activeChat.date_modified)}
            </span>
          );
        }
        case "closed":
        case "active": {
          if (!activeChat?.job_start_date) return undefined;
          if (
            user?.user_type === "freelancer" &&
            activeChat?.proposal_status === "accept"
          ) {
            return (
              <span>
                The client accepted your proposal on{" "}
                {formatDate(activeChat.proposal_modified_date)}! This
                conversation has since been moved to the "Projects" tab.{" "}
                <Link
                  style={{ textDecoration: "underline" }}
                  className="link"
                  to={`/messages-new/${activeChat._job_post_id}`}
                >
                  HERE.
                </Link>
              </span>
            );
          } else if (
            user?.user_type === "client" &&
            activeChat?.proposal_status === "accept"
          ) {
            return (
              <span>
                When you accepted this freelancer's project proposal on{" "}
                {formatDate(activeChat.proposal_modified_date)}, this
                conversation was moved to the "Projects" tab {""}
                <Link
                  style={{ textDecoration: "underline" }}
                  className="link"
                  to={`/messages-new/${activeChat._job_post_id}`}
                >
                  HERE.
                </Link>
              </span>
            );
          } else if (user?.user_type === "freelancer") {
            return (
              <span>
                The client awarded the project to another freelancer -{" "}
                {formatDate(activeChat.job_start_date)}
              </span>
            );
          } else {
            return (
              <span>
                You awarded this project to another freelancer -{" "}
                {formatDate(activeChat.job_start_date)}
              </span>
            );
          }
        }
        case "prospects": {
          if (activeChat?.proposal_status !== "denied") return undefined;
          if (!activeChat?.proposal_modified_date) return undefined;
          if (user?.user_type === "freelancer")
            return (
              <span>
                The client has declined your project proposal -{" "}
                {formatDate(activeChat.proposal_modified_date)}
              </span>
            );
          return (
            <span>
              You declined this proposal -{" "}
              {formatDate(activeChat.proposal_modified_date)}
            </span>
          );
        }
        default:
          return undefined;
      }
    }
    if (activeTab === "invities") {
      switch (activeChat?.job_status) {
        case "deleted": {
          if (!activeChat?.date_modified) return undefined;
          if (user?.user_type === "freelancer")
            return (
              <span>
                The client canceled this project post -{" "}
                {formatDate(activeChat.date_modified)}
              </span>
            );
          return (
            <span>
              You canceled this project post -{" "}
              {formatDate(activeChat.date_modified)}
            </span>
          );
        }
        case "closed":
        case "active": {
          if (!activeChat?.job_start_date) return undefined;
          if (user?.user_type === "freelancer")
            return (
              <span>
                The client awarded the project to another freelancer -{" "}
                {formatDate(activeChat.job_start_date)}
              </span>
            );
          return (
            <span>
              You awarded this project to another freelancer -{" "}
              {formatDate(activeChat.job_start_date)}
            </span>
          );
        }
        case "prospects": {
          if (!activeChat?.invite_modified_date) return undefined;
          if (
            user?.user_type === "freelancer" &&
            activeChat?.invite_status == "accepted"
          ) {
            return (
              <span>
                When you submitted a proposal to this project{" "}
                {formatDate(activeChat.invite_modified_date)}, this conversation
                was moved to the "Proposals" tab{" "}
                <Link
                  style={{ textDecoration: "underline" }}
                  className="link"
                  to={`/messages-new/proposal_${getProposalId(
                    activeChat._job_post_id,
                    remoteUser?.user_id
                  )}`}
                >
                  HERE.
                </Link>{" "}
                You can continue to speak to the client there!
              </span>
            );
          } else if (
            user?.user_type == "client" &&
            activeChat?.invite_status == "accepted"
          ) {
            return (
              <span>
                The freelancer submitted a proposal to this project on{" "}
                {formatDate(activeChat.invite_modified_date)}, so this
                conversation was moved to the "Proposals" tab.{" "}
                <Link
                  style={{ textDecoration: "underline" }}
                  className="link"
                  to={`/messages-new/proposal_${getProposalId(
                    activeChat._job_post_id,
                    remoteUser?.user_id
                  )}`}
                >
                  HERE.
                </Link>{" "}
                You can continue to speak to them there!
              </span>
            );
          } else if (
            user?.user_type === "freelancer" &&
            activeChat?.invite_status == "canceled"
          ) {
            return (
              <span>
                The client has canceled your invitation -{" "}
                {formatDate(activeChat.invite_modified_date)}
              </span>
            );
          } else {
            return (
              <span>
                You have canceled the invitation. -{" "}
                {formatDate(activeChat.invite_modified_date)}
              </span>
            );
          }
        }
        default:
          return undefined;
      }
    }

    {
      /* If the job is closed more than two week, then disable the chat and show the below message ----------------------- START */
    }

    if (
      activeChat?.job_status === "closed" &&
      activeChat?.job_end_date &&
      daysOfJobClosed >= 14
    ) {
      return (
        <span>
          Two weeks have passed since this project was completed. The project's
          message window is now closed.
        </span>
      );
    }

    {
      /* If the job is closed more than two week, then disable the chat and show the below message ----------------------- END */
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChat, activeTab, remoteUser?.user_id, user?.user_type]);

  if (
    !activeChat ||
    ((loading.message || loading.list) && !ignoreMessageLoading)
  ) {
    return (
      <ChatPanelWrapper className="m--chatpanel">
        <header className="m-panel--header m--chatpanel-header flex justify-between items-center"></header>
        {(loading.message || loading.list) && !ignoreMessageLoading ? (
          <section
            className="m--chatpanel-body"
            style={{
              filter: "blur(0.35rem)",
            }}
          >
            <Conversation />
            <CreateMessage disabled={true} />
          </section>
        ) : (
          <section className="m--chatpanel-body flex items-center justify-center my-4">
            {/* <RxEnvelopeClosed size={100} /> */}
            <MessageIcon />
            <h5 className="my-4">
              Click on the chat you want to see from the list on the{" "}
              {!isDesktop ? "top" : "left"}…
            </h5>
          </section>
        )}
      </ChatPanelWrapper>
    );
  }

  if (errors.messages)
    return (
      <ChatPanelWrapper className="m--chatpanel">
        <header className="m-panel--header m--chatpanel-header flex justify-between items-center"></header>
        <section className="m--chatpanel-body flex items-center justify-center my-4">
          <MdErrorOutline size={100} />
          <h5
            className="my-4 mx-auto"
            style={{
              width: "90%",
              maxWidth: "700px",
              textAlign: "center",
              lineHeight: "2rem",
            }}
          >
            {errors.messages}
          </h5>
        </section>
      </ChatPanelWrapper>
    );

  return (
    <ChatPanelWrapper className="m--chatpanel">
      <header
        className={
          !isDesktop
            ? "m-panel--header m--chatpanel-header flex flex-column justify-between align-items-start my-2"
            : "m-panel--header m--chatpanel-header flex justify-between items-center"
        }
      >
        <div className="m--chatpanel-activeUser">
          <div>
            {!isDesktop ? (
              <BackArrow
                style={{ cursor: "pointer" }}
                onClick={backToUserList}
              />
            ) : null}
            <h5 className="capitalize">{getUserName(remoteUser)}</h5>
            <p className="m--chatheader-job-title">
              {" "}
              {activeChat?.job_title || ""}
            </p>
          </div>
        </div>
        {isFromSingleMessaging ? (
          <></>
        ) : (
          backToProposalInviteJobButton.text && (
            <div className="flex gap-3">
              <div>
                <TimezoneUI
                  isFromSingleMessaging={isFromSingleMessaging}
                  remoteUser={remoteUser}
                />
              </div>
              <div>
                <ChatHeaderButton
                  variantType={"primary"}
                  variantColor={"job"}
                  className="m--chatpanel-back-to-job-proposal-invite"
                  onClick={backToProposalInviteJobButton.onClick}
                >
                  {backToProposalInviteJobButton.text}
                </ChatHeaderButton>
              </div>
            </div>
          )
        )}
      </header>
      <div className="d-block d-lg-none">
        <SearchMessages
          value={searchTerm}
          onClick={toggleSearchModal}
          onClear={onClearSearch}
        />
      </div>
      <section className="m--chatpanel-body">
        {/* If the job is closed, allow freelancer or client to chat for 2 weeks ------------ start */}

        {activeChat &&
          activeChat.job_status === "closed" &&
          activeChat.job_end_date &&
          daysOfJobClosed < 14 && (
            <div id="message-limit-note" className="message-limit-note">
              <span style={{ color: "blue" }}>
                This project has been closed. The message function for this
                project will remain open until{" "}
                {moment(activeChat.job_end_date)
                  .add(14, "days")
                  .format("MMM DD, YYYY")}
              </span>
            </div>
          )}

        {/* If the job is closed, allow freelancer or client to chat for 2 weeks ------------ end */}

        {/* START ----------------------------------------- Hint for message limit in proposal */}
        {/* 1. proposal tab selected
            2. hint text is there
            3. job is still open to proposal
        */}
        {isProposalConversation && hintForMessageLimitInProposal && (
          <div id="message-limit-note" className="message-limit-note">
            {hintForMessageLimitInProposal}
          </div>
        )}
        {isInviteConversation && hintForMessageLimitInInvite && (
          <div id="message-limit-note" className="message-limit-note">
            {hintForMessageLimitInInvite}
          </div>
        )}
        {/* END ------------------------------------------- Hint for message limit in proposal */}

        <Conversation
          searchedChat={searchedChat}
          showMilestoneAlert={
            activeTab === "jobs" &&
            activeChat?.total_milestones === 0 &&
            showMilestoneAlert
          }
          isFromSingleMessaging={isFromSingleMessaging}
        />
        {sendMessageDisabledText ? (
          <div className="message-limit-note-warn">
            {sendMessageDisabledText}
          </div>
        ) : (
          <>
            {/* allowing to send message if 
            1. proposal tab is selected and proposal status is pending
            2. active tab is not jobs OR total milestone is not 0
            */}
            {activeTab === "proposals" || activeTab === "invities" ? (
              <>
                {activeChat.job_status === "prospects" &&
                  activeChat?.proposal_status === "pending" && (
                    <CreateMessage
                      conversationId={`proposal_${activeChat?.proposal_id}`}
                    />
                  )}

                {activeChat.job_status === "prospects" &&
                  activeChat?.invite_status === "read" && (
                    <CreateMessage
                      conversationId={`invite_${activeChat?.invite_id}`}
                    />
                  )}
              </>
            ) : (
              <>
                {(isFromSingleMessaging ||
                  !(
                    activeTab === "jobs" &&
                    activeChat?.total_milestones === 0 &&
                    showMilestoneAlert
                  )) && (
                  <CreateMessage conversationId={activeChat._job_post_id} />
                )}
              </>
            )}
          </>
        )}
      </section>
      {activeChat && (
        <SearchMessagesModal
          searchTerm={searchTerm}
          onChange={onSearch}
          show={showSearchModal}
          toggle={toggleSearchModal}
          onClose={closeModalAndCancelSearch}
          onSelectMessage={onSelectMessage}
          jobId={activeChat?._job_post_id}
          jobTitle={activeChat?.job_title}
          remoteUserId={remoteUser.user_id}
        />
      )}
    </ChatPanelWrapper>
  );
}

export default ChatPanel;

const SearchMessages = ({
  onClick,
  onClear,
  value,
}: {
  onClick: () => void;
  onClear: () => void;
  value: string;
}) => {
  return (
    <div className="search-messages">
      <Search />
      <input
        placeholder={"Search messages"}
        value={value}
        onMouseDown={onClick}
      />
      {value !== "" && <CrossIcon className="pointer" onClick={onClear} />}
    </div>
  );
};
