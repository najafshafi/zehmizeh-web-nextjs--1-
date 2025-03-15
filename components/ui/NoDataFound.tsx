import styled from "styled-components";
import NoDataFoundIcon from "@/public/icons/nodatafound.svg";

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
      className={`flex flex-col justify-center items-center ${className}`}
    >
      <NoDataFoundIcon />

      <div className="description text-base font-normal text-center">
        {title || "No data found"}
      </div>
    </NoDataWrapper>
  );
};

export default NoDataFound;
