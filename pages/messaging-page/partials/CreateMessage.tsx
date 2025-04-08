import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import { pxToRem, showErr } from "@/helpers/utils/misc";
import styled from "styled-components";
import {
  generateAwsUrl,
  talkJsCreateNewThread,
  talkJsFetchSingleConversation,
} from "@/helpers/http/common";
import Attachment from "@/public/icons/attachment.svg";
import AttachmentPreview from "@/components/ui/AttachmentPreview";
import { useAuth } from "@/helpers/contexts/auth-context";
import { useWebSpellChecker } from "@/helpers/hooks/useWebSpellChecker";
import { useSelector } from "react-redux";
import { AppDispatch } from "@/store/redux/store";
import { AddMessagePayload } from "@/store/redux/slices/chat.interface";
import { useDispatch } from "react-redux";
import messageService from "@/helpers/http/message";
import MessageInput from "./MessageInput";
import { StyledButton } from "@/components/forms/Buttons";
import Tooltip from "rc-tooltip";
import { addNewMessage } from "@/store/redux/slices/talkjsSlice";
import { appendNewMessage } from "@/store/redux/slices/chatSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Define file type structure
interface UploadedFile {
  fileName: string;
  fileUrl: string;
}

interface UploadResult {
  success: boolean;
  data?: UploadedFile;
}

const Notice = styled.div`
  width: 100%;
  min-height: ${pxToRem(74)};
  padding: ${pxToRem(16)};
  border-top: 1px solid ${(props) => props.theme.colors.gray6};
  display: flex;
  align-items: center;
  justify-content: center;

  .new-module-link {
    color: #f2b420;
    text-decoration: underline;
    cursor: pointer;
  }
`;

const Wrapper = styled.div.attrs({
  className: "flex items-center justify-between px-3",
})`
  width: 100%;
  min-height: ${pxToRem(74)};
  padding: ${pxToRem(16)};
  border-top: 1px solid ${(props) => props.theme.colors.gray6};
  input {
    border: none !important;
    height: 100%;
    &:hover,
    &:focus,
    &:active {
      outline: none !important;
    }
  }
  .actions {
    display: flex;
    gap: 1rem;
    max-width: 100px;
    padding: 0 1rem span {
      cursor: pointer;
    }
    button {
      margin: 0;
      padding: 4px 16px;
      min-height: auto;
      font-size: 14px;
    }
    .submit-disabled {
      opacity: 0.5;
    }
  }
  .upload-attachment {
    display: flex;
    input {
      /* display: none; */
      visibility: hidden;
      width: 0;
    }
    label {
      cursor: pointer;
    }
  }
  .attachment-preview {
    border-radius: 0.75rem;
    img {
      border-radius: 0.75rem;
    }
  }
  .delete-preview {
    top: -5px;
    right: -5px;
    background-color: ${(props) => props.theme.colors.black};
    z-index: 9999;
    height: 25px;
    width: 25px;
    border-radius: 50%;
    border: 2px solid ${(props) => props.theme.colors.white};
  }
  .exhausted-messages {
    text-align: center;
    width: 100%;
    span {
      color: ${(props) => props.theme.colors.red};
    }
    a {
      color: ${(props) => props.theme.colors.lightBlue};
    }
  }
`;

interface Prop {
  disabled?: boolean;
  conversationId?: string;
}

