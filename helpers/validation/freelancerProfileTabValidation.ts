import { CONSTANTS } from "@/helpers/const/constants";
// import { IFreelancerDetails } from "@/helpers/types/freelancer.type";
import * as yup from "yup";

export const freelancerProfileTabValidation = yup
  .object({
    first_name: yup
      .string()
      .required("Please enter first name")
      .min(2, "First name must have more than one letter."),
    last_name: yup
      .string()
      .required("Please enter last name")
      .min(2, "Last name must have more than one letter."),
    hourly_rate: yup
      .number()
      .nullable()
      .typeError("Please enter a valid hourly rate")
      .min(5, "Hourly rate should be at least $5"),
    location: yup.object({
      country_name: yup.string().required("Please select your country"),
      country_short_name: yup.string(),
      state: yup.string().test({
        name: "stateValidation",
        message: "Please select your state/region",
        test: function (value) {
          const countryShortName = this.parent.country_short_name;
          const needsState =
            !CONSTANTS.COUNTRIES_SHORT_NAME_WITHOUT_STATE.includes(
              countryShortName
            );

          // If country requires state, then state is required
          if (needsState && !value) {
            return false;
          }

          // Otherwise, state is optional
          return true;
        },
      }),
    }),
  })
  .required();
