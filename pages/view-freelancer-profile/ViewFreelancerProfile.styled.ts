import styled from 'styled-components';
import { Container } from 'react-bootstrap';

export const Wrapper = styled(Container)`
  max-width: 970px;
  margin: auto;
  position: relative;
  @media (max-width: 768px) {
    overflow: hidden;
  }
  .banner-left-bg {
    position: absolute;
    left: -5rem;
    top: 13px;
    z-index: -1;
  }
  .banner-right-bg {
    position: absolute;
    right: -2.1875rem;
    top: 8.75rem;
    z-index: -1;
  }
`;

export const ViewFreelancerProfileWrapper = styled.div`
  width: 90%;
  margin: 3rem auto;
  display: flex;
  justify-content: center;
  gap: 2rem;
  position: relative;

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
    .phone-input-wrapper {
      width: 100%;
    }
  }
`;

export const ViewFreelancerContent = styled.div`
  margin-top: 1rem;
  max-width: 970px;
  width: 100%;
  background: transparent;
  padding: 1rem;
`;

export const ProfilePortfolioWrapper = styled.div`
  padding: 3.25rem;
  border-radius: 0.875rem;
  background: rgb(255, 255, 255);
  box-shadow: rgba(0, 0, 0, 0.04) 0px 4px 61px;
  margin-top: 28px;
`;
