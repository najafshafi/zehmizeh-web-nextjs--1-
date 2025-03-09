import * as yup from 'yup';
import { getCountries } from 'helpers/http/common';
import { getPlainText } from 'helpers/utils/misc';

/**
 * Yup schema to validate address details form
 */
export const validatePostJobStepOne = yup
  .object({
    job_title: yup.string().required('Project title is required'),
    job_description: yup
      .string()
      .min(50, 'The project description must be at least 50 characters.')
      .max(5000, 'The character maximum is 5000.')
      .required('Project description is required'),
  })
  .required();

export const validatePostJobStepThree = yup
  .object({
    job_title: yup.string().required('Project title is required'),
    job_description: yup.string().required('Project description is required'),
    // skills: yup
    //   .array()
    //   .min(1, 'Please add at least one skill')
    //   .required('Please add at least one skill'),
    // languages: yup
    //   .array()
    //   .min(1, 'Please add at least one language.')
    //   .required('Please add at least one language.'),
  })
  .required();

export const validateProposal = yup
  .object({
    costOrHourlyRate: yup
      .number()
      .required()
      .test('Is positive?', 'Please enter a number greater than 0', (value) => value > 0)
      .test({
        name: 'greater than 5',
        test: function (value, context) {
          if (value < 5) {
            return this.createError({
              message: `${
                context.parent.isHourlyJob ? 'Hourly rate must be at least $5.' : 'Project fee must be at least $5.'
              }`,
            });
          } else {
            return true;
          }
        },
      })
      .typeError('Please enter a valid number value'),
    estimation: yup.object({ number: yup.string(), duration: yup.string() }).test({
      message: 'Please enter a valid estimation',
      test: (value) => !!value.duration === !!value.number,
    }),
    proposalMessage: yup
      .string()
      .required('Please enter your proposal')
      .test({
        message: 'Maximum 2000 characters are allowed',
        test: (value) => getPlainText(value).length <= 2000,
      }),
    termsAndConditions: yup
      .string()
      .optional()
      .test({
        message: 'Maximum 2000 characters are allowed',
        test: (value) => getPlainText(value).length <= 2000,
      }),
    questions: yup
      .string()
      .optional()
      .test({
        message: 'Maximum 2000 characters are allowed',
        test: (value) => getPlainText(value).length <= 2000,
      }),
  })
  .required();

export const validateEducation = yup
  .object({
    degreeName: yup.string().required('Please enter degree name'),
    university: yup.string().required('Please enter university'),
    from: yup.lazy((value) => {
      // Validating value only if user entered some value
      if (value !== '') {
        return yup
          .number()
          .max(new Date().getFullYear(), 'Start year cannot be in future')
          .required()
          .test('Is positive?', 'Please enter a valid 4 digit year', (value) => value?.toString().length == 4)
          .typeError('Please enter a valid 4 digit year');
      }
      return yup.mixed().notRequired();
    }),
    to: yup.lazy((value) => {
      // Validating value only if user entered some value
      if (value !== '') {
        return yup
          .number()
          .required()
          .test('Is positive?', 'Please enter a valid 4 digit year', (value) => value?.toString().length == 4)
          .min(yup.ref('from'), 'To (year) must be greater then from (year)')
          .typeError('Please enter a valid 4 digit year');
      }
      return yup.mixed().notRequired();
    }),
  })
  .required();

export const validateCourse = yup
  .object({
    course_name: yup.string().required('Please enter course name'),
    school_name: yup.string().required('Please enter from where did you do course'),
  })
  .required();

export const validateDispute = yup
  .object({
    selectedPeojectId: yup.string().nullable().required('Please select a project.'),
    selectedMilestoneId: yup.string().nullable().required('Please select a milestone'),
    description: yup.string().required('Please enter a description.'),
  })
  .required();

export const validateGeneralInquiryForm = yup
  .object({
    subject: yup.string().required('Please enter a subject'),
    description: yup.string().required('Please enter a description.'),
  })
  .required();

export const validateAccountDetails = yup
  .object({
    accountHolderName: yup.string().required('Please enter the account holder name'),
    accountNumber: yup
      .string()
      .required('Please enter the account number')
      .typeError('Please enter a valid account number'),
    routingNumber: yup.string().notRequired(),
  })
  .required();

export const validateAccountDetailsWithRouting = yup
  .object({
    accountHolderName: yup.string().required('Please enter the account holder name'),
    accountNumber: yup
      .string()
      .required('Please enter the account number')
      .typeError('Please enter a valid account number'),
    routingNumber: yup
      .string()
      .required('Please enter the routing number')
      .typeError('Please enter a valid routing number'),
  })
  .required();

export const validatePhoneNumber = (number: string) => {
  if (!number) return 'Phone number is required.';
  if (number.length < 11) {
    return 'Please enter a valid phone number.';
  }
  if (number.length > 15) {
    return 'Please enter a valid phone number.';
  }
  return null;
};

export const addBankAccountValidationHandler = (country: string, type?: string) => {
  const validationFeilds = {
    accountHolderFirstName: yup
      .string()
      .trim()
      .min(2, 'First name must have more than one letter.')
      .required('Please enter the first name'),
    accountHolderLastName:
      type === 'individual'
        ? yup.string().trim().min(2, 'Last name must have more than one letter.').required('Please enter the last name')
        : yup.string().trim(),
    accountNumber: yup
      .string()
      .required('Please enter the account number')
      .typeError('Please enter a valid account number'),
    accountHolderType: yup.string().required('Please enter the account holder type'),
    routingNumber: yup.string().when([], {
      is: () => country !== 'CA',
      then: yup.string().required('Please enter the routing number').typeError('Please enter a valid routing number'),
      otherwise: yup.string().nullable(),
    }),
    transitNumber: yup.string().when([], {
      is: () => country === 'CA',
      then: yup
        .string()
        .required('Please enter the transit number')
        .typeError('Please enter a valid routing number')
        .min(5, 'Must be exactly 5 digits')
        .max(5, 'Must be exactly 5 digits'),
      otherwise: yup.string().nullable(),
    }),
    institutionNumber: yup.string().when([], {
      is: () => country === 'CA',
      then: yup
        .string()
        .required('Please enter the institution number')
        .typeError('Please enter a valid institution number')
        .min(3, 'Must be exactly 3 digits')
        .max(3, 'Must be exactly 3 digits'),
      otherwise: yup.string().nullable(),
    }),
  };

  if (['IL', 'GB', 'BE', 'MX', 'CA', 'AR', 'CH'].includes(country)) {
    delete validationFeilds.routingNumber;
    delete validationFeilds.transitNumber;
    delete validationFeilds.institutionNumber;
  }

  return yup.object(validationFeilds).required();
};

export const fetchCountriesCode = async () => {
  try {
    const { data } = await getCountries('');
    return data.map((dt) => dt.country_short_name.toLocaleLowerCase());
  } catch (error) {
    return [];
  }
};

export const onlyCharacters = (inputString = '') => {
  let result = '';
  for (let i = 0; i < inputString.length; i++) {
    if (/[a-zA-Z ]/.test(inputString[i])) result += inputString[i];
  }
  return result;
};

export const emailPattern = (inputString = '') => {
  const resp = inputString.replace(/[^a-zA-Z0-9@._-]/g, '');
  return resp;
};

export const paymentProcessingStatusHandler = (method = 'OTHER') => {
  const status = {
    ACH: 'Payment Processing (Up to 5 business days)',
    OTHER: 'Payment Processing',
  };
  return status[method];
};
