import moment from "moment";
import Clock from "@/public/icons/clock.svg";
import { UserData } from "@/store/redux/slices/chat.interface";
import { ChatHeaderButton, ChatUserTimeZoneWrapper } from "../messaging.styled";
import { useSelector } from "react-redux";
import { chatTypeSolidColor } from "@/helpers/http/common";

type Props = {
  isFromSingleMessaging: boolean;
  remoteUser: Partial<UserData>;
};

export const TimezoneUI = ({ isFromSingleMessaging, remoteUser }: Props) => {
  const { selectedConversation } = useSelector(
    (state: any) => state.talkJsChat || {}
  );

  if (!selectedConversation) return <></>;
  return (
    <ChatUserTimeZoneWrapper isFromSingleMessaging={isFromSingleMessaging}>
      {remoteUser?.timezone && (
        <ChatHeaderButton
          className="flex items-center gap-1"
          variantType="secondary"
          variantColor={selectedConversation.custom.type}
        >
          <Clock
            stroke={chatTypeSolidColor(selectedConversation.custom.type)}
            width={14}
            height={14}
          />
          <span>
            {remoteUser.user_type === "freelancer" ? "Freelancer" : "Client"}
            &apos;s timezone:{" "}
            {moment().tz(remoteUser?.timezone).format("hh:mm A")}
          </span>
        </ChatHeaderButton>
      )}
    </ChatUserTimeZoneWrapper>
  );
};
