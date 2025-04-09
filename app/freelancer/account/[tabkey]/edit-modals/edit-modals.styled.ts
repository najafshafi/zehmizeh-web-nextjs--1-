import styled from "styled-components";

export const EditFormWrapper = styled.div`
  .content {
    gap: 2rem;
  }
  .suggested-skills {
    color: #656565;
  }
  .locations-list {
    box-shadow: 0px 4px 60px rgba(0, 0, 0, 0.05);
    background: ${(props) => props.theme.colors.white};
    border-radius: 7px;
    border: ${(props) => `1px solid ${props.theme.colors.black}`};
    max-height: 250px;
    overflow-y: auto;
    .list-item {
      padding: 1rem;
      border-radius: 8px;
      &:hover {
        background: ${(props) => props.theme.colors.gray2};
      }
    }
  }
  .character-counter {
    text-align : right;
    color: rgb(242, 180, 32);
    margin-top 10px;
  }
`;

export const StyledFormGroup = styled.div`
  margin-top: 1.25rem;
  .form-input {
    margin-top: 6px;
    padding: 1rem 1.25rem;
    border-radius: 7px;
    border: ${(props) => `1px solid ${props.theme.colors.black}`};
  }

  .common-phone-number-input {
    padding: 0 1.25rem !important;
  }

  .full-width {
    @media (max-width: 767px) {
      width: 100% !important;
    }
  }
  .phone-input-wrapper {
    border: ${(props) => `1px solid ${props.theme.colors.black}`};
    padding-left: 0;
    input {
      height: 58px;
      font-size: 1rem;
    }
  }
  .input-symbol-euro {
    position: relative;
  }
  .rate-input {
    padding-left: 1.625rem;
  }
  .input-symbol-euro:before {
    position: absolute;
    top: 30%;
    bottom: 0;
    content: "$";
    left: 1rem;
  }
  .active-button {
    border-color: ${(props) => props.theme.colors.black};
  }

  .email-input-wrapper {
    position: relative;
  }

  .email-input {
    padding-right: 100px;
  }

  .edit-button {
    position: absolute;
    right: 1.25rem;
    top: 32%;
  }

  .bottom-buttons {
    position: absolute;
    margin-left: 23.5rem;
    margin-top: 0.3rem;
    justify-content: flex-end;
    @media (max-width: 768px) {
      position: relative;
      right: 55%;
      justify-content: center;
    }
  }
`;

export const MultiSelectCustomStyle = {
  control: (base: any) => ({
    ...base,
    minHeight: 60,
    border: "1px solid #000",
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
    ":hover": {
      backgroundColor: "rgba(209, 229, 255,1)",
    },
  }),
  option: (provided: any) => ({
    ...provided,
    // backgroundColor: state.isSelected ? 'rgba(209, 229, 255,1)' : 'white',
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
  menuList: (base: any) => ({
    ...base,
    "::-webkit-scrollbar": {
      width: "8px",
    },
    "::-webkit-scrollbar-thumb": {
      height: "50px",
    },
  }),
};
