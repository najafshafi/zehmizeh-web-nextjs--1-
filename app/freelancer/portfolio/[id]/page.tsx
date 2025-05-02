"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Spinner from "@/components/forms/Spin/Spinner";
import styled from "styled-components";
import BackButton from "@/components/ui/BackButton";
import { Wrapper } from "../portfolio-details.styled";
import { capitalizeFirstLetter } from "@/helpers/utils/misc";
import { isAudio, isPDF, isVideo } from "@/helpers/utils/coverImgHandler";
import usePortfolioDetails from "../controllers/usePortfolioDetails";
import VideoPortfolioItem from "../partials/VideoPortfolioItem";
import PortfolioListItem from "../partials/PortfolioListItem";

// Styled components
const Container = styled.div`
  margin-top: 110px;
  background-color: #fefbf4;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0px;
`;

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

const PortfolioDetailPage = () => {
  const params = useParams();
  // const pathname = usePathname();
  const portfolioId = params?.id as string;

  const { portfolioData, isLoading, isRefetching } = usePortfolioDetails(
    Number(portfolioId) || 0
  );

  const [previewURL, setPreviewURL] = useState<string>("");

  // Reset preview state when path changes
  // useEffect(() => {
  //   setPreviewURL("");
  // }, [pathname, portfolioId]);

  const previewHandler = (val: string) => {
    setPreviewURL(val);
    document.body.style.overflow = val ? "hidden" : "unset";
  };

  return (
    <Container>
      <Wrapper>
        <BackButton>{(isLoading || isRefetching) && <Spinner />}</BackButton>

        <ContentContainer>
          <PageHeading>
            <div className="text-[40px] font-normal my-4">
              {portfolioData?.project_name &&
                capitalizeFirstLetter(portfolioData?.project_name)}
            </div>
          </PageHeading>

          {isLoading || isRefetching ? (
            <div className="flex justify-center items-center h-60">
              <Spinner className="w-24 h-24 text-black" />
            </div>
          ) : (
            <GridContainer>
              {portfolioData?.image_urls?.map((item: string) => (
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
          )}
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
                <PreviewerBoxImage src={previewURL} alt="Portfolio preview" />
              )}

            <CloseButton onClick={() => previewHandler("")}>
              &times;
            </CloseButton>
          </ImagePreviewWrapper>
        )}
      </Wrapper>
    </Container>
  );
};

export default PortfolioDetailPage;
