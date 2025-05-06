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
import classNames from "classnames";
import PhoneInputWrapper from "@/components/styled/PhoneInputWrapper";
import PhoneNumberInput from "@/components/forms/phone-number-input";
import AsyncSelect from "react-select/async";
import Tooltip from "@/components/ui/Tooltip";
import { MultiSelectCustomStyle } from "../edit-modals/multiSelectCustomStyle";
import InfoIcon from "@/public/icons/info-gray-18.svg";
import { CONSTANTS } from "@/helpers/const/constants";
import { ContentBox } from "../freelancer-profile-settings.styled";
import { IFreelancerDetails } from "@/helpers/types/freelancer.type";
import { TEditUserRequest } from "@/helpers/types/apiRequestResponse";
import { freelancerAccountProfileValidation } from "@/helpers/validation/freelancerAccountProfileValidation";
import { getYupErrors } from "@/helpers/utils/misc";
import ErrorMessage from "@/components/ui/ErrorMessage";
import EditIcon from "@/public/icons/edit-blue.svg";
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
  value: string | number | boolean; // Updated to match CountryOptionType exactly
}

interface NotificationOption {
  label: string;
  value: number; // Changed from string to number to match CONSTANTS
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
    value: "", // Value is now required
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
> & {
  location: Location;
};

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
  const result = useQueryData<IFreelancerDetails>(
    queryKeys.getFreelancerProfile
  );
  const profileData = result ? (result as any).data : undefined;
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
    if (profileData) {
      // Ensure location has a value property if it exists
      const locationWithValue = profileData.location
        ? {
            ...profileData.location,
            value: profileData.location.country_name,
          }
        : initialState.location;

      setFormData({
        first_name: profileData.first_name || "",
        last_name: profileData.last_name || "",
        formatted_phonenumber: profileData.formatted_phonenumber || "",
        is_agency: profileData.is_agency || 0,
        new_message_email_notification:
          profileData.new_message_email_notification || 0,
        notification_email: profileData.notification_email || 0,
        phone_number: profileData.phone_number || "",
        u_email_id: profileData.u_email_id || "",
        location: locationWithValue,
      });
    }
  }, [profileData]);

  // Fixed the return type and implementation to match AsyncSelect requirements
  const notificationEmailOptions = (
    inputValue: string
  ): Promise<NotificationOption[]> => {
    return Promise.resolve(CONSTANTS.NOTIFICATION_EMAIL);
  };

  // Fixed the return type and implementation to match AsyncSelect requirements
  const newMessageEmailOptions = (
    inputValue: string
  ): Promise<NotificationOption[]> => {
    return Promise.resolve(
      CONSTANTS.NEW_MESSAGE_EMAIL_OPTIONS as NotificationOption[]
    );
  };

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
    if (profileData?.deletion_requested == 1) {
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
        {profileData &&
          dataKey in profileData &&
          profileData[dataKey as keyof IFreelancerDetails] !==
            formData[dataKey] && (
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
            <div className="relative mt-5">
              <div className="text-sm font-normal">
                First Name<span className="text-red-500">&nbsp;*</span>
              </div>
              <input
                placeholder="Enter first name"
                className="w-full px-3 py-3 border rounded"
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
            </div>
            {errors?.first_name && <ErrorMessage message={errors.first_name} />}
          </div>
          <div className="w-full lg:w-1/2 px-3">
            <div className="relative mt-5   ">
              <div className="text-sm font-normal">
                Last Name<span className="text-red-500">&nbsp;*</span>
              </div>
              <input
                placeholder="Enter last name"
                className="w-full px-3 py-3 border rounded"
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
            </div>
            {errors?.last_name && <ErrorMessage message={errors.last_name} />}
          </div>
        </div>
        {/* END ------------------------------------------- Username */}
        {/* START ----------------------------------------- Freelancer type */}
        <div className="flex flex-wrap">
          <div className="w-full lg:w-1/2 px-3">
            <div className="mt-5">
              <div className="text-sm font-normal">
                Freelancer Type
                <span className="text-red-500">&nbsp;*</span>
              </div>
              <div className="flex mt-2">
                <div
                  className={classNames(
                    "px-4 py-3 border rounded mr-4 cursor-pointer",
                    {
                      "border-dark": formData.is_agency === 0,
                      "border-gray-100": formData.is_agency !== 0,
                    }
                  )}
                  style={{
                    borderColor: formData.is_agency === 0 ? "#333" : "",
                  }}
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
                      "border-gray-100": formData.is_agency !== 1,
                    }
                  )}
                  style={{
                    borderColor: formData.is_agency === 1 ? "#333" : "",
                  }}
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
            </div>
          </div>

          <div className="w-full lg:w-1/2 px-3">
            <div className="relative mt-5">
              <div className="text-sm font-normal">
                Phone<span className="text-red-500">&nbsp;*</span>
              </div>
              <PhoneInputWrapper className="border border-black pl-0">
                <PhoneNumberInput
                  initialValue={formData?.formatted_phonenumber}
                  onChange={(phone, formattedValue) => {
                    if (
                      phone !== formData.phone_number ||
                      formattedValue !== formData.formatted_phonenumber
                    ) {
                      setFormData((prev) => ({
                        ...prev,
                        phone_number: phone,
                        formatted_phonenumber: formattedValue,
                      }));
                    }
                  }}
                />
                {SaveButtonUI("phone number", "formatted_phonenumber", 30, {
                  phone_number: formData.phone_number,
                })}
              </PhoneInputWrapper>
            </div>
            {errors?.formatted_phonenumber && (
              <ErrorMessage message={errors.formatted_phonenumber} />
            )}
          </div>
        </div>
        {/* END ------------------------------------------- Freelancer type */}

        <div className="flex flex-wrap">
          {/* START ----------------------------------------- Country */}
          <div className="w-full lg:w-1/2 px-3">
            <div className="mt-5">
              <div className="text-sm font-normal mb-1">
                Country<span className="text-red-500">&nbsp;*</span>
              </div>
              <CountryDropdown
                selectedCountry={
                  formData?.location as any /* Type cast to avoid type mismatch */
                }
                onSelectCountry={(item) => {
                  const newLocation: Location = {
                    ...item,
                    // Ensure all required properties are present
                    state: item.state || "",
                    country_id: item.country_id || 0,
                    country_code: item.country_code || "",
                    country_name: item.country_name || "",
                    country_short_name: item.country_short_name || "",
                    value: item.value || item.country_name || "",
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
                <ErrorMessage
                  message={errors.location.country_name as string}
                />
              )}
            </div>
          </div>
          {/* END ------------------------------------------- Country */}
          {/* START ----------------------------------------- State and region */}
          {!CONSTANTS.COUNTRIES_SHORT_NAME_WITHOUT_STATE.includes(
            formData?.location?.country_short_name
          ) && (
            <div className="w-full lg:w-1/2 px-3">
              <div className="mt-5">
                <div className="text-sm font-normal mb-1">
                  State/Region<span className="text-red-500">&nbsp;*</span>
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
                  <ErrorMessage message={errors.location.state as string} />
                )}
              </div>
            </div>
          )}
          {/* END ----------------------------------------- State and region */}
        </div>

        <div className="flex flex-wrap">
          {/* START ----------------------------------------- Email */}
          <div className="w-full lg:w-1/2 px-3">
            <div className="mt-5">
              <div className="text-sm font-normal">
                Email<span className="text-red-500">&nbsp;*</span>
              </div>
              <div className="relative">
                <input
                  placeholder="Enter your email"
                  className="w-full px-3 py-4 border rounded pr-[100px] "
                  value={formData?.u_email_id}
                  disabled={true}
                />
                <div
                  className="absolute right-4 top-[35%] flex items-center gap-2 cursor-pointer"
                  onClick={() => setShowEditEmailModal((prev) => !prev)}
                >
                  <EditIcon
                    stroke={myTheme.colors.primary}
                    fill={myTheme.colors.primary}
                  />
                  <div className="text-base font-normal">Edit</div>
                </div>
              </div>
            </div>
          </div>
          {/* END ------------------------------------------- Email */}

          {/* START ----------------------------------------- Password */}
          <div className="w-full lg:w-1/2 px-3">
            <div className="form-group-wapper flex items-center mt-5">
              <div className="relative  w-full">
                <div className="text-sm font-normal relative">
                  Password
                  <span className="text-red-500">&nbsp;*</span>
                </div>
                <input
                  placeholder="Enter your email"
                  className="w-full px-3 py-4 border rounded pr-[100px] "
                  value={"***"}
                  disabled={true}
                />
                <div
                  className="absolute right-4 top-[35%] flex items-center gap-2 cursor-pointer bottom-[10%]"
                  onClick={() => router.push("/change-password")}
                >
                  <EditIcon
                    stroke={myTheme.colors.primary}
                    fill={myTheme.colors.primary}
                  />
                  <div className="text-base font-normal">Reset</div>
                </div>
              </div>
            </div>
          </div>
          {/* END ------------------------------------------- Password */}
        </div>
        {/* START ----------------------------------------- Phone */}
        <div className="flex flex-wrap"></div>
        {/* END ------------------------------------------- Phone */}
        <div className="flex flex-wrap">
          {/* START ----------------------------------------- Frequency of project board emails */}
          <div className="w-full lg:w-1/2 px-3">
            <div className="mt-5">
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
            </div>
          </div>
          {/* END ------------------------------------------- Frequency of project board emails */}
          {/* START ----------------------------------------- Unread Messages Notifications Settings */}
          <div className="w-full lg:w-1/2 px-3">
            <div className="mt-5">
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
                    options as unknown as { label: string; value: number }
                  ).value;
                  setFormData((prev) => ({
                    ...prev,
                    new_message_email_notification: Number(value),
                  }));
                  handleEditUser("Unread Message Notification", {
                    new_message_email_notification: Number(value),
                  });
                }}
                value={CONSTANTS.NEW_MESSAGE_EMAIL_OPTIONS.find(
                  (x) => x.value === formData?.new_message_email_notification
                )}
                defaultOptions={true}
                key={formData?.new_message_email_notification}
              />
            </div>
          </div>
        </div>
        {/* END ------------------------------------------- Unread Messages Notifications Settings */}
      </ContentBox>
      <div className="flex flex-wrap">
        <div className="w-full">
          <div className="text-2xl font-normal mb-4">Account Status</div>
          {profileData?.deletion_requested === 1 ? (
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
          existingEmail={profileData?.u_email_id}
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
