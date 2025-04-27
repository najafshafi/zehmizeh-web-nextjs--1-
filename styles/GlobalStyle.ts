// import { pxToRem } from "@/helpers/utils/misc";
// import { createGlobalStyle } from "styled-components";
// import { myTheme } from "./theme";
// export const MyGlobalStyle = createGlobalStyle`
//   body {
//     margin: 0;
//     font-family: ${myTheme.font.primary};
//     scroll-behavior: smooth;
//     background: #FEFBF4;
//   }
//   code {
//     font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
//       monospace;
//   }
//   /* .btn-check:focus+.btn, .btn:focus{
//     box-shadow: none;
//   } */
//   a{
//     text-decoration: none;
//     color: inherit;
//   }
//   .form-check-input {
//     height: 24px;
//     width: 24px;
//     border-radius: 4px;
//   }
//   .form-check-input:checked{
//     background-color:#F2B420;
//     border: 1px solid #F2B420;
//   }
//   .btn.btn-link{
//     text-decoration: none;
//     /* todo : refactor color */
//     color: #283EFF;
//   }
//   button.btn:not(.btn-link, .btn-transparent) {
//     transition: all 0.2s ease-in-out;
//     &:hover {
//       box-shadow: rgba(0, 0, 0, 0.2) -2px 2px 6px 0px;
//       transform: translateY(-2px);
//       /* rotate(2deg); */
//     }
//   }
//   .heading-sm{
//     color: #0D0D0D;
//     font-size: 1.125rem;
//     font-weight: 700;
//     line-height: 1.5;
//   }
//   .modal-open  .App{
//     filter: blur(2.5px);
//   }
//   .delete-listing-modal{
//     .modal-dialog{
//       min-width: 500px;
//     }
//     .modal-body{
//       padding: 2rem;
//     }
//     .promptTitle{
//       font-size: 1.5rem;
//       font-weight: 700;
//       margin-bottom: 1.75rem;
//     }
//     .promptMsg{
//       text-align: left!important;
//     }
//   }
//   .pointer{
//     cursor: pointer;
//   }
//   .cursor-auto{
//     cursor:auto;
//   }
//   ::-webkit-scrollbar {
//     width: 4px;
//   }
//   ::-webkit-scrollbar-track {
//     background-color: transparent;
//   }
//   ::-webkit-scrollbar-thumb {
//     background-color: #CACACA;
//   }

//   .btn.btn-secondary{
//     background-color: #E7E7E7;
//     color: #000000;
//     border: none;
//   }
//   .stripeEleClass{
//     background-color: red;
//   }
//   /* input */
//   .password-input{
//     position: relative;
//     .input-icon{
//       position: absolute;
//       right: 15px;
//       top: 50%;
//       transform: translateY(-50%);
//       width: 25px;
//       height: 25px;
//       stroke: #A1A1A1;
//       &.active{
//         stroke: ${(props) => props.theme.colors.blue};
//       }
//     }
//   }
//   /* TODO: move */
//   .budget-tooltip{
//     .rc-slider-tooltip-inner{
//       box-shadow: none;
//       font-family: ${myTheme.font.primary};
//       background-color: transparent;
//       color: #000;
//       font-size: ${pxToRem(14)};
//       letter-spacing: .25px;
//     }
//   }
//   .width-fit-content {
//     width: fit-content
//   }
//   .ck-editor__editable:not(.ck-editor__nested-editable) {
//     max-height: 300px;
//   }
//   .ck-editor__editable {
//     overflow-x: hidden;
//   }
// /* overwrites */
//   .btn-primary {
//       color: ${myTheme.button.primary.color};
//       background-color: ${myTheme.button.primary.bg};
//       border-color: ${myTheme.button.primary.bg};
//       &:hover, &:focus, :disabled{
//         background-color: ${myTheme.button.primary.bg} !important;
//         color: ${myTheme.button.primary.color}!important;
//         border-color: ${myTheme.button.primary.bg}!important;
//       }
//   }

//   button:focus {
//     box-shadow: none !important;
//   }

//   input[type="number"]{
//     &::-webkit-outer-spin-button,
// &::-webkit-inner-spin-button {
//   -webkit-appearance: none;
//   margin: 0;
// }

// /* Firefox */
// /* input[type=number] { */
//   -moz-appearance: textfield;
// /* } */
//   }

//   .opacity-4 {
//     opacity: 0.4;
//   }
//   .blurred-2px {
//     filter: blur(2px);
//   }
//   .blurred-9px {
//     filter: blur(9px);
//   }
//   .capital-first-ltr::first-letter {
//     text-transform: capitalize;
//   }

//   .content-hfill{
//     min-height: calc(100vh - 465px);
//   }
//   /* overwrite btn transitions */
//   button.btn:not(.btn-link, .btn-transparent){
//     transition: all 0.2s ease-in-out;
//     &:hover {
//       box-shadow: rgb(0 0 0 / 10%) 0px 0px 15px 0px;
//       transform: scale(1.05);
//     }
//   }
//   /*  */
// .fade-appear,
// .fade-enter {
//   opacity: 0;
//   z-index: 1;
// }
// .fade-appear-active,
// .fade-enter.fade-enter-active {
//   opacity: 1;
//   transition: opacity 450ms linear 250ms;
// }
// .fade-exit {
//   opacity: 1;
// }
// .fade-exit.fade-exit-active {
//   opacity: 0;
//   transition: opacity 150ms linear;
// }
// .freezIphone{
//   pointer-events: none;
//   position: fixed;
//   width: 100%;
// }

// .no-hover-effect, .no-hover-effect:hover {
//   color: initial;
// }
// .react-datepicker__close-icon::after {
//     background-color: ${(props) => props.theme.colors.yellow};
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     padding-bottom: 5px;
//     height: 1.5rem;
//     width: 1.5rem;
//     font-size: 1.25rem;
//     margin-right: 0.5rem;
//   }
// .intercom {
//   position: fixed;
//   z-index: 2147483003;
//   padding: 0 !important;
//   margin: 0 !important;
//   border: none;
//   bottom: 20px;
//   right: 20px;
//   max-width: 48px;
//   width: 48px;
//   max-height: 48px;
//   height: 48px;
//   border-radius: 50%;
//   background: #f2b420;
//   cursor: pointer;
//   box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.06), 0 2px 32px 0 rgba(0, 0, 0, 0.16);
//   transition: transform 167ms cubic-bezier(0.33, 0.00, 0.00, 1.00);
//   box-sizing: content-box;
// }
// .intercom-icon {
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   position: absolute;
//   top: 20%;
//   left: 25%;
//   width: 42px;
//   height: 30px;
//   transition: transform 100ms linear, opacity 80ms linear;
// }
// .modal-backdrop.show {
//   opacity: 0.4 !important;
// }
// .mandatory {
//   color: red;
// }
// `;
