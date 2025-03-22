import { breakpoints } from "@/helpers/hooks/useResponsive";
import { pxToRem } from "@/helpers/utils/misc";
import styled from "styled-components";

export const MessageContainer = styled.div`
  background-color: ${(props) => props.theme.colors.white};
  border-radius: 0.75rem;
  margin: 1.5rem auto;
  display: flex;
  box-shadow: 0px 4px 74px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  @media ${breakpoints.tablet} {
    flex-direction: column;
  }
  .m-panel--header {
    min-height: 70px;
    border-bottom: 1px solid ${(props) => props.theme.colors.gray6};
    padding: 0 2rem;
  }
  .title {
    line-height: 70px;
    font-size: 1.5rem;
  }
  .m-userlist--wrapper {
    width: ${pxToRem(285)};
    border-right: 1px solid ${(props) => props.theme.colors.gray6};
    @media ${breakpoints.tablet} {
      width: 100%;
      border-right: none;
      border-bottom: 1px solid ${(props) => props.theme.colors.gray6};
      padding-bottom: 1rem;
    }
  }
`;

export const TabsContainer = styled.div`
  .msg-count {
    background-color: ${(props) => props.theme.colors.yellow};
    border-radius: 50%;
    height: 30px;
    width: 30px;
    font-size: 14px;
  }
`;

export const ChatPanelWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  .m--chatpanel {
    &-header {
      padding: 0 1.125rem;
    }
    &-activeUser {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      h5 {
        margin-bottom: 0;
        font-weight: 700;
        font-size: ${pxToRem(18)};
      }
    }
    &-clock {
      border: solid rgb(242, 180, 32, 0.16);
      border-radius: 2rem;
      padding: 0.4rem 0.5rem;
      background-color: ${(props) => props.theme.colors.body};
      span {
        font-size: ${pxToRem(14)};
        color: rgba(0, 0, 0, 0.5);
      }
      @media (max-width: 768px) {
        margin-bottom: 4px;
      }
    }
    &-body {
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
    background-color: ${({ theme }) => theme.statusColors.yellow.bg};
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
