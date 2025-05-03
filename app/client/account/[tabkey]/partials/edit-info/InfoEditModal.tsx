/*
 * This component is a modal to edit freelancer info
 */

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { StyledFormGroup, EditFormWrapper } from "./info-edit.styled";
import ErrorMessage from "@/components/ui/ErrorMessage";
import CountryDropdown from "@/components/forms/country-dropdown/CountryDropdown";
import StatesDropdopwn from "@/components/forms/state-picker/StatePicker";
import { getYupErrors } from "@/helpers/utils/misc";
import { editUser } from "@/helpers/http/auth";
import EmailEditModal from "@/components/profile/EmailEditModal";
import { onlyCharacters } from "@/helpers/validation/common";
import { clientProfileTabValidation } from "@/helpers/validation/clientProfileTabValidation";
import { CONSTANTS } from "@/helpers/const/constants";
import { IClientDetails } from "@/helpers/types/client.type";

// Define the interface for location data used in this component
interface LocationData {
  country_name?: string;
  country_short_name?: string;
  state?: string;
  [key: string]: any; // Allow any additional properties
}

// Define type for country dropdown options
type CountryOption = {
  label: string;
  value: string | number | boolean;
  country_name: string;
  country_short_name?: string;
  [key: string]: any;
};

// Define type for state dropdown options
interface StateOption {
  label: string;
  value: string;
}

// Define type for validation errors
type ErrorRecord = {
  [key: string]: string | ErrorRecord | undefined;
  location?: {
    country_name?: string;
    state?: string;
    [key: string]: any;
  };
};

type Props = {
  show: boolean;
  onClose: () => void;
  onUpdate: () => void;
  data?: IClientDetails;
};

export type TFormState = Pick<
  IClientDetails,
  | "first_name"
  | "last_name"
  | "user_image"
  | "company_name"
  | "location"
  | "u_email_id"
>;

const initialState: TFormState = {
  first_name: "",
  last_name: "",
  user_image: "",
  company_name: "",
  location: {} as any,
  u_email_id: "",
};

