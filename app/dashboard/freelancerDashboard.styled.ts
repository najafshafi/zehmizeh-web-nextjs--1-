import { Container } from 'react-bootstrap';
import styled from 'styled-components';

export const MainContainer = styled(Container)`
  position: relative;
  .top-rated-badge {
    background: ${(props) => props.theme.colors.white};
    gap: 0.5rem;
    padding: 1.25rem;
    padding-top: 2.25rem;
    height: 9rem;
    border-radius: 0px 0px 74px 74px;
  }
`;

export const Wrapper = styled.div`
  max-width: 1170px;
  margin: auto;
  min-height: 70vh;
  position: relative;
  .proposals-and-jobs {
    margin: 2rem 0rem 6.25rem 0rem;
    @media (max-width: 768px) {
      margin-top: 0;
    }
  }
`;
