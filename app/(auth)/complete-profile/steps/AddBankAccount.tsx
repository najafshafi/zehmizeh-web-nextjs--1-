"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Form } from "react-bootstrap";
import Tooltip from "@/components/ui/Tooltip";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { StyledButton } from "@/components/forms/Buttons";
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

  const router = useRouter();

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
        router.push("/login");
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

      <div className="space-y-4 mt-5">
        <div className="mb-4">
          <Form.Control
            placeholder="Account holder's name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={formState.accountHolderName}
            onChange={(e) => handleChange("accountHolderName", e.target.value)}
          />
          {errors.accountHolderName && (
            <ErrorMessage message={errors.accountHolderName} />
          )}
        </div>

        {/* Israel and Belgium takes IBAN number as account number  */}
        <div className="mb-4">
          <Form.Control
            placeholder={"Bank account number"}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={formState.accountNumber}
            onChange={(e) => handleChange("accountNumber", e.target.value)}
          />
          {errors.accountNumber && (
            <ErrorMessage message={errors.accountNumber} />
          )}
        </div>

        <div className="mb-4">
          <Form.Control
            placeholder="Routing number"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={formState.routingNumber}
            onChange={(e) => handleChange("routingNumber", e.target.value)}
          />
          {errors.routingNumber && (
            <ErrorMessage message={errors.routingNumber} />
          )}
        </div>
      </div>

      <div className="flex justify-center md:justify-end gap-3 mt-4">
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
