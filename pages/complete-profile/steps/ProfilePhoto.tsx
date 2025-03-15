"use client"
import { useCallback, useState } from 'react';
import { FormWrapper } from './steps.styled';
import { Container } from 'react-bootstrap';
import EditPictureModal from '@/components/ui/EditPictureModal';
import  EditBlueIcon  from '@/public/icons/edit-blue-outline.svg';
import { StyledButton } from '@/components/forms/Buttons';
import { IClientDetails } from '@/helpers/types/client.type';
import { IFreelancerDetails } from '@/helpers/types/freelancer.type';

type TData = Partial<IClientDetails & IFreelancerDetails>;

type Props = {
  onUpdate: (data: TData) => void;
  onPrevious: () => void;
  profileData?: TData;
  updatingProfile: boolean;
};

// NOTE: This component is only for freelancer
export const ProfilePhoto = ({
  profileData,
  onPrevious,
  onUpdate,
  updatingProfile,
}: Props) => {
  const [formState, setFormState] = useState(profileData);
  const [showEditPictureModal, setShowEditPictureModal] = useState(false);

  const handleChange = useCallback((field: keyof typeof profileData, value) => {
    setFormState((prevFormState) => {
      return { ...prevFormState, [field]: value };
    });
  }, []);

  const handleImageChange = (uploadedUrl: string) => {
    handleChange('user_image', uploadedUrl);

    setShowEditPictureModal(false);
  };

  return (
    <FormWrapper className="d-flex flex-column">
      <Container className="mt-3 px-0 d-flex flex-column">
        <div className="fs-sm fw-400 mb-3">
          <b className="fs-18">Profile Pic</b> (Optional)
          <p className="mt-2 mb-0 text-justify fs-base text-secondary">
            To make your profile even more personable, you can add a profile
            pic. Some users share a photo of their face, but it is also common
            to share your professional logo or a cartoon avatar instead.
          </p>
        </div>

        <div
          className="profile__img pointer d-flex justify-content-center align-self-center my-3"
          onClick={() => setShowEditPictureModal((prev) => !prev)}
        >
          <img
            className="img"
            src={formState?.user_image || '/images/default_avatar.png'}
            alt="freelancer-profile"
          />
          <div className="edit-picture-btn d-flex align-items-center justify-content-center">
            <EditBlueIcon />
          </div>
        </div>
        <EditPictureModal
          show={showEditPictureModal}
          onUpdate={handleImageChange}
          onClose={() => setShowEditPictureModal((prev) => !prev)}
          profilePic={formState?.user_image || null}
        />
      </Container>
      <div className="d-flex justify-content-center justify-content-md-end gap-3">
        <StyledButton
          variant="outline-dark"
          disabled={updatingProfile}
          onClick={onPrevious}
        >
          Previous
        </StyledButton>
        <StyledButton
          disabled={updatingProfile}
          onClick={() => onUpdate(formState)}
        >
          Save & Go to Profile
        </StyledButton>
      </div>
    </FormWrapper>
  );
};
