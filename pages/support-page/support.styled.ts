import styled from 'styled-components';
import { Container } from 'react-bootstrap';
import { breakpoints } from '@/helpers/hooks/useResponsive';

export const Wrapper = styled(Container)`
  max-width: 770px;
  margin: auto;
  .page-title {
    font-size: 2.25rem;
  }
  .view-dispute-btn {
    margin: 2rem auto;
    background: ${(props) => props.theme.colors.white};
    box-shadow: 0px 4px 74px rgba(0, 0, 0, 0.04);
    padding: 1.75rem;
    border-radius: 1.25rem;
  }
`;

export const FormWrapper = styled.div`
  padding: 1.5rem;
  border-radius: 1.25rem;
  background: ${(props) => props.theme.colors.white};
  box-shadow: 0px 4px 74px rgba(0, 0, 0, 0.04);
  .form-group {
    margin-top: 1rem;
  }
  .form-input {
    border-radius: 7px;
    padding: 1rem 1.25rem;
  }
  @media ${breakpoints.mobile} {
    padding: 2rem;
  }
`;

export const DropdownWrapper = styled.div`
  .dropdown-button {
    padding: 1rem 1.25rem;
    border: 1px solid #dddddd;
    border-radius: 7px;
  }
  .dropdown-options {
    max-height: 250px;
    overflow-y: auto;
    margin-top: 0.75rem;
    background: #ffffff;
    box-shadow: 0px 4px 19px rgba(0, 0, 0, 0.13);
    border-radius: 8px;
    padding: 1.5rem;
    .option {
      border: 1px solid #d9d9d9;
      padding: 1.5rem;
      border-radius: 8px;
      &:hover {
        background: ${(props) => props.theme.colors.gray2};
      }
      .user-text {
        opacity: 0.7;
      }
    }
  }
  .support-project--title {
    word-wrap: break-word;
  }
`;
