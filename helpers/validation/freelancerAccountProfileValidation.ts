import { CONSTANTS } from "@/helpers/const/constants";
// import { IFreelancerDetails } from "@/helpers/types/freelancer.type";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import { object, string } from "yup";

export const freelancerAccountProfileValidation = object({
  first_name: string().test({
    name: "first_name",
    test: function (value: string | undefined) {
      if (value === undefined) return true;
      if (!value)
        return this.createError({ message: "Please enter first name" });
      if (value.length < 2)
        return this.createError({
          message: "First name must have more than one letter.",
        });
      return true;
    },
  }),
  last_name: string().test({
    name: "last_name",
    test: function (value: string | undefined) {
      if (value === undefined) return true;
      if (!value)
        return this.createError({ message: "Please enter last name" });
      if (value.length < 2)
        return this.createError({
          message: "Last name must have more than one letter.",
        });
      return true;
    },
  }),
  formatted_phonenumber: string().test({
    name: "phoneValidation",
    test: function (value: string | undefined) {
      if (value === undefined) return true;
      return (
        isPossiblePhoneNumber(value || "") ||
        this.createError({ message: "Please enter a valid phone number" })
      );
    },
  }),
  location: object().test({
    name: "location",
    test: function (value: any) {
      if (value === undefined) return true;

      // Check country_name
      if (!value?.country_name) {
        return this.createError({
          message: "Please select your country",
          path: "location.country_name",
        });
      }

      // Check state if required based on country
      const countryShortName = value?.country_short_name;
      const needsState =
        !CONSTANTS.COUNTRIES_SHORT_NAME_WITHOUT_STATE.includes(
          countryShortName
        );

      if (needsState && !value?.state) {
        return this.createError({
          message: "Please select your state/region",
          path: "location.state",
        });
      }

      return true;
    },
  }),
});
