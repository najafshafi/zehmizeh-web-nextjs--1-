export const MultiSelectCustomStyle = {
  control: (base: any) => ({
    ...base,
    minHeight: 54,
    marginTop: '1.25rem',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: () => ({
    display: 'none',
  }),
  multiValue: () => {
    return {
      margin: '5px 10px 5px 0px',
      borderRadius: 6,
      backgroundColor: 'rgba(209, 229, 255, 0.4)',
      display: 'flex',
    };
  },
  multiValueLabel: () => ({
    margin: 5,
  }),
  multiValueRemove: (styles: any) => ({
    ...styles,
    color: '#0067FF',
    ':hover': {
      backgroundColor: 'rgba(209, 229, 255,1)',
    },
  }),
  menu: (base: any) => ({
    ...base,
    zIndex: 10,
  }),
};
