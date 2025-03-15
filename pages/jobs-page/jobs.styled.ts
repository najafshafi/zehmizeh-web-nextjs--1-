import styled from 'styled-components';

export const Wrapper = styled.div`
  padding: 4.375rem 0rem 3.125rem 0;
  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
  margin: auto;
  max-width: 1170px;
  .find-btn {
    flex: none;
  }
  .project-filter {
    background-color: white;
    position: relative;
    height: 72px;
    width: 50%;
    left: 25%;
    box-shadow: 0px 6px 29px rgba(155, 155, 155, 0.09);
    margin-bottom: 3rem;
    margin-top: 2rem;
    border-radius: 8px;
    @media (max-width: 768px) {
      left: 0%;
      width: 100%;
      margin-top: 1.5rem;
      margin-bottom: 2rem;
    }
  }
`;
