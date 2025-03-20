import React, { useCallback, useEffect, useState } from "react";
import ChevronUp from "@/public/icons/chevronUp.svg";
import ChevronDown from "@/public/icons/chevronDown.svg";
import {
  AccordionHeader,
  HeaderText,
  DetailsView,
  AccordionWrapper,
} from "./styled";
import { useSearchFilters } from "@/helpers/contexts/search-filter-context";

interface Props {
  title: string;
  details: React.ReactNode;
  defaultExpand?: boolean;
}

function AccordionView({ title, details, defaultExpand }: Props) {
  const { isFilterApplied } = useSearchFilters();
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const onToggle = useCallback(() => {
    setShowDetails((details) => !details);
  }, []);

  useEffect(() => {
    setShowDetails(Boolean(defaultExpand));
  }, [defaultExpand]);

  useEffect(() => {
    if (!isFilterApplied && defaultExpand === false) {
      setShowDetails(false);
    }
  }, [isFilterApplied]);

  return (
    <AccordionWrapper>
      <AccordionHeader
        onClick={onToggle}
        style={!showDetails ? { marginBottom: 0 } : {}}
      >
        <HeaderText className="fw-400 fs-1rem">{title}</HeaderText>
        {!showDetails ? <ChevronDown /> : <ChevronUp />}
      </AccordionHeader>
      {showDetails && <DetailsView>{details ? details : null}</DetailsView>}
    </AccordionWrapper>
  );
}

export default AccordionView;
