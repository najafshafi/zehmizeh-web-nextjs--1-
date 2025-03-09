import { Spinner } from 'react-bootstrap';
import styled from 'styled-components';

const CustomSpinner = styled(Spinner)`
  border-width: 2px;
`;

function LoadingButtons() {
  return <CustomSpinner animation="border" size="sm" />;
}

export default LoadingButtons;
