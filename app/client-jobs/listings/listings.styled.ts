import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { transition } from '@/styles/transitions';

export const ListingItem = styled(Link)`
  position: relative;
  background: ${(props) => props.theme.colors.white};
  padding: 2rem;
  border-radius: 0.875rem;
  margin-bottom: 1.875rem;
  box-shadow: 0px 4px 74px rgba(0, 0, 0, 0.04);

  .job-item-content {
    width: 100%;
  }
  ${() => transition()};
  .title {
    line-height: 2rem;
    word-wrap: break-word;
  }
  .applicants {
    gap: 8px;
    border: 1px solid #d9d9d9;
    padding: 0.625rem 1rem;
    border-radius: 2.1875rem;
  }
  .light-text {
    opacity: 0.6;
  }
  .listing__item-other-details {
    margin-top: 1.25rem;
    gap: 12px;
    .left-column {
      gap: 12px;
    }
    .left-column-gap-25 {
      gap: 1.5rem;
    }
  }
  .budget {
    background: ${(props) => props.theme.colors.body};
    padding: 0.375rem 0.75rem;
    border-radius: 1rem;
    gap: 9px;
  }
  .budget-label {
    opacity: 0.63;
    letter-spacing: 0.02em;
  }
  .freelancer-details {
    margin-top: 1.25rem;
    gap: 12px;
    .name-w-ratings {
      gap: 1.125rem;
      @media (max-width: 768px) {
        gap: 0;
      }
    }
  }
  .ratings-italic {
    font-style: italic;
  }
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;
