import { pxToRem } from "@/helpers/utils/misc";
import styled from "styled-components";
import React from "react";

const Wrapper = styled.div<{
  align: string;
}>`
  max-width: 600px;
  .section-top {
    color: ${({ theme }) => theme.colors.blue};
    font-family: ${({ theme }) => theme.font.secondary};
    font-size: 1.5rem;
    font-weight: 400;
    /* font-style: italic; */
  }
  .section-heading {
    font-size: ${pxToRem(50)};
    font-weight: 400;
    margin-top: 0.5rem;
  }
  p.section-description {
    font-size: ${pxToRem(22)};
    color: ${({ theme }) => theme.colors.grey1};
    font-weight: 300;
    /* margin-top: 0.5rem; */
  }
  ${(props) =>
    props.align === "center" ? "margin: 0 auto; text-align:center;" : ""}
`;

interface SectionHeadingProps {
  top?: React.ReactNode;
  heading?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  align: string;
}

function SectionHeading({
  top,
  heading,
  description,
  className,
  align = "left",
}: SectionHeadingProps) {
  return (
    <Wrapper align={align} className={className}>
      {!!top && <div className="section-top">{top}</div>}
      {!!heading && <h2 className="section-heading">{heading}</h2>}
      {!!description && (
        <p className="section-description mt-4">{description}</p>
      )}
    </Wrapper>
  );
}

export default SectionHeading;
