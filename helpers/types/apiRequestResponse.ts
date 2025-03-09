export type TEditUserRequest = Partial<{
  user_image: string;
  first_name: string;
  last_name: string;
  job_title: string;
  u_email_id: string;
  phone_number: string;
  phonenumber_country: string;
  phonenumber_countrycode: string;
  formatted_phonenumber: string;
  hourly_rate: number;
  location: {
    label: string;
    state: string;
    country_id: number;
    country_code: string;
    country_name: string;
    country_short_name: string;
  };
  about_me: string;
  skills: {
    category_id?: number;
    category_name?: string;
    skill_id?: number;
    categories?: number[];
    skill_name?: string;
  }[];
  gender: string;
  languages: {
    id: number;
    name: string;
  }[];
  user_group: Record<string, unknown>[];
  company_name: string;
  portfolio_link: string;
  notification_email: number | string;
  new_message_email_notification: number | string;
  settings: Record<string, string | number>;
  timezone: string;
  is_agency: number;
  action: string;
  old_email: string;
  new_email: string;
}>;

export type TapiResponse<T> = {
  status: boolean;
  message: string;
  data: T;
};
