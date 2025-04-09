import { useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import BackButton from "@/components/ui/BackButton";
import usePortfolioDetails from "./controllers/usePortfolioDetails";
import PortfolioListItem from "./partials/PortfolioListItem";
import { Wrapper } from "./portfolio-details.styled";
import { capitalizeFirstLetter } from "@/helpers/utils/misc";
import { isAudio, isPDF, isVideo } from "@/helpers/utils/coverImgHandler";
import VideoPortfolioItem from "./partials/VideoPortfolioItem";

// Styled components
const PageHeading = styled.h1`
  text-align: center;
  font-weight: 400;
  margin: 2rem 0;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const GridItem = styled.div`
  margin-bottom: 1.5rem;
`;

const ContentContainer = styled.div`
  margin-top: 2rem;
`;

const ImagePreviewWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ImagePreviewBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  cursor: pointer;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  color: white;
  font-size: 2.5rem;
  border: none;
  cursor: pointer;
  z-index: 1001;
`;

const PreviewerBoxPDF = styled.iframe`
  max-width: 90%;
  max-height: 90%;
  background: white;
  z-index: 1001;
`;

const PreviewerBoxImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  z-index: 1001;
`;

const PreviewerBoxVideo = styled.video`
  max-width: 90%;
  max-height: 90%;
  z-index: 1001;
`;

const PreviewerBoxAudio = styled.audio`
  max-width: 90%;
  height: 25%;
  z-index: 1001;
`;

const CustomSpinner = styled.span`
  margin-left: 0.25rem;
`;

const PortfolioDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { portfolioData, isLoading, isRefetching } = usePortfolioDetails(
    Number(id) || 0
  );

  const [previewURL, setPreviewURL] = useState<string>();

  const previewHandler = (val: string) => {
    setPreviewURL(val);
    document.body.style.overflow = val ? "hidden" : "unset";
  };

  return (
    <Wrapper>
      <BackButton>
        {(isLoading || isRefetching) && (
          <CustomSpinner className="ms-1">⊚</CustomSpinner>
        )}
      </BackButton>

      <ContentContainer>
        <PageHeading>
          {portfolioData?.project_name &&
            capitalizeFirstLetter(portfolioData?.project_name)}
        </PageHeading>

        <GridContainer>
          {!isLoading &&
            !isRefetching &&
            portfolioData?.image_urls?.map((item: string) => (
              <GridItem key={item}>
                {isVideo(item) ? (
                  <VideoPortfolioItem
                    image={item}
                    onClick={() => previewHandler(item)}
                  />
                ) : (
                  <PortfolioListItem
                    image={item}
                    onClick={() => previewHandler(item)}
                  />
                )}
              </GridItem>
            ))}
        </GridContainer>
      </ContentContainer>

      {!!previewURL && (
        <ImagePreviewWrapper>
          <ImagePreviewBackground onClick={() => previewHandler("")} />

          {isPDF(previewURL) && <PreviewerBoxPDF src={previewURL} />}

          {isVideo(previewURL) && (
            <PreviewerBoxVideo controls src={previewURL}>
              This is video
            </PreviewerBoxVideo>
          )}

          {isAudio(previewURL) && (
            <PreviewerBoxAudio controls src={previewURL}>
              This is audio
            </PreviewerBoxAudio>
          )}

          {!isVideo(previewURL) &&
            !isPDF(previewURL) &&
            !isAudio(previewURL) && (
              <PreviewerBoxImage src={previewURL} alt="Preview" />
            )}

          <CloseButton onClick={() => previewHandler("")}>&times;</CloseButton>
        </ImagePreviewWrapper>
      )}
    </Wrapper>
  );
};

export default PortfolioDetails;
