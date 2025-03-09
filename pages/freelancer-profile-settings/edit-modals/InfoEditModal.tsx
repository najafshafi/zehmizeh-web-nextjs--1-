import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Modal, Button, Container, Row, Col, Form } from 'react-bootstrap';
import { StyledFormGroup, EditFormWrapper } from './edit-modals.styled';
import { StyledModal } from '@/components/styled/StyledModal';
import { StyledButton } from '@/components/forms/Buttons';
import ErrorMessage from '@/components/ui/ErrorMessage';
import CountryDropdown from '@/components/forms/country-dropdown/CountryDropdown';
import StateDropdown from '@/components/forms/state-picker/StatePicker';
import { getYupErrors } from '@/helpers/utils/misc';
import { editUser } from '@/helpers/http/auth';
import { onlyCharacters } from '@/helpers/validation/common';
import Tooltip from '@/components/ui/Tooltip';
import EmailEditModal from '@/components/profile/EmailEditModal';
import InfoIcon from "../../../public/icons/info-gray-18.svg";
import { IFreelancerDetails } from '@/helpers/types/freelancer.type';
import { freelancerProfileTabValidation } from '@/helpers/validation/freelancerProfileTabValidation';
import { CONSTANTS } from '@/helpers/const/constants';

type Props = {
  show: boolean;
  onClose: () => void;
  onUpdate: () => void;
  data: IFreelancerDetails;
  refetch: () => void;
};

type TFormState = Pick<
  IFreelancerDetails,
  'user_image' | 'first_name' | 'last_name' | 'location' | 'hourly_rate' | 'u_email_id'
>;

const initialState: TFormState = {
  user_image: '',
  first_name: '',
  last_name: '',
  location: null,
  hourly_rate: 0,
  u_email_id: '',
};

