import CustomDatePicker from "@/components/forms/DatePicker";
import {
  FormLabel,
  FormLabelSubText,
  OptionButtonWithSvg,
  PostForm,
} from "../postJob.styled";
import { usePostJobContext } from "../context";
import moment from "moment";
import { PROJECT_TIME_SCOPE_OPTIONS } from "@/helpers/const/projectTimeScopeOptions";
import { OptionButton } from "@/components/forms/OptionButton";
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
    <PostForm>
      {/* START ----------------------------------------- Delivery time */}
      <div className="form-group">
        <FormLabel>Delivery Time (Optional)</FormLabel>
        <FormLabelSubText>
          After hiring, how much time would the freelancer have to complete the
          project?
        </FormLabelSubText>
        <div className="d-flex align-items-center gap-2 flex-wrap mt-3">
          {CONSTANTS.DELIVERY_DATE_OPTIONS.map((item) => (
            <OptionButton
              selected={formData?.expected_delivery_date == item}
              key={item}
              onClick={() => setFormData({ expected_delivery_date: item })}
              margin="0"
              padding="1rem 1rem"
            >
              {item}
            </OptionButton>
          ))}
        </div>
      </div>
      {/* END ------------------------------------------- Delivery time */}

      {/* START ----------------------------------------- Expected hours */}
      <div className="form-group">
        <FormLabel>Expected Hours Required (Optional)</FormLabel>
        <FormLabelSubText>
          If you don't know how long your project should take, or if you expect
          it to continue for many weeks or months, select "Ongoing Project."
        </FormLabelSubText>
        <div className="d-flex">
          {PROJECT_TIME_SCOPE_OPTIONS.map((item) => (
            <OptionButtonWithSvg
              selected={formData?.time_scope == item.key}
              key={item.key}
              onClick={() => setFormData({ time_scope: item.key })}
            >
              {item.icon}
              <div>
                <div className="fs-1rem fw-400">{item.label}</div>
                <div className="description fw-400 text-start">
                  {item.description}
                </div>
              </div>
            </OptionButtonWithSvg>
          ))}
        </div>
      </div>
      {/* END ------------------------------------------- Expected hours */}

      {/* START ----------------------------------------- Due date */}
      <div className="form-group">
        <FormLabel className="mb-2">Due Date (Optional)</FormLabel>
        <NewCustomDatePicker
          id="due_date"
          placeholderText="Due Date"
          onChange={(value) =>
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
    </PostForm>
  );
};
