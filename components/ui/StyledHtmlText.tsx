import { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div<{ minLines: number }>`
  p {
    margin-bottom: 0px;
    word-break: break-word;
  }
  a {
    color: ${(props) => props.theme.colors.yellow};
  }
  .view-more-btn {
    color: #ffa700;
    display: inline;
    &:hover {
      font-weight: 390;
      color: #ffa700;
    }
  }
  .description {
    word-break: break-word;
    overflow: hidden;
    display: -webkit-box;
    font-size: 1.125rem; /* fallback */
    line-height: 1.8755rem;
    max-height: ${(props) => props.minLines * 3}rem; /* fallback */
    -webkit-line-clamp: ${(props) =>
      props.minLines}; /* number of lines to show */
    -webkit-box-orient: vertical;
  }
`;
type Props = {
  htmlString: string;
  needToBeShorten?: boolean;
  id?: string;
  className?: string;
  minLines?: number;
};

const StyledHtmlText = ({
  htmlString,
  needToBeShorten,
  id,
  className,
  minLines = 3,
}: Props) => {
  const [showViewMore, setShowViewMore] = useState<boolean>(false);
  const [viewMore, setViewMore] = useState<boolean>(false);

  function getLinesCount(element) {
    const prevLH = element.style.lineHeight;
    const factor = 1000;
    element.style.lineHeight = factor + 'px';

    const height = element.getBoundingClientRect().height;
    element.style.lineHeight = prevLH;

    return Math.floor(height / factor);
  }

  const formatDescription = useCallback(
    (htmlString: string) => {
      let element;
      if (id) {
        element = document.getElementById(id);
      } else {
        element = document.getElementById('htmlString');
      }
      if (element) {
        element.innerHTML = htmlString;
        const totalLines = getLinesCount(element);
        if (totalLines > minLines) {
          if (needToBeShorten) {
            setShowViewMore(true);
            element.classList.toggle('description');
          }
        } else {
          setShowViewMore(false);
        }
      }
    },
    [id, minLines, needToBeShorten]
  );

  useEffect(() => {
    if (htmlString) {
      const htmlStringFormatted = htmlString?.replace(/(<p>&nbsp;<\/p>)+$/, '');
      formatDescription(htmlStringFormatted);
    }
  }, [htmlString, id, needToBeShorten, formatDescription]);

  const toggleReadMore = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setViewMore(!viewMore);
    let element;
    if (id) {
      element = document.getElementById(id);
    } else {
      element = document.getElementById('htmlString');
    }
    element.classList.toggle('description');
  };

  return (
    <Wrapper className={className} minLines={minLines}>
      <span id={id || 'htmlString'}></span>
      {showViewMore == true && (
        <>
          <div
            className="view-more-btn pointer view-more-dark"
            onClick={toggleReadMore}
          >
            {!viewMore ? ' View all' : ' View less'}
          </div>
        </>
      )}
    </Wrapper>
  );
};

export default StyledHtmlText;
