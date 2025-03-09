import * as yup from 'yup';

export const completeProfilePersonalDetailsValidation = yup
  .object({
    job_title: yup.string().required('Please enter a headline'),
    hourly_rate: yup
      .number()
      .min(0)
      .nullable()
      .transform((_, val) => (val === Number(val) ? val : null))
      .typeError('Please enter a valid hourly rate'),
  })
  .required();
