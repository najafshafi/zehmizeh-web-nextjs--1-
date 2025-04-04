"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import Spinner from "@/components/forms/Spin/Spinner";
import ProfileBanner from "./partials/ProfileBanner";
import * as C from "./client-profile.styled";
import AccountClosureModal from "@/components/profile/AccountClosureModal";
import BackButton from "@/components/ui/BackButton";
import Loader from "@/components/Loader";
import { StyledButton } from "@/components/forms/Buttons";
import PaymentInfo from "./partials/PaymentInfo";
import BankAccounts from "./partials/BankAccounts";
import useClientProfile from "@/controllers/useClientProfile";
import { useAuth } from "@/helpers/contexts/auth-context";
import {
  accountClosure,
  cancelAccountClosure,
  editUser,
} from "@/helpers/http/auth";
import StyledHtmlText from "@/components/ui/StyledHtmlText";
import ProfileDetailSection from "@/pages/freelancer-profile-settings/partials/ProfileDetailSection";
import { getFreelancerDetails } from "@/helpers/http/freelancer";
import { useQuery } from "react-query";
import AboutUsEditModal from "@/pages/freelancer-profile-settings/edit-modals/AboutUsEditModal";
import NewPaymentInfoModal from "./partials/NewPaymentInfoModal";
import Tooltip from "@/components/ui/Tooltip";
import ClientProfileTabs from "./ClientProfileTabs";
import { StyledFormGroup } from "./partials/edit-info/info-edit.styled";
import { myTheme } from "@/styles/theme";
import EditIcon from "@/public/icons/edit-blue.svg";
import EmailEditModal from "@/components/profile/EmailEditModal";
import PhoneInputWrapper from "@/components/styled/PhoneInputWrapper";
import PhoneNumberInput from "@/components/forms/phone-number-input";
import { Ratings } from "@/components/Ratings";
import CountryDropdown from "@/components/forms/country-dropdown/CountryDropdown";
import StateDropdown from "@/components/forms/state-picker/StatePicker";
import { TEditUserRequest } from "@/helpers/types/apiRequestResponse";
import { onlyCharacters } from "@/helpers/validation/common";
import { getYupErrors } from "@/helpers/utils/misc";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { clientAccountProfileValidation } from "@/helpers/validation/clientAccountProfileValidation";
import InfoIcon from "@/public/icons/info-gray-18.svg";
import AsyncSelect from "react-select/async";
import { MultiSelectCustomStyle } from "./partials/edit-info/multiSelectCustomStyle";
import { CONSTANTS } from "@/helpers/const/constants";
import { TClientProfilePathParams } from "@/helpers/types/pathParams.type";
import { IClientDetails } from "@/helpers/types/client.type";
import AccountClosureDescriptionModal from "@/components/profile/AccountClosureDescriptionModal";
import { queryKeys } from "@/helpers/const/queryKeys";
import { useRefetch } from "@/helpers/hooks/useQueryData";

// Add type definition for Window with intercomSettings
declare global {
  interface Window {
    intercomSettings: any;
  }
}

const INTERCOM_APP_ID = process.env.REACT_APP_INTERCOM_APP_ID;

const myWindow: Window = window;

type TInputFieldLoading =
  | "phone number"
  | "first name"
  | "last name"
  | "country"
  | "state/region"
  | "message email notification"
  | "";

type TFormData = Pick<
  IClientDetails,
  | "first_name"
  | "last_name"
  | "location"
  | "formatted_phonenumber"
  | "phone_number"
  | "new_message_email_notification"
>;

const singleSelectProps = {
  closeMenuOnSelect: true,
  isMulti: false,
  styles: MultiSelectCustomStyle,
};

interface SaveButtonUIProps {
  loadingFieldName: TInputFieldLoading;
  fieldName: keyof TFormData;
  timeout?: number;
  additionalData?: Partial<TFormData>;
  onSave: (
    loadingFieldName: TInputFieldLoading,
    data: TEditUserRequest
  ) => void;
}

const SaveButtonUI = ({
  loadingFieldName,
  fieldName,
  timeout,
  additionalData,
  onSave,
}: SaveButtonUIProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setShow(false);
        onSave(loadingFieldName, {
          [fieldName]: additionalData?.[fieldName],
          ...additionalData,
        });
      }, timeout || 1000);
      return () => clearTimeout(timer);
    }
  }, [show, fieldName, loadingFieldName, timeout, additionalData, onSave]);

  return (
    <div
      className={`edit-button flex items-center gap-2 cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 ${
        show ? "opacity-100" : "opacity-0"
      } transition-opacity duration-200`}
      onClick={() => setShow(true)}
    >
      <EditIcon stroke={myTheme.colors.primary} fill={myTheme.colors.primary} />
      <div className="text-base font-normal">Save</div>
    </div>
  );
};

