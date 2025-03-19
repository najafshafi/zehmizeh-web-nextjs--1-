/*
 * This component is a modal to edit languages
 */

import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { components } from "react-select";
import AsyncSelect from "react-select/async";
import { VscClose } from "react-icons/vsc";
import { IoClose } from "react-icons/io5";
import { editUser } from "@/helpers/http/auth";
import { getLanguages } from "@/helpers/http/common";

// Custom MultiValueRemove component
const CustomMultiValueRemove = (props: any) => {
  return (
    <components.MultiValueRemove {...props}>
      <IoClose size={16} style={{ color: "#0067ff" }} />
    </components.MultiValueRemove>
  );
};

// Custom ClearIndicator component to clear all selections
const ClearIndicator = (props: any) => {
  const {
    innerProps,
    clearValue, // Provided by react-select to clear all values
    hasValue, // Indicates if there are selected options
  } = props;

  if (!hasValue) return null; // Hide the clear icon if no values are selected

  return (
    <div
      {...innerProps}
      className="px-2 cursor-pointer"
      onClick={clearValue} // Clears all selected options
    >
      <IoClose size={20} className="text-gray-400 hover:text-gray-600" />
    </div>
  );
};

type Props = {
  show: boolean;
  onClose: () => void;
  languagesProps?: any;
  onUpdate: () => void;
};

// Customized styles for the AsyncSelect component
const customSelectStyles = {
  control: (base: any) => ({
    ...base,
    minHeight: "60px",
    backgroundColor: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "0.375rem",
    boxShadow: "none",
    "&:focus": {
      border: "2px solid #2684ff",
    },
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: "0.375rem",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#d1e5ff66"
      : state.isFocused
      ? "#d1e5ff66"
      : "white",
    color: state.isSelected ? "#212529" : "#212529",
    "&:active": {
      backgroundColor: "#d1e5ff66",
    },
  }),
  multiValue: (base: any) => ({
    ...base,
    backgroundColor: "#d1e5ff66",
    borderRadius: "6px",
    margin: "5px 10px 5px 0px",
  }),
  multiValueLabel: (base: any) => ({
    ...base,
    color: "#212529",
    fontWeight: 500,
    fontSize: "15px",
    padding: "2px 8px",
    margin: "2px 0px",
  }),
  multiValueRemove: (base: any) => ({
    ...base,
    color: "#212529",
    "&:hover": {
      backgroundColor: "#d1e5ff66",
      color: "#0067ff",
    },
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
};

const multiSelectProps = {
  closeMenuOnSelect: true,
  isMulti: true,
  styles: customSelectStyles,
};
const LanguagesEditModal = ({
  show,
  onClose,
  languagesProps,
  onUpdate,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [languages, setLanguages] = useState<any>(languagesProps);

  const handleUpdate = () => {
    setLoading(true);
    const body = {
      languages,
    };
    const promise = editUser(body);
    toast.promise(promise, {
      loading: "Updating your details - please wait...",
      success: (res) => {
        onUpdate();
        setLoading(false);
        return res.message;
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || "error";
      },
    });
  };

  const languageOptions = (inputValue: string) => {
    const languagesLocal: { label: any; value: any }[] = [];
    return getLanguages(inputValue || "").then((res) => {
      res.data.forEach(function (item: any) {
        const obj = {
          label: item.language_name,
          value: item.language_id,
        };
        languagesLocal.push(obj);
      });
      return languagesLocal;
    });
  };

  const getDefaultLanguageOptions = useMemo(() => {
    if (languages?.length > 0) {
      return languages?.map((item: any) => {
        return { label: item.name, value: item.id };
      });
    }
  }, [languages]);

  const onSelect = (selected: any) => {
    const data = selected.map((item: any) => {
      return { id: item.value, name: item.label };
    });
    setLanguages(data);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      {/* Backdrop */}
      <div
        className="w-screen h-screen fixed inset-0 backdrop-blur-sm z-40 p-0 m-0"
        onClick={onClose}
      ></div>
      {/* Modal Content */}
      <div className="bg-white rounded-xl w-full max-w-[678px] max-h-[90vh] py-8 px-4 md:p-12 relative z-50 m-2">
        {/* Close Button */}
        <VscClose
          className="absolute top-4 md:top-0 right-4 md:-right-8 text-2xl text-black md:text-white hover:text-gray-200 cursor-pointer"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div className="space-y-4">
          <h2 className="text-[#212529] text-[1.75rem] font-normal">
            My Languages
          </h2>

          <div className="space-y-2">
            <div className="text-base text-gray-700">
              Select all of the languages you can work in.
            </div>

            <div className="w-full">
              <AsyncSelect
                {...multiSelectProps}
                placeholder="Enter your languages"
                components={{
                  NoOptionsMessage,
                  MultiValueRemove: CustomMultiValueRemove,
                  ClearIndicator,
                }}
                loadOptions={languageOptions}
                onChange={(options) => onSelect(options)}
                value={getDefaultLanguageOptions}
                defaultOptions={true}
                className="w-full"
                isClearable={true}
              />
            </div>
          </div>

          {/* Update Button */}
          <div className="flex justify-center md:justify-end !mt-9">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className={`bg-[#F2B420] text-[#212529] px-9 py-[1.15rem] hover:scale-105 duration-300 text-lg rounded-full disabled:bg-[#F2A420] ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguagesEditModal;

const NoOptionsMessage = (props: any) => {
  return (
    <components.NoOptionsMessage {...props}>
      <div className="py-2 px-3 text-gray-500">
        {props?.selectProps?.inputValue
          ? `No result found for '${props?.selectProps?.inputValue}'`
          : "Search..."}
      </div>
    </components.NoOptionsMessage>
  );
};