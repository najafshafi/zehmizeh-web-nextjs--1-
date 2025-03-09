import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { StatusBadge } from '@/components/styled/Badges';
import { ProfileBannerWrapper } from '../freelancer-profile-settings.styled';
import InfoEditModal from '../edit-modals/InfoEditModal';
import EditPictureModal from '@/components/ui/EditPictureModal';
import { editUser } from '@/helpers/http/auth';
import { numberWithCommas, separateValuesWithComma } from '@/helpers/utils/misc';
import  DollarCircleIcon  from '../../public/icons/dollar-circle.svg';
import  LocationIcon  from '../../public/icons/location-blue.svg';
import  EditIcon  from '../../public/icons/edit.svg';
import  EditBlueIcon  from '../../public/icons/edit-blue-outline.svg';
import  BellIcon  from '../../public/icons/bell.svg';
import  JobsDoneIcon  from '../../public/icons/jobs-done.svg';
import  StarIcon  from '../../public/icons/star-yellow.svg';
import { BsStar } from 'react-icons/bs';
import { CONSTANTS } from '@/helpers/const/constants';
import { IFreelancerDetails } from '@/helpers/types/freelancer.type';
import Image from 'next/image';

type Props = {
  data: IFreelancerDetails;
  refetch: () => void;
};

const ProfileBanner = ({ data, refetch }: Props) => {
  const [showEditInfoModal, setShowEditInfoModal] = useState<boolean>(false);

  const [showEditPictureModal, setShowEditPictureModal] = useState<boolean>(false);

  const onUpdate = () => {
    /*
     * This funciton will be called after anything is edited / added
     * This will close the modal and refetch the profile
     */
    refetch();
  };

  const toggleEditModal = () => {
    // This function will toggle the Add / Edit modal
    setShowEditInfoModal(!showEditInfoModal);
  };

  const togglePictureModal = () => {
    setShowEditPictureModal(!showEditPictureModal);
  };

  /** @function updateUserProfile
   * This function will update user's profile picture
   * @param: {string} url - url of the image
   */
  const updateUserProfile = (url: string) => {
    const body = {
      user_image: url,
    };
    const promise = editUser(body);
    toast.promise(promise, {
      loading: 'Updating your details - please wait...',
      success: (res) => {
        setShowEditPictureModal(false);
        refetch();
        return res.message;
      },
      error: (err) => {
        return err?.response?.data?.message || 'error';
      },
    });
  };
  console.log('data', data);

  return (
    <>
      <ProfileBannerWrapper className="p-2">
        <Row className="p-4 g-3">
          <Col md="10">
            <Row className="g-3">
              {/* Profile picture */}
              <Col md="3" className="d-flex justify-content-center align-items-center">
                <div className="profile__img pointer" onClick={togglePictureModal}>
                  <Image
                    className="img"
                    src={data?.user_image || '/images/default_avatar.png'}
                    alt="freelancer-profile"
                    width={100}
                    height={100}
                  />
                  <div className="edit-picture-btn d-flex align-items-center justify-content-center">
                    <EditBlueIcon />
                  </div>
                </div>
              </Col>
              <Col md="9">
                <div className="profile__details d-flex flex-column">
                  {/* Name and designation */}

                  <div className="profile__name-title">
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <div className="profile__username fs-24 fw-400 text-capitalize">
                        {data.first_name} {data?.last_name}
                      </div>
                      {data?.is_agency ? <StatusBadge color="blue">Agency</StatusBadge> : null}
                    </div>

                    {data.is_agency && data.agency_name ? (
                      <div className="profile__description fs-18 fw-400 capital-first-ltr mt-2">{data.agency_name}</div>
                    ) : null}

                    {data.job_title && (
                      <div className="profile__description fs-18 fw-400 capital-first-ltr mt-3">{data.job_title}</div>
                    )}
                  </div>

                  <div className="budget-and-location d-flex align-items-center flex-wrap">
                    <div className="profile__badge d-flex align-items-center">
                      <DollarCircleIcon />
                      {data?.hourly_rate ? (
                        <div className="fs-1rem fw-400">
                          ${data?.hourly_rate}
                          <span className="budget-and-location-gray-text fs-1rem fw-400">/hr</span>
                        </div>
                      ) : (
                        <span className="budget-and-location-gray-text fs-1rem fw-400">n/a</span>
                      )}
                    </div>

                    {(data?.location?.state || data?.location?.country_name) && (
                      <div className="profile__badge d-flex align-items-center">
                        <LocationIcon />
                        <div className="budget-and-location-gray-text fs-1rem fw-400">
                          {separateValuesWithComma([data?.location?.state, data?.location?.country_name])}
                        </div>
                      </div>
                    )}

                    {data?.notification_email && (
                      <div className="profile__badge d-flex align-items-center">
                        <BellIcon height={25} style={{ marginRight: '0.3rem', width: '20px' }} />
                        <div className="budget-and-location-gray-text fs-1rem fw-400">
                          {CONSTANTS.NOTIFICATION_EMAIL.find(({ value }) => value === data?.notification_email)
                            ?.label ?? ''}
                        </div>
                      </div>
                    )}

                    {/* START ----------------------------------------- Ratings */}
                    <div className="profile__badge d-flex align-items-center">
                      {data?.count_rating ? <StarIcon /> : <BsStar color="#f2b420" />}
                      <div className="budget-and-location-gray-text fs-1rem fw-400">
                        <span>{data?.avg_rating?.toFixed(1) ?? 0}</span>
                        &nbsp;Ratings ({numberWithCommas(data?.count_rating) || 0})
                      </div>
                    </div>
                    {/* END ------------------------------------------- Ratings */}

                    {/* START ----------------------------------------- Total Jobs Done */}
                    <div className="profile__badge d-flex align-items-center">
                      <JobsDoneIcon />
                      <div className="budget-and-location-gray-text fs-1rem fw-400">
                        {numberWithCommas(data?.done_jobs) || 0}&nbsp;
                        <span>Projects done</span>
                      </div>
                    </div>
                    {/* END ------------------------------------------- Total Jobs Done */}
                  </div>
                </div>
              </Col>
            </Row>
          </Col>

          {/* Edit button */}
          <Col>
            <div className="d-flex justify-content-md-end mt-3">
              <div
                className="edit-button profile-edit-btn d-flex align-items-center gap-2 pointer"
                onClick={toggleEditModal}
              >
                <EditIcon stroke="#FFF" />
                <div className="fs-1rem fw-400">Edit</div>
              </div>
            </div>
          </Col>
        </Row>
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
