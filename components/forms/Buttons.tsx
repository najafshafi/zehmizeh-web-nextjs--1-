import styled, { css } from "styled-components";
import Delete from "@/public/icons/trash.svg";
import Edit from "@/public/icons/edit.svg";
import CheckMark from "@/public/icons/checkmark.svg";
// import { Button } from 'react-bootstrap';
import { BootButton } from "./BootButton";
import { pxToRem } from "@/helpers/utils/misc";
import { ButtonHTMLAttributes, ReactNode } from "react";

const StyledBtn = styled.button<{ background?: string }>`
  background-color: white;
  border: solid 1px #c7c7c7;
  border-radius: 0.5rem;
  width: 40px;
  height: 40px;
  ${({ background }) =>
    background &&
    css`
      background-color: ${background};
      border: none !important;
    `}
  &.withText {
    width: auto;
    display: flex;
    gap: 0.5rem;
    align-items: center;
    padding: 0.65rem;
  }
`;

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  name: "delete" | "edit" | "check";
  children?: ReactNode;
}

export const IconButton = ({ name, children, ...rest }: IconButtonProps) => (
  <StyledBtn {...rest}>
    {name === "delete" && <Delete />}
    {name === "edit" && <Edit />}
    {name === "check" && <CheckMark stroke="#32B155" />}
    {children}
  </StyledBtn>
);

interface StyledButtonProps {
  background?: string;
  backgroundcolor?: string;
  position?: string;
  top?: string;
  right?: string;
  color?: string;
  minWidth?: string;
  padding?: string;
  fontSize?: string;
  borderRadius?: string;
  width?: number;
  border?: string;
  shadow?: boolean;
  height?: number;
  theme?: {
    colors: {
      black: string;
      [key: string]: string;
    };
  };
}

export const StyledButton = styled(BootButton)<StyledButtonProps>`
  /* default */
  ${({ background }) =>
    background &&
    css`
      background-color: ${background};
      border: none;
    `}

  ${({ backgroundcolor }) =>
    backgroundcolor &&
    css`
      background-color: ${backgroundcolor};
    `}

  ${({ position }) =>
    position &&
    css`
      position: ${position};
    `}

    ${({ top }) =>
    top &&
    css`
      top: ${top};
    `}

    ${({ right }) =>
    right &&
    css`
      right: ${right};
    `}

  ${({ color }) =>
    color &&
    css`
      color: ${color};
    `}

    ${({ minWidth }) =>
    minWidth &&
    css`
      min-width: ${minWidth};
    `}

  white-space: nowrap;
  padding: ${(props) => props.padding || "0 2rem"};
  font-size: ${(props) => props.fontSize || "1.125rem"};
  text-align: center;
  border-radius: ${(props) => props.borderRadius || "4.8125rem"};
  min-height: ${pxToRem(56)};

  ${(props) => props.width && `width: ${pxToRem(props.width)}`};
  ${(props) => props.border && `border: ${props.border}`};
  ${({ shadow }) =>
    shadow &&
    css`
      box-shadow: 0px 4px 36px rgba(0, 0, 0, 0.08);
      transition: all 0.2s ease-in-out;
      &:hover,
      &:focus,
      &:active {
        box-shadow: 0px 8px 36px rgba(0, 0, 0, 0.16);
        transform: translateY(-2px);
      }
    `}
  ${(props) =>
    props.height &&
    css`
      height: ${props.height}px;
    `};
  svg {
    margin-right: 4px;
  }
  &.btn-outline-primary {
    border: 1px solid #c7c7c7;
    color: ${(props) => props.theme.colors.black};
    font-weight: 400;
    font-size: 1rem;
    transition: all 0.2s ease-in-out;
    &:hover {
      background-color: transparent;
      box-shadow: rgba(0, 0, 0, 0.1) -2px 2px 6px 0px;
      transform: translateY(-2px);
    }
  }
  &.btn-transparent {
    transition: all 0.1s ease-in-out;
    &:hover {
      /* transform: translateY(-2px); */
      opacity: 0.7;
    }
  }
`;

export const TransparentButton = styled(BootButton).attrs(() => ({
  className: "btn-transparent",
  variant: "link",
}))`
  border: none;
  color: #283eff;
  font-weight: 500;
  margin-bottom: 10px;
`;
