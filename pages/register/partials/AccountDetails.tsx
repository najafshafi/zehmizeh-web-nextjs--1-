import { yupResolver } from "@hookform/resolvers/yup";
import CountryDropdown from "@/components/forms/country-dropdown/CountryDropdown";
import PhoneNumberInput from "@/components/forms/phone-number-input";
import StateDropdown from "@/components/forms/state-picker/StatePicker";
import PhoneInputWrapper from "@/components/styled/PhoneInputWrapper";
import ErrorMessage from "@/components/ui/ErrorMessage";
import {
  emailPattern,
  onlyCharacters,
  validatePhoneNumber,
} from "@/helpers/validation/common";
import { signUpValidationSchema } from "@/helpers/validation/SignUpValidation";
import React, { Dispatch, SetStateAction } from "react";
import { Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useParams } from "next/navigation";
import styled from "styled-components";
import Tooltip from "@/components/ui/Tooltip";
import InfoIcon from "@/public/icons/info-gray-32.svg";
import cns from "classnames";
import { CONSTANTS } from "@/helpers/const/constants";
import { IFreelancerDetails } from "@/helpers/types/freelancer.type";
import Eye from "@/public/icons/eye.svg";
import toast from "react-hot-toast";
import { verifyEmailAndPhone } from "@/helpers/http/auth";
import { StyledButton } from "@/components/forms/Buttons";
import LoadingButtons from "@/components/LoadingButtons";
import { TRegisterProps } from "../types/commonProp";

interface PhoneNumberInputProps {
  initialValue?: string;
  onChange: (phone: string, formattedValue: string) => void;
  onBlur?: () => void;
}

const Wrapper = styled.div`
  .auth-group-dropdown {
    .dropdown-button {
      border: ${(props) => `1px solid ${props.theme.colors.gray6}`};
    }
    .dropdown-options-container {
      border: ${(props) => `1px solid ${props.theme.colors.gray6}`};
    }
  }
  .yellow-link {
    color: ${(props) => props.theme.colors.yellow};
  }
  .password-field {
    border: ${(props) => `1px solid ${props.theme.colors.gray6}`};
    border-radius: 4px;
    padding-right: 0.5rem;
  }
  .password-label {
    border: none;
    width: 100%;
  }
  .password-input {
    border: none;
    outline: none;
    outline-width: 0 !important;
    box-shadow: none;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
    position: relative;
    .password-tooltip {
      position: absolute;
      right: 50px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .register--form-row {
    gap: 0.75rem 0;
  }
`;

type Props = {
  setPayload: Dispatch<SetStateAction<Partial<IFreelancerDetails>>>;
} & TRegisterProps;

