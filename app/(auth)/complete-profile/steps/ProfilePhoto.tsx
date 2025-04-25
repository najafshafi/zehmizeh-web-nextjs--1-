"use client";
import { useCallback, useState } from "react";
import { Container } from "react-bootstrap";
import EditPictureModal from "@/components/ui/EditPictureModal";
import EditBlueIcon from "@/public/icons/edit-blue-outline.svg";
import { IClientDetails } from "@/helpers/types/client.type";
import { IFreelancerDetails } from "@/helpers/types/freelancer.type";
import Image from "next/image";
import CustomButton from "@/components/custombutton/CustomButton";

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
  const [formState, setFormState] = useState<TData>(profileData || {});
  const [showEditPictureModal, setShowEditPictureModal] = useState(false);

  const handleChange = useCallback((field: keyof TData, value: string) => {
    setFormState((prevFormState) => {
      return { ...prevFormState, [field]: value };
    });
  }, []);

  const handleImageChange = (uploadedUrl: string) => {
    handleChange("user_image", uploadedUrl);

    setShowEditPictureModal(false);
  };

  return (
    <div className="flex flex-col gap-8">
      <Container className="mt-3 px-0 flex flex-col">
        <div className="fs-sm font-normal mb-3">
          <b className="fs-18">Profile Pic</b> (Optional)
          <p className="mt-2 mb-0 text-justify fs-base text-gray-700">
            To make your profile even more personable, you can add a profile
            pic. Some users share a photo of their face, but it is also common
            to share your professional logo or a cartoon avatar instead.
          </p>
        </div>

        <div
          className="relative h-[9.5625rem] w-[9.5625rem] rounded-full border border-[#DDDDDD] pointer flex justify-center self-center my-3"
          onClick={() => setShowEditPictureModal((prev) => !prev)}
        >
          <Image
            className="h-full w-full rounded-full object-cover"
            src={formState?.user_image || "/images/default_avatar.png"}
            alt="freelancer-profile"
            width={100}
            height={100}
          />
          <div className="absolute bg-[#f7faff] h-10 w-10 rounded-full bottom-0 right-0 transition-all duration-300 flex items-center justify-center cursor-pointer">
            <EditBlueIcon />
          </div>
        </div>
        <EditPictureModal
          show={showEditPictureModal}
          onUpdate={handleImageChange}
          onClose={() => setShowEditPictureModal((prev) => !prev)}
          profilePic={formState?.user_image || undefined}
        />
      </Container>
      <div className="flex justify-center justify-content-md-end gap-3">
        <CustomButton
          text="Previous"
          className="px-8 py-3 transition-transform duration-200 hover:scale-105 font-normal  rounded-full hover:bg-black hover:text-white text-[18px] border border-black "
          disabled={updatingProfile}
          onClick={onPrevious}
        />

        <CustomButton
          text="Save & Go to Profile"
          className="px-8 py-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px]"
          disabled={updatingProfile}
          onClick={() => onUpdate(formState)}
        />
      </div>
    </div>
  );
};
