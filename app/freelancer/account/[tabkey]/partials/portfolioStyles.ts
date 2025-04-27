import styled from "styled-components";
import { transition } from "@/styles/CssUtils";
export const MainPortfolioWrapper = styled.div`
  box-shadow: 0px 4px 60px rgba(0, 0, 0, 0.05);
  background: ${(props) => props.theme?.colors?.white || "#ffffff"};
  border-radius: 7px;
  padding: 2rem;
  margin-bottom: 2rem;
  h3 {
    color: rgb(0, 0, 0);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  .delete-btn {
    background-color: #fbf5e8;
    border-radius: 0.5rem;
    margin-left: 1rem;
    ${() => transition()}
  }
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  // grid-template-columns: fr auto;
  gap: 1rem;
`;

export const PortfolioBox = styled.div<{ coverImage: string }>`
  width: 100%;
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  cursor: pointer;
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

export const StyledPortfolioListItem = styled.div<{ coverImage: string }>`
  width: 100%;
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
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

export const PortSkillItem = styled.div`
  padding: 0.625rem 0.75rem;
  background: #f6f6f6;
  border-radius: 0.5rem;
  width: fit-content;
`;

export const Iframe = styled.iframe`
  width: 100%;
  border: 6px;
  border-radius: 6px;
  border: 1px solid #ddd;
`;

export const Video = styled.video`
  width: 100%;
  height: 100%;
  border-radius: 6px;
  border: 1px solid #ddd;
  object-fit: cover;
`;

export const ImagePreviewWrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  background: transparent;
  z-index: 20;
  .img-previewer-background {
    position: absolute;
    top: 0;
    left: 0;
  }

  .img-preview {
    width: 100%;
    height: 100%;
  }

  .img-previewer-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: #000000ad;
  }
  audio.previewer-box {
    height: 50px !important;
    top: 40vh;
    background: none;
  }
  audio + .portfolio-close-btn {
    top: 36vh;
  }
  .previewer-box {
    position: fixed;
    top: 10vh;
    left: 10%;
    width: 80%;
    height: auto;
    background: #dfdfdf;
    border-radius: 6px;
    overflow: hidden;
    max-height: 80vh;
  }

  .previewer-box-pdf {
    position: fixed;
    top: 10vh;
    left: 10%;
    width: 80%;
    height: 100%;
    background: #dfdfdf;
    border-radius: 6px;
    overflow: hidden;
    max-height: 80vh;
  }

  .previewer-box.image {
    object-fit: contain;
  }

  .portfolio-close-btn {
    position: absolute;
    color: white;
    top: 6vh;
    left: 89.5%;
  }
`;
