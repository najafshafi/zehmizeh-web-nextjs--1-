import { Container } from 'react-bootstrap';
import styled from 'styled-components';

export const Wrapper = styled(Container)`
  padding: 3rem 0rem 6.25rem 0rem;
  max-width: 970px;
  .actions {
    margin-top: 2rem;
    @media (max-width: 768px) {
      display: flex;
      // flex-direction: column-reverse;
      justify-content: center;
      align-items: center;
    }
  }
  .close-button {
    margin: 2.5rem auto auto;
    text-align: center;
    width: 100%;
    max-width: 100%;
    margin-top: 1rem;
  }
`;

export const PengingProposalWrapper = styled.div`
  padding: 2.25rem;
  box-shadow: 0px 4px 60px rgba(0, 0, 0, 0.05);
  background: ${(props) => props.theme.colors.white};
  margin: 2.25rem 0rem 0rem 0rem;
  border-radius: 12px;
  border: ${(props) => `1px solid ${props.theme.colors.yellow}`};
  .banner-title {
    line-height: 2.1rem;
    margin-bottom: 1.25rem;
    word-wrap: break-word;
  }
  .attribute-gray-label {
    opacity: 0.5;
  }
  .attribute-value {
    margin-left: 0.5rem;
  }
  .line-height-28 {
    line-height: 1.75rem;
  }
  .divider {
    opacity: 0.1;
    margin: 0rem 1.25rem;
  }
  .location {
    background: ${(props) => props.theme.colors.body2};
    padding: 0.375rem 0.875rem;
    border-radius: 1.5rem;
  }
`;
export const NoPropsalWrapper = styled.div`
  padding: 2.25rem;
  box-shadow: 0px 4px 60px rgba(0, 0, 0, 0.05);
  background: ${(props) => props.theme.colors.white};
  margin: 2.25rem 0rem 0rem 0rem;
  border-radius: 12px;
  border: ${(props) => `1px solid ${props.theme.colors.yellow}`};
  .content {
    gap: 1.5rem;
  }
  .banner-title {
    line-height: 2.1rem;
    word-break: break-word;
  }
  .attribute-gray-label {
    opacity: 0.5;
  }
  .posted-date {
    gap: 0.5rem;
  }
  .line-height-28 {
    line-height: 1.75rem;
  }
  .posted-by-avatar {
    margin-right: 1rem;
  }
  .devider {
    opacity: 0.1;
  }
  .location {
    background: ${(props) => props.theme.colors.body2};
    padding: 0.375rem 0.5rem;
    border-radius: 1.5rem;
    gap: 4px;
  }
`;
