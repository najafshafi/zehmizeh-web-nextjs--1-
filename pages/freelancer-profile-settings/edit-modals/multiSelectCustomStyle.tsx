export const MultiSelectCustomStyle = {
  control: (base: any) => ({
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
  multiValueRemove: (styles: any) => ({
    ...styles,
    color: "#0067FF",
    ":hover": {
      backgroundColor: "rgba(209, 229, 255,1)",
    },
  }),
  option: (provided: any, state: { isSelected: boolean }) => ({
    ...provided,
    backgroundColor: state.isSelected ? "rgba(209, 229, 255,1)" : "white",
    color: "#000",
    padding: "1rem 1rem",
    cursor: "pointer",
    ":hover": {
      backgroundColor: "rgba(209, 229, 255,1)",
    },
  }),
  menu: (base: any) => ({
    ...base,
    zIndex: 10,
  }),
};
