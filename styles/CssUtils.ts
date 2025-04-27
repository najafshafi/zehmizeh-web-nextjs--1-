import { createGlobalStyle } from "styled-components";
import { myTheme } from "./theme";
import { css } from "styled-components";
export const CssUtils = createGlobalStyle<{ theme: typeof myTheme }>`
  .mb-2r{
    margin-bottom: 2rem;
  }
  .mt-2r{
    margin-top: 2rem;
  }
  .mt-100{
    margin-top: 100px;
  }
  .btn-nostyle{
    border: none;
  }
  .font-weight-normal{
    font-weight: normal;
  }
  .font-weight-bold{
    font-weight: 700;
  }
  .fs-sm{
    font-size: .875rem;
  }
  .fs-18{
    font-size: 1.125rem;
  }
  .fs-1rem{
    font-size: 1rem!important;
  }
  .gy-1{
    row-gap:1rem;
  }
  .g-1{
    gap: 0.5rem;
  }
  .g-2{
    gap: 1rem;
  }
  .fw-600{
    font-weight: 600;
  }
  .fw-700{
    font-weight: 700;
  }
  .fw-300{
    font-weight: 300;
  }
  .font-normal{
    font-weight: 400;
  }
  .fw-500{
    font-weight: 500;
  }
  .fs-base{
    font-size: 1rem;
  }
  .fs-28 {
    font-size: 1.75rem;
  }
  .fs-24 {
    font-size: 1.5rem;
  }
  .fs-12{
    font-size: 0.75rem;
  }
  .fs-14{
    font-size: .875rem;
  }
  .fs-20{
    font-size: 1.25rem;
  }
  .fs-32{
    font-size: 2rem;
  }
  .fs-40{
    font-size: 2.5rem;
  }
  .flip-x{
    transform: scaleX(-1);
  }
  .flex-1{
    flex: 1;
  }
  .link-bordered{
    border-bottom: 1px dashed currentColor ;
  }
  .text-dimmed{
    color: ${myTheme.colors.grey1};
  }
  .color-blue{
    color: ${myTheme.colors.blue};
  }
  .color-orange{
    color: ${myTheme.colors.orange};
  }
  .font-helvetica {
    font-family: ${(props) => props.theme.font.primary};
  }
  .font-secondary {
    font-family: ${(props) => props.theme.font.secondary};
  }
  .text-muted{
    color: rgba(0,0,0,.6);
  }
  .indent-2r{
    text-indent:2rem;
  }
  .w-max-content{
    width: max-content;
  }
  /* order-1{
    order: 1;
  }
  order-2{
    order: 2;
  } */
`;

export const transition = (blur = 36) => css`
  transition: all 0.2s ease-in;
  &:hover {
    box-shadow: 0px 8px ${() => blur}px rgba(0, 0, 0, 0.16);
    transform: translateY(-2px);
  }
`;
