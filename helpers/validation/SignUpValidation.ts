import { CONSTANTS } from 'helpers/const/constants';
import * as yup from 'yup';

export const signUpValidationSchema = (location) =>
  yup
    .object({
      first_name: yup
        .string()
        .required('First name is required.')
        .min(3, 'First name must have more than 2 letters.')
        .matches(/^[A-Za-z ]*$/, 'Please enter valid first name'),
      last_name: yup
        .string()
        .required('Last name is required')
        .min(3, 'Last name must have more than 2 letters.')
        .matches(/^[A-Za-z ]*$/, 'Please enter valid last name'),
      is_agency: yup.string(),
      email_id: yup
        .string()
        .email('Must be a valid email.')
        .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Enter a valid email address')
        .required('Email is required'),
      user_type: yup.string().default('freelancer'),
      agency_name: yup.string(),
      phone_number: yup
        .string()
        .required('Phone number is required.')
        .min(11, 'Please enter a valid phone number.')
        .max(15, 'Please enter a valid phone number.'),
      country: yup.string().required('Country is required.'),
      state: yup.string().when('country_short_name', {
        is: () => !CONSTANTS.COUNTRIES_SHORT_NAME_WITHOUT_STATE.includes(location?.country_short_name),
        then: yup.string().required('State/region is required.'),
        otherwise: yup.string().optional(),
      }),
      password: yup
        .string()
        .required('Password is required.')
        .min(
          8,
          'Every password must include at least: 1 uppercase letter, 1 lowercase letter, 1 number, 1 symbol, and at least 8 characters'
        )
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*-?])[A-Za-z\d#$@!%&*-?]{8,30}$/,
          'Every password must include at least: 1 uppercase letter, 1 lowercase letter, 1 number, 1 symbol, and at least 8 characters'
        ),
      confirm: yup
        .string()
        .required('Password confirmation is required.')
        .oneOf(
          [yup.ref('password'), null],
          'The password for Confirm Password field and Password field must match with each other'
        ),
    })
    .required();