const InfoEditModal = ({ show, onClose, onUpdate, data }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formState, setFormState] = useState<TFormState>(initialState);
  const [errors, setErrors] = useState<ErrorRecord>({});
  const [showEditEmailModal, setShowEditEmailModal] = useState<boolean>(false);

  const toggleEditModal = () => {
    // This function will toggle the Add / Edit modal
    setShowEditEmailModal(!showEditEmailModal);
  };

  const onUpdateEmail = (value: string) => {
    handleChange("u_email_id", value);
    onUpdate();
  };

  useEffect(() => {
    if (data && show) {
      /* This will set the data in fields from profile data */
      setFormState({
        first_name: data?.first_name?.trim() || "",
        last_name: data?.last_name?.trim() || "",
        user_image: data?.user_image || "",
        company_name: data?.company_name || "",
        location: data?.location || ({} as any),
        u_email_id: data?.u_email_id || "",
      });
    } else {
      setFormState(initialState);
    }
  }, [data, show]);

  const handleChange = useCallback(
    (field: keyof TFormState, value: TFormState[keyof TFormState]) => {
      /* This will store the field's changed values in state object */
      setFormState((prevFormState) => {
        return { ...prevFormState, [field]: value };
      });
    },
    []
  );

  const handleUpdate = () => {
    setErrors({});
    clientProfileTabValidation
      .validate(formState, { abortEarly: false })
      .then(() => {
        /* This function will update the client profile */
        setLoading(true);

        const body = {
          user_image: formState?.user_image,
          first_name: formState?.first_name,
          last_name: formState?.last_name,
          company_name: formState?.company_name,
          location: formState?.location,
        };

        /* API call to update client profile */
        const promise = editUser(body);

        toast.promise(promise, {
          loading: "Updating your details - please wait...",
          success: (res) => {
            onUpdate();
            onClose();
            setLoading(false);
            return res.message;
          },
          error: (err) => {
            setLoading(false);
            return err?.response?.data?.message || "error";
          },
        });
      })
      .catch((err) => {
        const errorsData = getYupErrors(err);
        setErrors(errorsData as ErrorRecord);
      });
  };

  const onSelectCountry = (item: any) => {
    if (!item) return;

    // Use type assertion to create a location object
    const location = {
      country_name: item.country_name,
      country_short_name: item.country_short_name,
      state: formState?.location?.state,
    };

    // Update the location in formState
    handleChange("location", location as any);
  };

  const onSelectState = (item: StateOption | null) => {
    if (!item) return;

    const formData = { ...formState };
    if (formData.location) {
      // Update the state property in location
      const updatedLocation = {
        ...formData.location,
        state: item.value,
      };

      formData.location = updatedLocation;
      setFormState(formData);
    }
  };

  // Convert location to CountryOptionType format for CountryDropdown
  const getCountryOptionFromLocation = () => {
    if (!formState?.location?.country_name) return null;

    return {
      label: formState.location.country_name,
      value:
        formState.location.country_short_name ||
        formState.location.country_name,
      country_name: formState.location.country_name,
      country_short_name: formState.location.country_short_name,
    };
  };

  // Get state option for StatesDropdown
  const getStateOption = (): StateOption | null => {
    if (!formState?.location?.state) return null;

    return {
      label: formState.location.state,
      value: formState.location.state,
    };
  };

  // Helper function to safely access nested error messages
  const getErrorMessage = (path: string): string | undefined => {
    const parts = path.split(".");
    let current: any = errors;

    for (const part of parts) {
      if (!current || typeof current !== "object") return undefined;
      current = current[part];
    }

    return typeof current === "string" ? current : undefined;
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black bg-opacity-50">
      <div className="relative w-full max-w-[678px] mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 relative">
          <button
            className="absolute top-4 right-4 text-3xl font-bold text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            &times;
          </button>
          <EditFormWrapper>
            <div className="content">
              <h3 className="text-3xl font-bold mb-6">Edit Profile Details</h3>
              <div className="form w-full px-2">
                {/* START ----------------------------------------- Username */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <StyledFormGroup>
                      <div className="text-sm font-normal">
                        First Name<span className="text-red-500">&nbsp;*</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Enter your first name"
                        className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formState?.first_name}
                        maxLength={35}
                        onChange={(e) =>
                          handleChange(
                            "first_name",
                            onlyCharacters(e.target.value)
                          )
                        }
                      />
                      {getErrorMessage("first_name") && (
                        <ErrorMessage
                          message={getErrorMessage("first_name") as string}
                        />
                      )}
                    </StyledFormGroup>
                  </div>
                  <div>
                    <StyledFormGroup>
                      <div className="text-sm font-normal">
                        Last Name<span className="text-red-500">&nbsp;*</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Enter your last name"
                        className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formState?.last_name}
                        maxLength={35}
                        onChange={(e) =>
                          handleChange(
                            "last_name",
                            onlyCharacters(e.target.value)
                          )
                        }
                      />
                      {getErrorMessage("last_name") && (
                        <ErrorMessage
                          message={getErrorMessage("last_name") as string}
                        />
                      )}
                    </StyledFormGroup>
                  </div>
                </div>
                {/* END ------------------------------------------- Username */}

                {/* START ----------------------------------------- Company name */}
                <div className="mb-4">
                  <StyledFormGroup>
                    <div className="text-sm font-normal">Company Name</div>
                    <input
                      type="text"
                      placeholder="Enter your company name"
                      className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formState?.company_name}
                      maxLength={255}
                      onChange={(e) =>
                        handleChange("company_name", e.target.value)
                      }
                    />
                  </StyledFormGroup>
                </div>
                {/* END ------------------------------------------- Company name */}

                {/* START ----------------------------------------- Country */}
                <div className="mb-4">
                  <StyledFormGroup>
                    <div className="text-sm font-normal mb-1">
                      Country<span className="text-red-500">&nbsp;*</span>
                    </div>
                    <CountryDropdown
                      selectedCountry={getCountryOptionFromLocation()}
                      onSelectCountry={onSelectCountry}
                    />
                    {getErrorMessage("location.country_name") && (
                      <ErrorMessage
                        message={
                          getErrorMessage("location.country_name") as string
                        }
                      />
                    )}
                  </StyledFormGroup>
                </div>
                {/* END ------------------------------------------- Country */}

                {/* START ----------------------------------------- State */}
                {!CONSTANTS.COUNTRIES_SHORT_NAME_WITHOUT_STATE.includes(
                  formState?.location?.country_short_name
                ) && (
                  <div className="mb-4">
                    <StyledFormGroup>
                      <div className="text-sm font-normal mb-1">
                        State/Region
                        <span className="text-red-500">&nbsp;*</span>
                      </div>
                      <StatesDropdopwn
                        countryCode={formState?.location?.country_short_name}
                        onSelectState={onSelectState}
                        selectedState={getStateOption()}
                      />
                      {getErrorMessage("location.state") && (
                        <ErrorMessage
                          message={getErrorMessage("location.state") as string}
                        />
                      )}
                    </StyledFormGroup>
                  </div>
                )}
                {/* END ------------------------------------------- State */}
              </div>

              <div className="flex mt-6 justify-end">
                <button
                  className="px-9 py-4 bg-primary text-black rounded-full font-normal hover:bg-primary/90 transition-colors"
                  disabled={loading}
                  onClick={handleUpdate}
                >
                  Update
                </button>
              </div>
            </div>
            <EmailEditModal
              show={showEditEmailModal}
              existingEmail={data?.u_email_id}
              onClose={toggleEditModal}
              onUpdateEmail={onUpdateEmail}
            />
          </EditFormWrapper>
        </div>
      </div>
    </div>
  );
};

export default InfoEditModal;
