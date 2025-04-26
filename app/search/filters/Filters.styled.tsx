import styled from "styled-components";

export const FilterWrapper = styled.div`
  min-width: 270px;
  height: max-content;
  box-shadow: 0px 4px 60px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  .filter__header {
    padding: 1.375rem 1.5rem;
  }
  .filter__header__title {
    line-height: 1.25rem;
  }
  .filter__header__clearbtn {
    line-height: 1rem;
    color: ${(props) => props.theme.colors.lightBlue};
  }
  .filter__checkbox__row {
    color: #4d4d4d;
    line-height: 1.125rem;
    margin-top: 0.875rem;
    .checkbox-label {
      margin-left: 0.75rem;
    }
    .form-check-input[type="radio"] ~ .form-check-label {
      margin-left: 10px;
    }
  }
  .filter__checkbox__row__first {
    color: #4d4d4d;
    line-height: 1.125rem;
    .checkbox-label {
      margin-left: 0.75rem;
    }
  }
`;

export const CategortySkillSelect = {
  control: (base: any) => ({
    ...base,
    height: 50.6,
    marginTop: "1.25rem",
    padding: "0 7px",
    fontSize: "0.875rem",
    fontWeight: 400,
    boxSizing: "border-box",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: () => ({
    display: "none",
  }),
  multiValueRemove: (styles: any) => ({
    ...styles,
    color: "#0067FF",
    ":hover": {
      backgroundColor: "rgba(209, 229, 255,1)",
    },
  }),
};

export const JobStatusFilter = styled.div`
  margin-top: 1rem;

  .check-filter {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
  }

  .form-check-label {
    position: relative;
    top: 2px;
  }
`;


export const SliderWrapper = styled.div`
  margin: 1.125rem 0rem;
  width: 95%;
  .rc-slider-rail,
  .rc-slider-track,
  .rc-slider-step {
    height: 12px;
  }
  .rc-slider-track {
    background: ${(props) => props.theme.colors.yellow};
  }
  .rc-slider {
    height: 44px;
    padding: 1rem 0;
  }
  .rc-slider-handle {
    width: 30px;
    height: 30px;
    border: solid 2px white;
    background: ${(props) => props.theme.colors.yellow};
    /* remove it later */
    top: 11px;
    opacity: 1;
  }
  .rc-slider-handle-dragging.rc-slider-handle-dragging.rc-slider-handle-dragging {
    border-color: white;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.35);
  }
  /* TODO: move below rules to components  */
  .diteched-labels {
    span {
      width: 150px;
      font-size: 0.8125rem;
      color: ${(props) => props.theme.colors.gray4};
      text-align: center;
      &:first-child {
        text-align: left;
      }
      &:last-child {
        text-align: right;
      }
    }
  }
  .budget-input {
    border-radius: 7px;
    padding: 1rem 1rem;
    padding-left: 1.625rem;
  }
  .input-symbol-euro {
    position: relative;
    color: ${(props) => props.theme.colors.gray4};
  }
  .input-symbol-euro:before {
    position: absolute;
    top: 35%;
    bottom: 0;
    content: "$";
    left: 1rem;
  }
`;
