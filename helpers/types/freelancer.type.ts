import { IStripeObject, TStripeStatus } from './stripe.type';

export interface IFreelancerDetails {
  user_id: string;
  first_name: string;
  last_name: string;
  user_image: string;
  skills: Skill[];
  is_agency: number;
  agency_name: string;
  languages: Language[];
  about_me: string;
  portfolio_link: string;
  hourly_rate: number;
  job_title: string;
  date_of_birth: string;
  location: Location;
  date_created: string;
  stp_account_status: TStripeStatus;
  stp_account_id: string;
  is_account_approved: number;
  avg_rating: number;
  feedback_count: number;
  jobs: Job[];
  is_bookmarked: boolean;
  certificate_course: CertificateCourse[];
  education: Education[];
  completedJobDetail: CompletedJobDetail[];
  completedJobCount: number;
  ongoingJobDetail: OngoingJobDetail[];
  ongoingJobCount: number;
  activeJobsClient: ActiveJobsClient[];
  formatted_phonenumber: string;
  phone_number: string;
  new_message_email_notification: number;
  notification_email: number;
  u_email_id: string;
  deletion_requested: number;
  stripe: IStripeObject;
  totalearning: number;
  account: Account[];
  user_type: 'client' | 'freelancer';
  user_group: Record<string, unknown>;
  preferred_banking_country: string;
  count_rating: number;
  done_jobs: number;
}

interface Skill {
  category_id?: number;
  category_name?: string;
  skill_id?: number;
  categories?: number[];
  skill_name?: string;
}

interface Language {
  id: number;
  name: string;
}

interface Location {
  label: string;
  state: string;
  country_id: number;
  country_code: string;
  country_name: string;
  country_short_name: string;
}

interface Job {
  job_title: string;
  job_post_id: string;
  job_description: string;
}

interface CertificateCourse {
  course_id: number;
  course_name: string;
  school_name: string;
  certificate_link: any;
  date_created: string;
}

interface Education {
  education_id: number;
  course_name: string;
  school_name: string;
  education_year: string;
  school_image: string;
  date_created: string;
}

interface CompletedJobDetail {
  job_post_id: string;
  job_title: string;
  job_description: string;
  feedback_id: number;
  rate: number;
  description: string;
  submitted_by: string;
  user_id: string;
  first_name: string;
  last_name: string;
  user_image: string;
  user_type: string;
}

interface OngoingJobDetail {
  job_post_id: string;
  _client_user_id: string;
  _freelancer_user_id: string;
  job_title: string;
  job_description: string;
  preferred_location: string[];
  date_created: string;
  expected_delivery_date: string;
  status: string;
  budget: Budget;
}

interface Budget {
  type: string;
  amount: any;
  isProposal: boolean;
  max_amount: any;
  min_amount?: number;
}

interface ActiveJobsClient {
  job_post_id: string;
  _client_user_id: string;
  _freelancer_user_id: string;
  job_title: string;
  job_description: string;
  preferred_location: string[];
  date_created: string;
  expected_delivery_date: string;
  status: string;
  budget: Budget2;
}

interface Budget2 {
  type: string;
  amount: any;
  isProposal: boolean;
  max_amount: any;
  min_amount?: number;
}

interface Account {
  user_bank_id: number;
  stripe_bank_account_id: string;
  bank_name: string;
  fingerprint: string;
  is_default: number;
  last_4_digit: string;
  account_holder_name: string;
  account_holder_type: string;
  routing_number: string;
  date_created: string;
}
