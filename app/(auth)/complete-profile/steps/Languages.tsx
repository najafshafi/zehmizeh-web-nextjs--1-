"use client";
import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { components } from "react-select";
import AsyncSelect from "react-select/async";
import { FormWrapper } from "./steps.styled";
import { StyledButton } from "@/components/forms/Buttons";
import { getLanguages } from "@/helpers/http/common";
import { MultiSelectCustomStyle } from "./multiSelectCustomStyle";
import { IClientDetails } from "@/helpers/types/client.type";
import { IFreelancerDetails } from "@/helpers/types/freelancer.type";
import CustomButton from "@/components/custombutton/CustomButton";

type TData = Partial<IClientDetails & IFreelancerDetails>;

// Define language types
interface Language {
  id: number;
  name: string;
}

interface LanguageOption {
  label: string;
  value: string;
}

interface LanguageApiResponse {
  language_id: string;
  language_name: string;
}

type Props = {
  languagesProps?: Language[];
  onUpdate: (data: TData) => void;
  onPrevious: () => void;
  skipForNow: () => void;
};

const multiSelectProps = {
  closeMenuOnSelect: true,
  isMulti: true,
  styles: MultiSelectCustomStyle,
};

const Languages = ({
  languagesProps,
  onUpdate,
  onPrevious,
  skipForNow,
}: Props) => {
  const [languages, setLanguages] = useState<Language[] | undefined>(
    languagesProps
  );

  const handleUpdate = () => {
    // Validations and parent function call to store the data in parent
    if (!languages || languages.length === 0) {
      toast.error("Please add at least one language.");
    } else {
      onUpdate({ languages });
    }
  };

  const languageOptions = (inputValue: string) => {
    // This will be called when user types and will call languages api with the keyword

    const languagesLocal: LanguageOption[] = [];
    return getLanguages(inputValue || "").then((res) => {
      res.data.forEach(function (item: LanguageApiResponse) {
        const obj = {
          label: item.language_name,
          value: item.language_id,
        };
        languagesLocal.push(obj);
      });
      return languagesLocal;
    });
  };

  const getDefaultlanguageOptions = useMemo(() => {
    // This will format all the availbale languages to the format that the react async requires

    if (languages && languages.length > 0) {
      return languages.map((item) => {
        return { label: item.name, value: item.id.toString() };
      });
    }
    return undefined;
  }, [languages]);

  const onSelect = (selected: readonly LanguageOption[]) => {
    const data = selected.map((item: LanguageOption) => {
      return { id: parseInt(item.value, 10), name: item.label };
    });
    setLanguages(data);
  };

  return (
    <FormWrapper className="flex flex-col w-full min-w-[600px]">
      <div>
        <div className="form-group">
          <div>
            <b className="fs-18">
              Languages
              <span className="text-red-500">&nbsp;*</span>
            </b>
            <p className="fs-base mt-2 mb-0 text-justify text-gray-500">
              Select any languages that you can work in below.
            </p>
          </div>
          <AsyncSelect
            {...multiSelectProps}
            placeholder="Enter your languages"
            components={{ NoOptionsMessage }}
            loadOptions={languageOptions}
            onChange={(options) =>
              onSelect(options as readonly LanguageOption[])
            }
            value={getDefaultlanguageOptions}
            defaultOptions={true}
          />
        </div>
      </div>
      <div className="flex justify-center md:justify-end gap-3">
        <CustomButton
          text="Previous"
          className="px-8 py-3 transition-transform duration-200 hover:scale-105 font-normal  rounded-full hover:bg-black hover:text-white text-[18px] border border-black "
          onClick={onPrevious}
        />

        <CustomButton
          text="Skip"
          className="px-8 py-4 transition-transform duration-200 hover:scale-105 font-normal  rounded-full bg-black text-white text-[18px]"
          onClick={skipForNow}
        />

        <CustomButton
          text="Next"
          className="px-8 py-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px]"
          onClick={handleUpdate}
        />
      </div>
    </FormWrapper>
  );
};

export default Languages;

// Using the correct type from react-select components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NoOptionsMessage = (props: any) => {
  return (
    <components.NoOptionsMessage {...props}>
      <div>
        {props?.selectProps?.inputValue
          ? `No result found for '${props?.selectProps?.inputValue}'`
          : "Search..."}
      </div>
    </components.NoOptionsMessage>
  );
};
