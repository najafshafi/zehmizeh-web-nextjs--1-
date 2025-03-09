import { useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { GridContainer, ImagePreviewWrapper, PortfolioBox } from './portfolioStyles';
import { Button } from 'react-bootstrap';
import { coverImgHandler, isAudio, isPDF, isVideo } from '@/helpers/utils/coverImgHandler';
import Image from 'next/image';

// const getItems = (count: any) =>
//   Array.from({ length: count }, (v, k) => k).map((k) => ({
//     id: `item-${k}`,
//     content: `item ${k}`,
//   }));

interface Props {
  files: string[] | any;
  onPosChange: (data: string[]) => void;
  allowEdit: boolean;
}

const PortfolioFiles = (props: Props) => {
  const [filesArr, setFilesArr] = useState(props.files);
  const [previewURL, setPreviewURL] = useState<string>();

  const onDragEnd = (result: any) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const newFileArr: any = reorder(filesArr, result.source.index, result.destination.index);

    setFilesArr(newFileArr);
    props.onPosChange(newFileArr);
  };

  const previewHandler = (val: string) => {
    setPreviewURL(val);
    document.body.style.overflow = val ? 'hidden' : 'unset';
  };

  // fake data generator

  // a little function to help us with reordering the result
  const reorder = (list: any, startIndex: any, endIndex: any) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal" key={'droppable-key'}>
          {(provided: any) => (
            <GridContainer ref={provided.innerRef} {...provided.droppableProps}>
              {filesArr.map((file: any) => (
                <>
                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <PortfolioBox onClick={() => previewHandler(file)} coverImage={coverImgHandler(file)}>
                      <div className="cover-img">
                        <div></div>
                      </div>
                    </PortfolioBox>
                  </div>
                </>
              ))}
            </GridContainer>
          )}
        </Droppable>
      </DragDropContext>

      {!!previewURL && (
        <ImagePreviewWrapper>
          <div className="img-previewer-background jjj" onClick={() => previewHandler('')}></div>

          {isPDF(previewURL) && <iframe src={previewURL} className="previewer-box-pdf" />}

          {isVideo(previewURL) && (
            <video controls src={previewURL} className="previewer-box image">
              This is video
            </video>
          )}

          {isAudio(previewURL) && (
            <audio controls src={previewURL} className="previewer-box h-25">
              This is audio
            </audio>
          )}

          {!isVideo(previewURL) && !isPDF(previewURL) && !isAudio(previewURL) && (
            <Image className="previewer-box image" alt='preview box' src={previewURL} 
            width={100}
            height={100}
            />
          )}

          <Button
            variant="transparent"
            className="close homepage-video-close-btn portfolio-close-btn"
            onClick={() => previewHandler('')}
          >
            &times;
          </Button>
        </ImagePreviewWrapper>
      )}
    </div>
  );
};

export default PortfolioFiles;
