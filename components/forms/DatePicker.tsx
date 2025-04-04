// "use client";

// import React from "react";
// import { Dayjs } from "dayjs";
// import { TextField } from "@mui/material";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { CalendarIcon } from "lucide-react";

// interface CustomDatePickerProps {
//   selected?: Dayjs | null;
//   onChange: (date: Dayjs | null) => void;
//   placeholderText?: string;
// }

// const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
//   selected,
//   onChange,
//   placeholderText = "Select date",
// }) => {
//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <DatePicker
//         value={selected || null}
//         onChange={onChange}
//         views={["year", "month", "day"]}
//         slots={{
//           textField: ({ inputRef, inputProps }) => (
//             <div className="relative w-full">
//               <TextField
//                 {...inputProps}
//                 inputRef={inputRef}
//                 placeholder={placeholderText}
//                 fullWidth
//                 className="border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 p-2"
//               />
//               <div className="absolute right-3 top-3 text-gray-500 cursor-pointer">
//                 <CalendarIcon size={20} />
//               </div>
//             </div>
//           ),
//         }}
//       />
//     </LocalizationProvider>
//   );
// };

// export default CustomDatePicker;

import React from "react";
import DatePicker from "react-datepicker";
import CalendarIcon from "@/public/icons/calendar.svg";
import "react-datepicker/dist/react-datepicker.css";

type DatePickerProps = React.ComponentProps<typeof DatePicker>;

interface CustomDatePickerProps
  extends Omit<DatePickerProps, "customInput" | "onChange"> {
  selected?: Date | null;
  onChange: (
    date: Date[] | null,
    event?:
      | React.MouseEvent<HTMLElement, MouseEvent>
      | React.KeyboardEvent<HTMLElement>
  ) => void;
  placeholderText?: string;
}

interface CustomInputProps {
  value: string;
  placeholder?: string;
  onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  ref: React.RefObject<HTMLDivElement>;
}

const CustomInput: React.FC<CustomInputProps> = ({
  value,
  placeholder,
  onClick,
  ref,
}) => (
  <div
    className={`flex items-center justify-between cursor-pointer p-4 rounded-lg border border-gray-300 ${
      value ? "text-black" : "text-gray-300"
    }`}
    onClick={onClick}
    ref={ref}
  >
    <div>{value || placeholder}</div>
    {!value && <CalendarIcon />}
  </div>
);

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  selected,
  onChange,
  placeholderText,
  ...restProps
}) => {
  function range(start: number, stop: number, step: number = 1): number[] {
    const a = [start];
    let b = start;
    while (b < stop) {
      a.push((b += step));
    }
    return b > stop ? a.slice(0, -1) : a;
  }

  const years = range(1940, new Date().getFullYear(), 1);
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
    <div>
      <DatePicker
        selected={selected}
        onChange={onChange}
        placeholderText={placeholderText}
        renderCustomHeader={({
          date,
          changeYear,
          changeMonth,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className="flex justify-center m-2.5">
            <button
              onClick={(e) => {
                e.preventDefault();
                decreaseMonth();
              }}
              disabled={prevMonthButtonDisabled}
              className="px-2 py-1 mx-1 border rounded hover:bg-gray-100 disabled:opacity-50"
            >
              {"<"}
            </button>
            <select
              value={new Date(date).getFullYear()}
              onChange={({ target: { value } }) => changeYear(Number(value))}
              className="px-2 py-1 mx-1 border rounded"
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
              className="px-2 py-1 mx-1 border rounded"
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
              className="px-2 py-1 mx-1 border rounded hover:bg-gray-100 disabled:opacity-50"
            >
              {">"}
            </button>
          </div>
        )}
        customInput={React.createElement(CustomInput)}
        {...(restProps as any)}
      />
    </div>
  );
};

export default CustomDatePicker;
