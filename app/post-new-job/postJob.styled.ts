"use client";

import styled, { css } from "styled-components";
import { OptionButton } from "@/components/forms/OptionButton";
import { breakpoints } from "@/helpers/hooks/useResponsive";
import { transition } from "@/styles/transitions";

export const MainLayout = styled.div`
  max-width: 719px;
  margin: auto;
  margin: 7.5rem auto;
  @media ${breakpoints.mobile} {
    margin: 0px;
    margin-top: 1rem;
  }
`;

export const Card = styled.div<{ $small: boolean }>`
  background-color: white;
  border-radius: 17px;
  padding: 4.3125rem 4rem;
  .stepper {
    background: ${(props) => props.theme.colors.body};
    border-radius: 2.5rem;
    padding: 0.625rem 1.25rem;
    line-height: 1.575rem;
    width: fit-content;
    margin-top: 1.8125rem;
  }

  h1 {
    font-size: 2.3 rem;
    font-weight: 700;
    margin-top: 2rem;
    margin-bottom: 0.875rem;
  }

  .buttons {
    margin: 2.5rem 0rem;
    gap: 1rem;
  }

  @media ${breakpoints.mobile} {
    background: ${(props) => props.theme.colors.body};
    padding: 1rem;
    .container {
      position: relative;
    }

    .mob-width-100 {
      width: 100%;
    }

    .sticky-button {
      position: fixed;
      background: white;
      width: 100%;
      bottom: -56px;
      right: 0px;
      box-shadow: 0px 4px 36px rgba(0, 0, 0, 0.08);
      border-radius: 2.5rem;
      padding: 0.5rem;
    }
  }

  input {
    // padding: 1rem 1.25rem;
    // border-radius: 7px;
    // margin-top: 0.75rem;
  }
`;

export const NewJobOption = styled.div<{ $active: boolean }>`
  width: 200px;
  height: 200px;
  border: 1px solid #d9d9d9;
  padding: 2rem;
  border-radius: 0.875rem;
  cursor: pointer;
  margin: 1.875rem 0rem 0rem 0rem;
  .icon-style {
    svg {
      height: 50px;
      width: 50px;
      margin-bottom: 10px;
    }
  }
  .option-title {
    font-size: 1.2rem;
    line-height: 1.24rem;
    letter-spacing: 0.03em;
    // margin-top: 0.8375rem;
  }
  ${(props) =>
    props.$active &&
    css`
      border: ${(props) => `3px solid ${props.theme.colors.primary}`};
    `};

  ${() => transition()}
`;

export const FormLabel = styled.div`
  line-height: 1.4625rem;
  font-size: 1.1rem;
  font-weight: bold;
  .mandatory {
    color: red;
  }
`;

export const FormLabelSubText = styled.span`
  font-size: 0.9rem;
`;

export const OptionButtonWithSvg = styled(OptionButton)`
  display: flex;
  flex: 1;
  align-items: center;
  border-radius: 0.5rem;
  padding: 0.4rem;
  margin: 1rem 0.6875rem 1rem 0rem;
  svg {
    margin-right: 0.4rem;
  }
  .description {
    font-size: 0.8rem;
    color: #858585;
  }
  @media ${breakpoints.mobile} {
    svg {
      margin-bottom: 0.6rem;
    }
    flex-direction: column;
    text-align: center !important;
  }
`;

export const PostForm = styled.div`
  margin-top: 1rem;
  text-align: left;
  .form-group {
    margin-top: 2.5rem;
  }
  text-dimmed: {
    opacity: 0.5;
  }
  .tips {
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    background-color: white;
    border-radius: 10px;
    margin-right: 10px;
    padding: 10px;
    position: absolute;
    left: calc(((100% - 719px) / 2) + 725px);
    padding-right: 10px;
    max-width: calc((100% - 719px) / 2);
  }
  .style-links-wrapper {
    margin-top: 1rem;
    display: flex;
    flex-direction: row;
    gap: 1.5rem;
    .upload-file-types {
      font-size: 14px !important;
    }
    .uploads-attached {
      display: grid !important;
      grid-template-columns: 1fr 1fr 1fr;
    }
    @media ${breakpoints.mobile} {
      flex-direction: column-reverse;
      .uploads-attached {
        display: flex !important;
      }
    }
  }
`;

export const MultiSelectCustomStyle = {
  control: (base: Record<string, unknown>) => ({
    ...base,
    minHeight: 54,
    marginTop: "1.25rem",
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
  multiValueRemove: (styles: Record<string, unknown>) => ({
    ...styles,
    color: "#0067FF",
    ":hover": {
      backgroundColor: "rgba(209, 229, 255,1)",
    },
  }),
  menu: (base: Record<string, unknown>) => ({
    ...base,
    zIndex: 10,
  }),
};

export const StepperContainer = styled.div`
  position: fixed;
  left: 2%;
  top: 50%;
  transform: translateY(-50%);
  height: 20rem;
`;

export const BackButtons = styled.div`
  display: flex;
  justify-content: space-between;
  button {
    color: red;
  }
`;
