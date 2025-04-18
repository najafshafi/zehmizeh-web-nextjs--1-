"use client"; // Ensure this is a client component
import { useState } from "react";
import toast from "react-hot-toast";
import { StatusBadge } from "@/components/styled/Badges";
import { ProfileBannerWrapper } from "../freelancer-profile-settings.styled";
import InfoEditModal from "../edit-modals/InfoEditModal";
import EditPictureModal from "@/components/ui/EditPictureModal";
import { editUser } from "@/helpers/http/auth";
import EditBlueIcon from "@/public/icons/edit-blue-outline.svg";
import EditWhiteIcon from "@/public/icons/editWhiteIcon.svg";

import {
  numberWithCommas,
  separateValuesWithComma,
} from "@/helpers/utils/misc";
import { CONSTANTS } from "@/helpers/const/constants";
import { IFreelancerDetails } from "@/helpers/types/freelancer.type";

import Image from "next/image";
import { BsStar } from "react-icons/bs";

type Props = {
  data: IFreelancerDetails;
  refetch: () => void;
};

const ProfileBanner = ({ data, refetch }: Props) => {
  const [showEditInfoModal, setShowEditInfoModal] = useState<boolean>(false);
  const [showEditPictureModal, setShowEditPictureModal] =
    useState<boolean>(false);

  const onUpdate = () => {
    refetch();
  };

  const toggleEditModal = () => {
    setShowEditInfoModal(!showEditInfoModal);
  };

  const togglePictureModal = () => {
    setShowEditPictureModal(!showEditPictureModal);
  };

  const updateUserProfile = (url: string) => {
    const body = { user_image: url };
    const promise = editUser(body);
    toast.promise(promise, {
      loading: "Updating your details - please wait...",
      success: (res) => {
        setShowEditPictureModal(false);
        refetch();
        return res.message;
      },
      error: (err) => err?.response?.data?.message || "error",
    });
  };

  return (
    <>
      <ProfileBannerWrapper className="p-2">
        <div className="flex flex-col md:flex-row py-6 px-4 gap-3">
          <div className="flex-1 md:w-10/12">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Profile picture */}
              <div className="md:w-[228px] flex justify-center items-center">
                <div
                  className="profile__img cursor-pointer relative"
                  onClick={togglePictureModal}
                >
                  <Image
                    className="img"
                    src={data?.user_image || "/images/default_avatar.png"}
                    alt="freelancer-profile"
                    width={100}
                    height={100}
                  />
                  <div className="edit-picture-btn  absolute bottom-0 flex items-center justify-center">
                    <EditBlueIcon />
                  </div>
                </div>
              </div>
              <div className="md:w-9/12">
                <div className="profile__details flex flex-col">
                  {/* Name and designation */}
                  <div className="profile__name-title space-y-4">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="profile__username text-2xl font-normal capitalize">
                        {data.first_name} {data?.last_name}
                      </div>
                      {data?.is_agency ? (
                        <StatusBadge color="blue">Agency</StatusBadge>
                      ) : (
                        ""
                      )}
                    </div>

                    {data.is_agency && data.agency_name ? (
                      <div className="profile__description text-lg font-normal capitalize-first mt-2">
                        {data.agency_name}
                      </div>
                    ) : null}

                    {data.job_title && (
                      <div className="profile__description text-lg font-normal capitalize-first mt-3">
                        {data.job_title}
                      </div>
                    )}
                  </div>

                  <div className="budget-and-location flex items-center flex-wrap gap-4">
                    <div className="profile__badge flex items-center gap-2">
                      <Image
                        src="/icons/dollar-circle.svg"
                        alt="Rate"
                        width={20}
                        height={20}
                      />
                      {data?.hourly_rate ? (
                        <div className="text-base font-normal">
                          ${data?.hourly_rate}
                          <span className="text-gray-500 text-base font-normal">
                            /hr
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-base font-normal">
                          n/a
                        </span>
                      )}
                    </div>

                    {(data?.location?.state ||
                      data?.location?.country_name) && (
                      <div className="profile__badge flex items-center gap-2">
                        <Image
                          src="/icons/location-blue.svg"
                          alt="Location"
                          width={20}
                          height={20}
                        />
                        <div className="text-gray-500 text-base font-normal">
                          {separateValuesWithComma([
                            data?.location?.state,
                            data?.location?.country_name,
                          ])}
                        </div>
                      </div>
                    )}

                    {data?.notification_email && (
                      <div className="profile__badge flex items-center gap-2">
                        <Image
                          src="/icons/bell.svg"
                          alt="Notifications"
                          width={20}
                          height={20}
                        />
                        <div className="text-gray-500 text-base font-normal">
                          {CONSTANTS.NOTIFICATION_EMAIL.find(
                            ({ value }) => value === data?.notification_email
                          )?.label ?? ""}
                        </div>
                      </div>
                    )}

                    {/* Ratings */}
                    <div className="profile__badge flex items-center gap-2">
                      {data?.count_rating ? (
                        <Image
                          src="/icons/star-yellow.svg"
                          alt="Rating"
                          width={20}
                          height={20}
                        />
                      ) : (
                        <BsStar color="#f2b420" />
                      )}
                      <div className="text-gray-500 text-base font-normal">
                        <span>{data?.avg_rating?.toFixed(1) ?? 0}</span> Ratings
                        ({numberWithCommas(data?.count_rating) || 0})
                      </div>
                    </div>

                    {/* Total Jobs Done */}
                    <div className="profile__badge flex items-center gap-2">
                      <Image
                        src="/icons/jobs-done.svg"
                        alt="Jobs"
                        width={20}
                        height={20}
                      />
                      <div className="text-gray-500 text-base font-normal">
                        {numberWithCommas(data?.done_jobs) || 0}{" "}
                        <span>Projects done</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Edit button */}
          <div className="my-[14px] mx-2">
            <div className="flex justify-end">
              <div
                className="edit-button profile-edit-btn flex items-center gap-2 cursor-pointer text-white"
                onClick={toggleEditModal}
              >
                <div className="text-white">
                  <EditWhiteIcon />
                </div>
                <div className="text-base font-normal">Edit</div>
              </div>
            </div>
          </div>
        </div>
        <EditPictureModal
          show={showEditPictureModal}
          onUpdate={updateUserProfile}
          onClose={togglePictureModal}
          profilePic={data?.user_image}
        />
      </ProfileBannerWrapper>

      {/* Edit Info modal */}
      <InfoEditModal
        show={showEditInfoModal}
        onClose={toggleEditModal}
        onUpdate={onUpdate}
        data={data}
        refetch={refetch}
      />
    </>
  );
};

export default ProfileBanner;
