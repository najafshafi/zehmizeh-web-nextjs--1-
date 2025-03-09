/*
 * This is edit about me modal
 */
"use client";
import { useState, useMemo, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Modal, Button } from 'react-bootstrap';
import { editUser } from '@/helpers/http/auth';
import { StyledButton } from '@/components/forms/Buttons';
import { StyledModal } from '@/components/styled/StyledModal';
import TextEditor from '@/components/forms/TextEditor';
import { EditFormWrapper } from './edit-modals.styled';
import { getPlainText, showErr } from '@/helpers/utils/misc';
import { CONSTANTS } from '@/helpers/const/constants';

type Props = {
  show: boolean;
  onClose: () => void;
  data: {
    is_agency?: boolean;
    aboutMe?: string;
    portfolioLink?: string;
  };
  onUpdate: () => void;
  user_type?: string;
};

const AboutUsEditModal = ({ show, onClose, data, onUpdate, user_type }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isMaxLimitReached, setIsMaxLimitReached] = useState(false);
  const [formState, setFormState] = useState({
    description: data.aboutMe,
    link: '',
  });

  const handleChange = useCallback((field, value) => {
    setFormState((prevFormState: any) => {
      return { ...prevFormState, [field]: value };
    });
  }, []);

  useEffect(() => {
    if (!show) {
      setFormState({
        description: data.aboutMe ?? '',
        link: data.portfolioLink,
      });
    }
  }, [data.aboutMe, data.portfolioLink, show]);

  const handleUpdate = () => {
    const { description, link } = formState;
    // Edit about me api call
    if (wordCount > CONSTANTS.ABOUT_ME_MAXIMUM_CHARACTERS) {
      showErr(`Maximum ${CONSTANTS.ABOUT_ME_MAXIMUM_CHARACTERS} characters are allowed.`);
      return;
    }
    if (wordCount < CONSTANTS.ABOUT_ME_MINIMUM_CHARACTERS) {
      showErr(
        `${data?.is_agency ? 'About the Agency' : 'About Me'} needs at least ${
          CONSTANTS.ABOUT_ME_MINIMUM_CHARACTERS
        } characters.`
      );
      return;
    }
    if (description) {
      setLoading(true);
      const body = {
        about_me: description,
        portfolio_link: link ?? '',
      };
      const promise = editUser(body);
      toast.promise(promise, {
        loading: 'Updating your details - please wait...',
        success: (res) => {
          onUpdate();
          setLoading(false);
          return res.message;
        },
        error: (err) => {
          setLoading(false);
          return err?.response?.data?.message || 'error';
        },
      });
    } else {
      toast.error('Please enter a description.');
    }
  };

  const onDescriptionChange = (data: any) => {
    handleChange('description', data);
    if (data.length <= CONSTANTS.ABOUT_ME_MAXIMUM_CHARACTERS) {
      if (isMaxLimitReached) {
        setIsMaxLimitReached(false);
      }
    } else {
      if (!isMaxLimitReached) {
        setIsMaxLimitReached(true);
      }
    }
  };

  const wordCount = useMemo(() => {
    return formState.description ? getPlainText(formState.description).length : 0;
  }, [formState.description]);

  return (
    <StyledModal maxwidth={678} show={show} size="sm" onHide={onClose} centered>
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={onClose}>
          &times;
        </Button>
        <EditFormWrapper>
          <div className="content d-flex flex-column">
            <div className="modal-title fs-28 fw-400">
              {data?.is_agency ? 'About the Agency' : 'About Me'}
              <span className="mandatory">&nbsp;*</span>
            </div>

            {/* Sub text for freelancers and not for agency */}
            {user_type === 'freelancer' && (
              <>
                {data?.is_agency ? (
                  <div>
                    <p className="fs-16 indent-2r">
                      The “About the Agency" section is the primary place for agencies to introduce themselves. You can
                      describe your work history and experience, your style, specialties, or unique services. Focus on
                      making a good impression and demonstrating your expertise.
                    </p>
                    <div className="mt-2">
                      <p className="fs-16 indent-2r font-weight-bold">
                        Links to outside websites and contact information should not be included.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="fs-16 indent-2r">
                      The “About Me" section is the primary place for freelancers to introduce themselves. You can
                      describe your work history and experience, your style, specialties, or unique services. Focus on
                      making a good impression and demonstrating your expertise.
                    </p>
                    <div className="mt-2">
                      <p className="fs-16 indent-2r font-weight-bold">
                        Links to outside websites and personal contact information should not be included.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Sub text for client */}
            {user_type === 'client' && (
              <div>
                <h4 className="fs-18 fw-400">
                  Use this box to introduce yourself to freelancers. Share any details you think may be relevant, like:
                </h4>
                <ul className="fs-10 fw-350 mt-3">
                  <li className="mt-1">What type of work do you do?</li>
                  <li className="mt-1">What expectations would you have for a freelancer you were working with?</li>
                  <li className="mt-1">What should they know about you?</li>
                </ul>
              </div>
            )}
            <div>
              <TextEditor
                value={formState.description}
                onChange={onDescriptionChange}
                placeholder=""
                maxChars={CONSTANTS.ABOUT_ME_MAXIMUM_CHARACTERS}
              />
            </div>
            <div className="bottom-buttons d-flex">
              <StyledButton padding="1.125rem 2.25rem" variant="primary" disabled={loading} onClick={handleUpdate}>
                Update
              </StyledButton>
            </div>
          </div>
        </EditFormWrapper>
      </Modal.Body>
    </StyledModal>
  );
};

export default AboutUsEditModal;