export const AccountDetails = ({ setStep, setPayload, shouldShow }: Props) => {
  const params = useParams();
  const userType = params?.type as string;
  const isClient = userType === "employer";

  const [agency, setAgency] = React.useState(false);
  const [location, setLocation] = React.useState<
    IFreelancerDetails["location"] | null
  >(null);
  const [phoneInput, setPhoneInput] = React.useState({
    value: "",
    error: "",
    formattedPhoneNumber: "",
  });
  const [locationError, setLocationError] = React.useState<{
    country: string;
    state: string;
  } | null>(null);
  const [passwordPreview, setPasswordPreview] = React.useState({
    password: false,
  });
  const [verifyingEmailPhone, setVerifyingEmailPhone] =
    React.useState<boolean>(false);

  const { register, handleSubmit, formState, setValue, trigger, clearErrors } =
    useForm<{
      first_name: string;
      last_name: string;
      email_id: string;
      password: string;
      confirm: string;
      phone_number: string;
      country: string;
      state?: string;
      company_name?: string;
      agency_name?: string;
      user_type: string;
    }>({
      resolver: yupResolver(signUpValidationSchema(location)),
      mode: "onTouched",
    });

  const handlePhoneChange = async (phone: string, formattedValue: string) => {
    setPhoneInput((prev) => ({
      ...prev,
      value: phone,
      formattedPhoneNumber: formattedValue,
      error: "",
    }));

    setValue("phone_number", phone, {
      shouldValidate: false,
    });

    clearErrors("phone_number");

    if (phone.length >= 11 && phone.length <= 15) {
      const isValid = !validatePhoneNumber(phone);
      if (isValid) {
        await trigger("phone_number");
      }
    }
  };

  const handlePhoneBlur = () => {
    // Only validate phone on blur
    trigger("phone_number");
  };

  const isCountryHaveState =
    !CONSTANTS.COUNTRIES_SHORT_NAME_WITHOUT_STATE.includes(
      location?.country_short_name
    );

  const togglePasswordPreview = (field: "password") => {
    setPasswordPreview((prevFormState) => {
      return { ...prevFormState, [field]: !prevFormState[field] };
    });
  };

  /** @function This function will set the selected country in the form (state variable) */
  const onSelectCountry = (item: IFreelancerDetails["location"]) => {
    if (item) {
      setLocation(item);
      setValue("country", item.country_name || "", { shouldValidate: true });
    }
  };

  /** @function This function will set the selected state in the form (state variable) */
  const onSelectState = (item: string) => {
    if (location) {
      const currentLocation = { ...location };
      currentLocation.state = item;
      setLocation(currentLocation);
      setValue("state", currentLocation.state, { shouldValidate: true });
    }
  };

  const handleNext = async (data: {
    first_name: string;
    last_name: string;
    email_id: string;
    password: string;
    confirm: string;
    phone_number: string;
    country: string;
    state?: string;
    company_name?: string;
    agency_name?: string;
    user_type: string;
  }) => {
    const res = validatePhoneNumber(phoneInput.value);
    if (res) {
      setPhoneInput((prev) => ({
        ...prev,
        error: res,
      }));
      toast.error(res);
      return;
    }

    if (!location?.country_name) {
      setLocationError({
        country: "Please select your country",
        state: "",
      });
      return;
    }

    setLocationError({ country: "", state: "" });
    setVerifyingEmailPhone(true);

    try {
      const responseOfVerifyEmailAndPhone = await verifyEmailAndPhone({
        email_id: data.email_id,
        phone_number: "+" + phoneInput.value,
      });

      if (!responseOfVerifyEmailAndPhone.status) {
        toast.error(responseOfVerifyEmailAndPhone?.message);
        return;
      }

      const payload: Partial<IFreelancerDetails> = {
        ...data,
        first_name: data?.first_name?.trim(),
        last_name: data?.last_name?.trim(),
        phone_number: "+" + phoneInput.value,
        formatted_phonenumber: phoneInput?.formattedPhoneNumber,
        is_agency: agency ? 1 : 0,
        location,
        user_type: isClient ? "client" : "freelancer",
      };

      if (!agency) delete payload.agency_name;
      setStep(3);
      setPayload(payload);
    } catch (error) {
      toast.error("An error occurred while verifying email and phone");
    } finally {
      setVerifyingEmailPhone(false);
    }
  };

  if (!shouldShow) return <></>;

  return (
    <Wrapper>
      {/* START ----------------------------------------- Registering as agency */}
      {!isClient && (
        <>
          <h3>Are you registering as an agency?</h3>
          <p className="fs-14" style={{ color: "#686868" }}>
            A freelancer who works alone is not considered an agency. If this
            account will be shared between coworkers, register as an agency.
          </p>
          <div className="flex mt-4 agency">
            <button
              type="button"
              id="y"
              className={
                agency
                  ? "me-4 text-start option-button active-button"
                  : "me-4 text-start option-button"
              }
              onClick={() => setAgency(true)}
            >
              <span>Yes</span>
            </button>
            <button
              type="button"
              id="n"
              className={
                !agency
                  ? "text-start option-button active-button"
                  : "text-start option-button"
              }
              onClick={() => setAgency(false)}
            >
              <span>No</span>
            </button>
          </div>
        </>
      )}
      {/* END ------------------------------------------- Registering as agency */}

      <h3>Account Details</h3>
      <h2 className="mb-3 fs-24 fw-300">
        Account details can be changed later
      </h2>
      <Row className="register--form-row">
        {/* START ----------------------------------------- Agency Name */}
        {!isClient && agency ? (
          <Col lg={12}>
            <FloatingLabel label="Enter Agency Name">
              <Form.Control
                type="text"
                maxLength={64}
                placeholder="Enter Agency Name"
                {...register("agency_name", {
                  onChange(e) {
                    e.target.value = onlyCharacters(e.target.value);
                    return e;
                  },
                })}
              />
            </FloatingLabel>
          </Col>
        ) : null}
        {/* END ------------------------------------------- Agency Name */}

        {/* START ----------------------------------------- First name */}
        <Col lg={6}>
          <FloatingLabel label="First Name">
            <Form.Control
              type="text"
              placeholder="First Name"
              maxLength={35}
              {...register("first_name", {
                onChange(e) {
                  e.target.value = onlyCharacters(e.target.value);
                  return e;
                },
              })}
            />
          </FloatingLabel>
          <ErrorMessage>{formState.errors.first_name?.message}</ErrorMessage>
        </Col>
        {/* END ------------------------------------------- First name */}

        {/* START ----------------------------------------- Last Name */}
        <Col lg={6}>
          <FloatingLabel label="Last Name">
            <Form.Control
              type="text"
              placeholder="Last Name"
              maxLength={35}
              {...register("last_name", {
                onChange(e) {
                  e.target.value = onlyCharacters(e.target.value);
                  return e;
                },
              })}
            />
          </FloatingLabel>
          <ErrorMessage>{formState.errors.last_name?.message}</ErrorMessage>
        </Col>
        {/* END ------------------------------------------- Last Name */}

        {/* START ----------------------------------------- Company Name */}
        {isClient && (
          <Col lg={12} className="mt-1">
            <FloatingLabel label="Enter Company Name (Optional)">
              <Form.Control
                type="text"
                placeholder="Company Name (Optional)"
                maxLength={64}
                {...register("company_name")}
              />
            </FloatingLabel>
          </Col>
        )}
        {/* END ------------------------------------------- Company Name */}

        {/* START ----------------------------------------- Country */}
        <Col xs={12} lg={isCountryHaveState ? 6 : 12}>
          <CountryDropdown
            selectedCountry={location}
            onSelectCountry={onSelectCountry}
          />
          <ErrorMessage>{formState.errors?.country?.message}</ErrorMessage>
        </Col>
        {/* END ------------------------------------------- Country */}

        {/* START ----------------------------------------- State */}
        {isCountryHaveState && (
          <Col xs={12} lg={6}>
            <StateDropdown
              countryCode={location?.country_short_name}
              onSelectState={onSelectState}
              selectedState={
                location?.state
                  ? {
                      label: location?.state,
                      value: location?.state,
                    }
                  : null
              }
            />
            <ErrorMessage>{formState.errors?.state?.message}</ErrorMessage>
          </Col>
        )}
        {/* END ------------------------------------------- State */}

        {/* START ----------------------------------------- Phone number */}
        <Col lg={12}>
          <PhoneInputWrapper>
            <label>Enter Phone Number</label>
            <PhoneNumberInput
              initialValue={phoneInput.formattedPhoneNumber}
              onChange={handlePhoneChange}
            />
          </PhoneInputWrapper>
          <ErrorMessage>{formState.errors?.phone_number?.message}</ErrorMessage>
        </Col>
        {/* END ------------------------------------------- Phone number */}

        {/* START ----------------------------------------- Email */}
        <Col lg={12}>
          <FloatingLabel label="Your Email">
            <Form.Control
              type="email"
              placeholder="Your Email"
              maxLength={128}
              {...register("email_id", {
                onChange(e) {
                  e.target.value = emailPattern(e.target.value);
                  return e;
                },
              })}
            />
          </FloatingLabel>
          <ErrorMessage>{formState.errors.email_id?.message}</ErrorMessage>
        </Col>
        {/* END ------------------------------------------- Email */}

        {/* START ----------------------------------------- Password */}
        <Col lg={12}>
          <FloatingLabel
            controlId="floatingInput"
            label="Password"
            className="password-input"
          >
            <Tooltip customTrigger={<InfoIcon />} className="password-tooltip">
              Every password must include at least: 1 uppercase letter, 1
              lowercase letter, 1 number, 1 symbol, and at least 8 characters
            </Tooltip>
            <span
              className="pointer"
              onClick={() => togglePasswordPreview("password")}
            >
              <Eye
                className={cns("input-icon", {
                  active: passwordPreview.password,
                })}
              />
            </span>
            <Form.Control
              type={passwordPreview.password ? "text" : "password"}
              maxLength={128}
              placeholder="Password"
              {...register("password")}
            />
          </FloatingLabel>
          <ErrorMessage>{formState.errors.password?.message}</ErrorMessage>
        </Col>
        {/* END ------------------------------------------- Password */}

        {/* START ----------------------------------------- Confirm Password */}
        <Col lg={12}>
          <FloatingLabel
            controlId="floatingInput"
            label="Confirm Password"
            className="password-input"
          >
            <span
              className="pointer"
              onClick={() => togglePasswordPreview("password")}
            >
              <Eye
                className={cns("input-icon", {
                  active: passwordPreview.password,
                })}
              />
            </span>
            <Form.Control
              maxLength={128}
              type={passwordPreview.password ? "text" : "password"}
              placeholder="Confirm Password"
              {...register("confirm")}
            />
          </FloatingLabel>
          <ErrorMessage>{formState.errors.confirm?.message}</ErrorMessage>
        </Col>
        {/* END ------------------------------------------- Confirm Password */}
      </Row>

      {/* START ----------------------------------------- Footer */}
      <div className="text-center my-3 mt-4">
        <br />
        <h4 className="align-self-center">
          Already have an account?{" "}
          <Link href="/login" className="yellow-link">
            Log in
          </Link>
        </h4>
      </div>
      <div className="flex flex-row justify-between">
        <StyledButton
          disabled={verifyingEmailPhone}
          variant="secondary"
          onClick={() => setStep(1)}
        >
          Back
        </StyledButton>
        <StyledButton
          disabled={verifyingEmailPhone}
          onClick={handleSubmit(handleNext)}
        >
          {verifyingEmailPhone ? <LoadingButtons /> : "Next"}
        </StyledButton>
      </div>
      {/* END ------------------------------------------- Footer */}
    </Wrapper>
  );
};
