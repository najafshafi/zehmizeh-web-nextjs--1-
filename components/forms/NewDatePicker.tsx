import React, { forwardRef } from "react";
import DatePicker from "react-datepicker";
import CalendarIcon from "@/public/icons/calendar.svg";
import "react-datepicker/dist/react-datepicker.css";

// Use generic type to allow all DatePicker props
const NewCustomDatePicker = (props: any) => {
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear + 1];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="w-full">
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
          <div className="w-full m-[10px] flex justify-center">
            <button
              onClick={(e) => {
                e.preventDefault();
                decreaseMonth();
              }}
              disabled={prevMonthButtonDisabled}
            >
              {"<"}
            </button>
            <select
              value={new Date(date).getFullYear()}
              onChange={({ target: { value } }) => changeYear(parseInt(value))}
            >
              {years.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <select
              value={months[new Date(date).getMonth()]}
              onChange={({ target: { value } }) =>
                changeMonth(months.indexOf(value))
              }
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
              {">"}
            </button>
          </div>
        )}
        customInput={<CustomInput />}
        {...props}
      />
    </div>
  );
};

export default NewCustomDatePicker;

interface CustomInputProps {
  value?: string;
  placeholder?: string;
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

const CustomInput = forwardRef<HTMLDivElement, CustomInputProps>(
  ({ value, placeholder, onClick }, ref) => (
    <div
      className={`date-input flex items-center justify-between cursor-pointer py-4 px-3 rounded-md border border-gray-300 ${
        value ? "text-black" : "text-gray-300"
      }`}
      onClick={onClick}
      ref={ref}
    >
      <div>{value || placeholder}</div>
      {value ? "" : <CalendarIcon />}
    </div>
  )
);

CustomInput.displayName = "CustomInput";
