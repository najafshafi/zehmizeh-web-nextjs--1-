import { useEffect, useState } from "react";
import Select, { components } from "react-select";
import { getStates } from "@/helpers/http/common";
import { MultiSelectCustomStyle } from "./MultiSelectCustomStyle";
import "./style.css";

type Props = {
  countryCode?: string;
  onSelectState: (item: { label: string; value: string } | null) => void;
  selectedState?: { label: string; value: string } | null;
  borderColor?: string;
};

const multiSelectProps = {
  closeMenuOnSelect: true,
};

const StateDropdown = ({
  countryCode,
  onSelectState,
  selectedState,
  borderColor,
}: Props) => {
  const [states, setStates] = useState<any[]>([]);

  useEffect(() => {
    if (countryCode) {
      getStates(countryCode).then((res) => {
        const formattedOptions = res?.data?.map((item: any) => ({
          label: item.name,
          value: item.name,
        }));
        setStates(formattedOptions);
      });
    } else {
      setStates([]); // Clear states if no country is selected
    }
  }, [countryCode]);
  return (
    <div>
      <Select
        {...multiSelectProps}
        styles={MultiSelectCustomStyle(borderColor)}
        placeholder="Select State/Region"
        components={{ NoOptionsMessage }}
        options={states}
        isSearchable={true}
        isMulti={false as any}
        value={selectedState}
        onChange={(option: any) => onSelectState(option as { label: string; value: string } | null)}
        isDisabled={!countryCode}
      />
    </div>
  );
};

export default StateDropdown;

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
