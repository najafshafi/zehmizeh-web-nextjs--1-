/*
 * This is the Hourly per week filter
 */

import React from 'react';
import TooltipSlider from '@/components/ui/TooltipSlider';
import { useSearchFilters } from '@/helpers/contexts/search-filter-context';
import { SliderWrapper } from '../Search.styled';

const HoursPerWeekFilter = () => {
  const { filters, updateFilters } = useSearchFilters();

  const [hoursPerWeek, setHoursPerWeek] = React.useState({
    min: 1,
    max: 10,
  });

  const afterChangeSliderValues = (e) => {
    const newHourlyRate = {
      min: e[0],
      max: e[1],
    };
    updateFilters('hours_per_week', newHourlyRate);
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
          placement: 'bottom',
          prefixCls: 'rc-slider-tooltip',
          overlayClassName: 'budget-tooltip',
          parentId: 'hpw-filter',
        }}
        tipFormatter={(value) => {
          return value;
        }}
        range
        className="gradiant-slider"
        value={[hoursPerWeek.min, hoursPerWeek.max]}
        onChange={(e) =>
          setHoursPerWeek({ ...hoursPerWeek, min: e[0], max: e[1] })
        }
        onAfterChange={afterChangeSliderValues}
        min={1}
        max={100}
      />
    </SliderWrapper>
  );
};

export default HoursPerWeekFilter;
