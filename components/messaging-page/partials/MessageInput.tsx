import { CONSTANTS } from "@/helpers/const/constants";
import React, { useEffect, useCallback, useRef } from "react";

interface MessageInputProps {
  disabled?: boolean;
  setMessageText: (text: string) => void;
  onSendMessage: () => void;
  placeholder?: string;
}

const MessageInput = ({
  disabled,
  setMessageText,
  onSendMessage,
  placeholder,
}: MessageInputProps) => {
  const inputRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.shiftKey || e.ctrlKey)) {
        e.preventDefault();
        onSendMessage();
      }
    },
    [onSendMessage]
  );

  useEffect(() => {
    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener("keydown", handleKeyDown);
      return () => {
        inputElement.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [handleKeyDown]);

  return (
    <div
      ref={inputRef}
      style={{ outline: "none", padding: "10px" }}
      onInput={(e) => setMessageText(e.currentTarget.innerHTML)}
      contentEditable={!disabled}
      id={CONSTANTS.WEB_SPELL_CHECKER_DOM_ID}
      className="flex-1"
      data-placeholder={placeholder}
      dangerouslySetInnerHTML={{ __html: "" }}
    ></div>
  );
};

export default MessageInput;
