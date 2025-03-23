"use client";
import { useEffect, useState, useRef } from "react";
import styled from "styled-components";

const Wrapper = styled.div<{ $minlines: number }>`
  position: relative;
  p {
    margin-bottom: 0px;
    word-break: break-word;
  }
  a {
    color: ${(props) => props.theme.colors.yellow};
  }
  .view-more-btn {
    color: #ffa700;
    display: inline-block;
    margin-top: 0.75rem;
    padding: 0.25rem 0;
    font-weight: 500;
    cursor: pointer;
    &:hover {
      font-weight: 400;
      color: #ffa700;
    }
  }
  .content-wrapper {
    position: relative;
  }
  .description {
    word-break: break-word;
    overflow: hidden;
    display: -webkit-box;
    font-size: 1.125rem; /* fallback */
    line-height: 1.8755rem;
    max-height: ${(props) => props.$minlines * 3}rem; /* fallback */
    -webkit-line-clamp: ${(props) =>
      props.$minlines}; /* number of lines to show */
    -webkit-box-orient: vertical;
  }
`;

type Props = {
  htmlString: string;
  needToBeShorten?: boolean;
  id?: string;
  className?: string;
  minlines?: number;
};

const StyledHtmlText = ({
  htmlString,
  needToBeShorten = true,
  id,
  className,
  minlines = 3,
}: Props) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [showViewMore, setShowViewMore] = useState<boolean>(false);
  const [viewMore, setViewMore] = useState<boolean>(false);

  // Calculate if we need to show "View more" button
  useEffect(() => {
    if (!htmlString || !needToBeShorten) return;

    const timer = setTimeout(() => {
      const element = contentRef.current;
      if (!element) return;

      // Force the element to show all content temporarily to measure full height
      element.classList.remove("description");
      const fullHeight = element.scrollHeight;

      // Add the description class back to truncate, then measure truncated height
      element.classList.add("description");
      const truncHeight = element.scrollHeight;

      // If content is truncated (full height > truncated height), show the button
      if (fullHeight > truncHeight + 5) {
        // Add small buffer for calculation errors
        setShowViewMore(true);
      } else {
        setShowViewMore(false);
        element.classList.remove("description"); // If not truncated, show all content
      }
    }, 100); // Longer timeout to ensure content is rendered

    return () => clearTimeout(timer);
  }, [htmlString, needToBeShorten]);

  const toggleReadMore = (e: React.MouseEvent) => {
    e.preventDefault();
    setViewMore(!viewMore);

    const element = contentRef.current;
    if (element) {
      if (viewMore) {
        // Currently expanded, so collapse
        element.classList.add("description");
      } else {
        // Currently collapsed, so expand
        element.classList.remove("description");
      }
    }
  };

  return (
    <Wrapper className={className} $minlines={minlines}>
      <div className="content-wrapper">
        <div
          ref={contentRef}
          id={id || "htmlString"}
          className={needToBeShorten ? "description" : ""}
          dangerouslySetInnerHTML={{ __html: htmlString || "" }}
        />
      </div>

      {showViewMore && (
        <div className="view-more-btn view-more-dark" onClick={toggleReadMore}>
          {!viewMore ? "View all" : "View less"}
        </div>
      )}
    </Wrapper>
  );
};

export default StyledHtmlText;
