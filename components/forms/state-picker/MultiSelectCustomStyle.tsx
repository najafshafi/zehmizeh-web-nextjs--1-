import { StylesConfig, GroupBase } from "react-select";

type OptionType = {
  label: string;
  value: string | number | boolean;
};

export const MultiSelectCustomStyle = (
  borderColor: string = "lightgrey"
): StylesConfig<OptionType, true, GroupBase<OptionType>> => ({
  control: (base) => ({
    ...base,
    minHeight: "60px",
    border: `1px solid ${borderColor}`,
    borderRadius: "7px",
    padding: "0.5rem",
    boxShadow: "none",
    ":hover": {
      borderColor: borderColor,
    },
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: () => ({
    display: "none",
  }),
  multiValue: (base) => ({
    ...base,
    margin: "5px 10px 5px 0px",
    borderRadius: "6px",
    backgroundColor: "rgba(209, 229, 255, 0.4)",
    display: "flex",
  }),
  multiValueLabel: (base) => ({
    ...base,
    margin: "5px",
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    ":hover": {
      backgroundColor: "rgba(209, 229, 255, 1)",
    },
  }),
  menu: (base) => ({
    ...base,
    zIndex: 10,
  }),
  option: (provided, state) => ({
    ...provided,
    color: "#000",
    padding: "16px",
    cursor: "pointer",
    backgroundColor: state.isSelected ? "rgba(209, 229, 255, 1)" : "white",
    ":hover": {
      backgroundColor: "rgba(209, 229, 255, 1)",
    },
  }),
  menuList: (base) => ({
    ...base,
    "::-webkit-scrollbar": {
      width: "8px",
    },
    "::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(209, 229, 255, 0.6)",
      borderRadius: "4px",
    },
  }),
});