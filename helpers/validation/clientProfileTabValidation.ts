import { CONSTANTS } from 'helpers/const/constants';
import { IFreelancerDetails } from 'helpers/types/freelancer.type';
import * as yup from 'yup';

export const clientProfileTabValidation = yup
  .object({
    first_name: yup
      .string()
      .required('Please enter first name')
      .min(2, 'First name must have more than one letter.'),
    last_name: yup
      .string()
      .required('Please enter last name')
      .min(2, 'Last name must have more than one letter.'),
    location: yup.object({
      country_name: yup.string().required('Please select your country'),
      country_short_name: yup.string(),
      state: yup.string().when('country_short_name', {
        is: (
          country_short_name: IFreelancerDetails['location']['country_short_name']
        ) =>
          !CONSTANTS.COUNTRIES_SHORT_NAME_WITHOUT_STATE.includes(
            country_short_name
          ),
        then: yup.string().required('Please select your state/region'),
        otherwise: yup.string().optional(),
      }),
    }),
  })
  .required();
