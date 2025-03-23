"use client"; // Ensure this is a client component
import { useEffect, useState } from "react";
import Spinner from "@/components/forms/Spin/Spinner";
import { useQueryData, useRefetch } from "@/helpers/hooks/useQueryData";
import { useRouter } from "next/navigation";
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
import CustomButton from "@/components/custombutton/CustomButton";

interface Location {
  label: string;
  state: string;
  country_id: number;
  country_code: string;
  country_name: string;
  country_short_name: string;
}

interface NotificationOption {
  label: string;
  value: string;
}

interface StateSelection {
  label: string;
  value: string;
}

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
  location: {
    label: "",
    state: "",
    country_id: 0,
    country_code: "",
    country_name: "",
    country_short_name: "",
  } as Location,
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
  const router = useRouter();
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
  const [errors, setErrors] = useState<Partial<TFormData>>({});

  useEffect(() => {
    if (data) {
      setFormData({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        formatted_phonenumber: data.formatted_phonenumber || "",
        is_agency: data.is_agency || 0,
        new_message_email_notification:
          data.new_message_email_notification || 0,
        notification_email: data.notification_email || 0,
        phone_number: data.phone_number || "",
        u_email_id: data.u_email_id || "",
        location: data.location || initialState.location,
      });
    }
  }, [data]);

  const notificationEmailOptions = async (): Promise<NotificationOption[]> =>
    CONSTANTS.NOTIFICATION_EMAIL;

  const newMessageEmailOptions = async (): Promise<NotificationOption[]> =>
    CONSTANTS.NEW_MESSAGE_EMAIL_OPTIONS;

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

  const onConfirmAccountDeletion = (message: string) => {
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
        setErrors({});
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
        const validationErrors = getYupErrors({ inner: [error] });
        setErrors(validationErrors as Partial<TFormData>);
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
        className="absolute right-0 mr-4 cursor-pointer"
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
          <div className="text-base font-normal">
            {inputFieldLoading === loadingKey ? (
              <Spinner className="mr-1" />
            ) : (
              "Save"
            )}
          </div>
        )}
      </div>
    );
  };

  const handleStateChange = (item: StateSelection | null) => {
    if (item && formData.location) {
      const newLocation = {
        ...formData.location,
        state: item.value,
      };
      setFormData((prev) => ({
        ...prev,
        location: newLocation,
      }));
      handleEditUser("state/region", {
        location: newLocation,
      });
    }
  };

  return (
    <div>
      <div className="text-2xl font-normal mt-4 mb-2">Account Details</div>
      <ContentBox className="pb-5">
        {/* START ----------------------------------------- Username */}
        <div className="flex flex-wrap">
          <div className="w-full lg:w-1/2 px-3">
            <StyledFormGroup className="relative">
              <div className="text-sm font-normal">
                First Name<span className="mandatory">&nbsp;*</span>
              </div>
              <input
                placeholder="Enter first name"
                className="w-full px-3 py-2 border rounded"
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
          </div>
          <div className="w-full lg:w-1/2 px-3">
            <StyledFormGroup className="relative">
              <div className="text-sm font-normal">
                Last Name<span className="mandatory">&nbsp;*</span>
              </div>
              <input
                placeholder="Enter last name"
                className="w-full px-3 py-2 border rounded"
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
          </div>
        </div>
        {/* END ------------------------------------------- Username */}
        {/* START ----------------------------------------- Freelancer type */}
        <div className="flex flex-wrap">
          <div className="w-full lg:w-1/2 px-3">
            <StyledFormGroup>
              <div className="text-sm font-normal">
                Freelancer Type
                <span className="mandatory">&nbsp;*</span>
              </div>
              <div className="flex mt-2">
                <div
                  className={classNames(
                    "px-4 py-3 border rounded mr-4 cursor-pointer",
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
                    "px-4 py-3 border rounded mr-4 cursor-pointer",
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
          </div>
          <div className="w-full lg:w-1/2 px-3">
            <StyledFormGroup className="relative">
              <div className="text-sm font-normal">
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
          </div>
        </div>
        {/* END ------------------------------------------- Freelancer type */}

        <div className="flex flex-wrap">
          {/* START ----------------------------------------- Country */}
          <div className="w-full lg:w-1/2 px-3">
            <StyledFormGroup>
              <div className="text-sm font-normal mb-1">
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
          </div>
          {/* END ------------------------------------------- Country */}
          {/* START ----------------------------------------- State and region */}
          {!CONSTANTS.COUNTRIES_SHORT_NAME_WITHOUT_STATE.includes(
            formData?.location?.country_short_name
          ) && (
            <div className="w-full lg:w-1/2 px-3">
              <StyledFormGroup>
                <div className="text-sm font-normal mb-1">
                  State/Region<span className="mandatory">&nbsp;*</span>
                </div>
                <StateDropdown
                  countryCode={formData?.location?.country_short_name}
                  onSelectState={handleStateChange}
                  selectedState={
                    formData?.location?.state
                      ? {
                          label: formData.location.state,
                          value: formData.location.state,
                        }
                      : null
                  }
                />
                {errors?.location?.state && (
                  <ErrorMessage message={errors.location.state} />
                )}
              </StyledFormGroup>
            </div>
          )}
          {/* END ----------------------------------------- State and region */}
        </div>

        <div className="flex flex-wrap">
          {/* START ----------------------------------------- Email */}
          <div className="w-full lg:w-1/2 px-3">
            <StyledFormGroup>
              <div className="text-sm font-normal">
                Email<span className="mandatory">&nbsp;*</span>
              </div>
              <div className="email-input-wrapper">
                <input
                  placeholder="Enter your email"
                  className="w-full px-3 py-4 border rounded email-input "
                  value={formData?.u_email_id}
                  disabled={true}
                />
                <div
                  className="edit-button flex items-center gap-2 cursor-pointer"
                  onClick={() => setShowEditEmailModal((prev) => !prev)}
                >
                  <EditIcon
                    stroke={myTheme.colors.primary}
                    fill={myTheme.colors.primary}
                  />
                  <div className="text-base font-normal">Edit</div>
                </div>
              </div>
            </StyledFormGroup>
          </div>
          {/* END ------------------------------------------- Email */}

          {/* START ----------------------------------------- Password */}
          <div className="w-full lg:w-1/2 px-3">
            <StyledFormGroup className="form-group-wapper flex items-center">
              <div className="email-input-wrapper  w-full">
                <div className="text-sm font-normal relative">
                  Password
                  <span className="mandatory">&nbsp;*</span>
                </div>
                <input
                  placeholder="Enter your email"
                  className="w-full px-3 py-4 border rounded email-input"
                  value={"***"}
                  disabled={true}
                />
                <div
                  className="edit-button flex items-center gap-2 cursor-pointer bottom-[10%]"
                  onClick={() => router.push("/change-password")}
                >
                  <EditIcon
                    stroke={myTheme.colors.primary}
                    fill={myTheme.colors.primary}
                  />
                  <div className="text-base font-normal">Reset</div>
                </div>
              </div>
            </StyledFormGroup>
          </div>
          {/* END ------------------------------------------- Password */}
        </div>
        {/* START ----------------------------------------- Phone */}
        <div className="flex flex-wrap"></div>
        {/* END ------------------------------------------- Phone */}
        <div className="flex flex-wrap">
          {/* START ----------------------------------------- Frequency of project board emails */}
          <div className="w-full lg:w-1/2 px-3">
            <StyledFormGroup>
              <div className="text-sm font-normal mb-1">
                Frequency of Project Board Emails{" "}
                <Tooltip customTrigger={<InfoIcon />} className="inline-block">
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
          </div>
          {/* END ------------------------------------------- Frequency of project board emails */}
          {/* START ----------------------------------------- Unread Messages Notifications Settings */}
          <div className="w-full lg:w-1/2 px-3">
            <StyledFormGroup>
              <div className="text-sm font-normal mb-1">
                Unread Messages Notifications Settings
                <Tooltip customTrigger={<InfoIcon />} className="inline-block">
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
          </div>
        </div>
        {/* END ------------------------------------------- Unread Messages Notifications Settings */}
      </ContentBox>
      <div className="flex flex-wrap">
        <div className="w-full">
          <div className="text-2xl font-normal mb-4">Account Status</div>
          {data?.deletion_requested === 1 ? (
            <StyledButton
              className="text-lg font-normal cursor-pointer"
              variant="primary"
              onClick={handleDelete}
              disabled={loading}
            >
              Cancel Account Closure Request
            </StyledButton>
          ) : (
            <CustomButton
              text={"Close My ZehMizeh Account"}
              className="px-7 py-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px] mt-5 close-account-btn"
              onClick={handleDelete}
            />
          )}
        </div>
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
      </div>
    </div>
  );
};
