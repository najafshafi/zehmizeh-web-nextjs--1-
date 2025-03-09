export type TBudgetType = 'hourly' | 'fixed';

export type TProposalDetails = Partial<{
  proposal_id: number;
  _job_post_id: string;
  delivery_time: string;
  attachments: any[];
  description: string;
  status: string;
  is_job_deleted: number;
  proposed_budget: Proposedbudget;
  approved_budget: Approvedbudget;
  budget_change: budget_change;
  date_created: string;
  date_modified: string;
  terms_and_conditions: string;
  questions: string;
  user_id: string;
  first_name: string;
  last_name: string;
  skills: Skill[];
  location: Location;
  user_image: string;
  job_title: string;
  is_agency: number;
  agency_name: string;
  threadExists: boolean;
  invite_id: any;
  invite_message: string;
  status_change_timestamp?: Partial<IStatusChangeTimestamp>;
}>;

interface IStatusChangeTimestamp {
  denied_date: string;
  accept_date: string;
  pending_date: string;
}
interface Location {
  label: string;
  state: string;
  country_id: number;
  country_code: string;
  country_name: string;
  country_short_name: string;
}
interface Skill {
  skill_id?: number;
  categories?: number[];
  skill_name?: string;
  category_id?: number;
  category_name?: string;
}

interface Approvedbudget {}
interface Proposedbudget {
  type: TBudgetType;
  amount: string;
  time_estimation: string;
}

interface budget_change {
  status: 'pending' | 'accepted' | 'denied';
  amount: number;
  requested_by: 'client' | 'freelancer';
  is_seen_denied_modal: number;
}
