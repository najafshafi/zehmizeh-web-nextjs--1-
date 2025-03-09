import styled from 'styled-components';
import  Info from "../../public/icons/info-circle-gray.svg";
import { useRef } from 'react';
import Tooltip from 'rc-tooltip';

const TooltipContent = styled.div`
  box-shadow: 0px 4px 22px rgba(0, 0, 0, 0.25);
  background: ${(props) => props.theme.colors.blue};
  padding: 0.5rem;
  text-align: left;
  max-width: 250px;
  font-size: 0.875rem;
  font-family: ${(props) => props.theme.font.primary};
  a {
    color: ${(props) => props.theme.colors.primary};
  }
`;
const Wrapper = styled.div`
  .title {
    padding: 0px !important;
  }
  .tooltip-inner {
    box-shadow: 0px 4px 22px rgba(0, 0, 0, 0.25);
    background: ${(props) => props.theme.colors.blue};
    padding: 1rem;
    text-align: left;
  }
`;

function UITooltip({
  title,
  customTrigger,
  className,
  children,
}: {
  title?: string;
  children?: React.ReactNode;
  customTrigger?: React.ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <Wrapper className={className} ref={containerRef}>
      <Tooltip
        placement="top"
        overlay={<TooltipContent>{children}</TooltipContent>}
        arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
      >
        <span className="title pointer d-block">
          {customTrigger ? (
            customTrigger
          ) : (
            <>
              {title ? title : ''} <Info />
            </>
          )}
        </span>
      </Tooltip>
    </Wrapper>
  );
}

export default UITooltip;
