export interface MilestoneTypes {
  milestone_id: number;
  _client_user_id: string;
  _freelancer_user_id: string;
  _job_post_id: string;
  amount: number;
  description: string;
  escrow_id: null;
  status: string;
  title: string;
  paid_date: string;
  released_date: string | null;
  decline_reason: string | null;
  date_created: string;
  cancelled_date: string;
  date_modified: string;
  is_deleted: number;
  due_date: string | null;
  attachments: string;
  revision_date: string | null;
  dispute_submitted_by: string | null;
  payment_method: string;
}
