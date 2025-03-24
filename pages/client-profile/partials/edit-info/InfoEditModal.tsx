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
  location: null,
  u_email_id: "",
};

const InfoEditModal = ({ show, onClose, onUpdate, data }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formState, setFormState] = useState<TFormState>(initialState);
  const [errors, setErrors] = useState<TFormState>(undefined);
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
        first_name: data?.first_name?.trim(),
        last_name: data?.last_name?.trim(),
        user_image: data?.user_image,
        company_name: data?.company_name,
        location: data?.location,
        u_email_id: data?.u_email_id,
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
    setErrors(undefined);
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
        const errors = getYupErrors(err);
        setErrors({ ...errors });
      });
  };

  const onSelectCountry = (item: TFormState["location"]) => {
    handleChange("location", item);
  };

  const onSelectState = (item: string) => {
    const formData = { ...formState };
    formData.location.state = item;
    setFormState(formData);
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
                    {errors?.first_name && (
                      <ErrorMessage message={errors.first_name} />
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
                    {errors?.last_name && (
                      <ErrorMessage message={errors.last_name} />
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
                      selectedCountry={formState?.location}
                      onSelectCountry={onSelectCountry}
                    />
                    {errors?.location?.country_name && (
                      <ErrorMessage message={errors.location.country_name} />
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
                        selectedState={
                          formState?.location?.state
                            ? {
                                label: formState?.location?.state,
                                value: formState?.location?.state,
                              }
                            : null
                        }
                      />
                      {errors?.location?.state && (
                        <ErrorMessage message={errors.location.state} />
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
