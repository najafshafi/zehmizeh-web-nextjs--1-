"use client";

import { usePostJobContext } from "../context";
import moment from "moment";
import { PROJECT_TIME_SCOPE_OPTIONS } from "@/helpers/const/projectTimeScopeOptions";
import { CONSTANTS } from "@/helpers/const/constants";
import { FooterButtons } from "../partials/FooterButtons";
import ErrorMessage from "@/components/ui/ErrorMessage";
import useResponsive from "@/helpers/hooks/useResponsive";
import NewCustomDatePicker from "@/components/forms/NewDatePicker";

export const ProjectTiming = () => {
  const { isMobile } = useResponsive();
  const { formData, setFormData, errors } = usePostJobContext();

  const isDateSelectable = (date: Date) => date >= new Date();

  return (
    <div className="flex flex-col space-y-6">
      {/* START ----------------------------------------- Delivery time */}
      <div className="mb-6">
        <label className="block text-base font-bold mb-1 text-left">
          Delivery Time (Optional)
        </label>
        <span className="block text-sm text-gray-600 mb-2 text-left">
          After hiring, how much time would the freelancer have to complete the
          project?
        </span>
        <div className="flex items-center gap-2 flex-wrap mt-3">
          {CONSTANTS.DELIVERY_DATE_OPTIONS.map((item) => (
            <button
              className={`py-4 px-4 rounded-xl border  transition-all duration-200 ${
                formData?.expected_delivery_date === item
                  ? "text-black border  border-black"
                  : ""
              }`}
              key={item}
              onClick={() => setFormData({ expected_delivery_date: item })}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      {/* END ------------------------------------------- Delivery time */}

      {/* START ----------------------------------------- Expected hours */}
      <div className="mb-6">
        <label className="block text-base font-bold mb-1 text-left">
          Expected Hours Required (Optional)
        </label>
        <span className="block text-sm text-gray-600 mb-2 text-left">
          If you don&apos;t know how long your project should take, or if you
          expect it to continue for many weeks or months, select &quot;Ongoing
          Project.&quot;
        </span>
        <div className="flex flex-row gap-2 mt-3">
          {PROJECT_TIME_SCOPE_OPTIONS.map((item) => (
            <button
              className={`flex items-start w-full max-w-[200px] p-1 rounded-md border transition-all duration-200 ${
                formData?.time_scope === item.key ? "border-black" : ""
              }`}
              key={item.key}
              onClick={() => setFormData({ time_scope: item.key })}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-center items-center">
                <div className="ml-1 mt-2">{item.icon}</div>
                <div className="flex flex-col justify-start items-start ml-2">
                  <div className="text-base font-normal">{item.label}</div>
                  <div className="text-sm font-normal text-left text-gray-600">
                    {item.description}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* END ------------------------------------------- Expected hours */}

      {/* START ----------------------------------------- Due date */}
      <div className="mb-6">
        <label className="block text-base font-bold mb-2 text-left">
          Due Date (Optional)
        </label>
        <NewCustomDatePicker
          id="due_date"
          placeholderText="Due Date"
          onChange={(value: Date | null) =>
            setFormData({ due_date: value ? moment(value).toISOString() : "" })
          }
          selected={formData?.due_date && new Date(formData?.due_date)}
          minDate={new Date()}
          format="YYYY-MM-DD"
          maxDate={
            new Date(moment().add(3, "years").toISOString().split("T")[0])
          }
          isClearable={!!formData?.due_date}
          filterDate={isDateSelectable}
          popperPlacement={isMobile ? "top-start" : "bottom-start"}
        />

        {errors?.due_date && <ErrorMessage message={errors.due_date} />}
      </div>
      {/* END ------------------------------------------- Due date */}
      <FooterButtons />
    </div>
  );
};
