import styled from "styled-components";
import { transition } from "@/styles/transitions";

export const TabContent = styled.div`
  height: 500px;
  max-height: 500px;
  overflow-y: auto;
`;

export const ProposalWrapper = styled.div`
  border: 1px solid #dbdbdb;
  padding: 1.25rem;
  border-radius: 0.5rem;
  gap: 14px;
  position: relative;
  ${() => transition()}
  .job-title {
    word-break: break-word;
  }
  .proposal__client-profile-img {
    margin-right: 0.5rem;
  }
  .proposal__client-detail-label {
    opacity: 0.5;
    margin-bottom: 3px;
  }
  .divider {
    width: 1px;
    height: 2rem;
    background: #d1d1d1;
  }
  .proposal__budget {
    background: ${(props) => props.theme.colors.body2};
    padding: 0.4375rem 0.625rem;
    border-radius: 1rem;
  }
  .proposal__budget-grey-label {
    margin-left: 0.5625rem;
    opacity: 0.6;
  }
  .proposal__budget-value {
    margin-left: 6.35px;
  }
  .proposal__details {
    gap: 1rem;
  }
  .location-and-budget {
    gap: 0.625rem;
  }
  .applied-date {
    opacity: 0.63;
  }
`;
