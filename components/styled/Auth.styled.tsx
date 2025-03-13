import { breakpoints } from '@/helpers/hooks/useResponsive';
import styled, { css } from 'styled-components';

export const RegisterWrapper = styled.div`
  /* background-color: ${(props) => props.theme.colors.bg}; */
  .option-button {
    border: 1px solid #d9d9d9;
    border-radius: 14px;
    background: transparent;
    padding: 1.1rem;
    font-weight: 400;
    font-size: 1rem;
    line-height: 128%;
    color: ${(props) => props.theme.colors.black};
    @media ${breakpoints.mobile} {
      font-size: 1.25rem;
    }
    svg {
      margin-right: 1.25rem;
    }
  }
  span[color='yellow'] {
    position: absolute;
    top: 20px;
    right: 20px;
  }
`;

export const CardWrapper = styled.div<{ small?: boolean }>`
  ${(props) =>
    props.small
      ? css`
          max-width: 900px;
        `
      : css`
          max-width: 718px;
        `}
  margin: 5.5rem auto;
  .yellow-link {
    color: ${(props) => props.theme.colors.yellow};
  }
  @media ${breakpoints.mobile} {
    padding: 2rem 0.75rem;
    margin-top: 0;
  }
`;

export const Card = styled.div<{ small?: boolean }>`
  ${(props) =>
    props.small
      ? css`
          max-width: 900px;
        `
      : css`
          max-width: 718px;
        `}
  /* margin: auto; */
  display: grid;
  position: relative;
  align-content: center;
  background-color: white;
  border-radius: 17px;
  padding: 3rem 3.875rem;
  @media ${breakpoints.mobile} {
    padding: 4rem 0.75rem;
    margin-top: 0;
  }

  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-top: 2.5rem;
  }

  h2 {
    margin-top: 0.75rem;
    font-weight: 300;
    font-size: 1.5rem;
    line-height: 140%;
    opacity: 0.63;
  }

  h3 {
    font-weight: 400;
    font-size: 1.5rem;
    line-height: 140%;
    margin-top: 3.5rem;
  }

  h4 {
    font-weight: 400;
    font-size: 1.25rem;
    line-height: 140%;
  }

  .agency {
    button {
      padding: 1.125rem 2.25rem;
    }
  }

  .planing {
    button {
      width: 40%;
    }
  }

  .input-group {
    button {
      padding: 0rem 1rem;
      font-size: 1rem;
      background-color: transparent !important;
      color: black !important;
      border: 1px solid #dfdfdf;
      border-right: none;

      &:active,
      .show {
        background-color: transparent !important;
      }
    }

    input {
      padding: 1rem 0.75rem;
    }

    .dropdown-menu {
      max-height: 200px;
      overflow: auto;

      a {
        color: black;
      }
    }
  }

  /* button[type='submit'] {
    padding: 1.125rem 2.25rem;
  } */

  a {
    color: #0067ff;
  }

  .active-button {
    border: ${(props) => `2px solid ${props.theme.font.color.heading}`};
  }

  label {
    font-weight: 300;
    font-size: 1rem;
    color: #7d7777;
  }

  input {
    font-size: 1rem;
  }

  .forgot-password {
    margin-left: auto;
    color: ${(props) => props.theme.colors.black};
  }
`;

export const LimitedH2 = styled.h2`
  max-width: 480px;
`;

export const Verification = styled.input`
  max-width: 44px;
  height: 56px;
  border: 1px solid ${(props) => props.theme.colors.black};
  border-radius: 7px;
  font-size: 1.5rem;
  text-align: center;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  &[type='number'] {
    -moz-appearance: textfield;
  }
`;
