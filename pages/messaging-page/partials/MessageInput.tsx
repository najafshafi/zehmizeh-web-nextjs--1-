import { CONSTANTS } from '@/helpers/const/constants';
import React, {  useEffect, useCallback, useRef } from 'react';

const MessageInput = ({ disabled, setMessageText, onSendMessage, placeholder }: any) => {
  const inputRef = useRef(null);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && (e.shiftKey || e.ctrlKey)) {
        e.preventDefault();
        onSendMessage();
      }
    },
    [onSendMessage]
  );

  useEffect(() => {
    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener('keydown', handleKeyDown);
      return () => {
        inputElement.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [handleKeyDown]);

  return (
    <div
      ref={inputRef}
      style={{ outline: 'none', padding: '10px' }}
      onInput={(e) => setMessageText(e.currentTarget.innerHTML)}
      contentEditable={!disabled}
      id={CONSTANTS.WEB_SPELL_CHECKER_DOM_ID}
      className="flex-1"
      data-placeholder={placeholder}
      dangerouslySetInnerHTML={{ __html: '' }}
    ></div>
  );
};

export default MessageInput;
