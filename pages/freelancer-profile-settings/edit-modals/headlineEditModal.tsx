/*
 * This component is a modal to edit headline
 */

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Modal, Button, Form } from 'react-bootstrap';
import { EditFormWrapper, StyledFormGroup } from './edit-modals.styled';
import { StyledModal } from '@/components/styled/StyledModal';
import { StyledButton } from '@/components/forms/Buttons';
import { editUser } from '@/helpers/http/auth';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { SeeMore } from '@/components/ui/SeeMore';
import { useWebSpellChecker } from '@/helpers/hooks/useWebSpellChecker';
import { CONSTANTS } from '@/helpers/const/constants';

type Props = {
  headline: string;
  show: boolean;
  onClose: () => void;
  onUpdate: () => void;
};

const HeadlineEditModal = ({ show, headline, onClose, onUpdate }: Props) => {
  useWebSpellChecker(show, [show]);

  const [loading, setLoading] = useState(false);
  const [headlineText, setHeadlineText] = useState(headline || '');
  const [error, setError] = useState('');
  const [seeMore, setSeeMore] = useState(false);

  const handleUpdate = () => {
    if (!headlineText) return setError('Please enter headline');
    // Update info api call
    setLoading(true);
    const body: any = {
      job_title: headlineText,
    };
    const promise = editUser(body);
    toast.promise(promise, {
      loading: 'Updating headline - please wait...',
      success: (res: { message: string }) => {
        onUpdate();
        onClose();
        setLoading(false);
        return res.message;
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || 'error';
      },
    });
  };

  const countCharactersWithoutSpaces = (text) => {
    return text.replace(/\s+/g, '').length;
  };

  const handleChange = (inputValue) => {
    if (countCharactersWithoutSpaces(inputValue) <= 150) {
      setHeadlineText(inputValue);
    }
  };

  return (
    <StyledModal maxwidth={678} show={show} size="sm" onHide={onClose} centered>
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={onClose}>
          &times;
        </Button>
        <EditFormWrapper>
          <div className="content d-flex flex-column">
            <div className="modal-title">
              <b className="fs-28">Headline</b>
              <p className="fs-base mt-2 mb-0 text-justify text-secondary">
                Your headline should introduce your work as a freelancer. When
                clients search for freelancers, they&apos;ll see it directly under
                your name as a personal subtitle or slogan.
              </p>
              {seeMore && (
                <p className="fs-base mb-0 mt-2 text-justify text-secondary">
                  The simplest way to introduce yourself would be to mention
                  your job title (“Ghostwriter” or “Accountant”). Alternatively,
                  you could list your freelancing skills (“Photoshop | Adobe |
                  FinalCut Pro”). Or you could even use a tagline that makes it
                  clear what you do (“Editing You Can Count On”).
                </p>
              )}
              <SeeMore onClick={() => setSeeMore((prev) => !prev)}>
                {seeMore ? 'See Less' : 'See More'}
              </SeeMore>
            </div>
            <StyledFormGroup>
              <div className="fs-sm fw-400">
                Add headline below<span className="mandatory">&nbsp;*</span>
              </div>
              <Form.Control
                id={CONSTANTS.WEB_SPELL_CHECKER_DOM_ID}
                placeholder="Enter your headline"
                className="form-input"
                value={headlineText}
                onChange={(e) => handleChange(e.target.value)}
                maxLength={150}
              />
              <div className="character-counter">
                {150 - countCharactersWithoutSpaces(headlineText)}/150
                characters
              </div>
              {error && <ErrorMessage message={error} />}
            </StyledFormGroup>
            <div className="bottom-buttons d-flex">
              <StyledButton
                padding="1.125rem 2.25rem"
                variant="primary"
                disabled={loading}
                onClick={handleUpdate}
              >
                Update
              </StyledButton>
            </div>
          </div>
        </EditFormWrapper>
      </Modal.Body>
    </StyledModal>
  );
};

export default HeadlineEditModal;
