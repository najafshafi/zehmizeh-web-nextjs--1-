// import { Button, ButtonProps } from 'react-bootstrap';
// import Delete from '@/public/icons/trash.svg';
// import Edit from '@/public/icons/edit.svg';
// import CheckMark from '@/public/icons/checkmark.svg';
// import { pxToRem } from '@/helpers/utils/misc';

// // Interface for IconButton props
// interface IconButtonProps {
//   name: 'delete' | 'edit' | 'check';
//   background?: string;
//   className?: string;
//   children?: React.ReactNode;
//   [key: string]: any;
// }

// export const IconButton = ({ name, background, className = '', children, ...rest }: IconButtonProps) => {
//   const baseClasses = 'w-10 h-10 rounded-lg border border-[#c7c7c7] bg-white';
//   const backgroundClasses = background ? `bg-[${background}] border-none` : '';
//   const withTextClasses = children ? 'w-auto flex items-center gap-2 p-2.5' : '';

//   return (
//     <button
//       className={`${baseClasses} ${backgroundClasses} ${withTextClasses} ${className}`}
//       {...rest}
//     >
//       {name === 'delete' && <Delete />}
//       {name === 'edit' && <Edit />}
//       {name === 'check' && <CheckMark stroke="#32B155" />}
//       {children}
//     </button>
//   );
// };

// // Extended ButtonProps interface from react-bootstrap
// interface StyledButtonProps extends ButtonProps {
//   background?: string;
//   backgroundcolor?: string;
//   position?: string;
//   top?: string;
//   right?: string;
//   color?: string;
//   minWidth?: string;
//   padding?: string;
//   fontSize?: string;
//   borderRadius?: string;
//   width?: number;
//   border?: string;
//   shadow?: boolean;
//   height?: number;
// }

// export const StyledButton = ({
//   background,
//   backgroundcolor,
//   position,
//   top,
//   right,
//   color,
//   minWidth,
//   padding,
//   fontSize,
//   borderRadius,
//   width,
//   border,
//   shadow,
//   height,
//   className = '',
//   ...rest
// }: StyledButtonProps) => {
//   const classes = [
//     'whitespace-nowrap',
//     'text-center',
//     padding ? `p-${padding}` : 'px-8',
//     fontSize ? `text-${fontSize}` : 'text-lg',
//     borderRadius ? `rounded-${borderRadius}` : 'rounded-[4.8125rem]',
//     'min-h-[56px]', // Using pxToRem(56) result directly
//     background ? `bg-[${background}] border-none` : '',
//     backgroundcolor ? `bg-[${backgroundcolor}]` : '',
//     position ? `position-${position}` : '',
//     color ? `text-[${color}]` : '',
//     shadow ? 'shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5' : '',
//     'outline-none', // To handle btn-outline-primary
//     className.includes('btn-outline-primary') 
//       ? 'border border-[#c7c7c7] text-black font-normal text-base hover:bg-transparent hover:shadow-md hover:-translate-y-0.5 transition-all duration-200' 
//       : '',
//     className.includes('btn-transparent') 
//       ? 'transition-all duration-100 hover:opacity-70' 
//       : '',
//   ].filter(Boolean).join(' ');

//   const styles = {
//     ...(top && { top }),
//     ...(right && { right }),
//     ...(minWidth && { minWidth }),
//     ...(width && { width: pxToRem(width) }),
//     ...(border && { border }),
//     ...(height && { height: `${height}px` }),
//   };

//   return (
//     <Button
//       className={classes}
//       style={styles}
//       {...rest}
//     />
//   );
// };

// // TransparentButton component
// export const TransparentButton = (props: ButtonProps) => (
//   <Button
//     className="border-none text-[#283eff] font-medium mb-2.5 outline-none"
//     {...props}
//   />
// );






import styled, { css } from 'styled-components';
import  Delete  from '@/public/icons/trash.svg';
import  Edit  from '@/public/icons/edit.svg';
import  CheckMark  from '@/public/icons/checkmark.svg';
// import { Button } from 'react-bootstrap';
import { BootButton } from './BootButton';
import { pxToRem } from '@/helpers/utils/misc';

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

export const IconButton = ({ name, children, ...rest }: any) => (
  <StyledBtn {...rest}>
    {name === 'delete' && <Delete />}
    {name === 'edit' && <Edit />}
    {name === 'check' && <CheckMark stroke="#32B155" />}
    {children}
  </StyledBtn>
);

export const StyledButton = styled(BootButton)<any>`
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
  padding: ${(props) => props.padding || '0 2rem'};
  font-size: ${(props) => props.fontSize || '1.125rem'};
  text-align: center;
  border-radius: ${(props) => props.borderRadius || '4.8125rem'};
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
  className: 'btn-transparent',
  variant: 'link',
}))`
  border: none;
  color: #283eff;
  font-weight: 500;
  margin-bottom: 10px;
`;
