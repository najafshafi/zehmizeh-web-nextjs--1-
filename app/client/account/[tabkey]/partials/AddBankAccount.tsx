import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { addBankAccountValidationHandler } from "@/helpers/validation/common";
import { getYupErrors } from "@/helpers/utils/misc";
import { managePayment } from "@/helpers/http/freelancer";
import { camelCaseToNormalCase } from "@/helpers/utils/helper";
import Select, {
  StylesConfig,
  ControlProps,
  CSSObjectWithLabel,
  OptionProps,
  SingleValue,
} from "react-select";

interface AccountHolderType {
  label: string;
  value: string | number;
}

const MultiSelectCustomStyle: StylesConfig<AccountHolderType, false> = {
  control: (
    base: CSSObjectWithLabel,
    _state: ControlProps<AccountHolderType, false>
  ) => ({
    ...base,
    minHeight: 60,
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
  multiValueRemove: (styles: CSSObjectWithLabel) => ({
    ...styles,
    ":hover": {
      backgroundColor: "rgba(209, 229, 255,1)",
    },
  }),
  option: (
    provided: CSSObjectWithLabel,
    _state: OptionProps<AccountHolderType, false>
  ) => ({
    ...provided,
    color: "#000",
    padding: "1rem 1rem",
    cursor: "pointer",
    ":hover": {
      backgroundColor: "rgba(209, 229, 255,1)",
    },
  }),
  menu: (base: CSSObjectWithLabel) => ({
    ...base,
    zIndex: 10,
  }),
  menuList: (base: CSSObjectWithLabel) => ({
    ...base,
    "::-webkit-scrollbar": {
      width: "8px",
    },
    "::-webkit-scrollbar-thumb": {
      height: "50px",
    },
  }),
};

interface FormState {
  accountHolderFirstName: string;
  accountHolderLastName: string;
  accountHolderType: string;
  accountNumber: string;
  routingNumber: string;
  [key: string]: string;
}

interface ErrorRecordValue {
  [key: string]: string | ErrorRecordValue;
}

type ErrorRecord = Record<string, string | ErrorRecordValue>;

const initialState: FormState = {
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

const AddBankAccount = ({ onCancel, onBankAccountAdded }: Props) => {
  const [formState, setFormState] = useState<FormState>(initialState);
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

  const handleChange = useCallback((field: keyof FormState, value: string) => {
    setFormState((prevFormState: FormState) => {
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
          setErrors(errors as ErrorRecord);
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
        <div className="mt-5">
          <Select<AccountHolderType>
            styles={MultiSelectCustomStyle}
            options={accountHolderTypeOptions}
            onChange={(option: SingleValue<AccountHolderType>) => {
              if (option && option.value !== undefined) {
                handleChange("accountHolderType", String(option.value));
                setErrors({});
              }
            }}
            placeholder="Select Account Type"
            key={"bank-account-holder-type"}
            className="account-holder-type-select"
          />

          {errors?.accountHolderType && (
            <ErrorMessage message={errors.accountHolderType as string} />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mt-5">
            <label className="block">
              First Name
              <span className="text-red-500">&nbsp;*</span>
            </label>
            <input
              placeholder={
                formState?.accountHolderType === "company"
                  ? "First Name/Business Name"
                  : "First Name"
              }
              className="w-full mt-1.5 p-4 rounded-md border border-gray-300"
              value={formState?.accountHolderFirstName}
              onChange={(e) =>
                handleChange("accountHolderFirstName", e.target.value)
              }
              maxLength={60}
            />
            {errors?.accountHolderFirstName && (
              <ErrorMessage message={errors.accountHolderFirstName as string} />
            )}
          </div>
          <div className="mt-5">
            <label className="block">
              Last Name<span className="text-red-500">&nbsp;*</span>
            </label>
            <input
              placeholder={
                formState?.accountHolderType === "company"
                  ? "Last Name (Optional)"
                  : "Last Name"
              }
              className="w-full mt-1.5 p-4 rounded-md border border-gray-300"
              value={formState?.accountHolderLastName}
              onChange={(e) =>
                handleChange("accountHolderLastName", e.target.value)
              }
              maxLength={60}
            />
            {errors?.accountHolderLastName && (
              <ErrorMessage message={errors.accountHolderLastName as string} />
            )}
          </div>
        </div>

        {/* Israel and  Belgium takes IBAN number as account number  */}
        <div className="mt-5">
          <label className="block">
            Bank Account Number
            <span className="text-red-500">&nbsp;*</span>
          </label>
          <input
            placeholder={"Account Number"}
            className="w-full mt-1.5 p-4 rounded-md border border-gray-300"
            value={formState?.accountNumber}
            onChange={(e) => handleChange("accountNumber", e.target.value)}
            maxLength={20}
          />
          {errors?.accountNumber && (
            <ErrorMessage message={errors.accountNumber as string} />
          )}
        </div>

        {/* Israel and  Belgium does not accept routing number for bank account*/}

        <div className="mt-5">
          <label className="block">
            Routing Number<span className="text-red-500">&nbsp;*</span>
          </label>
          <input
            placeholder="Routing Number"
            className="w-full mt-1.5 p-4 rounded-md border border-gray-300"
            value={formState?.routingNumber}
            maxLength={20}
            onChange={(e) => handleChange("routingNumber", e.target.value)}
          />
          {errors?.routingNumber && (
            <ErrorMessage message={errors.routingNumber as string} />
          )}
        </div>
      </div>

      <div className="flex justify-center md:justify-end mt-4 gap-3">
        <button
          className="px-[2rem] py-[1rem] border border-gray-300 rounded-full text-[16px] transition-transform duration-200 hover:scale-105"
          disabled={loading}
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="px-[2rem] py-[1rem] transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[16px]"
          disabled={loading}
          onClick={validateForm}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default AddBankAccount;
