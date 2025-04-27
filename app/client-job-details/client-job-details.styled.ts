import { breakpoints } from "@/helpers/hooks/useResponsive";
import { Container } from "react-bootstrap";
import styled from "styled-components";
import { transition } from "@/styles/CssUtils";

export const Wrapper = styled(Container)`
  padding: 3rem 0rem 6.25rem 0rem;
  max-width: 970px;
  margin: auto;
  min-height: 70vh;
  .tabs-quick-options {
    margin-top: 2rem;
    gap: 1.25rem;
    @media (max-width: 768px) {
      display: flex;
      flex-direction: column-reverse;
      justify-content: center;
      align-items: center;
      .mob-width-100 {
        width: 100%;
      }
    }
  }
  .round-button {
    height: 3.25rem;
    width: 3.25rem;
    border-radius: 3.75rem;
    background: ${(props) => props.theme.colors.white};
    ${() => transition()};
  }
  .align-left {
    margin-right: 1rem;
  }
  .post-visibility-switch {
    display: flex;
    flex-direction: row;
    border: 1px solid ${(props) => props.theme.colors.gray5};
    border-radius: 1rem;
    div {
      cursor: pointer;
      padding: 0.1rem 1rem;
      &.active {
        cursor: default;
        color: ${(props) => props.theme.colors.white};
        border-radius: 1rem;
        background-color: ${(props) => props.theme.colors.primary};
      }
    }
  }

  .edit-btn {
    background-color: rgba(209, 229, 255, 0.3);
    border-radius: 0.5rem;
    height: 44px;
    gap: 0.5rem;
    padding: 0 1rem;
    ${() => transition()};
    span {
      color: #0067ff;
    }
  }

  .delete-btn {
    background-color: #fbf5e8;
    border-radius: 0.5rem;
    margin-left: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 44px;
    gap: 0.5rem;
    padding: 0 1rem;
    ${() => transition()}
    span {
      color: #ee761c;
    }
  }
  .closure-request-status-badge {
    display: flex;
    white-space: normal;
    padding: 0.5rem 0.5rem;
    width: 14rem;
    @media ${breakpoints.tablet} {
      justify-content: center;
      width: 100%;
    }
  }
`;

export const DraftProspectJobBanner = styled.div`
  padding: 2.25rem;
  box-shadow: 0px 4px 60px rgba(0, 0, 0, 0.05);
  background: ${(props) => props.theme.colors.white};
  margin: 2.25rem 0rem 0rem 0rem;
  border-radius: 12px;
  border: ${(props) => `1px solid ${props.theme.colors.yellow}`};
  .banner-title {
    line-height: 2.1rem;
    word-wrap: break-word;
    max-width: 100%;
  }
  .light-text {
    opacity: 0.5;
  }
  .divider {
    opacity: 0.1;
  }
  .location {
    background: ${(props) => props.theme.colors.body};
    padding: 0.375rem 0.875rem;
    border-radius: 1rem;
  }
`;

export const InProgressClosedJobWrapper = styled.div`
  box-shadow: 0px 4px 60px rgba(0, 0, 0, 0.05);
  background: ${(props) => props.theme.colors.white};
  margin: 1.4rem 0rem 0rem 0rem;
  border-radius: 12px;
  border: ${(props) => `1px solid ${props.theme.colors.yellow}`};
  .header {
    padding: 2.25rem;
  }
  .banner-title {
    line-height: 2.1rem;
    word-wrap: break-word;
  }
  .job-basic-details {
    gap: 1.25rem;
  }
  .posted-by-avatar {
    height: 5.25rem;
    width: 5.25rem;
    border-radius: 50%;
    margin-right: 1rem;
  }
  .budget-and-earnings {
    border-top: ${(props) => `1px solid ${props.theme.colors.yellow}`};
    padding: 2.25rem;
  }
  .divider {
    width: 1px;
    height: 58px;
    background-color: #000;
  }
  .light-text {
    opacity: 0.5;
  }
  .budget-change-button {
    font-size: 14px;
    border-radius: 4rem;
    padding: 6px 14px;
    cursor: pointer;
    margin-left: 8px;
    background-color: ${(props) => props.theme.colors.yellow};
  }
  .hired-freelancer-name {
    display: flex;
    flex-wrap: wrap;
    margin-top: 1rem;
    align-items: flex-end;
    width: max-content;
    max-width: 20rem;
    @media ${breakpoints.mobile} {
      width: auto;
    }
  }
`;
