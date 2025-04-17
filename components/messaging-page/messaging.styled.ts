import { breakpoints } from "@/helpers/hooks/useResponsive";
import {
  chatOnUserHoverOrActiveColor,
  chatTypeSolidColor,
} from "@/helpers/http/common";
import { pxToRem } from "@/helpers/utils/misc";
import { chatType } from "@/store/redux/slices/talkjs.interface";
import styled, { css } from "styled-components";

export const MessageContainer = styled.div`
  gap: 2rem;
  border-radius: 0.75rem;
  margin: 1.5rem auto;
  display: flex;
  /* box-shadow: 0px 4px 74px rgba(0, 0, 0, 0.04); */
  /* overflow: hidden; */
  @media ${breakpoints.tablet} {
    flex-direction: column;
  }
  .m-panel--header {
    /* min-height: 70px; */
    /* border-bottom: 1px solid ${(props) => props.theme.colors.gray6}; */
    padding: 0px 0.5rem;
  }
  .title {
    line-height: 70px;
    font-size: 1.2rem;
  }
  .m-userlist--wrapper {
    width: 20rem;
    padding: 0 0.5rem;
    padding-bottom: 1rem;
    box-shadow: 0 4px 50px 2px #e7e7e7;
    border-radius: 13px;
    /* border-right: 1px solid ${(props) => props.theme.colors.gray6}; */
    @media ${breakpoints.tablet} {
      width: 100%;
      border-right: none;
      border-bottom: 1px solid ${(props) => props.theme.colors.gray6};
      padding-bottom: 1rem;
    }
  }
`;

export const TabsContainer = styled.div`
  @media screen and (max-width: 900px) {
    width: 100%;
  }
  .msg-count {
    background-color: ${(props) => props.theme.colors.yellow};
    border-radius: 50%;
    height: 30px;
    width: 30px;
    font-size: 14px;
  }
`;

export const Wrapper = styled.div`
  padding: ${pxToRem(6)};
  max-height: 589px;
  overflow-y: auto;

  ::-webkit-scrollbar {
    width: 0.4rem;
  }

  &::-webkit-scrollbar-track {
    background-color: #eaeaea;
    border-radius: 10px;
    overflow: hidden;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
  }

  @media ${breakpoints.tablet} {
    max-height: 430px;
  }
`;

export const ChatSingleUser = styled.div<{
  $chatType: chatType;
  $isSelected?: boolean;
}>`
  border-left: 4px solid ${({ $chatType }) => chatTypeSolidColor($chatType)};
  padding: 0.6rem 1.25rem;
  padding-right: 0.5rem;
  gap: ${pxToRem(12)};
  cursor: pointer;
  &:hover {
    background-color: ${({ $chatType }) =>
      chatOnUserHoverOrActiveColor($chatType)};
  }
  .userlistitem__avatar {
    img {
      border-radius: 50%;
      width: 48px;
      height: 48px;
      object-fit: cover;
    }
  }
  .userlistitem__count {
    background-color: ${(props) => props.theme.colors.black};
    color: ${(props) => props.theme.colors.white};
    width: 28px;
    height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
  }
  .userlistitem--info-name {
    color: #000;
    font-size: 15px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-wrap: nowrap;
    width: 145px;
  }
  .userlistitem--info-msg {
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 130px;
    display: block;
    overflow: hidden;
    color: rgba(0, 0, 0, 0.6);
    font-size: 14px;
    flex: 1;
  }
  &.active {
    background-color: ${({ $chatType }) =>
      chatOnUserHoverOrActiveColor($chatType)};
  }
  .closed-project {
    font-size: 14px !important;
  }

  .conversation-type-text {
    color: ${({ $chatType }) => chatTypeSolidColor($chatType)};
    background-color: ${({ $chatType }) =>
      chatOnUserHoverOrActiveColor($chatType)};
    padding: 2px 5px;
    text-transform: uppercase;
  }
`;

export const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 2rem;
  @media screen and (max-width: 900px) {
    flex-direction: column;
    align-items: start;
    gap: 1rem;
  }
`;

export const MessageSidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  .message-sidebar-header-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    user-select: none;

    svg {
      cursor: pointer;
    }
  }

  .message-dropdown-options {
    position: absolute;
    background-color: rgb(255, 255, 255);
    box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 4px 0px;
    min-width: max-content;
    width: 125px;
    padding: 0.5rem 0;
    top: 100%;
    right: 0px;
    z-index: 10;
    margin-top: 1rem;
    border: 1px solid #dfdfdfb5;
    border-radius: 5px;
    li {
      list-style-type: none;
      padding: 0.5rem 1.5rem;
      cursor: pointer;
      &:hover {
        background: #ececfd;
      }
    }
  }
`;

export const SingleUserChatAction = styled.div<{ $chatType: chatType }>`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  .closed-project {
    flex: none;
    color: ${({ $chatType }) => chatTypeSolidColor($chatType)};
  }
`;

