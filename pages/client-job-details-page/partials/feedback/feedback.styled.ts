import styled from 'styled-components';

export const FeedbackWrapper = styled.div`
  .review-heading-note {
    max-width: 574px;
    margin: auto;
    margin-top: 4rem;
    line-height: 160%;
  }
  .content {
    gap: 1.5rem;
    margin-top: 2.75rem;
    padding: 2rem 2.25rem;
    background: rgba(255, 255, 255, 0.7);
    box-shadow: 0px 4px 54px rgba(0, 0, 0, 0.04);
    border-radius: 1rem;
  }
  .ratings {
    border: 1px solid #d7d7d7;
    padding: 1.5rem 1.75rem;
    gap: 1.25rem;
    border-radius: 0.5rem;
    .ratings__label {
      opacity: 0.7;
      text-transform: uppercase;
    }
  }
  .ratings__stars {
    gap: 3px;
  }
  .feedback-message {
    padding: 1rem 1.25rem;
    border-radius: 7px;
  }
  .button {
    background: ${(props) => props.theme.colors.yellow};
  }
  .client-feedback {
    margin-top: 2.5rem;
  }
  .freelancer-feedback {
    margin-top: 3rem;
  }
  .review-content {
    background: ${(props) => props.theme.colors.white};
    padding: 1.875rem;
    border-radius: 1rem;
    gap: 1.875rem;
    margin-top: 1.125rem;
  }
  .given-ratings {
    gap: 4px;
    .stars {
      gap: 1px;
    }
    .given-rating-count {
      font-style: italic;
    }
  }
  .light-text {
    opacity: 0.6;
  }
  .review-description {
    font-style: italic;
    opacity: 0.8;
    line-height: 170%;
    margin-top: 0.75rem;
  }
  .client-details {
    gap: 1.25rem;
  }
  .client-location {
    margin-top: 6px;
  }
  .divider {
    margin: 0rem 0.625rem;
    height: 8.5rem;
    width: 1px;
    background: ${(props) => props.theme.colors.black};
  }
  .fill-available {
    flex: 1;
  }
`;
