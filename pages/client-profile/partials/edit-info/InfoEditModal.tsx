/*
 * This component is a modal to edit freelancer info
 */

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { Modal, Button, Container, Row, Col, Form } from "react-bootstrap";
import { StyledFormGroup, EditFormWrapper } from "./info-edit.styled";
import { StyledModal } from "@/components/styled/StyledModal";
import { StyledButton } from "@/components/forms/Buttons";
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

  return (
    <StyledModal maxwidth={678} show={show} size="sm" onHide={onClose} centered>
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={onClose}>
          &times;
        </Button>
        <EditFormWrapper>
          <div className="content">
            <h3 className="fs-36 fw-700">Edit Profile Details</h3>
            <Container className="form">
              {/* START ----------------------------------------- Username */}
              <Row>
                <Col>
                  <StyledFormGroup>
                    <div className="fs-sm fw-400">
                      First Name<span className="mandatory">&nbsp;*</span>
                    </div>
                    <Form.Control
                      placeholder="Enter your first name"
                      className="form-input"
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
                </Col>
                <Col>
                  <StyledFormGroup>
                    <div className="fs-sm fw-400">
                      Last Name<span className="mandatory">&nbsp;*</span>
                    </div>
                    <Form.Control
                      placeholder="Enter your last name"
                      className="form-input"
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
                </Col>
              </Row>
              {/* END ------------------------------------------- Username */}

              {/* START ----------------------------------------- Company name */}
              <Row>
                <Col>
                  <StyledFormGroup>
                    <div className="fs-sm fw-400">Company Name</div>
                    <Form.Control
                      placeholder="Enter your company name"
                      className="form-input"
                      value={formState?.company_name}
                      maxLength={255}
                      onChange={(e) =>
                        handleChange("company_name", e.target.value)
                      }
                    />
                  </StyledFormGroup>
                </Col>
              </Row>
              {/* END ------------------------------------------- Company name */}

              {/* START ----------------------------------------- Country */}
              <Row>
                <Col>
                  <StyledFormGroup>
                    <div className="fs-sm fw-400 mb-1">
                      Country<span className="mandatory">&nbsp;*</span>
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
                </Col>
              </Row>
              {/* END ------------------------------------------- Country */}

              {/* START ----------------------------------------- State */}
              {!CONSTANTS.COUNTRIES_SHORT_NAME_WITHOUT_STATE.includes(
                formState?.location?.country_short_name
              ) && (
                <Row>
                  <Col>
                    <StyledFormGroup>
                      <div className="fs-sm fw-400 mb-1">
                        State/Region<span className="mandatory">&nbsp;*</span>
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
                  </Col>
                </Row>
              )}
              {/* END ------------------------------------------- State */}
            </Container>

            <div className="bottom-buttons d-flex">
              <StyledButton
                padding="1.125rem 2.25rem"
                variant="primary"
                disabled={loading}
                onClick={handleUpdate}
              >
                Update
              </StyledButton>
            </div>
          </div>
          <EmailEditModal
            show={showEditEmailModal}
            existingEmail={data?.u_email_id}
            onClose={toggleEditModal}
            onUpdateEmail={onUpdateEmail}
          />
        </EditFormWrapper>
      </Modal.Body>
    </StyledModal>
  );
};

export default InfoEditModal;
