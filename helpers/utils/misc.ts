import { TJobDetails } from '@/helpers/types/job.type';
import moment from 'moment';
import toast from 'react-hot-toast';

interface ExpectedHoursRemap {
  simple: string;
  bigger: string;
  ongoing: string;
}

const EXPECTED_HOURS_REMAP: ExpectedHoursRemap = {
  simple: 'Short Project (<10 hours)',
  bigger: 'Medium Project (>10 hours)',
  ongoing: 'Ongoing Project',
};

export const pxToRem = (px: number) => `${px / 16}rem`;

export const showMsg = (msg: string) => {
  toast.dismiss();
  toast.success(msg);
};
export const showErr = (msg: string) => {
  toast.dismiss();
  toast.error(msg);
};

export const limitDecimals = (number: number | undefined, decimal = 2) => {
  if (!number) return 0;
  if (Number.isInteger(number)) return numberWithCommas(number);
  return numberWithCommas(Number(number).toFixed(decimal));
};

// todo: Mudit here I am taking currency to have a fixed decimal points
export function numberWithCommas(value: number | string, currency?: string) {
  const input = Number(value);
  if (currency) {
    return input
      ? input.toLocaleString('en-US', { style: 'currency', currency })
      : '$0';
  } else {
    return input ? input.toLocaleString() : '0';
  }
}

export function formatLocalDate(date: string, format?: string) {
  return moment
    .utc(date)
    .local()
    .format(format || 'Do MMM YYYY hh:mm a');
}

interface YupError {
  inner: Array<{ path: string; message: string }>;
}

interface ErrorRecordValue {
  [key: string]: string | ErrorRecordValue;
}

type ErrorRecord = Record<string, string | ErrorRecordValue>;

export const getYupErrors = (error: YupError): ErrorRecord => {
  const errors = error.inner?.reduce((acc: ErrorRecord, error) => {
    if (error.path?.includes('.')) {
      const [first, ...rest] = error.path.split('.');
      const existingFirst = (acc[first] as ErrorRecordValue) || {};
      return {
        ...acc,
        [first]: {
          ...existingFirst,
          ...getYupErrors({
            inner: [{ path: rest.join('.'), message: error.message }],
          }),
        },
      };
    } else {
      return {
        ...acc,
        [error.path]: error.message,
      };
    }
  }, {});
  return errors;
};

export const calculateExpertise = (expertise: number) => {
  if (expertise < 50) return 'newbie';
  if (expertise >= 50 && expertise < 90) return 'doing_great';
  if (expertise >= 90) return 'best';
  return expertise;
};

export const calculateExpertiseNumbeFromTag = (expertise: string) => {
  if (expertise == 'newbie') return 1;
  if (expertise == 'doing_great') return 50;
  if (expertise == 'best') return 100;
  else return expertise;
};

export const getExpertiseDesFromTag = (expertise: string) => {
  if (expertise == 'newbie') return 'Newbie';
  if (expertise == 'doing_great') return 'Doing Great Work';
  if (expertise == 'best') return 'The Best in the Field';
  else return expertise;
};

export const formatExpertiseStatus = (expertise: string) => {
  const splits = expertise.split('_');
  let finalString = '';
  for (let i = 0; i < splits.length; i++) {
    const str = splits[i];
    const str2 = str.charAt(0).toUpperCase() + str.slice(1);
    finalString = finalString + str2 + ' ';
  }
  return finalString;
};

export const changeStatusDisplayFormat = (status: string, splitBy = '-') => {
  const splits = status?.split(splitBy);
  let finalString = '';
  for (let i = 0; i < splits?.length; i++) {
    const str = splits[i];
    const str2 = str?.charAt(0).toUpperCase() + str?.slice(1);
    finalString = finalString + str2 + ' ';
  }

  if (finalString.trim() === 'Cancelled') return 'Canceled';
  return finalString;
};

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatPhoneNumber = (phoneNumberString: string) => {
  const formattedNumber = phoneNumberString.replace(/\D+/g, '');
  if (formattedNumber === undefined) return ``;
  if (formattedNumber?.length === 11) {
    return formattedNumber.replace(
      /(\d{1})(\d{3})(\d{3})(\d{4})/,
      `+$1 $2 $3 $4`
    );
  }
  if (formattedNumber?.length === 12) {
    return formattedNumber.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})/,
      `+$1 $2 $3 $4`
    );
  }
  if (formattedNumber?.length === 13) {
    return formattedNumber.replace(
      /(\d{3})(\d{3})(\d{3})(\d{4})/,
      `+$1 $2 $3 $4`
    );
  }
  return formattedNumber;
};

