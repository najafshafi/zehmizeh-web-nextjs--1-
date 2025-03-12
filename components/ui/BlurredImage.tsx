import { useState } from "react";
import styled from "styled-components";

type Props = {
  src: string;
  height: string;
  width: string;
  allowToUnblur?: boolean;
  className?: string;
  type?: string;
  overlayText?: string;
  overlayTextClassName?: string;
  state?: ReturnType<typeof useState<boolean>>;
};

const ImageWrapper = styled.div`
  position: relative;
  border-radius: 100%;
  overflow: hidden;
  .blurred-view {
    filter: blur(12px);
    background-color: rgba(255, 255, 255, 0.6);
  }
  .blurred-view-small {
    filter: blur(5px);
    background-color: rgba(255, 255, 255, 0.6);
  }
  img {
    border-radius: 100%;
    object-fit: cover;
    z-index: +1;
  }
  .overlay {
    position: absolute;
    top: 0;
    color: #fff;
    height: 100%;
    width: 100%;
  }
  .overlay-text {
    text-align: center;
  }
`;

const BlurredImage = ({
  src,
  height,
  width,
  allowToUnblur = true,
  className,
  type,
  overlayText,
  overlayTextClassName = "",
  state,
}: Props) => {
  const localState = useState<boolean>(false);

  // If state is passed from parent then state will be handled by parent
  // else it'll be handled locally
  const [isShowingImage, setIsShowingImage] = state || localState;

  const toggleBlur = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    if (allowToUnblur) {
      setIsShowingImage(!isShowingImage);
    }
  };

  return (
    <div className={className}>
      <ImageWrapper
        style={{ height: height, width: width }}
        onClick={toggleBlur}
        className="pointer"
      >
        <div
          className={
            !isShowingImage
              ? type === "small"
                ? "blurred-view-small"
                : "blurred-view"
              : ""
          }
          style={{ height: height, width: width }}
        >
          <img
            src={src}
            className="img"
            style={{ height: height, width: width }}
            alt="user-profile-img"
          />
        </div>

        {allowToUnblur && !isShowingImage && (
          <div className="overlay flex items-center justify-content-center">
            <div className={`overlay-text ${overlayTextClassName}`}>
              {overlayText ?? (
                <span>
                  Click to <br />
                  view
                </span>
              )}
            </div>
          </div>
        )}
      </ImageWrapper>
    </div>
  );
};

export default BlurredImage;
