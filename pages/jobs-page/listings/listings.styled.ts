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
  ${() => transition()};
  .title {
    line-height: 2rem;
    word-break: break-word;
  }
  .description {
    margin-top: 9px;
  }
  .light-text {
    opacity: 0.6;
  }
  .listing__item-other-details {
    margin-top: 1.25rem;
    gap: 12px;
  }
  .in-progress-closed {
    gap: 1.5rem;
    margin-top: 11px;
  }
  .budget {
    background: ${(props) => props.theme.colors.body2};
    padding: 0.375rem 0.75rem;
    border-radius: 1rem;
  }
  .budget-label {
    opacity: 0.63;
    letter-spacing: 0.02em;
  }
  .client-img-avatar {
    height: 52px;
    width: 52px;
    border-radius: 50%;
  }
  .divider {
    width: 1px;
    height: 2rem;
    background: #d1d1d1;
  }
  .client-hidden-post-banner {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    text-align: center;
    background-color: ${(props) => props.theme.statusColors.red.bg};
    color: ${(props) => props.theme.statusColors.red.color};
    padding: 4px 0px;
    font-size: 14px;
    border-radius: 0.9rem 0.9rem 0px 0px;
  }
`;

export const Bookmark = styled.div`
  height: 43px;
  width: 43px;
  border-radius: 2rem;
  background: ${(props) => props.theme.colors.yellow};
  color: #fff;
`;