export const convertToPlain = (html: string): string => {
  const tempDivElement = document.createElement('div');
  tempDivElement.innerHTML = html;
  return tempDivElement.textContent || tempDivElement.innerText || '';
};

export const separateValuesWithComma = (params: string[]) => {
  return params
    .filter(function (val) {
      return val;
    })
    .join(', ');
};

export const showFormattedBudget = (budget: TJobDetails['budget']): string => {
  let amount = '';
  if (budget) {
    if (budget?.type === 'fixed' || budget?.type === 'hourly') {
      if (Number(budget?.max_amount) > 1 && Number(budget?.min_amount) > 1) {
        if (budget?.max_amount === budget?.min_amount) {
          amount = numberWithCommas(Number(budget?.min_amount), 'USD');
        } else {
          amount = `${numberWithCommas(Number(budget?.min_amount), 'USD')} - ${numberWithCommas(Number(budget?.max_amount), 'USD')}`;
        }
      } else {
        if (budget?.amount) amount = numberWithCommas(Number(budget?.amount), 'USD');
        else if (budget?.max_amount) amount = numberWithCommas(Number(budget?.max_amount), 'USD');
      }
      return `${amount}${budget?.type === 'hourly' ? '/hr' : ''}`;
    }
    return ' - ';
  }
  return '';
};

export function getPlainText(strSrc: string): string {
  const divElement = document.createElement('DIV');
  divElement.innerHTML = strSrc;
  const plain = divElement.textContent || divElement.innerText || '';
  return plain;
}

export function update_query_parameters(key: string, val: string): void {
  let newurl = window.location.href
    .replace(
      RegExp('([?&]' + key + '(?=[=&#]|$)[^#&]*|(?=#|$))'),
      '&' + key + '=' + encodeURIComponent(val)
    )
    .replace(/^([^?&]+)&/, '$1?');

  newurl = newurl?.replace(/[^=&]+=(&|$)/g, '').replace(/&$/, '');
  window.history.pushState({ path: newurl }, '', newurl);
}

export const fileIsAnImage = (url: string): boolean | null => {
  return url.match(/\.(jpeg|jpg|gif|png|webp|avif)$/) !== null;
};

export const convertToTitleCase = (str: string) => {
  if (!str) return '';

  const title = str.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });

  if (str.split(' ')?.length <= 1) {
    return title;
  }
  // Certain minor words should be left lowercase unless
  // they are the first or last words in the string
  const lowers = [
    'A',
    'An',
    'The',
    'And',
    'But',
    'Or',
    'For',
    'Nor',
    'As',
    'At',
    'By',
    'For',
    'From',
    'In',
    'Into',
    'Near',
    'Of',
    'On',
    'Onto',
    'To',
    'With',
    'Is',
  ];
  const firstWord = title.split(' ')[0];
  let restLine = title.substr(title.indexOf(' ') + 1);

  restLine = restLine
    .split(' ')
    .map((word) => (lowers.includes(word) ? word.toLocaleLowerCase() : word))
    .join(' ');

  return firstWord + ' ' + restLine;
};

export const getUtcDate = (date: string, format?: string) => {
  if (format === 'fromNow') {
    return moment.utc(date).local().fromNow();
  }
  return moment
    .utc(date)
    .local()
    .format(format || 'Do MMM YYYY hh:mm a');
};

export const adjustTimezone = (date: Date): string | Date => {
  if (!date) return '';
  const offSetDate = new Date(
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  );
  return new Date(offSetDate.setHours(23, 58, 59, 999));
};

export const expectedHoursRemap = (value: keyof ExpectedHoursRemap): string => {
  return EXPECTED_HOURS_REMAP[value];
};

export const getFileNameAndFileUrlFromAttachmentUrl = (url: string) => {
  const returnData = { fileUrl: '', fileName: '', file: '' };
  returnData.fileUrl = url;
  returnData.fileName = url.split('#docname=')?.[1] || '';
  return returnData;
};
