export interface IClientDetails {
  user_id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  phonenumber_country: string;
  phonenumber_countrycode: string;
  formatted_phonenumber: string;
  gender: string;
  company_name: string;
  user_image: string;
  is_agency: number;
  deletion_requested: number;
  is_profile_completed: boolean;
  user_type: 'client' | 'freelancer';
  date_of_birth: string;
  portfolio_link: string;
  agency_name: string;
  u_email_id: string;
  date_created: string;
  location: Location;
  settings: Settings;
  is_deleted: number;
  new_message_email_notification: number;
  timezone: string;
  done_jobs: number;
  avg_rating: number;
  count_rating: number;
  carddata: Carddaum[];
  account: Account[];
  jobData: unknown[];
  review: Review[];
  email_id: string; // NOT_VERIFIED
  id: string; // NOT_VERIFIED
}

interface Review {
  feedback_id: string;
  job_title: string;
  user_image: string;
  first_name: string;
  last_name: string;
  location: { state: string; country_name: string };
}

interface Location {
  label: string;
  state: string;
  country_id: number;
  country_code: string;
  country_name: string;
  country_short_name: string;
}

type Settings = Partial<{
  do_not_show_post_project_modal: number;
  do_not_show_switch_to_hidden_post_warning: number;
  do_not_show_switch_to_public_post_warning: number;
  posted_project_count: number;
}>;

interface Carddaum {
  exp_date: string;
  last_4_digit: number;
  user_card_id: number;
  stripe_card_id: string;
}

interface Account {
  status: string;
  bank_name: string;
  is_default: number;
  fingerprint: string;
  date_created: string;
  last_4_digit: string;
  user_bank_id: number;
  routing_number: string;
  account_holder_name: string;
  account_holder_type: string;
  stripe_bank_account_id: string;
}
