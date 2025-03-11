import { Modal } from 'react-bootstrap';
import styled from 'styled-components';
import { breakpoints } from '@/helpers/hooks/useResponsive';

export const StyledModal = styled(Modal)<{
  maxwidth?: number;
  transpatent?: boolean;
  $hideModal?: boolean;
}>`
  .modal-dialog {
    max-width: ${(props) => (props.maxwidth ? `${props.maxwidth}px` : '800px')};
  }
  .modal-content {
    border-radius: 12px;
    background: ${(props) =>
      props.transpatent ? 'transparent' : (props.theme?.colors?.white || 'white')};
    border: ${(props) => (props.transpatent ? 'transparent' : 'initial')};
    ${(props) => {
      if (props.$hideModal) {
        return `
          height:0px;
          width:0px;
          overflow:hidden;
        `;
      }
      return '';
    }}
  }
  .modal-body {
    /* overflow-x: hidden; */
    @media ${breakpoints.mobile} {
      padding: 2rem 1rem;
    }
    padding: 3rem;
  }
  .content {
    gap: 1rem !important;
  }
  .close {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0;
    color: white;
    transform: translate(30px, -10px);
    font-size: 1.75rem;
    font-weight: 200;
    border: none !important;
    border-color: none !important;
    @media ${breakpoints.mobile} {
      transform: translate(0, 0);
      right: 10px;
      color: #000;
    }
    &:hover,
    &:focus,
    &:active,
    &:visited {
      border: none !important;
      border-color: none !important;
    }
  }
  .bottom-buttons {
    margin-top: 1.25rem;
    justify-content: flex-end;
    @media (max-width: 768px) {
      justify-content: center;
    }
  }
`;
