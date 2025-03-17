import classNames from 'classnames';
import { StyledButton } from 'components/forms/Buttons';
import { StyledModal } from 'components/styled/StyledModal';
import useResponsive from 'helpers/hooks/useResponsive';
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

type Props = {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  isHidden: boolean;
  handleConfirm: (isDoNotShowWarningChecked) => void;
  handleReject: () => void;
  isLoading: boolean;
};

export const PostVisibilityConfirmationModal = ({
  show,
  setShow,
  isHidden,
  handleConfirm,
  handleReject,
  isLoading,
}: Props) => {
  const { isMobile } = useResponsive();

  const [isDoNotShowWarningChecked, setIsDoNotShowWarningChecked] =
    useState(false);

  useEffect(() => {
    setIsDoNotShowWarningChecked(false);
  }, [show]);

  const content = useMemo(() => {
    if (isHidden) {
      return {
        title: 'Are you sure you want to hide this post?',
        text: 'If you switch this post to the “Hidden” status, only freelancers who <b>(1)</b> you invite, <b>(2)</b> have already invited, or <b>(3)</b> who have already sent in proposals will be able to see the details. No one else will be able to submit proposals.',
        buttons: [
          {
            variant: 'secondary',
            text: 'No - Keep public',
            onClick: handleReject,
          },
          {
            variant: 'primary',
            text: 'Yes - Hide my post',
            onClick: () => handleConfirm(isDoNotShowWarningChecked),
          },
        ],
      };
    }
    return {
      title: 'Are you sure you want to make this post public?',
      text: 'If you switch this post to “public," any freelancer on ZehMizeh can access it on the project board.',
      buttons: [
        {
          variant: 'secondary',
          text: 'No - Keep hidden',
          onClick: handleReject,
        },
        {
          variant: 'primary',
          text: 'Yes - Make my post public',
          onClick: () => handleConfirm(isDoNotShowWarningChecked),
        },
      ],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHidden, isDoNotShowWarningChecked]);

  return (
    <StyledModal
      show={show}
      size="sm"
      centered
      onHide={() => !isLoading && setShow(false)}
    >
      <Modal.Body>
        {!isLoading && (
          <Button
            variant="transparent"
            className="close"
            onClick={() => setShow(false)}
          >
            &times;
          </Button>
        )}
        <div className="d-flex flex-column align-items-center">
          <div className="fs-24 fw-400 text-center mb-3">{content.title}</div>
          <div
            className="mb-4 fs-18 text-center px-3"
            dangerouslySetInnerHTML={{ __html: content.text }}
          />
          <div
            className={classNames('d-flex justify-content-center gap-4', {
              'flex-row': !isMobile,
              'flex-column w-100': isMobile,
            })}
          >
            {content.buttons.map((button) => {
              return (
                <StyledButton
                  key={button.text}
                  className="fs-16 fw-400"
                  variant={button.variant}
                  padding="0.8125rem 2rem"
                  onClick={button.onClick}
                  disabled={isLoading}
                >
                  {button.text}
                </StyledButton>
              );
            })}
          </div>
          <Form.Check
            type="checkbox"
            className="d-inline-flex align-items-center g-1 me-2 mt-4 user-select-none"
            id={`post-visibility-warning`}
            label="Do not show this warning in the future"
            disabled={isLoading}
            checked={isDoNotShowWarningChecked}
            onChange={() => setIsDoNotShowWarningChecked((prev) => !prev)}
          />
        </div>
      </Modal.Body>
    </StyledModal>
  );
};
