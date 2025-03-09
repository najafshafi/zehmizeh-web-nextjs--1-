import styled from 'styled-components';
import { ReactComponent as NoDataFoundIcon } from "../../public/icons/nodatafound.svg";

const NoDataWrapper = styled.div`
  .description {
    margin-top: 0rem;
  }
`;

interface Prop {
  className?: string;
  title?: string | JSX.Element;
}

const NoDataFound = ({ className, title }: Prop) => {
  return (
    <NoDataWrapper
      className={`d-flex flex-column justify-content-center align-items-center ${className}`}
    >
      <NoDataFoundIcon />

      <div className="description fs-16 fw-400 text-center">
        {title || 'No data found'}
      </div>
    </NoDataWrapper>
  );
};

export default NoDataFound;