const InfoEditModal = ({ show, onClose, onUpdate, data, refetch }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formState, setFormState] = useState<TFormState>(initialState);
  const [errors, setErrors] = useState<TFormState>(undefined);
  const [showEditEmailModal, setShowEditEmailModal] = useState<boolean>(false);

  const toggleEditModal = () => {
    // This function will toggle the Add / Edit modal
    setShowEditEmailModal(!showEditEmailModal);
  };

  const onUpdateEmail = (value: string) => {
    handleChange('u_email_id', value);
    refetch();
  };

  useEffect(() => {
    if (data && show) {
      setFormState({
        user_image: data?.user_image,
        first_name: data?.first_name,
        last_name: data?.last_name,
        location: data?.location,
        hourly_rate: data?.hourly_rate,
        u_email_id: data?.u_email_id,
      });
    } else {
      setFormState(initialState);
    }
  }, [data, show]);

  const handleChange = useCallback((field: keyof TFormState, value: TFormState[keyof TFormState]) => {
    setFormState((prevFormState) => {
      return { ...prevFormState, [field]: value };
    });
  }, []);

  const handleUpdate = () => {
    setErrors(undefined);
    freelancerProfileTabValidation
      .validate(formState, { abortEarly: false })
      .then(() => {
        // Update info api call
        setLoading(true);
        const body = {
          user_image: formState?.user_image,
          first_name: formState?.first_name?.trim(),
          last_name: formState?.last_name?.trim(),
          hourly_rate: formState?.hourly_rate ? parseFloat(formState?.hourly_rate?.toString()) : 0,
          location: formState?.location,
        };
        const promise = editUser(body);
        toast.promise(promise, {
          loading: 'Updating your details - please wait...',
          success: (res) => {
            onUpdate();
            onClose();
            setLoading(false);
            return res.message;
          },
          error: (err) => {
            setLoading(false);
            return err?.response?.data?.message || 'error';
          },
        });
      })
      .catch((err) => {
        const errors = getYupErrors(err);
        setErrors({ ...errors });
      });
  };

  const onSelectState = (item: string) => {
    const formData = { ...formState };
    formData.location.state = item;
    setFormState(formData);
  };

  const onSelectCountry = (item: TFormState['location']) => {
    handleChange('location', item);
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
                      placeholder="Enter first name"
                      className="form-input"
                      value={formState?.first_name}
                      onChange={(e) => handleChange('first_name', onlyCharacters(e.target.value))}
                      maxLength={35}
                    />
                    {errors?.first_name && <ErrorMessage message={errors.first_name} />}
                  </StyledFormGroup>
                </Col>
                <Col>
                  <StyledFormGroup>
                    <div className="fs-sm fw-400">
                      Last Name<span className="mandatory">&nbsp;*</span>
                    </div>
                    <Form.Control
                      placeholder="Enter last name"
                      className="form-input"
                      value={formState?.last_name}
                      onChange={(e) => handleChange('last_name', onlyCharacters(e.target.value))}
                      maxLength={35}
                    />
                    {errors?.last_name && <ErrorMessage message={errors.last_name} />}
                  </StyledFormGroup>
                </Col>
              </Row>
              {/* END ------------------------------------------- Username */}

              {/* START ----------------------------------------- Hourly rate */}
              <Row>
                <Col>
                  <StyledFormGroup>
                    <div className="fs-sm fw-400">
                      Hourly Rate<span className="mandatory">&nbsp;*</span>{' '}
                      <Tooltip customTrigger={<InfoIcon />} className="d-inline-block">
                        The purpose here is to share your standard hourly rate if you have one. If you have different
                        rates for different projects, or no standard at all, leave this section empty.
                      </Tooltip>
                    </div>
                    <span className="input-symbol-euro">
                      <Form.Control
                        placeholder="Enter your hourly rate"
                        className="form-input rate-input"
                        value={formState?.hourly_rate}
                        onChange={(e) => handleChange('hourly_rate', e.target.value.replace(/\D/g, ''))}
                        maxLength={3}
                      />
                    </span>
                    {errors?.hourly_rate && <ErrorMessage message={errors.hourly_rate.toString()} />}
                  </StyledFormGroup>
                </Col>
              </Row>
              {/* END ------------------------------------------- Hourly rate */}
              <Row>
                {/* START ----------------------------------------- Country */}
                <Col>
                  <StyledFormGroup>
                    <div className="fs-sm fw-400 mb-1">
                      Country<span className="mandatory">&nbsp;*</span>
                    </div>
                    <CountryDropdown selectedCountry={formState?.location} onSelectCountry={onSelectCountry} />
                    {errors?.location?.country_name && <ErrorMessage message={errors?.location?.country_name} />}
                  </StyledFormGroup>
                </Col>
                {/* END ------------------------------------------- Country */}
              </Row>

              {/* START ----------------------------------------- State and region */}
              {/* If selected country dont have states then not showing states dropdown as well as removing validation */}
              {!CONSTANTS.COUNTRIES_SHORT_NAME_WITHOUT_STATE.includes(formState?.location?.country_short_name) && (
                <Row>
                  <Col>
                    <StyledFormGroup>
                      <div className="fs-sm fw-400 mb-1">
                        State/Region<span className="mandatory">&nbsp;*</span>
                      </div>
                      <StateDropdown
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
                        borderColor="#000"
                      />
                      {errors?.location?.state && <ErrorMessage message={errors.location.state} />}
                    </StyledFormGroup>
                  </Col>
                </Row>
              )}
              {/* END ------------------------------------------- State and region */}
            </Container>

            <div className="bottom-buttons d-flex">
              <StyledButton padding="1.125rem 2.25rem" variant="primary" disabled={loading} onClick={handleUpdate}>
                Update
              </StyledButton>
            </div>
          </div>
        </EditFormWrapper>
        {/* Edit Info modal */}

        <EmailEditModal
          show={showEditEmailModal}
          existingEmail={data?.u_email_id}
          onClose={toggleEditModal}
          onUpdateEmail={onUpdateEmail}
        />
      </Modal.Body>
    </StyledModal>
  );
};

export default InfoEditModal;
