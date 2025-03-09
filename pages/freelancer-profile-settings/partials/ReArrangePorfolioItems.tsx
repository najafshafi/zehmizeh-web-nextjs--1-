import { Modal, Button, Form } from 'react-bootstrap';
import { StyledModal } from '@/components/styled/StyledModal';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useState } from 'react';
import { GridContainer, PortfolioBox } from './portfolioStyles';
import { toast } from 'react-hot-toast';
import { addEditPortfolio } from '@/helpers/http/portfolio';

export const Wrapper = styled(Form)`
  .styled-form {
    margin-top: 1.25rem;
    .form-input {
      margin-top: 6px;
      padding: 1rem 1.25rem;
      border-radius: 7px;
      border: 1px solid ${(props) => props.theme.colors.gray6};
    }
  }
  .gray-labels {
    color: ${(props) => props.theme.colors.blue};
  }
  .max-count {
    color: ${(props) => props.theme.colors.gray8};
  }
`;

type Props = {
  show: boolean;
  onClose: () => void;
  onUpdate: () => void;
  portfolio: any;
  freelancerId: string;
  refetch: () => void;
};

const ReArrangePorfolioItems = (props: Props) => {
  const [filesArr, setFilesArr] = useState(props?.portfolio?.image_urls);
  const [loading, setloading] = useState(false);
  const { project_name } = props?.portfolio ?? {};

  // fake data generator

  // a little function to help us with reordering the result
  const reorder = (list: any, startIndex: any, endIndex: any) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const isPDF = (url: string) => url?.split('.').pop() === 'pdf';
  const isVideo = (url: string) => url?.split('.').pop() === 'mp4';
  const isAudio = (url: string) =>
    ['mp3', 'wav'].includes(url?.split('.').pop() || '');

  const coverImgHandler = (file: string) => {
    if (isPDF(file)) file = '/images/pdf-file.svg';
    if (isVideo(file)) file = '/images/video.png';
    if (isAudio(file)) file = '/images/audio.png';
    return file;
  };

  const updatedPorfolioHandler = (portFiles: any[]) => {
    const data = { ...props?.portfolio };
    const body: any = {
      action: 'edit_portfolio',
      portfolio_id: data.portfolio_id,
      project_name: data.project_name,
      project_year: data.project_year,
      project_description: data.project_description,
      project_skills: data.project_skills,
      image_urls: portFiles,
    };

    const promise = addEditPortfolio(body);
    setloading(true);
    toast.promise(promise, {
      loading: 'Please wait...',
      success: (res) => {
        setloading(false);
        return res.message;
      },
      error: (err) => {
        setloading(false);
        return err?.message || 'error';
      },
    });
  };

  const onDragEnd = (result: any) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const newFileArr: any = reorder(
      filesArr,
      result.source.index,
      result.destination.index
    );

    updatedPorfolioHandler(newFileArr);

    setFilesArr(newFileArr);
  };

  return (
    <StyledModal
      show={props.show}
      size="sm"
      onHide={() => props.onClose()}
      centered
    >
      <Modal.Body>
        <Button
          variant="transparent"
          className="close"
          onClick={() => props.onClose()}
        >
          &times;
        </Button>
        <Wrapper>
          <h2 style={{ marginBottom: '2rem' }} className="line-break">
            {project_name}
          </h2>
          <div>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable
                droppableId="droppable"
                direction="horizontal"
                key={'droppable-key'}
              >
                {(provided: any) => (
                  <GridContainer
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {filesArr.map((file: any, index: number) => (
                      <Draggable
                        isDragDisabled={loading}
                        key={`drag-key-${index + 1}`}
                        draggableId={`drag-id-${index + 1}`}
                        index={index}
                      >
                        {(provided: any) => (
                          <>
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <PortfolioBox coverImage={coverImgHandler(file)}>
                                <div className="cover-img"></div>
                              </PortfolioBox>
                            </div>
                          </>
                        )}
                      </Draggable>
                    ))}
                  </GridContainer>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </Wrapper>
      </Modal.Body>
    </StyledModal>
  );
};

export default ReArrangePorfolioItems;
