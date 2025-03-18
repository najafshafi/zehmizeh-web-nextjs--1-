import styled from 'styled-components';
import { breakpoints } from '@/helpers/hooks/useResponsive';
import { chatType } from '@/store/redux/slices/talkjs.interface';
import { chatTypeSolidColor } from '@/helpers/http/common';
import ReactSelect from 'react-select';

export const Select = styled(ReactSelect)`
  width: 200px;
  max-width: 100%;

  @media ${breakpoints.tablet} {
    width: 160px !important;
  }
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

export const DisableChatReason = styled.div`
  padding: 0.8rem 1rem;
  text-align: center;
  background-color: #fbf5e8;
  color: #f2b420;

  span {
    background-color: #fbf5e8;
    color: #f2b420;
  }
`;

export const Sidebar = styled.div<{ openState: string }>`
  background-color: #ffffff;
  width: 280px;
  min-width: 280px;
  max-width: 100%;
  overflow: auto;
  box-shadow: 0 4px 50px 2px rgb(231, 231, 231);
  border-radius: 10px;
  position: relative;

  @media ${breakpoints.tablet} {
    position: absolute;
    z-index: 10;
    top: 55px;
    width: calc(100% - 20px);
    left: 10px;
    height: 100%;
    transform: translateX(${({ openState }) => (openState ? `0` : `-150%`)});
    transition: 0.3s;
  }

  @media screen and (max-width: 531px) {
    top: 108px;
  }
`;

export const ChatListHeader = styled.div`
  padding: 0.8rem 1rem;
  position: sticky;
  width: 100%;
  background: white;
  z-index: 10;
  top: 0;
  left: 0;

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  p.inbox-title {
    font-size: 1.2rem;
    margin-bottom: 0;
  }

  a {
    font-size: 15px;
    background: #f2b4204d;
    padding: 5px 10px;
    border-radius: 5px;
    &:hover {
      color: black;
    }
  }

  @media ${breakpoints.mobile} {
    flex-wrap: wrap;
    gap: 8px;

    .header-content {
      width: 100%;
      justify-content: space-between;
    }
  }
`;

export const NotificationToggle = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: ${(props) => (props.active ? '#FEF6E1' : '#f5f5f5')};
  color: ${(props) => (props.active ? '#F2B420' : '#9ca3af')};
  transition: all 0.2s ease;
  padding: 0;
  margin-left: 8px;

  &:hover {
    background: ${(props) => (props.active ? '#FEF6E1' : '#f5f5f5')};
    color: ${(props) => (props.active ? '#F2B420' : '#6b7280')};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const ToggleLabel = styled.span`
  font-size: 12px;
  color: ${(props) => props.theme.colors.gray2 || '#666'};
  cursor: pointer;
`;

export const Navbar = styled.div`
  background-color: #ffffff;
  padding: 1rem;
  border-bottom: 1px solid #d3d3d3;
  flex-wrap: wrap;

  .left-section {
    display: flex;
    align-items: center;
    gap: 1rem;
    h1 {
      font-size: 1.2rem;
      margin-bottom: 0;
    }

    p {
      margin-bottom: 0;
    }
  }

  .right-section {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    @media ${breakpoints.mobile} {
      justify-content: center;
    }

    .chat-btn {
      padding: 0.5rem 1rem;
      border-radius: 5px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .chat-btn-light {
      background: #facc15;
      color: #000000;
    }
    .chat-btn-dark {
      color: #facc15;
      background: #000000;
    }
  }
`;

export const SingleUserChatAction = styled.div<{ chatType: chatType }>`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  .closed-project {
    flex: none;
    color: ${({ chatType }) => chatTypeSolidColor(chatType)};
  }
`;

export const Filters = styled.div`
  position: relative;
  z-index: 20;
  padding: 1rem 0;
  padding-top: 0;
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const UnreadCount = styled.div<{ chatType: chatType }>`
  background-color: ${({ chatType }) => chatTypeSolidColor(chatType)};
  color: ${(props) => props.theme.colors.white};
  width: 28px;
  height: 28px;
  aspect-ratio: 1/1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
`;

export const ResetButton = styled.button`
  color: rgb(242, 180, 32);
  width: 75px;
  height: 36px;
  outline: none;
  border: none;
  background: white;
  border-radius: 5px;
  &:hover {
    background-color: #fbf5e8;
  }
`;

export const MobileViewButtons = styled.div<{ chatType: chatType }>`
  display: none;
  @media ${breakpoints.tablet} {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 35px;
    height: 35px;
    color: #ffffff;
    background-color: ${({ chatType }) => chatTypeSolidColor(chatType)};
    border: none;
    border-radius: 5px;
  }
`;

export const ToggleSwitch = styled.div<{ checked: boolean }>`
  position: relative;
  width: 32px;
  height: 16px;
  background: ${(props) => (props.checked ? '#F2B420' : '#E5E5E5')};
  border-radius: 16px;
  padding: 2px;
  transition: 300ms all;
  cursor: pointer;

  &:before {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    top: 2px;
    left: 2px;
    background: white;
    transition: 300ms all;
    transform: ${(props) => (props.checked ? 'translateX(16px)' : 'translateX(0)')};
  }
`;

export const SendMessageDisabledText = styled.div`
  padding: 0.2rem 1rem;
  text-align: center;
  background-color: #fbf5e8;
  color: #f2b420;
`;
