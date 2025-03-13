import { IFreelancerDetails } from './freelancer.type';
import { IClientDetails } from './client.type';

export interface LoginPayload {
  email_id: string;
  password: string;
  terms_agreement: boolean;
  stay_signedin?: boolean;
}

export interface RegisterPayload {
  email_id: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  terms_agreement: boolean;
  user_type: 'freelancer' | 'client';
  utm_info?: Record<string, string>;
}

export interface TwoFactorFormData {
  action: 'send_otp' | 'verify_otp';
  type: 'new_registration' | 'login';
  otp?: string;
  email_id?: string;
}

export interface TwoFactorPayload {
  formdata: TwoFactorFormData;
  email: string;
}

export interface AuthResponse {
  user: IFreelancerDetails & IClientDetails;
  token: string;
  user_type: 'freelancer' | 'client';
  user_id: string;
  email_id: string;
  first_name: string;
  last_name: string;
  user_image: string;
  skills: Array<{ category_name: string }>;
  timezone?: string;
  is_agency: number;
  agency_name: string;
  languages: Array<{ id: number; name: string }>;
  about_me: string;
  portfolio_link: string;
  hourly_rate: number;
  job_title: string;
  date_of_birth: string;
  location: {
    label: string;
    state: string;
    country_id: number;
    country_code: string;
    country_name: string;
    country_short_name: string;
  };
  date_created: string;
  is_account_approved: number;
  avg_rating: number;
  feedback_count: number;
  is_bookmarked: boolean;
  formatted_phonenumber: string;
  phone_number: string;
  new_message_email_notification: number;
  notification_email: number;
  u_email_id: string;
  deletion_requested: number;
  totalearning: number;
  user_group: Record<string, unknown>;
  preferred_banking_country: string;
  count_rating: number;
  done_jobs: number;
}

export interface ApiResponse<T> {
  status: boolean;
  data: T;
  message: string;
  errorCode?: number;
  emailId?: string;
  response?: string;
}

export interface AuthError {
  status: boolean;
  message: string;
  errorCode?: number;
  emailId?: string;
  response?: string;
} 