"use client";

import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import Tooltip from "@/components/ui/Tooltip";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Select from "react-select";
import { getYupErrors } from "@/helpers/utils/misc";
import { managePayment } from "@/helpers/http/freelancer";
import { camelCaseToNormalCase } from "@/helpers/utils/helper";
import { useAuth } from "@/helpers/contexts/auth-context";
import { addBankAccountValidationHandler } from "@/helpers/validation/common";

const initialState = {
  accountHolderFirstName: "",
  accountHolderLastName: "",
  accountHolderType: "",
  accountNumber: "",
  routingNumber: "",
};

// Define form state interface
interface BankAccountFormState {
  accountHolderFirstName: string;
  accountHolderLastName: string;
  accountHolderType: string;
  accountNumber: string;
  routingNumber: string;
  transitNumber?: string;
  institutionNumber?: string;
}

// Error record type
interface ErrorRecord {
  [key: string]: string;
}

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
  const [formState, setFormState] =
    useState<BankAccountFormState>(initialState);
  const [errors, setErrors] = useState<ErrorRecord>({});
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

  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      padding: "0.75rem 0.5rem", 
      borderRadius: "0.4rem", // rounded-lg
      borderColor: state.isFocused ? "#3B82F6" : "#000000", // focus:ring-blue-500, border-gray-300
      boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.5)" : "none", // focus:ring-2
      outline: "none",
      "&:hover": {
        borderColor: "#3B82F6", // Hover effect
      },
    }),
    placeholder: (base: any) => ({
      ...base,
      color: "#9CA3AF", 
    }),
    menu: (base: any) => ({
      ...base,
      zIndex: 50, // So it appears above modals or other UI
    }),
  };

  // Handle body scroll lock when modal is open
  useEffect(() => {
    if (show) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, parseInt(scrollY || "0", 10));
    }
  }, [show]);

  const handleChange = useCallback(
    (field: keyof BankAccountFormState, value: string | number) => {
      setFormState((prevFormState) => {
        return { ...prevFormState, [field]: value };
      });
    },
    []
  );

  const validateForm = () => {
    const country: string = auth?.user?.preferred_banking_country;
    const validateEq = addBankAccountValidationHandler(
      country,
      formState.accountHolderType
    );
    validateEq.isValid(formState).then((valid) => {
      if (!valid) {
        validateEq.validate(formState, { abortEarly: false }).catch((err) => {
          const validationErrors = getYupErrors(err);
          setErrors(validationErrors as ErrorRecord);
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

    interface BankAccountBody {
      action: string;
      account_holder_name: string;
      account_holder_type: string;
      account_number: string;
      routing_number?: string;
      [key: string]: string | undefined;
    }

    const body: BankAccountBody = {
      action: "add_account",
      account_holder_name:
        camelCaseToNormalCase(accountHolderFirstName) +
        " " +
        camelCaseToNormalCase(accountHolderLastName),
      account_holder_type: accountHolderType,
      account_number: accountNumber,
    };

    if (routingNumber) body.routing_number = routingNumber;
    if (institutionNumber && transitNumber)
      body.routing_number = `${transitNumber}-${institutionNumber}`;
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

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onModalClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-[678px] bg-white rounded-lg shadow-xl md:p-12 px-4 py-8 m-2">
        {/* Close button */}
        <button
          onClick={onModalClose}
          className="absolute top-4 right-4 md:top-0 md:-right-8 md:text-white text-gray-500 hover:opacity-85 transition-colors"
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="">
          <h2 className="text-[28px] font-normal mb-3">Add Payment Details</h2>
          <div className="flex items-center mb-6">
            <span>Add Details Below</span>
            <Tooltip>
              To get paid on ZMZ, add the details of the bank account you would
              like your fees to be sent to. These details are not visible to
              other users.
            </Tooltip>
          </div>

          <div className="space-y-4">
            {/* Account Type Select */}
            <div>
              <Select
                className="w-full "
                classNamePrefix="select"
                options={accountHolderTypeOptions}
                styles={customStyles}
                onChange={(option: AccountHolderType | null) => {
                  if (option) {
                    handleChange("accountHolderType", option.value);
                    setErrors({});
                  }
                }}
                placeholder="Select Account Type"
                key={"bank-account-holder-type"}
              />
              {errors?.accountHolderType && (
                <ErrorMessage message={errors.accountHolderType} />
              )}
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  placeholder={
                    formState?.accountHolderType === "company"
                      ? "First Name/Business Name"
                      : "First Name"
                  }
                  className="w-full px-5 py-4 border rounded-md focus:outline-none border-black focus:ring-4 focus:ring-[#0d6efd40] transition-all"
                  value={formState?.accountHolderFirstName}
                  onChange={(e) =>
                    handleChange("accountHolderFirstName", e.target.value)
                  }
                  maxLength={60}
                />
                {errors?.accountHolderFirstName && (
                  <ErrorMessage message={errors.accountHolderFirstName} />
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder={
                    formState?.accountHolderType === "company"
                      ? "Last Name (Optional)"
                      : "Last Name"
                  }
                  className="w-full px-5 py-4 border rounded-md focus:outline-none border-black focus:ring-4 focus:ring-[#0d6efd40] transition-all"
                  value={formState?.accountHolderLastName}
                  onChange={(e) =>
                    handleChange("accountHolderLastName", e.target.value)
                  }
                  maxLength={60}
                />
                {errors?.accountHolderLastName && (
                  <ErrorMessage message={errors.accountHolderLastName} />
                )}
              </div>
            </div>

            {/* Account Number */}
            <div>
              <input
                type="text"
                placeholder={accountNumberPlaceHolderHandler()}
                className="w-full px-5 py-4 border rounded-md focus:outline-none border-black focus:ring-4 focus:ring-[#0d6efd40] transition-all"
                value={formState?.accountNumber}
                onChange={(e) =>
                  handleChange("accountNumber", e.target.value.trim())
                }
                maxLength={30}
              />
              {errors?.accountNumber && (
                <ErrorMessage message={errors.accountNumber} />
              )}
            </div>

            {/* Routing Number */}
            {!["IL", "GB", "BE", "MX", "CA", "AR", "CH"].includes(
              auth?.user?.preferred_banking_country
            ) && (
              <div>
                <input
                  type="text"
                  placeholder={routingPlaceHolder()}
                  className="w-full px-5 py-4 border rounded-md focus:outline-none border-black focus:ring-4 focus:ring-[#0d6efd40] transition-all"
                  value={formState?.routingNumber}
                  maxLength={20}
                  onChange={(e) =>
                    handleChange("routingNumber", e.target.value.trim())
                  }
                />
                {errors?.routingNumber && (
                  <ErrorMessage message={errors.routingNumber} />
                )}
              </div>
            )}

            {/* Canadian Bank Details */}
            {auth?.user?.preferred_banking_country === "CA" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Transit Number (5 digits)"
                    className="w-full px-5 py-4 border rounded-md focus:outline-none border-black focus:ring-4 focus:ring-[#0d6efd40] transition-all"
                    value={formState?.transitNumber}
                    maxLength={20}
                    onChange={(e) =>
                      handleChange("transitNumber", e.target.value.trim())
                    }
                  />
                  {errors?.transitNumber && (
                    <ErrorMessage message={errors.transitNumber} />
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Institution Number (3 digits)"
                    className="w-full px-5 py-4 border rounded-md focus:outline-none border-black focus:ring-4 focus:ring-[#0d6efd40] transition-all"
                    value={formState?.institutionNumber}
                    maxLength={20}
                    onChange={(e) =>
                      handleChange("institutionNumber", e.target.value.trim())
                    }
                  />
                  {errors?.institutionNumber && (
                    <ErrorMessage message={errors.institutionNumber} />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center md:justify-end mt-6">
            <button
              onClick={validateForm}
              disabled={loading}
              className="px-8 py-[0.85rem] bg-[#f2b420] text-lg rounded-full hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Adding...
                </div>
              ) : (
                "Add"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBankAccount;
