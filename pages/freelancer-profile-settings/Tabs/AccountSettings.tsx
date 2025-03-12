"use client"; // Ensure this is a client component
import { useEffect, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { useQueryData, useRefetch } from "@/helpers/hooks/useQueryData";
import { useNavigate } from "react-router-dom";
import AccountClosureModal from "@/components/profile/AccountClosureModal";
import { StyledButton } from "@/components/forms/Buttons";
import toast from "react-hot-toast";
import {
  accountClosure,
  cancelAccountClosure,
  editUser,
} from "@/helpers/http/auth";
import { queryKeys } from "@/helpers/const/queryKeys";
import { StyledFormGroup } from "../edit-modals/edit-modals.styled";
import classNames from "classnames";
import PhoneInputWrapper from "@/components/styled/PhoneInputWrapper";
import PhoneNumberInput from "@/components/forms/phone-number-input";
import AsyncSelect from "react-select/async";
import Tooltip from "@/components/ui/Tooltip";
import { MultiSelectCustomStyle } from "../edit-modals/multiSelectCustomStyle";
import InfoIcon from "../../../public/icons/info-gray-18.svg";
import { CONSTANTS } from "@/helpers/const/constants";
import { ContentBox } from "../freelancer-profile-settings.styled";
import { IFreelancerDetails } from "@/helpers/types/freelancer.type";
import { TEditUserRequest } from "@/helpers/types/apiRequestResponse";
import { freelancerAccountProfileValidation } from "@/helpers/validation/freelancerAccountProfileValidation";
import { getYupErrors } from "@/helpers/utils/misc";
import ErrorMessage from "@/components/ui/ErrorMessage";
import EditIcon from "../../../public/icons/edit-blue.svg";
import { myTheme } from "@/styles/theme";
import EmailEditModal from "@/components/profile/EmailEditModal";
import CountryDropdown from "@/components/forms/country-dropdown/CountryDropdown";
import StateDropdown from "@/components/forms/state-picker/StatePicker";
import AccountClosureDescriptionModal from "@/components/profile/AccountClosureDescriptionModal";

const singleSelectProps = {
  closeMenuOnSelect: true,
  isMulti: false,
  styles: MultiSelectCustomStyle,
};

const initialState: TFormData = {
  first_name: "",
  last_name: "",
  is_agency: 0,
  u_email_id: "",
  phone_number: "",
  formatted_phonenumber: "",
  notification_email: 0,
  new_message_email_notification: 0,
  location: null,
};

type TFormData = Pick<
  IFreelancerDetails,
  | "first_name"
  | "last_name"
  | "is_agency"
  | "u_email_id"
  | "phone_number"
  | "formatted_phonenumber"
  | "notification_email"
  | "new_message_email_notification"
  | "location"
>;

type TInputFieldLoading =
  | "first name"
  | "last name"
  | "freelancer type"
  | "country"
  | "state/region"
  | "Frequency of Project Board Emails"
  | "Unread Message Notification"
  | "phone number"
  | "";

export const AccountSettings = () => {
  const navigate = useNavigate();
  const { data } = useQueryData<IFreelancerDetails>(
    queryKeys.getFreelancerProfile
  );
  const { refetch } = useRefetch(queryKeys.getFreelancerProfile);

  const [isAccountClosureModalOpen, setIsAccountClosureModalOpen] =
    useState(false);
  const [showClosureDescriptionModal, setShowClosureDescriptionModal] =
    useState<boolean>(false);
  const [showEditEmailModal, setShowEditEmailModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<TFormData>(initialState);
  const [inputFieldLoading, setInputFieldLoading] =
    useState<TInputFieldLoading>("");
  const [errors, setErrors] = useState<TFormData>(undefined);

  useEffect(() => {
    setFormData({
      first_name: data?.first_name,
      last_name: data?.last_name,
      formatted_phonenumber: data?.formatted_phonenumber,
      is_agency: data?.is_agency,
      new_message_email_notification: data?.new_message_email_notification,
      notification_email: data?.notification_email,
      phone_number: data?.phone_number,
      u_email_id: data?.u_email_id,
      location: data?.location,
    });
  }, [data]);

  const notificationEmailOptions = async () =>
    (await CONSTANTS.NOTIFICATION_EMAIL) as any;
  const newMessageEmailOptions = async () =>
    (await CONSTANTS.NEW_MESSAGE_EMAIL_OPTIONS) as any;

  const handleCancelDeletionRequest = () => {
    const promise = cancelAccountClosure();
    setLoading(true);
    toast.promise(promise, {
      loading: "Please wait...",
      success: (res) => {
        setLoading(false);
        refetch();
        return res.message;
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || "error";
      },
    });
  };

  const closureDescriptionToggle = () => {
    setIsAccountClosureModalOpen(!isAccountClosureModalOpen);
    setShowClosureDescriptionModal(!showClosureDescriptionModal);
  };

  const closureDescriptiontoggle = () => {
    setShowClosureDescriptionModal(!showClosureDescriptionModal);
  };

  const onConfirmAccountDeletion = (message) => {
    const body = {
      message: message,
    };
    const promise = accountClosure(body);
    setLoading(true);
    toast.promise(promise, {
      loading: "Please wait...",
      success: (res) => {
        setLoading(false);
        closureDescriptiontoggle();
        refetch();
        return res.message;
      },
      error: (err) => {
        setLoading(false);
        closureDescriptiontoggle();
        return err?.response?.data?.message || "error";
      },
    });
  };

  const handleDelete = () => {
    if (data?.deletion_requested == 1) {
      handleCancelDeletionRequest();
    } else {
      setIsAccountClosureModalOpen(true);
    }
  };

  const handleEditUser = (
    loadingFieldName: TInputFieldLoading,
    data: TEditUserRequest
  ) => {
    freelancerAccountProfileValidation
      .validate(data)
      .then(() => {
        setErrors(undefined);
        setInputFieldLoading(loadingFieldName);
        const promise = editUser(data);
        toast.promise(promise, {
          loading: `updating ${loadingFieldName}`,
          success: (res) => {
            refetch();
            setInputFieldLoading("");
            return res.message;
          },
          error: (err) => {
            refetch();
            setInputFieldLoading("");
            return err.message ?? err.toString();
          },
        });
      })
      .catch((error) => {
        const errors = getYupErrors({ inner: [error] });
        setErrors({ ...errors });
      });
  };

  const SaveButtonUI = (
    loadingKey: typeof inputFieldLoading,
    dataKey: keyof typeof formData,
    top?: number,
    additionalPayload: TEditUserRequest = {}
  ) => {
    return (
      <div
        className="position-absolute end-0 me-4 pointer"
        style={top ? { top: `${top}%` } : { top: "50%" }}
        onClick={() => {
          if (inputFieldLoading !== loadingKey) {
            handleEditUser(loadingKey, {
              [dataKey]: formData[dataKey],
              ...additionalPayload,
            });
          }
        }}
      >
        {data?.[dataKey] !== formData[dataKey] && (
          <div className="fs-1rem fw-400">
            {inputFieldLoading === loadingKey ? (
              <Spinner animation="border" size="sm" className="me-1" />
            ) : (
              "Save"
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="title fs-24 fw-400 mt-4 mb-2">Account Details</div>
      <ContentBox className="pb-5">
        {/* START ----------------------------------------- Username */}
        <Row>
          <Col md={12} lg={6}>
            <StyledFormGroup className="position-relative">
              <div className="fs-sm fw-400">
                First Name<span className="mandatory">&nbsp;*</span>
              </div>
              <Form.Control
                placeholder="Enter first name"
                className="form-input"
                value={formData?.first_name}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    first_name: e.target.value,
                  }));
                }}
                maxLength={35}
              />
              {SaveButtonUI("first name", "first_name")}
            </StyledFormGroup>
            {errors?.first_name && <ErrorMessage message={errors.first_name} />}
          </Col>
          <Col md={12} lg={6}>
            <StyledFormGroup className="position-relative">
              <div className="fs-sm fw-400">
                Last Name<span className="mandatory">&nbsp;*</span>
              </div>
              <Form.Control
                placeholder="Enter last name"
                className="form-input"
                value={formData?.last_name}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    last_name: e.target.value,
                  }));
                }}
                maxLength={35}
              />
              {SaveButtonUI("last name", "last_name")}
            </StyledFormGroup>
            {errors?.last_name && <ErrorMessage message={errors.last_name} />}
          </Col>
        </Row>
        {/* END ------------------------------------------- Username */}
        {/* START ----------------------------------------- Freelancer type */}
        <Row>
          <Col md={12} lg={6}>
            <StyledFormGroup>
              <div className="fs-sm fw-400">
                Freelancer Type
                <span className="mandatory">&nbsp;*</span>
              </div>
              <div className="flex mt-2">
                <div
                  className={classNames(
                    "px-4 py-3 border rounded me-4 pointer",
                    {
                      "border-dark": formData.is_agency === 0,
                    }
                  )}
                  style={{ borderColor: "grey" }}
                  onClick={() => {
                    if (formData?.is_agency === 1) {
                      setFormData((prev) => ({ ...prev, is_agency: 0 }));
                      handleEditUser("freelancer type", { is_agency: 0 });
                    }
                  }}
                >
                  <span>Freelancer</span>
                </div>
                <div
                  className={classNames(
                    "px-4 py-3 border rounded me-4 pointer",
                    {
                      "border-dark": formData.is_agency === 1,
                    }
                  )}
                  style={{ borderColor: "grey" }}
                  onClick={() => {
                    if (formData?.is_agency === 0) {
                      setFormData((prev) => ({ ...prev, is_agency: 1 }));
                      handleEditUser("freelancer type", { is_agency: 1 });
                    }
                  }}
                >
                  <span>Agency</span>
                </div>
              </div>
            </StyledFormGroup>
          </Col>
          <Col md={12} lg={6}>
            <StyledFormGroup className="position-relative">
              <div className="fs-sm fw-400">
                Phone<span className="mandatory">&nbsp;*</span>
              </div>
              <PhoneInputWrapper className="phone-input-wrapper">
                <PhoneNumberInput
                  initialValue={formData?.formatted_phonenumber}
                  onChange={(phone, formattedValue) => {
                    setFormData((prev) => ({
                      ...prev,
                      phone_number: phone,
                      formatted_phonenumber: formattedValue,
                    }));
                  }}
                />
                {SaveButtonUI("phone number", "formatted_phonenumber", 30, {
                  phone_number: formData.phone_number,
                })}
              </PhoneInputWrapper>
            </StyledFormGroup>
            {errors?.formatted_phonenumber && (
              <ErrorMessage message={errors.formatted_phonenumber} />
            )}
          </Col>
        </Row>
        {/* END ------------------------------------------- Freelancer type */}

        <Row>
          {/* START ----------------------------------------- Country */}
          <Col md={12} lg={6}>
            <StyledFormGroup>
              <div className="fs-sm fw-400 mb-1">
                Country<span className="mandatory">&nbsp;*</span>
              </div>
              <CountryDropdown
                selectedCountry={formData?.location}
                onSelectCountry={(item) => {
                  const newLocation = {
                    ...item,
                  };
                  setFormData((prev) => ({
                    ...prev,
                    location: newLocation,
                  }));
                  handleEditUser("country", {
                    location: newLocation,
                  });
                }}
              />
              {errors?.location?.country_name && (
                <ErrorMessage message={errors.location.country_name} />
              )}
            </StyledFormGroup>
          </Col>
          {/* END ------------------------------------------- Country */}
          {/* START ----------------------------------------- State and region */}
          {!CONSTANTS.COUNTRIES_SHORT_NAME_WITHOUT_STATE.includes(
            formData?.location?.country_short_name
          ) && (
            <Col md={12} lg={6}>
              <StyledFormGroup>
                <div className="fs-sm fw-400 mb-1">
                  State/Region<span className="mandatory">&nbsp;*</span>
                </div>
                <StateDropdown
                  countryCode={formData?.location?.country_short_name}
                  onSelectState={(item) => {
                    const newLocation = {
                      ...formData.location,
                      state: item,
                    };
                    setFormData((prev) => ({
                      ...prev,
                      location: newLocation,
                    }));
                    handleEditUser("state/region", {
                      location: newLocation,
                    });
                  }}
                  selectedState={
                    formData?.location?.state
                      ? {
                          label: formData?.location?.state,
                          value: formData?.location?.state,
                        }
                      : null
                  }
                />
                {errors?.location?.state && (
                  <ErrorMessage message={errors.location.state} />
                )}
              </StyledFormGroup>
            </Col>
          )}
          {/* END ----------------------------------------- State and region */}
        </Row>

        <Row>
          {/* START ----------------------------------------- Email */}
          <Col md={12} lg={6}>
            <StyledFormGroup>
              <div className="fs-sm fw-400">
                Email<span className="mandatory">&nbsp;*</span>
              </div>
              <div className="email-input-wrapper">
                <Form.Control
                  placeholder="Enter your email"
                  className="form-input email-input"
                  value={formData?.u_email_id}
                  disabled={true}
                />
                <div
                  className="edit-button flex items-center gap-2 pointer"
                  onClick={() => setShowEditEmailModal((prev) => !prev)}
                >
                  <EditIcon
                    stroke={myTheme.colors.primary}
                    fill={myTheme.colors.primary}
                  />
                  <div className="fs-1rem fw-400">Edit</div>
                </div>
              </div>
            </StyledFormGroup>
          </Col>
          {/* END ------------------------------------------- Email */}

          {/* START ----------------------------------------- Password */}
          <Col md={12} lg={6}>
            <StyledFormGroup className="form-group-wapper flex items-center">
              <div className="email-input-wrapper flex-1">
                <div className="fs-sm fw-400">
                  Password
                  <span className="mandatory">&nbsp;*</span>
                </div>
                <Form.Control
                  placeholder="Enter your email"
                  className="form-input email-input"
                  value={"***"}
                  disabled={true}
                />
                <div
                  className="edit-button flex items-center gap-2 pointer top-50"
                  onClick={() => navigate("/change-password")}
                >
                  <EditIcon
                    stroke={myTheme.colors.primary}
                    fill={myTheme.colors.primary}
                  />
                  <div className="fs-1rem fw-400">Reset</div>
                </div>
              </div>
            </StyledFormGroup>
          </Col>
          {/* END ------------------------------------------- Password */}
        </Row>
        {/* START ----------------------------------------- Phone */}
        <Row></Row>
        {/* END ------------------------------------------- Phone */}
        <Row>
          {/* START ----------------------------------------- Frequency of project board emails */}
          <Col md={12} lg={6}>
            <StyledFormGroup>
              <div className="fs-sm fw-400 mb-1">
                Frequency of Project Board Emails{" "}
                <Tooltip
                  customTrigger={<InfoIcon />}
                  className="d-inline-block"
                >
                  Freelancers can receive email updates when new, relevant
                  projects are added to the project board. You can set how often
                  you would like to receive these emails here.
                </Tooltip>
              </div>
              <AsyncSelect
                {...singleSelectProps}
                placeholder="Notification Email"
                loadOptions={notificationEmailOptions}
                onChange={(options) => {
                  const value = (
                    options as (typeof CONSTANTS.NOTIFICATION_EMAIL)[0]
                  ).value;
                  setFormData((prev) => ({
                    ...prev,
                    notification_email: Number(value),
                  }));
                  handleEditUser("Frequency of Project Board Emails", {
                    notification_email: Number(value),
                  });
                }}
                value={CONSTANTS.NOTIFICATION_EMAIL.find(
                  (x) => x.value === formData?.notification_email
                )}
                defaultOptions={true}
                key={formData?.notification_email}
              />
            </StyledFormGroup>
          </Col>
          {/* END ------------------------------------------- Frequency of project board emails */}
          {/* START ----------------------------------------- Unread Messages Notifications Settings */}
          <Col md={12} lg={6}>
            <StyledFormGroup>
              <div className="fs-sm fw-400 mb-1">
                Unread Messages Notifications Settings
                <Tooltip
                  customTrigger={<InfoIcon />}
                  className="d-inline-block"
                >
                  Freelancers are notified by email when a new message is
                  received on ZMZ. You can set here how often you would like to
                  receive these emails.
                </Tooltip>
              </div>
              <AsyncSelect
                {...singleSelectProps}
                placeholder="New Message Email"
                loadOptions={newMessageEmailOptions}
                onChange={(options) => {
                  const value = (
                    options as unknown as { label: string; value: string }
                  ).value;
                  setFormData((prev) => ({
                    ...prev,
                    new_message_email_notification: Number(value),
                  }));
                  handleEditUser("Frequency of Project Board Emails", {
                    new_message_email_notification: Number(value),
                  });
                }}
                value={CONSTANTS.NEW_MESSAGE_EMAIL_OPTIONS.find(
                  (x) => x.value === formData?.new_message_email_notification
                )}
                defaultOptions={true}
                key={formData?.new_message_email_notification}
              />
            </StyledFormGroup>
          </Col>
        </Row>
        {/* END ------------------------------------------- Unread Messages Notifications Settings */}
      </ContentBox>
      <Row>
        <Col lg="12">
          <div className="title fs-24 fw-400 mb-4">Account Status</div>
          {data?.deletion_requested === 1 ? (
            <StyledButton
              className="fs-18 fw-400 pointer"
              variant="primary"
              onClick={handleDelete}
              disabled={loading}
            >
              Cancel Account Closure Request
            </StyledButton>
          ) : (
            <StyledButton
              className="close-account-btn fs-18 fw-400 pointer"
              onClick={handleDelete}
            >
              Close My ZehMizeh Account
            </StyledButton>
          )}
        </Col>
        <EmailEditModal
          show={showEditEmailModal}
          existingEmail={data?.u_email_id}
          onClose={() => setShowEditEmailModal(false)}
          onUpdateEmail={() => refetch()}
        />
        <AccountClosureModal
          show={isAccountClosureModalOpen}
          toggle={() => setIsAccountClosureModalOpen((prev) => !prev)}
          clousureToggle={closureDescriptionToggle}
          loading={loading}
        />
        <AccountClosureDescriptionModal
          show={showClosureDescriptionModal}
          toggle={() => closureDescriptionToggle}
          onConfirm={onConfirmAccountDeletion}
          loading={loading}
        />
      </Row>
    </div>
  );
};
