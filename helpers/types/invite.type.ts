export type TInviteSentDetails = {
  status_change_timestamp?: Partial<IStatusChangeTimestamp>;
};

interface IStatusChangeTimestamp {
  unarchive_date: string;
  declined_date: string;
  archived_date: string;
  read_date: string;
  pending_date: string;
  accepted_date: string;
  canceled_date: string;
}
