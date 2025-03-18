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