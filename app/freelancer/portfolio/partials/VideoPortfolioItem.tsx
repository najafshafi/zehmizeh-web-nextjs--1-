import { breakpoints } from "@/helpers/hooks/useResponsive";
import { coverImgHandler } from "@/helpers/utils/coverImgHandler";
import styled from "styled-components";
import { transition } from "@/styles/CssUtils";

const StyledVideoPortfolioItem = styled.div<{ coverImage: string }>`
  border-radius: 0.5rem;
  width: 100%;
  height: 100%;
  box-shadow: rgba(0, 0, 0, 0.1) -2px 2px 6px 0px;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  .cover-img {
    border-radius: 0.5rem;
    background-image: ${(props) => `url(${props.coverImage})`};
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    transition: all 0.3s ease;
    transform: translateY(0);
    opacity: 0.7;
  }

  .video-preview {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 1;
    object-fit: cover;
    z-index: -1;
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000;
  }

  @media ${breakpoints.mobile} {
    .video-preview {
      position: unset;
      width: auto;
    }
    .cover-img {
      width: 60%;
      margin: 0 auto;
    }
  }

  ${() => transition()}
`;

interface VideoPortfolioItemProps {
  image: string;
  onClick: () => void;
}

const VideoPortfolioItem = ({ image, onClick }: VideoPortfolioItemProps) => {
  return (
    <StyledVideoPortfolioItem
      coverImage={coverImgHandler(image)}
      onClick={onClick}
    >
      <video
        className="video-preview"
        src={image}
        muted
        autoPlay
        loop
        playsInline
        preload="auto"
      >
        Your browser does not support the video tag.
      </video>
      <div className="cover-img" />
    </StyledVideoPortfolioItem>
  );
};

export default VideoPortfolioItem;