export const ChatPanelWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: white;
  .m--chatheader-job-title {
    margin-bottom: 0;
    color: #454545;
  }
  .m--chatpanel {
    &-header {
      padding: 0 1.5rem;
    }
    &-activeUser {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      align-items: flex-start;
      margin: 10px 0px;
      h5 {
        margin-bottom: 0;
        font-weight: 500;
        font-size: 20px;
      }

      @media ${breakpoints.tablet} {
        margin: 0px;
      }
    }
    &-back-to-job-proposal-invite {
      min-height: auto;
      padding: 12px 1.4rem;
      font-size: 16px;
      @media ${breakpoints.tablet} {
        margin: 10px 0px;
      }
    }
    &-body {
      position: relative;
      display: flex;
      flex-direction: column;
      flex: 1;
      .message-limit-note {
        background-color: aliceblue;
        color: ${({ theme }) => theme.statusColors.blue.color};
        text-align: center;
        padding: 10px 20px;
        .link {
          color: ${(props) => props.theme.colors.lightBlue};
        }
      }
    }
  }
  .message-limit-note-warn {
    /* background-color: ${({ theme }) => theme.statusColors.yellow.bg}; */
    background-color: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.statusColors.yellow.color};
    text-align: center;
    padding: 10px 20px;
    .link {
      color: ${(props) => props.theme.colors.lightBlue};
    }
  }
  .search-messages {
    border: 1px solid ${(props) => props.theme.colors.gray6};
    margin: 0.5rem;
    border-radius: 0.35rem;
    overflow: hidden;
    padding-left: 0.65rem;
    padding-right: 0.65rem;
    display: flex;
    align-items: center;
    /* width: 300px; */
    /* flex: 1; */
    input {
      border: none !important;
      outline: none !important;
      height: 44px;
      flex: 1;
      max-width: 100%;
      padding: 0 0.5rem;
    }
    svg {
      stroke: ${(props) => props.theme.colors.gray7};
    }
  }
`;

export const ChatHeaderButton = styled.button<{
  variantColor: chatType;
  variantType: "primary" | "secondary";
}>`
  border-radius: 5px;
  padding: 10px 1.5rem;
  outline: none;
  border: none;
  font-size: 15px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;

  ${({ variantType, variantColor }) => {
    if (variantType === "primary") {
      return `
        background-color: ${chatTypeSolidColor(variantColor)};
        color: white;
      `;
    }
    if (variantType === "secondary") {
      return `
        background-color: ${chatOnUserHoverOrActiveColor(variantColor)};
        color: ${chatTypeSolidColor(variantColor)};
      `;
    }
  }}
`;

export const MessageBubbleWrapper = styled.div<{
  type: "self" | "remote";
  variant: chatType;
}>`
  max-width: 50%;
  .message__avatar {
    img {
      width: 29px;
      height: 29px;
      object-fit: cover;
      border-radius: 50%;
    }
  }
  .message__body {
    border-radius: 0px 12px 12px 12px;
    padding: 1rem;
    /* background-color: #3d3de7; */
    background-color: ${({ variant }) => chatTypeSolidColor(variant)};
    color: white;
    a {
      color: ${(props) => props.theme.colors.yellow};
    }
  }
  .message__body {
    white-space: pre-line;
  }
  .message__time {
    margin-left: 2.2rem;
    margin-bottom: 0.5rem;
    opacity: 0.5;
    line-height: 1.4;
    font-size: 0.857rem;
  }
  ${(props) =>
    props.type === "self" &&
    css`
      align-self: flex-end;
      .message__time {
        text-align: right;
      }
      .message__body {
        border-radius: 12px 12px 0px 12px;
        background-color: ${chatOnUserHoverOrActiveColor(props.variant)};

        color: black;
      }
    `}
  .file-msg-img {
    width: 200px;
    height: 200px;
    object-fit: cover;
    object-position: top center;
    border-radius: 12px 12px 0px 12px;
    border: 1px solid ${(props) => props.theme.colors.gray6};
  }
  .file-msg-doc {
    svg {
      width: 200px;
      height: 200px;
      border: 1px solid lightgray;
      border-radius: 0.75rem;
      padding: 1rem;
    }
  }
  .delete-btn {
    background-color: #fbf5e8;
    border-radius: 0.5rem;
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    padding: 0.25rem;
    display: none;
  }
  :hover {
    .delete-btn {
      display: block;
    }
  }
`;

export const ChatUserTimeZoneWrapper = styled.div<{
  isFromSingleMessaging: boolean;
}>`
  display: flex;
  position: ${(props) => (props.isFromSingleMessaging ? "relative" : "sticky")};
  /* left: 0px;
  top: -1px; */
  /* margin-left: ${(props) => (props.isFromSingleMessaging ? "4px" : "-20px")};
  margin-right: ${(props) =>
    props.isFromSingleMessaging ? "4px" : "-18px"}; */
  z-index: 999;
  .timezone {
    display: flex;
    align-items: center;
    gap: 6px;
    border-radius: ${(props) => (props.isFromSingleMessaging ? "2rem" : "0px")};
    border: solid rgb(242, 180, 32, 0.16);
    padding: 0px 0.5rem;
    background-color: ${(props) => props.theme.colors.body};
    span {
      font-size: ${pxToRem(14)};
      color: rgba(0, 0, 0, 0.5);
    }
  }
  @media ${breakpoints.tablet} {
    margin: ${(props) =>
      props.isFromSingleMessaging ? "10px 0px" : "0px -18px 0px -20px"};
    .timezone {
      justify-content: center;
      width: calc(100% + 20px);
    }
  }
`;
