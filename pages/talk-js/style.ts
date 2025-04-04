import { breakpoints } from '@/helpers/hooks/useResponsive';
// import { chatOnUserHoverOrActiveColor, chatTypeSolidColor } from '@/helpers/http/common';
import styled from 'styled-components';
// import ReactSelect from 'react-select';
// import { chatType } from '@/store/redux/slices/talkjs.interface';

export const Wrapper = styled.div`
  margin: 3rem auto;
  height: 100%;
  background-color: transparent;
  display: flex;
  position: relative;
  gap: 1rem;
  padding: 0;
  height: 700px;

  @media ${breakpoints.desktop} {
    max-height: 75vh;
  }

  .fetching-chat-loader {
    height: 50%;
  }
  .talkjs-chatbox {
    height: 100%;
    @media ${breakpoints.mobile} {
      height: 122%;
    }
    iframe {
      height: 100%;
    }
  }

  @media ${breakpoints.mobile} {
    padding: 0 10px;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  .project-filter__label {
    width: 200px !important;
    max-width: 100%;
  }
`;

export const Chatbox = styled.div`
  background-color: white;
  flex: 1;
`;

export const Loading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  svg {
    width: 2rem !important;
    height: 2rem !important;
    animation: 1.2s rotateAnimation infinite;
  }
  p {
    margin-bottom: 0px;
    font-size: 1.1rem;
    margin-top: 3px;
  }

  @keyframes rotateAnimation {
    from {
      transform: rotate(0);
    }

    to {
      transform: rotate(360deg);
    }
  }
`;
