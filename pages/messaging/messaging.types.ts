export type MessageUserItem = {
  user_id: any;
  email?: any;
  unread_count: number;
  job_status: 'active' | 'deleted' | 'prospect';
  proposal_status: 'pending' | 'denied' | null;
  _from_user_data: {
    email: string;
    user_id: string;
    last_name: string;
    user_type: string;
    first_name: string;
    user_image: string;
  };
  _to_user_data: {
    email: string;
    user_id: string;
    last_name: string;
    user_type: string;
    first_name: string;
    user_image: string;
  };
  message: string;
  _job_post_id: string;
  job_title: string;
  proposal_id?: number;
  invite_id?: any;
  invite_status: any;
};

export type MessageUser = {
  email: string;
  user_id: string;
  last_name: string;
  user_type: string;
  first_name: string;
  user_image: string;
};

export type MessageType = 'down' | 'up';
// const MessageProps = {chat_id: 83
//   date_created: "2022-06-24 12:36:33"
//   delivered_date: null
//   first_name: "Kishan"
//   is_seen: 0
//   last_name: "Talaviya+"
//   message_text: "Hi Kishan Talaviya\nKishan Talaviya+ is accepted your invitation."
//   seen_date: null
//   type: "TEXT"
//   user_image: "https://zehmizeh-stage-data.s3.amazonaws.com/job-documents/1655529394363-1080x2340-mountains-amoled-4k-1080x2340-resolution-wallpaper-hd-artist-4k-wallpapers-images-photos-and-background-wallpapers-den.jpeg"
//   _from_user_id: "68bb6266-1f1f-4d46-a512-8cbd8fa45912"
//   _job_post_id: "0038fec9-f217-41c7-b9a9-9251591604d5"
//   _to_user_id: "49};

export type MessageProps = {
  chat_id: number;
  date_created: string;
  delivered_date: any;
  first_name: string;
  is_seen: number;
  last_name: string;
  message_text: string;
  seen_date: any;
  type: string;
  user_image: string;
  _from_user_id: string;
  _job_post_id: string;
  _to_user_id: string;
  proposal_id?: string;
  showMilestoneAlert?: boolean;
  invite_id?: string;
};

export type TPusherSeenMessageProps = {
  chat_id: string;
  job_post_id: string;
  is_seen_all: boolean;
  to_user_id: string;
  from_user_id: string;
};
