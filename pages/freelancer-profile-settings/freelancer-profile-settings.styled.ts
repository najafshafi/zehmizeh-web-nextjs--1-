import { Container } from 'react-bootstrap';
import styled from 'styled-components';
import { transition } from '@/styles/transitions';

export const Wrapper = styled(Container)`
  max-width: 1170px;
  .reset-password {
    transition: all 0.2s ease-in-out;
    color: ${(props) => props.theme.colors.lightBlue};
    &:hover {
      transform: translateY(-2px);
    }
  }
`;

export const ProfileBannerWrapper = styled.div`
  word-break: break-word;
  box-shadow: 0px 4px 60px rgba(0, 0, 0, 0.05);
  background: ${(props) => props.theme.colors.white};
  border: ${(props) => `1px solid ${props.theme.colors.yellow}`};
  margin: 1rem 0rem 0rem 0rem;
  border-radius: 12px;
  gap: 1.25rem;
  /* .profile__name-title {
    word-break: break-word;
  } */
  .profile__img {
    height: 9.5625rem;
    width: 9.5625rem;
    border-radius: 50%;
    position: relative;
    border: 1px solid ${(props) => props.theme.colors.gray5};
  }
  .img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
  .edit-picture-btn {
    position: absolute;
    background: #f7faff;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    bottom: 0px;
    right: 0px;
    ${() => transition()}
  }
  .profile__details {
    gap: 1.125rem;
  }
  .profile__username {
    line-height: 2.1rem;
  }
  .profile__description {
    color: #999999;
    // line-height: 1rem;
  }
  .profile__contact {
    gap: 1.125rem;
  }
  .profile__contact-item {
    gap: 0.75rem;
    word-break: break-word;
  }
  .profile__contact-item-value {
    opacity: 0.8;
  }
  .divider {
    width: 1px;
    background: ${(props) => props.theme.colors.gray6};
    height: 1.25rem;
  }
  .budget-and-location {
    gap: 10px;
  }
  .profile__badge {
    background: ${(props) => props.theme.colors.body2};
    padding: 0.375rem 0.75rem;
    border-radius: 1rem;
    gap: 7px;
  }
  .budget-and-location-gray-text {
    opacity: 0.63;
  }
  .edit-button {
    border: 1px solid #f2b420;
    background: #f2b420;
    color: white;
    padding: 0.75rem 1.25rem;
    border-radius: 1.75rem;
    ${() => transition()}
  }
`;

export const NotificationButton = styled.button`
  transition: all 0.2s ease-in-out 0s;
  color: rgb(0, 103, 255);
  background: transparent;
  border: none;
  outline: none;
  font-size: 18px;
  margin-right: 1rem;
  display: inline-block;
`;

export const FreelancerProfileWrapper = styled.div`
  width: 90%;
  margin: auto;
  margin: 3rem auto;
  display: flex;
  gap: 2rem;
  position: relative;
  .phone-input-wrapper {
    border: 1px solid hsl(0, 0%, 80%) !important;
    width: 100%;
  }
  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    gap: 0;
    margin-top: 0;

    .form-group-wapper {
      flex-direction: column;
      gap: unset !important;
      align-items: start !important;
    }

    .email-input-wrapper,
  }
`;

export const FreelancerContent = styled.div`
  margin-top: 1rem;
  width: 100%;
  background: transparent;
  padding: 1rem;
`;

export const ContentBox = styled.div`
  box-shadow: rgba(0, 0, 0, 0.05) 0px 4px 60px;
  background-color: #fff;
  border-radius: 16px;
  padding: 2rem;
  margin: 1rem auto;
  .form-input {
    border: 1px solid hsl(0, 0%, 80%) !important;
  }
`;
