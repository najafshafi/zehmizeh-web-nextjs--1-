import { breakpoints } from '@/helpers/hooks/useResponsive';
import { Container } from 'react-bootstrap';
import styled from 'styled-components';

export const Wrapper = styled(Container)`
  max-width: 1170px;

  .image-preview-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    .img-previewer-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.75);
    }

    .img-preview {
      position: relative;
      max-width: 100%;
      max-height: 100%;
      z-index: 21;
    }

    audio.previewer-box {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80%;
      max-width: 500px;
      height: 50px !important;
      z-index: 21;
    }

    .previewer-box {
      position: relative;
      max-width: 90%;
      max-height: 85vh;
      width: auto;
      height: auto;
      background: #dfdfdf;
      border-radius: 6px;
      z-index: 21;
      margin: 20px;

      &.image {
        object-fit: contain;
        width: auto;
        height: auto;
        max-width: 90%;
        max-height: 85vh;
      }
    }

    .previewer-box-pdf {
      position: fixed;
      top: 8rem;
      left: 20%;
      width: 60%;
      height: 80%;
      z-index: 21;
      margin: 0;
      padding: 0;
      border: none;
      background: white;

      @media ${breakpoints.mobile} {
        width: 90%;
        left: 5%;
        height: 70%;
      }
    }

    .portfolio-close-btn {
      position: fixed;
      top: 20px;
      right: 20px;
      color: white;
      z-index: 22;
      font-size: 24px;
      padding: 10px;
      line-height: 1;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;

      &:hover {
        color: #e0e0e0;
        background: rgba(0, 0, 0, 0.7);
      }

      @media ${breakpoints.mobile} {
        top: max(10px, env(safe-area-inset-top, 10px));
        right: max(10px, env(safe-area-inset-right, 10px));
        width: 40px;
        height: 40px;
        font-size: 20px;
      }
    }
  }
`;
