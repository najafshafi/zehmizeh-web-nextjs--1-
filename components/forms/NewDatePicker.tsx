import React from 'react';
import DatePicker from 'react-datepicker';
import styled from 'styled-components';
import CalendarIcon  from '@/public/icons/calendar.svg';
import 'react-datepicker/dist/react-datepicker.css';

const DateInputWrapper = styled.div<{ value?: string }>`
  padding: 1rem 0.8rem;
  border-radius: 7px;
  border: 1px solid lightgray;
  color: ${(props) => (props.value ? '#000' : 'lightgray')};
`;

const NewCustomDatePicker = (props) => {
  function range(start, stop, step) {
    const a = [start];
    let b = start;
    while (b < stop) {
      a.push((b += step || 1));
    }
    return b > stop ? a.slice(0, -1) : a;
  }

  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear + 1];
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return (
    <div>
      <DatePicker
        renderCustomHeader={({
          date,
          changeYear,
          changeMonth,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div
            style={{
              margin: 10,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                decreaseMonth();
              }}
              disabled={prevMonthButtonDisabled}
            >
              {'<'}
            </button>
            <select value={new Date(date).getFullYear()} onChange={({ target: { value } }) => changeYear(value)}>
              {years.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <select
              value={months[new Date(date).getMonth()]}
              onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
            >
              {months.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <button
              onClick={(e) => {
                e.preventDefault();
                increaseMonth();
              }}
              disabled={nextMonthButtonDisabled}
            >
              {'>'}
            </button>
          </div>
        )}
        customInput={React.createElement(CustomInput)}
        {...props}
      />
    </div>
  );
};

export default NewCustomDatePicker;

const CustomInput = ({
  value,
  placeholder,
  onClick,
  ref,
}: {
  value: string;
  placeholder?: string;
  onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  ref: any;
}) => (
  <DateInputWrapper
    className="date-input d-flex align-items-center justify-content-between pointer"
    onClick={onClick}
    ref={ref}
    value={value}
  >
    <div>{value || placeholder}</div>
    {value ? '' : <CalendarIcon />}
  </DateInputWrapper>
);
