import { useState } from "react";
import styled from "styled-components";
import toast from "react-hot-toast";
import InfoEditModal from "./edit-info/InfoEditModal";
import dynamic from "next/dynamic";
// Improved dynamic import with loading fallback
const EditPictureModal = dynamic(
  () => import("@/components/ui/EditPictureModal"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    ),
  }
);
import { separateValuesWithComma } from "@/helpers/utils/misc";
import { editUser } from "@/helpers/http/auth";
import { transition } from "@/styles/transitions";
import LocationIcon from "@/public/icons/location-blue.svg";
import EditIcon from "@/public/icons/edit.svg";
import EditBlueIcon from "@/public/icons/edit-blue-outline.svg";
import Image from "next/image";

const StyledBanner = styled.div`
  box-shadow: 0px 4px 60px rgba(0, 0, 0, 0.05);
  background: ${(props) => props.theme.colors.white};
  border: ${(props) => `1px solid ${props.theme.colors.yellow}`};
  margin: 2.25rem 0rem 0rem 0rem;
  border-radius: 12px;
  word-break: break-word;
  .client-profile-name--company {
    word-break: break-word;
  }
  .profile__img {
    height: 9.5625rem;
    width: 9.5625rem;
    min-width: 9.5625rem;
    border-radius: 50%;
    border: 1px solid ${(props) => props.theme.colors.gray5};
    position: relative;
  }
  .img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
  .edit-picture-btn {
    position: absolute;
    background: #f7faff;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    bottom: 0px;
    right: 0px;
    ${() => transition()}
  }
  .client-profile--company {
    color: #999999;
  }
  .client-profile--contact {
    opacity: 0.8;
  }
  .divider {
    width: 1px;
    background: #d6d6d6;
    height: 20px;
  }
  .client-profile--location {
    background-color: ${(props) => props.theme.colors.body2};
    border-radius: 2rem;
    padding: 0.375rem 0.875rem;
    float: left;
  }
  .edit-btn {
    border: 1px solid #f2b420;
    padding: 0.75rem 1.25rem;
    border-radius: 1.75rem;
    background: #f2b420;
    color: white;
    ${() => transition()};
  }
`;

const ProfileBanner = ({
  data,
  refetch,
}: {
  data: any;
  refetch: () => void;
}) => {
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showEditPictureModal, setShowEditPictureModal] =
    useState<boolean>(false);
  const [updatingProfile, setUpdatingProfile] = useState<boolean>(false);

  const toggleEditModal = () => {
    setShowEditModal(!showEditModal);
  };

  const onUpdate = () => {
    refetch();
  };

  const togglePictureModal = () => {
    setShowEditPictureModal(!showEditPictureModal);
  };

  const updateUserProfile = (url: string) => {
    if (!url) {
      toast.error("Failed to get image URL");
      return;
    }

    setUpdatingProfile(true);

    const body = {
      user_image: url,
    };

    const promise = editUser(body);
    toast.promise(promise, {
      loading: "Updating your profile image...",
      success: (res) => {
        setUpdatingProfile(false);
        refetch();
        return res.message || "Profile image updated successfully";
      },
      error: (err) => {
        setUpdatingProfile(false);
        return err?.response?.data?.message || "Error updating profile image";
      },
    });
  };

  return (
    <StyledBanner className="p-2">
      <div className="p-4 flex flex-col md:flex-row  justify-between gap-3 ">
        <div className="md:w-10/12 ">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="md:w-3/12 flex justify-center items-center">
              <div
                className="profile__img pointer"
                onClick={togglePictureModal}
              >
                <Image
                  className="img"
                  src={data?.user_image || "/images/default_avatar.png"}
                  alt="freelancer-profile"
                  width={100}
                  height={100}
                />
                <div className="edit-picture-btn flex items-center justify-center">
                  <EditBlueIcon />
                </div>
              </div>
            </div>

            <div className="md:w-9/12">
              <div className="client-profile-name--company">
                <div className="text-[1.75rem] font-normal capitalize">
                  {data?.first_name} {data?.last_name}
                </div>
                <div className="client-profile--company text-[1.125rem] font-normal mt-2">
                  {data?.company_name ? <div>{data?.company_name}</div> : null}
                </div>
              </div>

              {(data?.location?.state || data?.location?.country_name) && (
                <div className="client-profile--location mt-3 flex items-center gap-1">
                  <LocationIcon />
                  <div className="text-base font-normal">
                    {separateValuesWithComma([
                      data?.location?.state,
                      data?.location?.country_name,
                    ])}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex md:justify-end  h-fit ">
          <div
            className="edit-btn flex items-center gap-2 cursor-pointer"
            onClick={toggleEditModal}
          >
            <EditIcon stroke="#fff" />
            <div className="text-base font-normal">Edit</div>
          </div>
        </div>
      </div>

      {showEditPictureModal && (
        <EditPictureModal
          show={showEditPictureModal}
          onUpdate={updateUserProfile}
          onClose={togglePictureModal}
          profilePic={data?.user_image}
        />
      )}

      <InfoEditModal
        show={showEditModal}
        onClose={toggleEditModal}
        data={data}
        onUpdate={onUpdate}
      />
    </StyledBanner>
  );
};

export default ProfileBanner;
