import { breakpoints } from 'helpers/hooks/useResponsive';
import styled from 'styled-components';

const PageTitle = styled.h1<{ fontSize?: string }>`
  font-size: ${(props) => (props.fontSize ? props.fontSize : '3.25rem')};
  font-weight: 400;
  @media ${breakpoints.mobile} {
    font-size: 2rem;
  }
  text-transform: capitalize;
  word-break: break-word;
`;

export default PageTitle;
