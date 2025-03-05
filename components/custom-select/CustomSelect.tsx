import { components, MultiValue, SingleValue } from "react-select";
import AsyncSelect from "react-select/async";
import { GroupBase, NoticeProps } from "react-select";

type OptionType = { label: string; value: string | number | boolean };

type Props = {
  placeholder?: string;
  isMulti?: boolean;
  loadOptions: (inputValue: string) => Promise<OptionType[]>;
  selectedValue?: OptionType | OptionType[] | null;
  onSelect: (item: OptionType | OptionType[] | null) => void;
  getOptionValue?: (item: OptionType) => string;
  getOptionLabel?: (item: OptionType) => string;
};

const CustomSelect = ({
  placeholder = "Select",
  isMulti = true,
  loadOptions,
  selectedValue,
  onSelect,
  getOptionValue = (item) => String(item.value),
  getOptionLabel = (item) => item.label,
}: Props) => {
  return (
    <div className="w-full">
      <AsyncSelect<OptionType, boolean, GroupBase<OptionType>>
        isMulti={isMulti}
        placeholder={placeholder}
        loadOptions={loadOptions}
        defaultOptions
        value={selectedValue}
        onChange={(selected) => {
          if (isMulti) {
            onSelect(selected ? [...(selected as MultiValue<OptionType>)] : null);
          } else {
            onSelect(selected as SingleValue<OptionType>);
          }
        }}
        getOptionValue={getOptionValue}
        getOptionLabel={getOptionLabel}
        components={{ NoOptionsMessage }}
        className="text-black"
        classNames={{
          control: () =>
            "min-h-[60px] rounded-lg border border-gray-300 shadow-sm px-3 bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400",
          menu: () => "z-50 bg-white border border-gray-200 rounded-md shadow-lg",
          option: ({ isSelected }) =>
            `px-4 py-2 cursor-pointer ${isSelected ? "bg-blue-100" : "hover:bg-gray-100"}`,
          multiValue: () => "flex items-center bg-blue-100 rounded-md px-2 py-1 m-1",
          multiValueLabel: () => "text-sm",
          multiValueRemove: () => "cursor-pointer hover:bg-blue-200 rounded",
        }}
      />
    </div>
  );
};

export default CustomSelect;

const NoOptionsMessage = (props: NoticeProps<OptionType, boolean, GroupBase<OptionType>>) => {
  const { selectProps } = props;
  return (
    <components.NoOptionsMessage
      {...props}
    >
      <div className="text-gray-500 text-sm">
        {selectProps?.inputValue
          ? `No result found for "${selectProps?.inputValue}"`
          : "Search..."}
      </div>
    </components.NoOptionsMessage>
  );
};
