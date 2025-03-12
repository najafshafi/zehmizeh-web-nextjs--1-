import { CONSTANTS } from '@/helpers/const/constants';
import { capitalizeFirstLetter } from './misc';
import { TJobDetails, TPROPOSAL_ESTIMATION_DURATION } from '@/helpers/types/job.type';
import { IClientDetails } from '@/helpers/types/client.type';
import moment from 'moment';
import { ChatUser } from '../../store/redux/slices/talkjs.interface';

export const camelCaseToNormalCase = (word) => {
  const result = word && word.replace(/([A-Z])/g, '$1');
  const finalResult = result && result.charAt(0).toUpperCase() + result.slice(1);
  return finalResult;
};

export const stripeRequirementsHandler = (requirements: any = {}) => {
  let finalRequirementArr = [];
  const keyArr = Object.keys(requirements);

  keyArr.forEach((keyElem) => {
    finalRequirementArr.push(requirements[keyElem]);
  });

  finalRequirementArr = finalRequirementArr.flat(Infinity);

  finalRequirementArr = [...new Set(finalRequirementArr)].map((elem) => {
    if (typeof elem !== 'string') elem = '';
    const detail = elem.split('.').length === 2 ? elem?.split('.')[1] : elem?.split('.')[0];

    return capitalizeFirstLetter(detail.replaceAll('_', ' '));
  });

  finalRequirementArr = finalRequirementArr?.filter((el) => !!el);

  return finalRequirementArr;
};

export const isUserStripeVerified = (stripe) => {
  let finalRequirementArr = stripeRequirementsHandler(stripe?.individual?.requirements);

  let stripeErrorCheckArr = stripeRequirementsHandler(stripe?.requirements);
  const errors = stripe?.requirements?.errors;
  if (Array.isArray(errors) && errors?.length <= 0) stripeErrorCheckArr = [];

  /*future requirements start*/
  let futureRequirementsErrors = stripeRequirementsHandler(stripe?.future_requirements);
  const futureErrors = stripe?.future_requirements?.errors;
  if (Array.isArray(futureErrors) && futureErrors?.length <= 0) futureRequirementsErrors = [];
  /*future requirements end*/

  finalRequirementArr = finalRequirementArr.concat(stripeErrorCheckArr, futureRequirementsErrors);
  finalRequirementArr = [...new Set(finalRequirementArr)];

  return finalRequirementArr;
};

export const showAddBankButton = (data) => {
  let flag = false;
  const stripe = data?.stripe;

  if (!data?.stp_account_id) return flag;

  flag = true;
  if (data.stp_account_status !== 'verified') {
    const finalRequirementArr = isUserStripeVerified(stripe);
    flag = finalRequirementArr.length === 0;
  }

  return flag;
};

// If milestone/hourly rate paid then client and freelancer can add review
export const isNotAllowedToSubmitReview = (jobDetails) => {
  return (
    jobDetails?.milestone?.length === 0 ||
    !(
      jobDetails?.milestone?.findIndex(
        (milestone) => milestone?.hourly_status === 'paid' || milestone?.status === 'released'
      ) >= 0
    )
  );
};

export const getTimeEstimation = (estimation: string | number = '', defaultValue: TPROPOSAL_ESTIMATION_DURATION) => {
  // if project is project-based
  if (!estimation) return '';

  const est = estimation.toString().split(' ');
  const number = est?.[0];
  let duration = est?.[1];

  // default values for number and duration
  if (!number) return '';

  if (!duration) duration = CONSTANTS.ESTIMATION_VALUES.find((est) => est.id === defaultValue).id;
  return `${number} ${CONSTANTS.ESTIMATION_VALUES.find((est) => est.id === duration)?.label || ''}`;
};

const STRIPE_ACCOUNT_STATUS = {
  BANK_ACCOUNT_PENDING: 'bank_account_pending',
  PENDING_VERIFICATION: 'pending_verification',
  CURRENTLY_DUE: 'currently_due',
  VERIFIED: 'verified',
  PENDING: 'pending',
};

export const STRIPE_ACCOUNT_STATUS_USER_FACING = {
  NOT_STARTED: 'Not started',
  NEEDS_MORE_INFO: 'NEEDS_MORE_INFO',
  NEW_SUBMISSIONS_NEEDED: 'New Submissions Needed',
  VERIFYING_INFO: 'Verifying Info',
  VERIFIED: 'Verified',
  BANK_ACCOUNT_PENDING: 'Bank Account Pending',
};

export const stripeIntercomStatusHandler = (stp_account_id: string, stp_account_status: string) => {
  let stripeAccountStatus = '';

  switch (stp_account_status) {
    case STRIPE_ACCOUNT_STATUS.PENDING: {
      if (!stp_account_id) stripeAccountStatus = STRIPE_ACCOUNT_STATUS_USER_FACING.NOT_STARTED;
      else stripeAccountStatus = STRIPE_ACCOUNT_STATUS_USER_FACING.NEEDS_MORE_INFO;
      break;
    }
    case STRIPE_ACCOUNT_STATUS.CURRENTLY_DUE:
      stripeAccountStatus = STRIPE_ACCOUNT_STATUS_USER_FACING.NEW_SUBMISSIONS_NEEDED;
      break;
    case STRIPE_ACCOUNT_STATUS.PENDING_VERIFICATION:
      stripeAccountStatus = STRIPE_ACCOUNT_STATUS_USER_FACING.VERIFYING_INFO;
      break;
    case STRIPE_ACCOUNT_STATUS.BANK_ACCOUNT_PENDING:
      stripeAccountStatus = STRIPE_ACCOUNT_STATUS_USER_FACING.BANK_ACCOUNT_PENDING;
      break;
    case STRIPE_ACCOUNT_STATUS.VERIFIED:
      stripeAccountStatus = STRIPE_ACCOUNT_STATUS_USER_FACING.VERIFIED;
      break;
    default:
      stripeAccountStatus = (stp_account_status as string)?.replace(/_/g, ' ');
  }

  return stripeAccountStatus;
};

