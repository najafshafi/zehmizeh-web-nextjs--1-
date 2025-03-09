export type TJOB_STATUS = 'draft' | 'active' | 'closed' | 'prospects' | 'deleted';

export type TPROPOSAL_ESTIMATION_DURATION = 'hours' | 'days' | 'weeks' | 'months';

export interface TJobDetails {
  job_post_id: string;
  _client_user_id: string;
  _freelancer_user_id: string;
  job_title: string;
  job_description: string;
  attachments: string[];
  skills: Skill[];
  languages: any[];
  preferred_location: string[];
  time_scope: string;
  expected_delivery_date: string;
  expertise: string;
  budget: HourlyBudget | FixedBudget;
  date_created: string;
  date_modified: any;
  attributes?: { isExpired: boolean };
  status: TJOB_STATUS;
  job_start_date: any;
  job_end_date: any;
  due_date: string;
  incomplete_desc: any;
  is_completed: number;
  closed_by: any;
  job_reason: any;
  is_deleted: number;
  is_closure_request: number;
  is_closure_request_accepted: number;
  closure_req_submitted_by: any;
  message_freelancer_popup_count: number;
  paid: any;
  total_hours: number;
  userdata: Userdata;
  clientdata: Clientdata;
  is_client_feedback: boolean;
  proposal: Proposal;
  milestone: any[];
  applicants: number;
  reference_links: string[];
  reference_attachments: string[];
  invite_message: string;
  budget_change: BudgetChange;
  is_hidden:
    | {
        value: 0 | 1;
        date: string;
      }
    | 0
    | 1;
  job_expire_time: string;
}

type Skill = Partial<{
  category_id: number;
  category_name: string;
  skill_id: number;
  skill_name: string;
  categories: number[];
}>;

interface HourlyBudget {
  type: 'hourly';
  isProposal: boolean;
  amount?: number;
  max_amount?: number;
  min_amount?: number;
}

interface FixedBudget {
  type: 'fixed';
  isProposal: boolean;
  amount?: number;
  max_amount?: number;
  min_amount?: number;
}

interface Userdata {
  first_name: string;
  last_name: string;
  user_type: 'client' | 'freelancer';
  user_image: string;
  location: Location;
}

interface Clientdata {
  first_name: string;
  last_name: string;
  user_type: string;
  user_image: string;
  location: Location;
}

interface Location {
  label: string;
  state: string;
  country_id: number;
  country_code: string;
  country_name: string;
  country_short_name: string;
}

interface BudgetChange {
  status: 'pending' | 'accepted' | 'denied';
  amount: number;
  requested_by: 'client' | 'freelancer';
  is_seen_denied_modal: number;
}
interface ApprovedBudget {
  amount: number;
  type: 'hourly' | 'fixed';
  start_date: string;
}

interface Proposal {
  budget_change: BudgetChange;
  approved_budget: ApprovedBudget;
}
