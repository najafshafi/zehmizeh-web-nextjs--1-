import { CSSObjectWithLabel, OptionProps, GroupBase } from "react-select";

type OptionType = {
  label: string;
  value: string | number | boolean;
};

export const MultiSelectCustomStyle = {
  control: (base: CSSObjectWithLabel) => ({
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
    color: "#0067FF",
    ":hover": {
      backgroundColor: "rgba(209, 229, 255,1)",
    },
  }),
  option: (
    provided: CSSObjectWithLabel,
    state: OptionProps<OptionType, false, GroupBase<OptionType>>
  ) => ({
    ...provided,
    backgroundColor: state.isSelected ? "rgba(209, 229, 255,1)" : "white",
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
};
