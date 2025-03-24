import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { Form, Row, Col } from "react-bootstrap";
import styled from "styled-components";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { StyledButton } from "@/components/forms/Buttons";
import { addBankAccountValidationHandler } from "@/helpers/validation/common";
import { getYupErrors } from "@/helpers/utils/misc";
import { managePayment } from "@/helpers/http/freelancer";
import { camelCaseToNormalCase } from "@/helpers/utils/helper";
import Select from "react-select";

const StyledFormGroup = styled.div`
  margin-top: 1.25rem;
  .form-input {
    margin-top: 6px;
    padding: 1rem 1.25rem;
    border-radius: 7px;
    border: 1px solid ${(props) => props.theme.colors.gray6};
  }
`;

const MultiSelectCustomStyle = {
  control: (base: any) => ({
    ...base,
    minHeight: 60,
    // border: '1px solid #000',
    borderRadius: "7px",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: () => ({
    display: "none",
  }),
  multiValue: () => {
    return {
      margin: "5px 10px 5px 0px",
      borderRadius: 6,
      backgroundColor: "rgba(209, 229, 255, 0.4)",
      display: "flex",
    };
  },
  multiValueLabel: () => ({
    margin: 5,
  }),
  multiValueRemove: (styles: any) => ({
    ...styles,
    ":hover": {
      backgroundColor: "rgba(209, 229, 255,1)",
    },
  }),
  option: (provided) => ({
    ...provided,
    // backgroundColor: state.isSelected ? 'rgba(209, 229, 255,1)' : 'white',
    color: "#000",
    padding: "1rem 1rem",
    cursor: "pointer",
    ":hover": {
      backgroundColor: "rgba(209, 229, 255,1)",
    },
  }),
  menu: (base) => ({
    ...base,
    zIndex: 10,
  }),
  menuList: (base) => ({
    ...base,
    "::-webkit-scrollbar": {
      width: "8px",
    },
    "::-webkit-scrollbar-thumb": {
      height: "50px",
    },
  }),
};

const initialState = {
  accountHolderFirstName: "",
  accountHolderLastName: "",
  accountHolderType: "",
  accountNumber: "",
  routingNumber: "",
};

type Props = {
  userCountry: string;
  onCancel: () => void;
  onBankAccountAdded: () => void;
};

interface AccountHolderType {
  label: string;
  value: string | number;
}

const AddBankAccount = ({ onCancel, onBankAccountAdded }: Props) => {
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

  const handleChange = useCallback((field, value) => {
    setFormState((prevFormState: any) => {
      return { ...prevFormState, [field]: value };
    });
  }, []);

  const validateForm = () => {
    const validateEq = addBankAccountValidationHandler(
      "US",
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
      accountNumber,
      routingNumber,
      accountHolderFirstName,
      accountHolderLastName,
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
      routing_number: routingNumber,
    };

    const promise = managePayment(body);
    toast.promise(promise, {
      loading: "Loading...",
      success: (res) => {
        setLoading(false);
        setFormState(initialState);
        onBankAccountAdded();
        return res.message;
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || "error";
      },
    });
  };

  return (
    <div>
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
              <label>
                First Name
                <span className="mandatory">&nbsp;*</span>
              </label>
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
              <label>
                Last Name<span className="mandatory">&nbsp;*</span>
              </label>
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

        {/* Israel and  Belgium takes IBAN number as account number  */}
        <StyledFormGroup>
          <label>Bank Account Number</label>
          <span className="mandatory">&nbsp;*</span>
          <Form.Control
            placeholder={"Account Number"}
            className="form-input"
            value={formState?.accountNumber}
            onChange={(e) => handleChange("accountNumber", e.target.value)}
            maxLength={20}
          />
          {errors?.accountNumber && (
            <ErrorMessage message={errors.accountNumber} />
          )}
        </StyledFormGroup>

        {/* Israel and  Belgium does not accept routing number for bank account*/}

        <StyledFormGroup>
          <label>
            Routing Number<span className="mandatory">&nbsp;*</span>
          </label>
          <Form.Control
            placeholder="Routing Number"
            className="form-input"
            value={formState?.routingNumber}
            maxLength={20}
            onChange={(e) => handleChange("routingNumber", e.target.value)}
          />
          {errors?.routingNumber && (
            <ErrorMessage message={errors.routingNumber} />
          )}
        </StyledFormGroup>
      </div>

      <div className="d-flex justify-content-center justify-content-md-end mt-4 gap-3">
        <StyledButton
          variant="outline-dark"
          disabled={loading}
          onClick={onCancel}
        >
          Cancel
        </StyledButton>
        <StyledButton disabled={loading} onClick={validateForm}>
          Add
        </StyledButton>
      </div>
    </div>
  );
};

export default AddBankAccount;
