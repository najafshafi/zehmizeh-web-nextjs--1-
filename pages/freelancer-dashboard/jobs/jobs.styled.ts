import styled from 'styled-components';
import { transition } from '@/styles/transitions';

export const TabContent = styled.div`
  height: 500px;
  max-height: 500px;
  overflow-y: auto;
`;

export const ProposalWrapper = styled.div`
  border: 1px solid #dbdbdb;
  padding: 1.25rem;
  border-radius: 0.5rem;
  position: relative;
  ${() => transition()}
  .job-title {
    word-break: break-word;
  }
  .saved-job--content {
    gap: 14px;
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
  .proposal__budget-value {
    margin-left: 6.35px;
  }
  .proposal__details {
    gap: 1rem;
  }
  .archived-badge {
    color: #747474;
    background-color: rgba(165, 165, 165, 0.19);
    border-radius: 4px;
    padding: 0.5rem 1rem;
  }
  .budget-and-location {
    gap: 10px;
  }
  .light-text {
    opacity: 0.63;
  }
`;

export const BookmarkIcon = styled.div`
  height: 43px;
  width: 43px;
  border-radius: 2rem;
  background: ${(props) => props.theme.colors.body};
  color: #747474;
  background-color: rgba(165, 165, 165, 0.19);
`;
