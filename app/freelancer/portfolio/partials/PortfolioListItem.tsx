import { coverImgHandler } from "@/helpers/utils/coverImgHandler";
import styled from "styled-components";
import { transition } from "@/styles/CssUtils";

const StyledPortfolioListItem = styled.div<{ coverImage: string }>`
  border-radius: 0.5rem;
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.1) -2px 2px 6px 0px;
  .cover-img {
    border-radius: 0.5rem;
    background-image: ${(props) => `url(${props.coverImage})`};
    width: 100%;
    position: relative;
    aspect-ratio: 1;
    background-repeat: no-repeat;
    background-size: cover;
  }
  ${() => transition()}
`;

const PortfolioListItem = ({
  image,
  onClick,
}: {
  image: string;
  onClick: () => void;
}) => {
  return (
    <StyledPortfolioListItem
      coverImage={coverImgHandler(image)}
      className="pointer"
      onClick={onClick}
    >
      <div className="cover-img" />
    </StyledPortfolioListItem>
  );
};

export default PortfolioListItem;
