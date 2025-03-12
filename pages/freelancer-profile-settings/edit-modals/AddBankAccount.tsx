"use client";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { Form, Modal, Button, Row, Col } from "react-bootstrap";
import Tooltip from "@/components/ui/Tooltip";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { StyledButton } from "@/components/forms/Buttons";
import { StyledModal } from "@/components/styled/StyledModal";
import { StyledFormGroup, MultiSelectCustomStyle } from "./edit-modals.styled";
import { getYupErrors } from "@/helpers/utils/misc";
import { managePayment } from "@/helpers/http/freelancer";
import { camelCaseToNormalCase } from "@/helpers/utils/helper";
import { useAuth } from "@/helpers/contexts/auth-context";
import Select from "react-select";
import { addBankAccountValidationHandler } from "@/helpers/validation/common";

const initialState = {
  accountHolderFirstName: "",
  accountHolderLastName: "",
  accountHolderType: "",
  accountNumber: "",
  routingNumber: "",
};

type Props = {
  show: boolean;
  userCountry: string;
  onClose: () => void;
  onUpdate: () => void;
};

interface AccountHolderType {
  label: string;
  value: string | number;
}

const AddBankAccount = ({ show, onClose, onUpdate }: Props) => {
  const [formState, setFormState] = useState<any>(initialState);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [accountHolderTypeOptions] = useState<AccountHolderType[]>([
    {
      label: "Individual",
      value: "individual",
    },
    {
      label: "Business",
      value: "company",
    },
  ]);
  const auth = useAuth();

  const handleChange = useCallback((field, value) => {
    setFormState((prevFormState: any) => {
      return { ...prevFormState, [field]: value };
    });
  }, []);

  const validateForm = () => {
    const country: string = auth?.user?.preferred_banking_country;
    const validateEq = addBankAccountValidationHandler(
      country,
      formState.accountHolderType
    );
    validateEq.isValid(formState).then((valid) => {
      if (!valid) {
        validateEq.validate(formState, { abortEarly: false }).catch((err) => {
          const errors = getYupErrors(err);
          setErrors({ ...errors });
        });
      } else {
        setErrors({});
        addBankAccount();
      }
    });
  };

  const addBankAccount = () => {
    setLoading(true);
    const {
      accountHolderFirstName,
      accountHolderLastName,
      accountNumber,
      routingNumber,
      institutionNumber,
      transitNumber,
      accountHolderType,
    } = formState;
    const body = {
      action: "add_account",
      account_holder_name:
        camelCaseToNormalCase(accountHolderFirstName) +
        " " +
        camelCaseToNormalCase(accountHolderLastName),
      account_holder_type: accountHolderType,
      account_number: accountNumber,
      // routing_number: routingNumber,
    };

    if (routingNumber) body["routing_number"] = routingNumber;
    if (institutionNumber && transitNumber)
      body["routing_number"] = `${transitNumber}-${institutionNumber}`;
    const promise = managePayment(body).then((res) => {
      if (res.status) return res;
      else throw res;
    });
    toast.promise(promise, {
      loading: "Loading...",
      success: (res) => {
        setLoading(false);
        setFormState(initialState);
        onUpdate();
        return res.message;
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || err?.message || "error";
      },
    });
  };

  const onModalClose = () => {
    setFormState(initialState);
    onClose();
  };

  const accountNumberPlaceHolderHandler = () => {
    let label = "";
    switch (auth?.user?.preferred_banking_country) {
      case "IL":
      case "BE":
      case "GB":
        label = "IBAN Number";
        break;
      case "CH":
        label = "IBAN Number";
        break;
      default:
        label = "Bank Account Number";
        break;
    }
    return label;
  };

  const routingPlaceHolder = () => {
    let label = "";
    switch (auth?.user?.preferred_banking_country) {
      case "ZA":
        label = "SWIFT / BIC CODE";
        break;
      default:
        label = "Routing Number";
        break;
    }
    return label;
  };

  return (
    <StyledModal
      maxwidth={678}
      show={show}
      size="sm"
      onHide={onModalClose}
      centered
    >
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={onModalClose}>
          &times;
        </Button>
        <div>
          <div className="fs-28 fw-400 mb-3">Add Payment Details</div>
          <div className="flex items-center">
            Add Details Below&nbsp;
            <Tooltip>
              To get paid on ZMZ, add the details of the bank account you would
              like your fees to be sent to. These details are not visible to
              other users.
            </Tooltip>
          </div>

          <div className="account-form">
            <StyledFormGroup>
              <Select
                styles={MultiSelectCustomStyle}
                options={accountHolderTypeOptions}
                onChange={({ value }) => {
                  handleChange("accountHolderType", value);
                  setErrors({});
                }}
                placeholder="Select Account Type"
                key={"bank-account-holder-type"}
                className="account-holder-type-select"
              />

              {errors?.accountHolderType && (
                <ErrorMessage message={errors.accountHolderType} />
              )}
            </StyledFormGroup>

            <Row>
              <Col>
                <StyledFormGroup>
                  <Form.Control
                    placeholder={
                      formState?.accountHolderType === "company"
                        ? "First Name/Business Name"
                        : "First Name"
                    }
                    className="form-input"
                    value={formState?.accountHolderFirstName}
                    onChange={(e) =>
                      handleChange("accountHolderFirstName", e.target.value)
                    }
                    maxLength={60}
                  />
                  {errors?.accountHolderFirstName && (
                    <ErrorMessage message={errors.accountHolderFirstName} />
                  )}
                </StyledFormGroup>
              </Col>
              <Col>
                <StyledFormGroup>
                  <Form.Control
                    placeholder={
                      formState?.accountHolderType === "company"
                        ? "Last Name (Optional)"
                        : "Last Name"
                    }
                    className="form-input"
                    value={formState?.accountHolderLastName}
                    onChange={(e) =>
                      handleChange("accountHolderLastName", e.target.value)
                    }
                    maxLength={60}
                  />
                  {errors?.accountHolderLastName && (
                    <ErrorMessage message={errors.accountHolderLastName} />
                  )}
                </StyledFormGroup>
              </Col>
            </Row>

            <StyledFormGroup>
              <Form.Control
                placeholder={accountNumberPlaceHolderHandler()}
                className="form-input"
                value={formState?.accountNumber}
                onChange={(e) =>
                  handleChange("accountNumber", e.target.value.trim())
                }
                maxLength={30}
              />
              {errors?.accountNumber && (
                <ErrorMessage message={errors.accountNumber} />
              )}
            </StyledFormGroup>

            {/* Israel,UK,Mexico and Belgium does not accept routing number for bank account*/}

            {!["IL", "GB", "BE", "MX", "CA", "AR", "CH"].includes(
              auth?.user?.preferred_banking_country
            ) && (
              <StyledFormGroup>
                <Form.Control
                  placeholder={routingPlaceHolder()}
                  className="form-input"
                  value={formState?.routingNumber}
                  maxLength={20}
                  onChange={(e) =>
                    handleChange("routingNumber", e.target.value.trim())
                  }
                />
                {errors?.routingNumber && (
                  <ErrorMessage message={errors.routingNumber} />
                )}
              </StyledFormGroup>
            )}

            {/* START ----------------------------------------- Transit and institution number for canadata */}
            <Row>
              {auth?.user?.preferred_banking_country === "CA" && (
                <>
                  <Col>
                    <StyledFormGroup>
                      <Form.Control
                        placeholder="Transit Number (5 digits)"
                        className="form-input"
                        value={formState?.transitNumber}
                        maxLength={20}
                        onChange={(e) =>
                          handleChange("transitNumber", e.target.value.trim())
                        }
                      />
                      {errors?.transitNumber && (
                        <ErrorMessage message={errors.transitNumber} />
                      )}
                    </StyledFormGroup>
                  </Col>
                  <Col>
                    <StyledFormGroup>
                      <Form.Control
                        placeholder="Institution Number (3 digits)"
                        className="form-input"
                        value={formState?.institutionNumber}
                        maxLength={20}
                        onChange={(e) =>
                          handleChange(
                            "institutionNumber",
                            e.target.value.trim()
                          )
                        }
                      />
                      {errors?.institutionNumber && (
                        <ErrorMessage message={errors.institutionNumber} />
                      )}
                    </StyledFormGroup>
                  </Col>
                </>
              )}
            </Row>
            {/* END ------------------------------------------- Transit and institution number for canadata */}
          </div>

          <div className="flex justify-content-center justify-content-md-end mt-4">
            <StyledButton disabled={loading} onClick={validateForm}>
              Add
            </StyledButton>
          </div>
        </div>
      </Modal.Body>
    </StyledModal>
  );
};

export default AddBankAccount;