export default function CreateMessage({
  disabled = false,
  conversationId,
}: Prop) {
  const { activeChat, loading, activeTab } = useSelector(
    (state: any) => state.chat || {}
  );
  // checking for the chat thred  in talkjs
  const [newChatLoading, setNewChatLoading] = useState<boolean>(true);
  const [isChatExist, setIsChatExist] = useState<boolean>(false);
  const [threadLoading, setThreadLoading] = useState<boolean>(false);

  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { user } = useAuth();
  const remoteUser =
    user?.user_id !== activeChat?._from_user_data?.user_id
      ? activeChat?._from_user_data
      : activeChat?._to_user_data;
  useWebSpellChecker();

  const [uploadLoading, setUploadLoading] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const clearMessageInput = () => {
    const element = document.getElementById("wsc-check");
    if (element) element.innerHTML = "";
  };

  const addMessageToArr = (message: AddMessagePayload) => {
    message._from_user_id = user?.user_id;
    dispatch(appendNewMessage(message));
  };

  const sendMessage = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!activeChat || !remoteUser?.user_id) return;

    if (isFileUploaded()) {
      sendFile();
    } else {
      const message: AddMessagePayload = {
        to_user_id: remoteUser.user_id,
        job_post_id: activeChat._job_post_id,
        type: "TEXT",
        message_text: messageText,
        tab: activeTab,
        custom_chat_id: new Date().getTime(),
      };

      if (activeChat.invite_id) message.invite_id = activeChat.invite_id;
      if (activeChat.proposal_id) message.proposal_id = activeChat.proposal_id;

      dispatch(addNewMessage({ message }));
      message._from_user_id = user?.user_id;
      addMessageToArr(message);
      setMessageText("");
      clearMessageInput();
    }
  };

  const sendFile = async () => {
    if (!Array.isArray(files) || !activeChat || !remoteUser?.user_id) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const message: AddMessagePayload = {
        to_user_id: remoteUser.user_id,
        job_post_id: activeChat._job_post_id,
        type: "FILE",
        message_text: `${file.fileUrl}#docname=${file.fileName}`,
        tab: activeTab,
        custom_chat_id: new Date().getTime() + i,
      };

      if (activeChat.invite_id) message.invite_id = activeChat.invite_id;
      if (activeChat.proposal_id) message.proposal_id = activeChat.proposal_id;

      dispatch(addNewMessage({ message }));
      addMessageToArr(message);
      setMessageText("");
      clearMessageInput();
      setFiles([]);
    }
  };

  const fileUploadHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFilesArr: UploadedFile[] = [];

    if (e.target.files) {
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const result = await uploadAttachement(file);
        if (result && result.success && result.data)
          uploadedFilesArr.push(result.data);
      }
    }

    setFiles([...files, ...uploadedFilesArr]);
  };

  const uploadAttachement = async (uploadfile: File): Promise<UploadResult> => {
    try {
      const fileSize = uploadfile.size / 1024 / 1024;
      const name = uploadfile.name;

      if (fileSize > 100) {
        showErr("File size must not exceed 100MB.");
        return { success: false };
      }
      setUploadLoading(true);
      const file = uploadfile;
      // eslint-disable-next-line no-debugger

      const res = await generateAwsUrl({
        folder: "chat",
        file_name: file.name,
        content_type: file.type,
      });

      const { uploadURL } = res;
      const contentType = file.type;

      await axios.put(uploadURL, file, {
        headers: { "Content-Type": contentType },
      });

      setUploadLoading(false);

      return {
        success: true,
        data: {
          fileName: name,
          fileUrl: uploadURL?.split("?")[0],
        },
      };
    } catch (error) {
      setUploadLoading(false);
      showErr("Error uploading image.");
      return {
        success: false,
      };
    }
  };

  // Clearing the typed message when the chat is changed
  useEffect(() => {
    setMessageText("");
    clearMessageInput();
  }, [activeChat?._job_post_id]);

  /** @function This will remove the uploaded file (preview) */
  const onDeletePreview = async (fileUrl: string, index: number) => {
    setFiles((files) => files.filter((fl, i) => i !== index));
    messageService.removeFileFromS3(fileUrl);
  };

  // Emoji feature code
  // useEffect(() => {
  //   const handleDocumentClick = (event) => {
  //     if (!event.target.closest(`.emoji-wrapper`)) {
  //       setShowEmojiBox(false);
  //     }
  //   };
  //   document.addEventListener('click', handleDocumentClick);
  //   return () => {
  //     document.removeEventListener('click', handleDocumentClick);
  //   };
  // }, []);

  // const emojiHandler = (emoji) => {
  //   setMessageText((message) => {
  //     return message + emoji;
  //   });
  // };

  const isFileUploaded = () => !!files.length;

  const checkForTalkJs = async (id: string) => {
    try {
      const { conversation } = await talkJsFetchSingleConversation(id);
      setNewChatLoading(false);
      setIsChatExist(conversation?.data !== null);
    } catch (error) {
      setNewChatLoading(false);
      setIsChatExist(false);
    }
  };

  const createTalkJSConversation = async () => {
    if (threadLoading || !activeChat) return false;
    const { _job_post_id, job_title, _from_user_data, _to_user_data } =
      activeChat;
    const payload = {
      conversationId,
      // doesn't matter if the ID's flip over, we just need both id's
      clientId: _from_user_data?.user_id,
      freelancerId: _to_user_data?.user_id,
      subject: job_title,
      custom: {
        projectName: job_title,
        jobPostId: _job_post_id,
      },
    };

    setThreadLoading(true);

    const promise = talkJsCreateNewThread(payload);

    toast.promise(promise, {
      loading: "create thread...",
      success: () => {
        if (conversationId) {
          router.push(`/messages-new/${conversationId}`);
        }
        setThreadLoading(false);
        return "thread created successfully";
      },
      error: (err) => {
        console.log(err.response?.data);
        setThreadLoading(false);
        return "Error: " + err.toString();
      },
    });
  };

  useEffect(() => {
    if (conversationId) checkForTalkJs(conversationId);
  }, [conversationId]);

  if (newChatLoading) return <Notice>loading...</Notice>;

  if (!newChatLoading && isChatExist)
    return (
      <Notice>
        <p>
          Chat using our new module from{" "}
          <Link
            className="new-module-link"
            href={`/messages-new/${conversationId}`}
          >
            here.
          </Link>
        </p>
      </Notice>
    );

  if (!newChatLoading && !isChatExist)
    return (
      <Notice>
        <p>
          The chat module is depreciated due to several technical glitch, click{" "}
          <span
            className="new-module-link"
            onClick={() => createTalkJSConversation()}
          >
            here
          </span>{" "}
          to chat.
        </p>
      </Notice>
    );

  return (
    <form className="w-100" onSubmit={sendMessage}>
      <Wrapper>
        {isFileUploaded() ? (
          <div className="flex gap-5 flex-wrap items-center justify-center">
            {files?.map((file, index) => (
              <AttachmentPreview
                key={`attch-prev-${index}`}
                fileName={file?.fileName}
                uploadedFile={file?.fileUrl}
                onDelete={() => onDeletePreview(file?.fileUrl, index)}
              />
            ))}
          </div>
        ) : (
          // <input
          //   id={CONSTANTS.WEB_SPELL_CHECKER_DOM_ID}
          //   type="text"
          //   placeholder="Write your message..."
          //   className="flex-1"
          //   style={{ padding: '10px' }}
          //   onChange={(e) => setMessageText(e.target.value)}
          //   value={messageText}
          //   disabled={disabled}
          // />
          // <div
          //   style={{ outline: 'none', padding: '10px' }}
          //   onInput={(e) => setMessageText(e.currentTarget.innerHTML)}
          //   contentEditable={!disabled}
          //   id={CONSTANTS.WEB_SPELL_CHECKER_DOM_ID}
          //   className="flex-1"
          // ></div>
          <MessageInput
            disabled={disabled}
            setMessageText={setMessageText}
            onSendMessage={() => sendMessage()}
            placeholder={"Write your message..."}
          />
        )}
        <div className="actions items-center mt-0">
          {/* START ----------------------------------------- Showing remaining messages user can send for proposal messages limit */}
          {/* {(isProposalConversation || isInviteConversation) && (
            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip>
                  {`You have ${messagesRemaining} messages remaining. Choose wisely!`}
                </Tooltip>
              }
            >
              <StatusBadge className="user-select-none" color="yellow">
                {messagesRemaining}
              </StatusBadge>
            </OverlayTrigger>
          )} */}
          {/* END ------------------------------------------- Showing total messages user can send for proposal messages limit */}

          <Tooltip
            mouseEnterDelay={1}
            placement="top"
            overlay={<span>Send (Ctrl+Enter)</span>}
          >
            <StyledButton
              padding="4px 10px"
              type="submit"
              disabled={
                (!messageText && !isFileUploaded()) || loading?.sendingMessage
              }
              className={
                (!messageText && !isFileUploaded()) || loading?.sendingMessage
                  ? "submit-disabled"
                  : ""
              }
              variant="primary"
            >
              Send
            </StyledButton>
          </Tooltip>
          <div className="upload-attachment">
            {uploadLoading ? (
              <Spinner size="sm" animation="grow" />
            ) : (
              <>
                <input
                  disabled={loading?.sendingMessage}
                  type="file"
                  multiple
                  id="upload"
                  onChange={fileUploadHandler}
                />
                <label htmlFor="upload">
                  <Attachment stroke="currentColor" />
                </label>{" "}
              </>
            )}
          </div>

          {/* <div className="emoji-wrapper cursor-pointer position-relative">
            <Smile
              stroke="currentColor"
              onClick={() => setShowEmojiBox(!showEmojiBox)}
            />
            <div
              className={`emoji-parent-container ${
                showEmojiBox ? 'block' : 'none'
              }`}
            >
              <EmojiPicker onEmojiClick={({ emoji }) => emojiHandler(emoji)} />
            </div>
          </div> */}
        </div>
      </Wrapper>
    </form>
  );
}