interface ClientProfileProps {
  currentTab: string;
}

const ClientProfile = ({ currentTab }: ClientProfileProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);
  const clientId = currentTab || "profile";

  const { refetch: cardExpirationRefetch } = useRefetch(
    queryKeys.checkCardExpiration
  );
  const { refetch: paymentMethodRefetch } = useRefetch(
    queryKeys.clientHasPaymentMethod
  );

  /* This will fetch the client profile details */
  const [loading, setLoading] = useState<boolean>(false);
  const [showClosureModal, setShowClosureModal] = useState<boolean>(false);
  const [showClosureDescriptionModal, setShowClosureDescriptionModal] =
    useState<boolean>(false);
  const [showEditModalState, setEditModdalState] = useState<{
    modal: string;
  } | null>(null);
  const [isNewPayInfoModal, setIsNewPayInfoModal] = useState(false);
  const [showEditEmailModal, setShowEditEmailModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<TFormData>({
    first_name: "",
    last_name: "",
    location: {} as IClientDetails["location"],
    formatted_phonenumber: "",
    phone_number: "",
    new_message_email_notification: 0,
  });
  const [inputFieldLoading, setInputFieldLoading] =
    useState<TInputFieldLoading>("");
  const [errors, setErrors] = useState<TFormData>({} as TFormData);

  const { profileData, isLoading, refetchData, isRefetching } =
    useClientProfile();

  const { setUser, user } = useAuth();

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleEditModal = () => {
    setShowEditEmailModal(!showEditEmailModal);
  };

  const newMessageEmailOptions = async () =>
    await CONSTANTS.NEW_MESSAGE_EMAIL_OPTIONS;

  useEffect(() => {
    if (!isMounted) return;

    if (user) {
      myWindow.intercomSettings = {
        appId: INTERCOM_APP_ID,
        email: user?.u_email_id,
        user_id: user?.user_id,
        name: user?.first_name + " " + user?.last_name,
        avatar: {
          type: "avatar",
          image_url: user.user_image,
        },
      };
    }
  }, [user, isMounted]);

  const onBack = () => {
    if (!isMounted) return;

    const fromRegister = searchParams?.get("fromRegister") === "true";
    if (fromRegister) {
      router.push("/");
    } else {
      router.push(
        user.user_type === "freelancer" ? "/dashboard" : "/client/dashboard"
      );
    }
  };

  useEffect(() => {
    if (!isMounted) return;

    if (profileData) {
      setUser(profileData);
      setFormData((prev) => ({
        ...prev,
        first_name: profileData?.first_name,
        last_name: profileData?.last_name,
        location: profileData?.location,
        formatted_phonenumber: profileData?.formatted_phonenumber,
        phone_number: profileData?.phone_number,
        new_message_email_notification:
          CONSTANTS.NEW_MESSAGE_EMAIL_OPTIONS.find(
            (dt) => dt.value === profileData?.new_message_email_notification
          )?.value || 0,
      }));
    }
  }, [profileData, setUser, isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    if (!isLoading) {
      const currentLocation = window.location.href;
      const hasCommentAnchor = currentLocation.includes("/#");
      if (hasCommentAnchor) {
        const anchorCommentId = `${currentLocation.substring(
          currentLocation.indexOf("#") + 1
        )}`;
        const anchorComment = document.getElementById(anchorCommentId);
        if (anchorComment) {
          anchorComment.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }, [isLoading, isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    if (
      !["settings", "profile", "ratings", "payments"].includes(
        clientId.toLowerCase()
      )
    ) {
      router.back();
    }
  }, [clientId, router, isMounted]);

  const toggleClosureModal = () => {
    setShowClosureModal(!showClosureModal);
  };

  const toggleClosureDescriptionModal = () => {
    setShowClosureModal(!showClosureModal);
    setShowClosureDescriptionModal(!showClosureDescriptionModal);
  };

  const toggleClosureDescriptionEditModal = () => {
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
        toggleClosureDescriptionEditModal();
        refetchData();
        return res.message;
      },
      error: (err) => {
        setLoading(false);
        toggleClosureDescriptionEditModal();
        return err?.response?.data?.message || "error";
      },
    });
  };

  const handleCancelDeletionRequest = () => {
    const promise = cancelAccountClosure();
    setLoading(true);
    toast.promise(promise, {
      loading: "Please wait...",
      success: (res) => {
        setLoading(false);
        refetchData();
        return res.message;
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || "error";
      },
    });
  };

  const { data, refetch } = useQuery(
    ["clientdetails", user?.user_id],
    () =>
      getFreelancerDetails(user?.user_id).catch((err) => {
        throw err;
      }),
    { enabled: !!user?.user_id }
  );

  const onUpdate = () => {
    /*
     * This funciton will be called after anything is edited / added
     * This will close the modal and refetch the profile
     */
    setEditModdalState(null);
    refetch();
  };

  const firstPaymentInfoModalHandler = () => {
    const account = (profileData as any)?.account || [];
    const carddata = (profileData as any)?.carddata || [];
    if (account.length === 0 && carddata.length === 0)
      setIsNewPayInfoModal(true);
  };

  const handleEditUser = (
    loadingFieldName: TInputFieldLoading,
    data: TEditUserRequest
  ) => {
    clientAccountProfileValidation
      .validate(data, { context: { exist: false } })
      .then(() => {
        setErrors({} as TFormData);
        setInputFieldLoading(loadingFieldName);
        const promise = editUser(data);
        toast.promise(promise, {
          loading: `Updating ${loadingFieldName}`,
          success: (res) => {
            refetchData();
            setInputFieldLoading("");
            return res.message;
          },
          error: (err) => {
            refetchData();
            setInputFieldLoading("");
            return err.message ?? err.toString();
          },
        });
      })
      .catch((error) => {
        const errors = getYupErrors({ inner: [error] });
        // @ts-ignore - Converting error record to form errors
        setErrors(errors as unknown as TFormData);
      });
  };

  const refetchAfterPaymentDetailsAdded = () => {
    refetchData();
    cardExpirationRefetch();
    paymentMethodRefetch();
  };

  if (!isMounted) {
    return <Loader />;
  }

  return (
    <C.ClientProfileWrapper>
      <ClientProfileTabs currentTab={clientId} />
      <C.ClientContent>
        <C.Wrapper className="content-hfill mt-2 ">
          <BackButton onBack={onBack}>
            {isRefetching ? <Spinner className="ml-1 w-4 h-4" /> : null}
          </BackButton>

          {isLoading && <Loader />}

          {!isLoading && (
            <>
              {clientId === "profile" && (
                <>
                  {/* Profile details banner */}
                  {profileData && (
                    <ProfileBanner data={profileData} refetch={refetchData} />
                  )}

                  <div className="my-4">
                    {/* About Me */}
                    <div className="w-full mb-5">
                      <ProfileDetailSection
                        onEdit={() => setEditModdalState({ modal: "about_me" })}
                        title={
                          <div className="flex items-center gap-1">
                            {"About Me"}
                            <Tooltip>
                              The &quot;About Me&quot; section is the primary
                              place to introduce yourself to freelancers. You
                              can share whatever you like - your work history,
                              your style, your special preferences... whatever
                              you think would be helpful for freelancers to
                              know!
                            </Tooltip>
                          </div>
                        }
                        details={
                          <div>
                            {data?.data?.about_me && (
                              <div className="about-me text-lg font-normal">
                                <StyledHtmlText
                                  htmlString={data?.data?.about_me}
                                  needToBeShorten={true}
                                  minlines={5}
                                  id="about-me"
                                />
                              </div>
                            )}
                          </div>
                        }
                      />
                    </div>
                  </div>
                </>
              )}
              {clientId === "ratings" && (
                <Ratings reviews={profileData?.review || []} />
              )}
              {clientId === "payments" && (
                <>
                  {/* START ----------------------------------------- Payment details */}
                  <div className="text-2xl font-normal mt-4 mb-3">
                    Payment Details
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Payment info (Saved cards) */}
                    <div
                      className={
                        profileData?.location?.country_short_name === "US"
                          ? "mb-4"
                          : "mx-auto"
                      }
                    >
                      <PaymentInfo
                        onNewAdded={firstPaymentInfoModalHandler}
                        // @ts-ignore - Card data type mismatch
                        paymentData={(profileData as any)?.carddata || []}
                        refetch={refetchAfterPaymentDetailsAdded}
                      />
                    </div>
                    {profileData?.location?.country_short_name === "US" && (
                      <div className="mb-4" id="bank-accounts">
                        <BankAccounts
                          onNewAdded={firstPaymentInfoModalHandler}
                          // @ts-ignore - Bank account type mismatch
                          paymentData={(profileData as any)?.account}
                          refetch={refetchAfterPaymentDetailsAdded}
                          userCountry={
                            profileData?.location?.country_short_name
                          }
                        />
                      </div>
                    )}
                  </div>
                  {/* END ------------------------------------------- Payment details */}
                </>
              )}
              {clientId === "settings" && (
                <>
                  {/* Reset password */}
                  <div className="text-2xl font-normal mt-4 mb-2">
                    Account Details
                  </div>
                  <C.ContentBox className="pb-5">
                    {/* START ----------------------------------------- First name and last name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <StyledFormGroup className="relative">
                          <div className="text-sm font-normal">
                            First Name
                            <span className="text-red-500">&nbsp;*</span>
                          </div>
                          <input
                            type="text"
                            placeholder="Enter your first name"
                            className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData?.first_name}
                            maxLength={35}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                first_name: onlyCharacters(e.target.value),
                              }))
                            }
                          />
                          <SaveButtonUI
                            loadingFieldName="first name"
                            fieldName="first_name"
                            onSave={handleEditUser}
                          />
                        </StyledFormGroup>
                        {errors?.first_name && (
                          <ErrorMessage message={errors.first_name} />
                        )}
                      </div>
                      <div>
                        <StyledFormGroup className="relative">
                          <div className="text-sm font-normal">
                            Last Name
                            <span className="text-red-500">&nbsp;*</span>
                          </div>
                          <input
                            type="text"
                            placeholder="Enter your last name"
                            className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData?.last_name}
                            maxLength={35}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                last_name: onlyCharacters(e.target.value),
                              }))
                            }
                          />
                          <SaveButtonUI
                            loadingFieldName="last name"
                            fieldName="last_name"
                            onSave={handleEditUser}
                          />
                        </StyledFormGroup>
                        {errors?.last_name && (
                          <ErrorMessage message={errors.last_name} />
                        )}
                      </div>
                    </div>
                    {/* END ------------------------------------------- First name and last name */}

                    {/* START ----------------------------------------- Country */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <StyledFormGroup className="relative">
                          <div className="text-sm font-normal mb-1">
                            Country<span className="text-red-500">&nbsp;*</span>
                          </div>
                          <CountryDropdown
                            // @ts-ignore - Location type mismatch with CountryOptionType
                            selectedCountry={formData?.location as any}
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
                            <ErrorMessage
                              message={errors?.location?.country_name}
                            />
                          )}
                        </StyledFormGroup>
                      </div>
                      {/* END ------------------------------------------- Country */}

                      {/* START ----------------------------------------- State / region */}
                      {!CONSTANTS.COUNTRIES_SHORT_NAME_WITHOUT_STATE.includes(
                        formData?.location?.country_short_name
                      ) && (
                        <div>
                          <StyledFormGroup>
                            <div className="text-sm font-normal mb-1">
                              State/Region
                              <span className="text-red-500">&nbsp;*</span>
                            </div>
                            <StateDropdown
                              countryCode={
                                formData?.location?.country_short_name
                              }
                              onSelectState={(item) => {
                                const newLocation = {
                                  ...formData.location,
                                  state: item?.value || "",
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
                        </div>
                      )}
                      {/* END ------------------------------------------- State / region */}

                      {/* START ----------------------------------------- Phone number */}
                      <div>
                        <StyledFormGroup className="flex flex-col">
                          <div className="text-sm font-normal">
                            Phone<span className="text-red-500">&nbsp;*</span>
                          </div>
                          <PhoneInputWrapper className="phone-input-wrapper flex-1 w-full">
                            <PhoneNumberInput
                              initialValue={profileData?.formatted_phonenumber}
                              onChange={(phone, formattedValue) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  phone_number: phone,
                                  formatted_phonenumber: formattedValue,
                                }));
                              }}
                            />
                            <SaveButtonUI
                              loadingFieldName="phone number"
                              fieldName="formatted_phonenumber"
                              onSave={handleEditUser}
                              timeout={30}
                              additionalData={{
                                phone_number: formData.phone_number,
                              }}
                            />
                          </PhoneInputWrapper>
                        </StyledFormGroup>
                        {errors?.formatted_phonenumber && (
                          <ErrorMessage
                            message={errors.formatted_phonenumber}
                          />
                        )}
                      </div>
                      {/* END ------------------------------------------- Phone number */}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* START ----------------------------------------- Email */}
                      <div>
                        <StyledFormGroup
                          className="flex items-center"
                          style={{ gap: "4rem" }}
                        >
                          <div className="email-input-wrapper flex-1">
                            <div className="text-sm font-normal">
                              Email
                              <span className="text-red-500">&nbsp;*</span>
                            </div>
                            <input
                              type="email"
                              placeholder="Enter your email"
                              className="form-input email-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={profileData?.u_email_id}
                              disabled={true}
                            />
                            <div
                              className="edit-button flex items-center gap-2 cursor-pointer top-50"
                              onClick={toggleEditModal}
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
                      <div>
                        <StyledFormGroup
                          className="flex items-center"
                          style={{ gap: "1.7rem" }}
                        >
                          <div className="email-input-wrapper flex-1">
                            <div className="text-sm font-normal">
                              Password
                              <span className="text-red-500">&nbsp;*</span>
                            </div>
                            <input
                              type="password"
                              placeholder="Enter your password"
                              className="form-input email-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value="***"
                              disabled={true}
                            />
                            <div
                              className="edit-button flex items-center gap-2 cursor-pointer top-50"
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

                    <div>
                      {/* START ----------------------------------------- Unread Messages Notifications Settings */}
                      <div>
                        <StyledFormGroup>
                          <div className="flex items-center text-sm font-normal mb-1">
                            Unread Messages Notifications Settings
                            <Tooltip
                              customTrigger={<InfoIcon className="ml-1" />}
                              className="inline-block"
                            >
                              Clients are notified by email when a new message
                              is received on ZMZ. You can set here how often you
                              would like to receive these emails.
                            </Tooltip>
                          </div>
                          <AsyncSelect
                            {...singleSelectProps}
                            placeholder="New Message Email"
                            loadOptions={newMessageEmailOptions}
                            onChange={(options) => {
                              const value = (
                                options as (typeof CONSTANTS.NEW_MESSAGE_EMAIL_OPTIONS)[0]
                              ).value;
                              setFormData((prev) => ({
                                ...prev,
                                new_message_email_notification: Number(value),
                              }));
                              handleEditUser("message email notification", {
                                new_message_email_notification: Number(value),
                              });
                            }}
                            value={CONSTANTS.NEW_MESSAGE_EMAIL_OPTIONS.find(
                              (x) =>
                                x.value ===
                                formData?.new_message_email_notification
                            )}
                            defaultOptions={true}
                          />
                        </StyledFormGroup>
                      </div>
                      {/* END ------------------------------------------- Unread Messages Notifications Settings */}
                    </div>
                  </C.ContentBox>

                  {/* START ----------------------------------------- Account status */}
                  <div className="mt-5">
                    <div className="text-2xl font-normal mb-2">
                      Account Status
                    </div>
                    <div>
                      {profileData?.deletion_requested == 1 ? (
                        <StyledButton
                          className="text-lg font-normal cursor-pointer"
                          variant="primary"
                          onClick={handleCancelDeletionRequest}
                          disabled={loading}
                        >
                          Cancel Account Closure Request
                        </StyledButton>
                      ) : (
                        <StyledButton
                          className="close-account-btn text-lg font-normal cursor-pointer"
                          onClick={toggleClosureModal}
                        >
                          Close My ZehMizeh Account
                        </StyledButton>
                      )}
                    </div>
                  </div>
                  {/* END ------------------------------------------- Account status */}
                </>
              )}
            </>
          )}
        </C.Wrapper>

        <AccountClosureModal
          show={showClosureModal}
          toggle={toggleClosureModal}
          clousureToggle={toggleClosureDescriptionModal}
          loading={loading}
        />

        <AccountClosureDescriptionModal
          show={showClosureDescriptionModal}
          toggle={toggleClosureDescriptionModal}
          onConfirm={onConfirmAccountDeletion}
          loading={loading}
        />

        <AboutUsEditModal
          show={showEditModalState?.modal == "about_me"}
          data={{
            is_agency: !!data?.data?.is_agency,
            aboutMe: data?.data?.about_me,
            portfolioLink: data?.data?.portfolio_link,
          }}
          onClose={() => setEditModdalState(null)}
          onUpdate={onUpdate}
          user_type={user?.user_type}
        />

        <NewPaymentInfoModal
          show={isNewPayInfoModal}
          onClose={() => setIsNewPayInfoModal(false)}
        />

        <EmailEditModal
          show={showEditEmailModal}
          existingEmail={profileData?.u_email_id}
          onClose={toggleEditModal}
          onUpdateEmail={() => refetchData()}
        />
      </C.ClientContent>
    </C.ClientProfileWrapper>
  );
};

export default ClientProfile;
