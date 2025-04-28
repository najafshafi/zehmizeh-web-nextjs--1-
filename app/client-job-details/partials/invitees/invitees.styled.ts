import styled from 'styled-components';

export const InviteesWrapper = styled.div`
  gap: 30px;
  margin-top: 2.5rem;
`;

export const InviteesListItem = styled.div`
  padding: 2.75rem;
  box-shadow: 0px 4px 74px rgba(0, 0, 0, 0.04);
  background: ${(props) => props.theme.colors.white};
  border-radius: 12px;
  gap: 2rem;
  position: relative;
  overflow: hidden;
  .applicant-details {
    max-width: 75%;
    word-wrap: break-word;
  }
  .main-details {
    gap: 10px;
  }
  .line-height-140 {
    line-height: 140%;
  }
  .light-text {
    opacity: 0.5;
  }
  .buttons {
    gap: 12px;
  }
  .line-height-100-perc {
    line-height: 100%;
  }
  .rounded-chip {
    background-color: #fbf5e8;
    padding: 0.375rem 0.875rem;
    border-radius: 1rem;
  }
  .form-group {
    margin-top: 1.25rem;
  }
  .form-input {
    border-radius: 7px;
    padding: 1rem 1.25rem;
  }
  .bottom-buttons {
    justify-content: flex-end;
    gap: 9px;
    @media (max-width: 768px) {
      justify-content: center;
    }
  }
  .right-section {
    @media (max-width: 768px) {
      gap: 1.25rem;
      /* align-items: flex-start; */
    }
  }
  .divider {
    height: 1px;
    background-color: rgba(0, 0, 0, 0.1);
  }
  .updated-on {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    text-align: center;
    background-color: #ffedd3;
    color: #ee761c;
    padding: 2px 0px;
  }
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const DetailsWrapper = styled.div`
  .content {
    gap: 2.25rem;
  }
  .freelancer-details {
    gap: 2rem;
  }
  .freelancer-avatar {
    height: 80px;
    width: 80px;
    border-radius: 100%;
  }
  .freelancer-details__content {
    gap: 10px;
  }
  .proposal-attributes {
    gap: 0.875rem;
  }
  .description-text {
    opacity: 0.5;
    line-height: 160%;
  }
  .light-text {
    opacity: 0.5;
  }
  .proposal-details-item {
    gap: 0.875rem;
    .row-item {
      gap: 10px;
    }
  }
  .attachments {
    background-color: #f8f8f8;
    border: 1px solid #dedede;
    padding: 0.75rem 1.25rem;
    border-radius: 0.5rem;
    gap: 10px;
  }
  .divider {
    margin: 2rem 0rem;
    height: 1px;
    background: #000000;
    opacity: 0.1;
  }
`;
