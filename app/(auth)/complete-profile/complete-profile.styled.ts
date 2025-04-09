import styled from 'styled-components';
// import { breakpoints } from '@/helpers/hooks/useResponsive';

export const Wrapper = styled.div`
  max-width: 678px;
  box-shadow: 0px 4px 60px rgba(0, 0, 0, 0.05);
  background: ${(props) => props.theme.colors.white};
  border-radius: 12px;
  padding: 3rem;
  @media (max-width: 767px) {
    padding: 1rem;
  }
`;

export const StepIndicator = styled.div`
  background: ${(props) => props.theme.colors.body2};
  padding: 0.625rem 1.25rem;
  border-radius: 3rem;
  width: max-content;
`;
