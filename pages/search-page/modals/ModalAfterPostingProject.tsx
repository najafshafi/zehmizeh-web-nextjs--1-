import { StyledButton } from '@/components/forms/Buttons';
import { StyledModal } from '@/components/styled/StyledModal';
import useClientProfile from '@/controllers/useClientProfile';
import { CONSTANTS } from '@/helpers/const/constants';
import { editUser } from '@/helpers/http/auth';
import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

export const ModalAfterPostingProject = () => {
  const { profileData } = useClientProfile();
  const location = useLocation();

  const [modalAfterPostingProject, setModalAfterPostingProject] = React.useState(
    location.hash === `#${CONSTANTS.PROJECT_POSTED_HASH_VALUE}`
  );
  const [isCheckedDoNotShowAgain, setIsCheckedDoNotShowAgain] = React.useState(false);

  const handleOkay = async () => {
    // closing modal without waiting for api call to finish
    setModalAfterPostingProject(false);

    /* START -----------------------------------------  
      if do not show again checkbox selected then
      making api call to set do not show flag to 1
    */
    if (isCheckedDoNotShowAgain) {
      try {
        const body = {
          settings: {
            do_not_show_post_project_modal: 1,
          },
        };
        await editUser(body);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Modal after posting project:', error);
        toast.error('Failed to update "Do not show this notice again" value');
      }
    }
    /* END -------------------------------------------  */
  };

  return (
    <StyledModal show={modalAfterPostingProject} size="lg" centered onHide={() => setModalAfterPostingProject(false)}>
      <Modal.Body className="text-center">
        <Button variant="transparent" className="close" onClick={() => setModalAfterPostingProject(false)}>
          &times;
        </Button>
        <div className="d-flex flex-column mb-3">
          <b className="mb-3 fs-20">You can now invite freelancers to your project!</b>
          <li>Freelancers you invite will know you're interested in their proposals</li>
          <li>Click their name from the list to see their profile details</li>
          <li>Use the filters on the left to find your ideal candidates!</li>
        </div>
        {/* START ----------------------------------------- Do not show again checkbox */}
        {Number(profileData?.settings?.posted_project_count || 0) >=
          CONSTANTS.VALUE_TO_SHOW_POSTED_PROJECT_MODAL_CHECKBOX && (
          <>
            <Form.Check
              type="checkbox"
              className="d-inline-flex align-items-center g-1 me-2 user-select-none mb-3"
              label="Please do not show this notice again"
              checked={isCheckedDoNotShowAgain}
              onChange={(e) => {
                setIsCheckedDoNotShowAgain(e.target.checked);
              }}
            />
            <br />
          </>
        )}
        {/* END ------------------------------------------- Do not show again checkbox */}
        <StyledButton padding="1.125rem 2.5rem" margin="10px 4px" onClick={handleOkay}>
          Okay
        </StyledButton>
      </Modal.Body>
    </StyledModal>
  );
};
