import { Container } from "react-bootstrap";
import styled from "styled-components";
import { breakpoints } from "@/helpers/hooks/useResponsive";

export const Wrapper = styled(Container)`
  max-width: 1170px;
  min-height: 70vh;
  .page-title {
    font-size: 3.25rem;
    @media ${breakpoints.mobile} {
      font-size: 2rem;
    }
  }
  .jobs-proposal-col {
    margin-bottom: 2rem;
  }
`;
