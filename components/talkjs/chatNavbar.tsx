import * as T from "./style";
import { useSelector } from "react-redux";
import { RootState } from "@/store/redux/store";
import Clock from "@/public/icons/clock.svg";
import { useMemo } from "react";
import { useAuth } from "@/helpers/contexts/auth-context";
import moment from "moment";
import { ChatHeaderButton } from "@/pages/messaging-page/messaging.styled";
import { chatTypeSolidColor } from "@/helpers/http/common";
import {
  RemoteUserProp,
  chatType,
} from "@/store/redux/slices/talkjs.interface";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import ExportChat from "./ExportChat";

// Define interface for the conversation object to avoid using 'any'
interface TalkJsConversation {
  id: string;
  custom: {
    type: chatType;
    jobPostId?: string;
    projectName?: string;
    clientId?: string;
    clientName?: string;
    clientTimezone?: string;
    freelancerId?: string;
    freelancerName?: string;
    freelancerTimezone?: string;
    payload?: {
      job_status?: string;
      job_end_date?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface Prop {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setShowChatFilter: React.Dispatch<React.SetStateAction<boolean>>;
  singleConversation?: string;
}

const ChatNavbar = ({ setOpen, singleConversation }: Prop) => {
  // Use type assertion with more specific types
  const { selectedConversation, activeTab } = useSelector(
    (state: RootState) =>
      (
        state as unknown as {
          talkJsChat: {
            selectedConversation: TalkJsConversation;
            activeTab: string;
          };
        }
      ).talkJsChat
  );

  const { user } = useAuth();

  const remoteUser = useMemo<RemoteUserProp>(() => {
    try {
      const keys = [
        "clientName",
        "clientId",
        "freelancerId",
        "freelancerName",
        "freelancerTimezone",
        "clientTimezone",
      ];
      const data = selectedConversation?.custom ?? {};
      const results = keys.filter((key) => key in data);

      if (keys.length !== results.length) {
        return {
          userType: "unknown",
          username: "Missing custom values",
        };
      }

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
        userType: user.user_id === data.freelancerId ? "client" : "freelancer",
      };

      if (user.user_id === data.freelancerId) {
        // client is remote user
        userData = {
          ...userData,
          userId: clientId,
          username: clientName,
          timezone: clientTimezone,
        };
      } else {
        // freelancer is remote user
        userData = {
          ...userData,
          userId: freelancerId,
          username: freelancerName,
          timezone: freelancerTimezone,
        };
      }

      return userData;
    } catch (error: unknown) {
      return {
        userType: "unknown",
        username:
          typeof error === "object" && error !== null && "message" in error
            ? (error as { message: string }).message
            : "Unknown error",
      };
    }
  }, [selectedConversation, user]);

  const hintForMessageLimitInProposal = useMemo(() => {
    if (!activeTab) return <></>;
    if (activeTab === "proposals") {
      const jobPostId = selectedConversation.custom.jobPostId;
      const link =
        user.user_type === "client"
          ? `/client-job-details/${jobPostId}`
          : `/job-details/${jobPostId}`;
      return (
        <span style={{ color: "blue" }}>
          <b>Note: </b> Projects cannot be completed or paid for on this
          Messages page. To move this project forward, visit its unique page -{" "}
          <Link
            className="link"
            href={link}
            style={{ textDecoration: "underline" }}
          >
            HERE
          </Link>
          .
        </span>
      );
    }
  }, [activeTab, selectedConversation.custom.jobPostId, user.user_type]);

  const hintForMessageLimitInInvite = useMemo(() => {
    if (!activeTab || activeTab !== "invities") return <></>;
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
            href={`/offer-details/${selectedConversation.custom.jobPostId}`}
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
            href={`/client-job-details/${selectedConversation.custom.jobPostId}/invitees`}
          >
            HERE
          </Link>
        </span>
      );
    }
  }, [activeTab, selectedConversation.custom.jobPostId, user?.user_type]);

  const projectExpirationMessageHandler = useMemo(() => {
    let flag = false;
    if (selectedConversation && selectedConversation.custom) {
      if (selectedConversation.custom.payload) {
        const payload = selectedConversation.custom.payload;
        const todaysDate = moment();
        const jobClosedDate = payload?.job_end_date
          ? moment(payload?.job_end_date)
          : moment();
        const daysOfJobClosed = todaysDate.diff(jobClosedDate, "days");

        flag = Boolean(
          payload?.job_status === "closed" &&
            payload?.job_end_date &&
            daysOfJobClosed < 14
        );
      }
    }
    return flag;
  }, [selectedConversation]);

  const jobDetailsPage = useMemo(() => {
    if (user.user_type === "freelancer")
      return `/job-details/${selectedConversation.custom.jobPostId}`;
    return `/client-job-details/${selectedConversation.custom.jobPostId}`;
  }, [selectedConversation, user]);

  return (
    <>
      <div className="px-3 pt-0">
        {/* changes from here */}
        {!!projectExpirationMessageHandler && (
          <div id="message-limit-note" className="message-limit-note">
            <span style={{ color: "blue" }}>
              This project has been closed. The message function for this
              project will remain open until{" "}
              {moment(selectedConversation?.custom?.payload?.job_end_date ?? "")
                .add(14, "days")
                .format("MMM DD, YYYY")}
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
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="left-section">
            {!singleConversation && (
              <T.MobileViewButtons chatType={selectedConversation.custom.type}>
                <button onClick={() => setOpen((prev) => !prev)}>
                  <FaArrowLeft />
                </button>
              </T.MobileViewButtons>
            )}
            <div>
              <h1 className="text-xl font-semibold">{remoteUser.username}</h1>
              <p className="text-normal">{remoteUser.projectName}</p>
            </div>
          </div>
          {!singleConversation && (
            <div className="right-section">
              <ExportChat conversationId={selectedConversation.id} />
              {remoteUser?.timezone && (
                <ChatHeaderButton
                  variantType="secondary"
                  variantColor={selectedConversation.custom.type}
                >
                  <Clock
                    style={{ position: "relative", top: "-1px" }}
                    stroke={chatTypeSolidColor(
                      selectedConversation.custom.type
                    )}
                  />

                  <span>
                    {remoteUser.userType === "freelancer"
                      ? "Freelancer"
                      : "Client"}
                    &apos;s timezone:{" "}
                    {moment()
                      .tz(remoteUser?.timezone ?? "")
                      .format("hh:mm A")}
                  </span>
                </ChatHeaderButton>
              )}
              <Link href={jobDetailsPage}>
                <ChatHeaderButton
                  variantType="primary"
                  variantColor={selectedConversation.custom.type}
                >
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
