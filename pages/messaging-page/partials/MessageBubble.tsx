import { formatTime } from "@/helpers/utils/formatter";
import { fileIsAnImage } from "@/helpers/utils/misc";
import { MessageProps } from "../messaging.types";
import cns from "classnames";
import DeleteIcon from "@/public/icons/trash.svg";
import AttachmentPreview from "@/components/ui/AttachmentPreview";
import { useEffect } from "react";
import BlurredImage from "@/components/ui/BlurredImage";
import { useSelector } from "react-redux";
import { RootState } from "@/store/redux/store";
import { useAuth } from "@/helpers/contexts/auth-context";
import { MessageBubbleWrapper } from "../messaging.styled";
import Link from "next/link";

function MessageBubble({
  author: authorType,
  data,
  handleDelete,
  state,
}: {
  author: "self" | "remote";
  data: MessageProps;
  handleDelete: () => void;
  searchTerm?: string;
  state: any;
}) {
  const { user } = useAuth();
  const { activeChat, activeTab } = useSelector(
    (state: RootState) => state.chat
  );
  const remoteUser =
    user.user_id !== activeChat?._from_user_data.user_id
      ? activeChat?._from_user_data
      : activeChat?._to_user_data;

  function urlify(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url) {
      return '<a href="' + url + '">' + url + "</a>";
    });
  }

  useEffect(() => {
    if (data.type !== "FILE") {
      const msgElement = document.getElementById(`msg-${data.chat_id}`);
      msgElement.innerHTML = String(urlify(data?.message_text));
    }
  }, [data.chat_id, data?.message_text, data.type]);

  return (
    <MessageBubbleWrapper
      variant={"job"}
      id={`single-message-${data.chat_id}`}
      type={authorType}
    >
      {data.type === "FILE" ? (
        <div
          className={cns("message__content d-mflex g-1", {
            "justify-end": authorType === "self",
          })}
        >
          <FileMsg
            path={data.message_text}
            handleDelete={handleDelete}
            allowDeleting={authorType === "self"}
          />
        </div>
      ) : (
        <div
          className={cns("message__content d-mflex g-1", {
            "justify-end": authorType === "self",
          })}
        >
          {authorType !== "self" && (
            <div className="message__avatar">
              <BlurredImage
                overlayText=""
                state={state}
                src={remoteUser?.user_image || "/images/default_avatar.png"}
                width="29px"
                height="29px"
              />
            </div>
          )}
          <div
            className="message__body capital-first-ltr"
            id={`msg-${data.chat_id}`}
          >
            {data.message_text}
          </div>
        </div>
      )}
      <div className="message__time">
        {formatTime(data.date_created)}{" "}
        {authorType === "self" && !!data?.is_seen && <b>Seen</b>}
      </div>
    </MessageBubbleWrapper>
  );
}

export default MessageBubble;

function FileMsg({
  path,
  handleDelete,
  allowDeleting,
}: {
  path: string;
  handleDelete: () => void;
  allowDeleting?: boolean;
}) {
  if (fileIsAnImage(path)) {
    return (
      <div className="position-relative">
        <Link href={path} target="_blank" rel="noreferrer">
          <img src={path} alt="file" className="file-msg-img" />
        </Link>
        {allowDeleting && (
          <div className="delete-btn pointer" onClick={handleDelete}>
            <DeleteIcon />
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="position-relative">
      <AttachmentPreview uploadedFile={path} removable={false} />
      {allowDeleting && (
        <div className="delete-btn pointer" onClick={handleDelete}>
          <DeleteIcon />
        </div>
      )}
    </div>
  );
}
