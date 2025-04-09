"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation"; // Changed from react-router-dom
import toast from "react-hot-toast";
import { Form } from "react-bootstrap";
import Tooltip from "@/components/ui/Tooltip";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { StyledButton } from "@/components/forms/Buttons";
import { StyledFormGroup } from "./steps.styled";
import { validateAccountDetailsWithRouting } from "@/helpers/validation/common";
import { getYupErrors } from "@/helpers/utils/misc";
import { managePayment } from "@/helpers/http/freelancer";

// Define proper interfaces for form state and errors
interface BankAccountForm {
  accountHolderName: string;
  accountNumber: string;
  routingNumber: string;
}

interface FormErrors {
  accountHolderName?: string;
  accountNumber?: string;
  routingNumber?: string;
  [key: string]: string | undefined;
}

const initialState: BankAccountForm = {
  accountHolderName: "",
  accountNumber: "",
  routingNumber: "",
};

type Props = {
  onPrevious: () => void;
};

const AddBankAccount = ({ onPrevious }: Props) => {
  const [formState, setFormState] = useState<BankAccountForm>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter(); // Changed from useNavigate

  const handleChange = useCallback(
    (field: keyof BankAccountForm, value: string) => {
      setFormState((prevFormState) => {
        return { ...prevFormState, [field]: value };
      });
    },
    []
  );

  const validateForm = () => {
    validateAccountDetailsWithRouting.isValid(formState).then((valid) => {
      if (!valid) {
        validateAccountDetailsWithRouting
          .validate(formState, { abortEarly: false })
          .catch((err) => {
            const validationErrors = getYupErrors(err);
            setErrors(validationErrors as FormErrors);
          });
      } else {
        setErrors({});
        addBankAccount();
      }
    });
  };

  const addBankAccount = () => {
    setLoading(true);
    const { accountHolderName, accountNumber, routingNumber } = formState;
    const body = {
      action: "add_account",
      account_holder_name: accountHolderName,
      account_holder_type: "individual",
      account_number: accountNumber,
      routing_number: routingNumber,
    };
    const promise = managePayment(body);
    toast.promise(promise, {
      loading: "Loading...",
      success: (res) => {
        setLoading(false);
        router.push("/login"); // Changed from navigate
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
      <Tooltip title="Account details">Please add your account details</Tooltip>

      <div className="account-form">
        <StyledFormGroup>
          <Form.Control
            placeholder="Account holder's name"
            className="form-input"
            value={formState.accountHolderName}
            onChange={(e) => handleChange("accountHolderName", e.target.value)}
          />
          {errors.accountHolderName && (
            <ErrorMessage message={errors.accountHolderName} />
          )}
        </StyledFormGroup>

        {/* Israel and Belgium takes IBAN number as account number  */}
        <StyledFormGroup>
          <Form.Control
            placeholder={"Bank account number"}
            className="form-input"
            value={formState.accountNumber}
            onChange={(e) => handleChange("accountNumber", e.target.value)}
          />
          {errors.accountNumber && (
            <ErrorMessage message={errors.accountNumber} />
          )}
        </StyledFormGroup>

        <StyledFormGroup>
          <Form.Control
            placeholder="Routing number"
            className="form-input"
            value={formState.routingNumber}
            onChange={(e) => handleChange("routingNumber", e.target.value)}
          />
          {errors.routingNumber && (
            <ErrorMessage message={errors.routingNumber} />
          )}
        </StyledFormGroup>
      </div>

      <div className="flex justify-center justify-content-md-end gap-3 mt-4">
        <StyledButton
          variant="outline-dark"
          disabled={loading}
          onClick={onPrevious}
        >
          Previous
        </StyledButton>
        <StyledButton disabled={loading} onClick={validateForm}>
          Finish
        </StyledButton>
      </div>
    </div>
  );
};

export default AddBankAccount;
