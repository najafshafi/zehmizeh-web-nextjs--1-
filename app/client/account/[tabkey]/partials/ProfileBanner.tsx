import { useState } from "react";
import toast from "react-hot-toast";
import InfoEditModal from "./edit-info/InfoEditModal";
import EditPictureModal from "@/components/ui/EditPictureModal";
import { separateValuesWithComma } from "@/helpers/utils/misc";
import { editUser } from "@/helpers/http/auth";
import LocationIcon from "@/public/icons/location-blue.svg";
import EditIcon from "@/public/icons/edit.svg";
import EditBlueIcon from "@/public/icons/edit-blue-outline.svg";
import Image from "next/image";

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
    const body: any = {
      user_image: url,
    };
    const promise = editUser(body);
    toast.promise(promise, {
      loading: "Updating your details - please wait...",
      success: (res) => {
        setShowEditPictureModal(false);
        refetch();
        return res.message;
      },
      error: (err) => {
        return err?.response?.data?.message || "error";
      },
    });
  };

  return (
    <div className="bg-white shadow-[0px_4px_60px_rgba(0,0,0,0.05)] border border-primary rounded-xl mt-9 p-2 break-words">
      <div className="p-4 flex flex-col md:flex-row justify-between gap-3">
        <div className="md:w-10/12">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="md:w-3/12 flex justify-center items-center">
              <div
                className="h-[9.5625rem] w-[9.5625rem] min-w-[9.5625rem] rounded-full border border-gray-300 relative cursor-pointer"
                onClick={togglePictureModal}
              >
                <Image
                  className="h-full w-full rounded-full object-cover"
                  src={data?.user_image || "/images/default_avatar.png"}
                  alt="freelancer-profile"
                  width={100}
                  height={100}
                />
                <div className="absolute bottom-0 right-0 bg-[#f7faff] h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300">
                  <EditBlueIcon />
                </div>
              </div>
            </div>

            <div className="md:w-9/12">
              <div className="break-words">
                <div className="text-[1.75rem] font-normal capitalize">
                  {data?.first_name} {data?.last_name}
                </div>
                <div className="text-[#999999] text-[1.125rem] font-normal mt-2">
                  {data?.company_name ? <div>{data?.company_name}</div> : null}
                </div>
              </div>

              {(data?.location?.state || data?.location?.country_name) && (
                <div className="bg-[#f7faff] rounded-full py-1.5 px-3.5 mt-3 inline-flex items-center gap-1">
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

        <div className="flex md:justify-end h-fit">
          <div
            className="border border-[#f2b420] bg-[#f2b420] text-white py-3 px-5 rounded-[1.75rem] flex items-center gap-2 cursor-pointer transition-all duration-300"
            onClick={toggleEditModal}
          >
            <EditIcon stroke="#fff" />
            <div className="text-base font-normal">Edit</div>
          </div>
        </div>
      </div>

      <EditPictureModal
        show={showEditPictureModal}
        onUpdate={updateUserProfile}
        onClose={togglePictureModal}
        profilePic={data?.user_image}
      />

      <InfoEditModal
        show={showEditModal}
        onClose={toggleEditModal}
        data={data}
        onUpdate={onUpdate}
      />
    </div>
  );
};

export default ProfileBanner;
