import { Button } from "react-bootstrap";
import styled from "styled-components";
import "./style.css";
import { useState } from "react";
import Image from "next/image";
import { CSSProperties } from "react";

interface ShowProp {
  show: boolean;
}

const MainViewBox = styled.div`
  position: relative;
  border: 18px solid #f0f0f0;
  border-radius: 0.5rem;
  z-index: 10;
  min-height: 340px;
`;

const ViewImageBox = styled.div<ShowProp>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  ${({ show }) =>
    show &&
    `
  opacity: 0;
  pointer-events: none;
  `}
  .play-icon {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    transition: all 0.2s ease-in-out;
  }
`;

const Video = styled.video<ShowProp>`
  opacity: 0;
  display: block;
  ${(props) =>
    !props.show &&
    `
    pointer-events: none;
`}
`;

const videoTagStyle: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "fill",
  aspectRatio: 1 / 1,
};

type Props = {
  videosrc: string;
};

const logoStyle: CSSProperties = {
  margin: "auto",
  width: "8rem",
  height: "8rem",
  position: "absolute",
  top: "45%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const TopBorder = styled.div`
  background: #f0f0f085;
  position: absolute;
  top: -17px;
  left: 0;
  width: 100%;
  height: 18px;
  z-index: 10;
`;

const BottomBorder = styled.div`
  background: #f0f0f085;
  position: absolute;
  bottom: -17px;
  left: 0;
  width: 100%;
  height: 18px;
  z-index: 10;
`;

const closeButtonStyle: CSSProperties = {
  position: "absolute",
  top: "-26px",
  right: "-26px",
  zIndex: 9999,
};

export const VideoComponent = ({ videosrc }: Props) => {
  const [show, setShow] = useState(false);

  return (
    <MainViewBox>
      <TopBorder />
      <BottomBorder />
      <Video
        show={show}
        width="100%"
        height="100%"
        autoPlay
        controls
        // src={HOME_PAGE_VIDEO}
      />

      {show && (
        <video
          width="100%"
          height="100%"
          autoPlay
          controls
          src={videosrc}
          style={videoTagStyle}
        />
      )}

      {show && (
        <Button
          style={closeButtonStyle}
          variant="transparent"
          className="close homepage-video-close-btn"
          onClick={() => {
            setShow(false);
          }}
        >
          &times;
        </Button>
      )}

      <ViewImageBox show={show}>
        {/* <Logo style={logoStyle} /> */}
        <Image
          src="/images/home-play-icon.svg"
          className="play-icon pointer"
          alt="play-icon"
          width={100}
          height={100}
          onClick={() => {
            setShow(true);
          }}
        />
      </ViewImageBox>
    </MainViewBox>
  );
};
