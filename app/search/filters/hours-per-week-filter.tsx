/*
 * This is the Hourly per week filter
 */

import React from "react";
import TooltipSlider from "@/components/ui/TooltipSlider";
import { useSearchFilters } from "@/helpers/contexts/search-filter-context";
import { SliderWrapper } from "./Filters.styled";

const HoursPerWeekFilter = () => {
  const { filters, updateFilters } = useSearchFilters();

  const [hoursPerWeek, setHoursPerWeek] = React.useState({
    min: 1,
    max: 10,
  });

  const afterChangeSliderValues = (e: number | number[]) => {
    // If e is an array, use it directly, otherwise create a default
    const values = Array.isArray(e) ? e : [1, 1];
    const newHourlyRate = {
      min: values[0],
      max: values[1],
    };
    updateFilters("hours_per_week", newHourlyRate);
  };

  React.useEffect(() => {
    setHoursPerWeek({
      min: filters?.hours_per_week?.min || 1,
      max: filters?.hours_per_week?.max || 1,
    });
  }, [filters]);

  return (
    <SliderWrapper>
      <TooltipSlider
        tipProps={{
          placement: "bottom",
          prefixCls: "rc-slider-tooltip",
          overlayClassName: "budget-tooltip",
          parentId: "hpw-filter",
        }}
        tipFormatter={(value) => {
          return value;
        }}
        range
        className="gradiant-slider"
        value={[hoursPerWeek.min, hoursPerWeek.max]}
        onChange={(e: number | number[]) => {
          // Handle both cases: single value or array
          const values = Array.isArray(e) ? e : [e, e];
          setHoursPerWeek({ ...hoursPerWeek, min: values[0], max: values[1] });
        }}
        onAfterChange={afterChangeSliderValues}
        min={1}
        max={100}
      />
    </SliderWrapper>
  );
};

export default HoursPerWeekFilter;
