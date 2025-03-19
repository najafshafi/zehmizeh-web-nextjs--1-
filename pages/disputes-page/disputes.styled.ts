import styled from 'styled-components';
import { Container } from 'react-bootstrap';
import { transition } from '@/styles/transitions';

export const Wrapper = styled(Container)`
  margin: auto;
  max-width: 1170px;
  margin-bottom: 100px;
  .title {
    font-size: 3.25rem;
    margin-bottom: 1.75rem;
  }
`;

export const DisputeListItem = styled.div`
  padding: 2rem;
  margin-top: 2rem;
  border-radius: 0.875rem;
  background: ${(props) => props.theme.colors.white};
  box-shadow: 0px 4px 52px rgba(0, 0, 0, 0.08);
  .dispute-content {
    max-width: 70%;
  }
  .label {
    opacity: 0.5;
    min-width: 140px;
    margin-right: 0.5rem;
    word-wrap: break-word;
  }
  .value {
    word-wrap: break-word;
  }
  .right-column {
    margin-left: auto;
  }
  .created-date {
    opacity: 0.5;
  }
  @media (max-width: 768px) {
    .dispute-row {
      flex-wrap: wrap;
    }
  }
  ${() => transition()}
`;

export const DisputeDetailsWrapper = styled.div`
  gap: 2rem;
  .light-black {
    color: ${(props) => props.theme.font.color.heading};
  }
  .light-text {
    opacity: 0.7;
  }
  .heading-title {
    max-width: 80%;
  }
  .support-request--by {
    background-color: ${(props) => props.theme.colors.body2};
    border-radius: 9px;
  }
  .project-owner-details {
    background-color: ${(props) => props.theme.colors.whiteSmoke};
    border-radius: 9px;
  }
  .support-request--avatar {
    height: 38px;
    width: 38px;
    border-radius: 50%;
    object-fit: cover;
  }
  .support-attachment--link {
    background-color: #f8f8f8;
    border: 1px solid ${(props) => props.theme.colors.gray8};
    padding: 0.75rem 1.25rem;
    border-radius: 0.5rem;
    gap: 10px;
  }
  .divider {
    width: 1px;
    background: ${(props) => props.theme.colors.gray8};
    height: 1.5rem;
  }
`;
