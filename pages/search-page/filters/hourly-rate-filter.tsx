/*
 * This is the Hourly rate filter
 */

import { useState } from 'react';
import { Form } from 'react-bootstrap';
import Checkbox from '@/components/forms/Checkbox';
import { SliderWrapper } from '../Search.styled';
import { useSearchFilters } from '@/helpers/contexts/search-filter-context';
import { HourlyFilter } from '@/helpers/types/filter.type';

const HourlyRateFilter = () => {
  const { updateFilterHandler, filters } = useSearchFilters();

  const [hourlyRateCheck, setHourtlyCheck] = useState<HourlyFilter>({
    min: false,
    max: false,
  });

  const isValidNumber = (e: any) => {
    const re = /^[0-9\b]+$/;
    const value = e.target.value;
    if (value === '' || re.test(value)) {
      return true;
    } else {
      return false;
    }
  };

  const onChange = (data, key) => {
    if (['min', 'max'].includes(key) && !isValidNumber(data)) {
      data.target.value = '';
      return data;
    }

    const payload = { ...filters.hourly_rate };

    if (key === 'isNAChecked') {
      if (data) payload[key] = data;
      else delete payload[key];
    } else {
      if (isValidNumber(data) && data.target.value !== '')
        payload[key] = data.target.value;
      else delete payload[key];
    }
    updateFilterHandler('hourly_rate', payload);
  };

  const hourlyRateCheckHandler = (flag: string, value: boolean) => {
    setHourtlyCheck({ ...hourlyRateCheck, [flag]: value });
    if (!value) onChange({ target: { value: '' } }, flag);
  };

  return (
    <SliderWrapper>
      <div className="mt-4 d-flex flex-column align-items-left justify-content-start">
        {/* Max Amount */}
        <div className="filter__checkbox__row__first d-flex align-items-center mb-3">
          <Checkbox
            checked={hourlyRateCheck.max}
            toggle={(e) => hourlyRateCheckHandler('max', e.target.checked)}
          />{' '}
          <div className="checkbox-label fs-1rem fw-400 text-capitalize">
            Max Amount
          </div>
        </div>

        {hourlyRateCheck.max && (
          <span className="input-symbol-euro mb-2">
            <Form.Control
              placeholder="Amount"
              value={filters.hourly_rate.max ?? ''}
              onChange={(e) => onChange(e, 'max')}
              className="budget-input"
              maxLength={3}
            />
          </span>
        )}

        <div className="mb-3">
          <div className="filter__checkbox__row__first d-flex align-items-center">
            <Checkbox
              checked={hourlyRateCheck.min}
              toggle={(e) => hourlyRateCheckHandler('min', e.target.checked)}
            />{' '}
            <div className="checkbox-label fs-1rem fw-400 text-capitalize">
              Min Amount
            </div>
          </div>
          {hourlyRateCheck.min && (
            <span className="input-symbol-euro mt-2 d-block">
              <Form.Control
                placeholder="Min Amount"
                value={filters.hourly_rate.min ?? ''}
                onChange={(e) => onChange(e, 'min')}
                className="budget-input"
                maxLength={3}
              />
            </span>
          )}
        </div>

        {/* N/A Checkbox */}
        <div className="filter__checkbox__row__first d-flex align-items-center">
          <Checkbox
            checked={filters.hourly_rate.isNAChecked}
            toggle={(e) => onChange(e.target.checked, 'isNAChecked')}
          />{' '}
          <div className="checkbox-label fs-1rem fw-400 text-capitalize">
            No Rate Listed
          </div>
        </div>
      </div>
    </SliderWrapper>
  );
};

export default HourlyRateFilter;
