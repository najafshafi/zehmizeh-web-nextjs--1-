import { CONSTANTS } from 'helpers/const/constants';
import { IClientDetails } from 'helpers/types/client.type';
import { isPossiblePhoneNumber } from 'react-phone-number-input';
import { object, string } from 'yup';

export const clientAccountProfileValidation = object({
  first_name: string().when({
    is: (exist) => exist !== undefined,
    then: string()
      .required('Please enter first name')
      .min(2, 'First name must have more than one letter.'),
    otherwise: string(),
  }),
  last_name: string().when({
    is: (exist) => exist !== undefined,
    then: string()
      .required('Please enter last name')
      .min(2, 'Last name must have more than one letter.'),
    otherwise: string(),
  }),
  formatted_phonenumber: string().when({
    is: (exist) => exist !== undefined,
    then: string().test(
      'phoneValidation',
      'Please enter a valid phone number',
      (phone) => isPossiblePhoneNumber(phone || '')
    ),
    otherwise: string(),
  }),
  location: object().when({
    is: (exist) => exist !== undefined,
    then: object({
      country_name: string().required('Please select your country'),
      country_short_name: string(),
      state: string().when('country_short_name', {
        is: (
          country_short_name: IClientDetails['location']['country_short_name']
        ) =>
          !CONSTANTS.COUNTRIES_SHORT_NAME_WITHOUT_STATE.includes(
            country_short_name
          ),
        then: string().required('Please select your state/region'),
        otherwise: string().optional(),
      }),
    }),
    otherwise: object(),
  }),
});