export const isStagingEnv = () => {
  // Check if window is defined (i.e., running on client)
  if (typeof window === "undefined") {
    return false; // Default to false on server-side
  }
  return ['beta.zehmizeh.com', 'localhost'].includes(window.location.hostname);
};

export const pusherApiKey = () =>
  isStagingEnv() ? process.env.REACT_APP_PUSHER_API_KEY : process.env.REACT_APP_PUSHER_API_KEY_PROD;

export const talkjsApiKey = () =>
  isStagingEnv() ? process.env.REACT_APP_TALKJS_APP_ID : process.env.REACT_APP_TALKJS_APP_ID_PROD;

export const talkjsSecretKey = () =>
  isStagingEnv() ? process.env.REACT_APP_TALKJS_APP_SECRET_KEY : process.env.REACT_APP_TALKJS_APP_SECRET_KEY_PROD;

export const hasClientAddedPaymentDetails = (user: IClientDetails) => {
  const isCardAdded = user?.carddata?.length > 0;
  const isBankAccountVerified =
    user?.account?.length > 0 &&
    user?.account.findIndex((item) => 'status' in item && item?.status === 'verified') > -1;

  return !(user?.user_type === 'client' && !isCardAdded && !isBankAccountVerified);
};

export const getCategories = (categories: TJobDetails['skills']) => {
  return categories?.filter((category) => !!category?.category_id) || [];
};

export const getSkills = (skills: TJobDetails['skills']) => {
  return skills?.filter((skill) => !!skill?.skill_id) || [];
};

export const getRelevantSkillsBasedOnCategory = (skills: TJobDetails['skills']) => {
  const categories = getCategories(skills);
  const allSkills = getSkills(skills);

  return categories.reduce((acc, category) => {
    const skills = [];
    const removeIndexes = [];

    /* START ----------------------------------------- Collecting index of skills to remove because category is removed */
    for (let i = 0; i < allSkills.length; i++) {
      if (allSkills?.[i]?.categories?.includes(category.category_id)) {
        skills.push(allSkills[i]);
        removeIndexes.push(i);
      }
    }
    /* END ------------------------------------------- Collecting index of skills to remove because category is removed */

    /* START ----------------------------------------- Removing skills using indexes collected above */
    for (let j = 0; j < removeIndexes.length; j++) {
      allSkills.splice(removeIndexes[j], 1);
    }
    /* END ------------------------------------------- Removing skills using indexes collected above */
    acc.push({ ...category, skills });
    return acc;
  }, []);
};

export const getJobExpirationInDays = (job) => {
  if (!job.job_expire_time) return;

  const currentDate = moment();
  const days = moment(job.job_expire_time).endOf('day').diff(currentDate, 'days');

  if (days > 0) return `Post Closing in: ${days} Days`;
};

// If project is hidden and dont have any proposal from freelancer then it shouldnt be shown to that freelancer
export const isProjectHiddenForFreelancer = (data: TJobDetails) => {
  // Hide project if
  // 1. is_hidden value is 1
  // 2. freelancer hasn't sent proposal
  return (
    typeof data?.is_hidden === 'object' &&
    data?.is_hidden?.value === 1 &&
    Object.keys(data?.proposal || {}).length === 0
  );
};

/* START -----------------------------------------bank account hidden until the last four digits */
export const formatingAccountNumber = (lastFourDigits) => {
  if (!lastFourDigits) return '';
  return '********' + lastFourDigits;
};
/* END -------------------------------------------  */

/* START -----------------------------------------routing hidden until the last four digits */
export const formatRoutingNumber = (routingNumber) => {
  if (!routingNumber) return '';
  // Ensure the routing number is a string
  const routingNumberStr = routingNumber.toString();
  // Get the last 4 digits
  const lastFourDigits = routingNumberStr.slice(-4);
  // Mask the preceding digits with asterisks
  const maskedNumber = '*****' + lastFourDigits;
  return maskedNumber;
};
/* END -------------------------------------------  */

export const scrollToBottom = (id: string) => {
  const element = document.getElementById(id);
  if (!element) return;
  element.scrollTop = element.scrollHeight;
};

export const getValueByPercentage = (amount?: number, percentage?: number): number => {
  if (!amount || !percentage) return 0;
  return (amount * percentage) / 100;
};

export const removeDuplicateValues = (array: any[], key: string) => {
  const uniqueArray = array.filter((obj, index, self) => index === self.findIndex((o) => o[key] === obj[key]));
  return uniqueArray;
};

export const isClosedorDeclined = (conversation: ChatUser) => {
  if (conversation?.custom && !conversation?.custom?.payload) return '';

  const payload = conversation.custom.payload;
  if (payload?.proposal_status || payload?.invite_status)
    if (['deleted', 'active', 'closed'].includes(payload?.job_status)) {
      return 'Closed';
    } else if (payload?.proposal_status === 'denied') {
      return 'Declined';
    } else if (payload?.invite_status === 'canceled') {
      return 'Canceled';
    } else if (payload?.invite_status === 'accepted') {
      return 'Accepted';
    }
  return '';
};
