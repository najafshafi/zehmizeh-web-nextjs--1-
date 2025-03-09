import { REGEX } from '@/helpers/const/regex';
import { getCategories } from '@/helpers/utils/helper';
import { getPlainText } from '@/helpers/utils/misc';
import moment from 'moment';
import { array, bool, number, object, string } from 'yup';

export const projectDescriptionStepValidation = object({
  job_title: string().required('Project title is required'),
  job_description: string()
    .transform((value) => getPlainText(value))
    .min(50, 'The project description must be at least 50 characters.')
    .max(5000, 'The character maximum is 5000.')
    .required('Project description is required'),
});

export const projectSkillsStepValidation = object({
  categories: array().test({
    test: (_, context) => getCategories(context?.parent?.skills)?.length > 0,
    message: 'At least 1 category is required',
  }),
});

export const projectTimingStepValidation = object({
  due_date: string().test({
    message: 'Due date must be later than current date.',
    test: (value) => {
      if (value) {
        const currentDate = moment().utc().valueOf();
        const dueData = moment(value).utc().valueOf();
        return dueData >= currentDate;
      }
      return true;
    },
  }),
});

export const projectPreferenceStepValidation = object({
  reference_links: array().of(
    string().test({
      message: 'Please provide a valid URL as input.',
      test: (value) => REGEX.URL.test(value),
    })
  ),
});

export const projectPaymentStepValidation = object({
  budget: object({
    isProposal: bool(),
    min_amount: number()
      .test({
        message: 'Min Amount is required',
        test: (value, context) => {
          if (!context.parent.isProposal) return !!Number(value);
          return true;
        },
      })
      .test({
        message: 'Min amount should be at least $5',
        test: (value, context) => {
          if (!context.parent.isProposal) return value >= 5;
          return true;
        },
      }),
    max_amount: number()
      .test({
        message: 'Max Amount is required',
        test: (value, context) => {
          if (!context.parent.isProposal) return !!Number(value);
          return true;
        },
      })
      .test({
        message: 'Max amount should be greater or equal to min amount',
        test: (value, context) => {
          if (!context.parent.isProposal) return value >= context.parent.min_amount;
          return true;
        },
      })
      .test({
        message: 'Max amount should be at least $5',
        test: (value, context) => {
          if (!context.parent.isProposal) return value >= 5;
          return true;
        },
      }),
  }),
});
