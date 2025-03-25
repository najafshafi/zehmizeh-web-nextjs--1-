"use client";
import { useEffect, useState, useRef } from "react";
import styled from "styled-components";

// CSS for the description class that can't be easily converted to Tailwind
// due to dynamic property calculation and -webkit specific properties
const DescriptionStyled = styled.div<{ $minlines: number }>`
  &.description {
    word-break: break-word;
    overflow: hidden;
    display: -webkit-box;
    font-size: 1.125rem;
    line-height: 1.75rem;
    max-height: ${(props) => props.$minlines * 1.75}rem;
    -webkit-line-clamp: ${(props) => props.$minlines};
    -webkit-box-orient: vertical;
  }

  p {
    margin-bottom: 0px;
    word-break: break-word;
  }

  a {
    color: ${(props) => props.theme.colors.yellow};
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
      const truncHeight = element.clientHeight;

      // If content is truncated (full height > truncated height), show the button
      if (fullHeight > truncHeight + 2) {
        // Reduced buffer to detect smaller truncations
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
    <div className={`relative ${className}`}>
      <div className="relative">
        <DescriptionStyled
          ref={contentRef}
          id={id || "htmlString"}
          className={needToBeShorten ? "description" : ""}
          $minlines={minlines}
          dangerouslySetInnerHTML={{ __html: htmlString || "" }}
        />
      </div>

      {showViewMore && (
        <div
          className="inline-block mt-3 py-1 text-[#ffa700] font-medium cursor-pointer hover:font-normal view-more-dark"
          onClick={toggleReadMore}
        >
          {!viewMore ? "View all" : "View less"}
        </div>
      )}
    </div>
  );
};

export default StyledHtmlText;
