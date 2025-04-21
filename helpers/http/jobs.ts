import { apiClient } from "./index";
import axios from "axios";

interface MilestoneInterface {
  action: string;
  job_post_id?: string;
  page?: number;
  limit?: number;
  milestone_id?: string | number;
  status?: string;
  amount?: string;
  description?: string;
  title?: string;
  decline_reason?: string;
  payment_method?: string;
  token?: string;
  milestone_id_arr?: string[];
  is_pay_now?: boolean;
}

export const getJobDetails = (id: string) => {
  return apiClient
    .get(`/job/get-detail/${id}`)
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

export const inviteFreelancer = (formData: {
  job_post_id: string;
  freelancer_user_id: any;
  message?: string;
}) => {
  return apiClient.post(`/invite/freelancer`, formData).then((res) => res.data);
};

export const editInvitation = (formData: {
  invite_id: string;
  invite_message: string;
}) => {
  return apiClient.post(`/invite/edit`, formData).then((res) => res.data);
};

export const updateInvitationStatus = (
  inviteId: string,
  status: "canceled" | "pending"
) => {
  return apiClient
    .get(`/invite/status/${inviteId}/${status}`)
    .then((res) => res.data);
};

export const manageFeedback = (formData: {
  action: string;
  job_post_id: string;
  client_user_id: string;
  freelancer_user_id: string;
  submitted_by: string;
  rate: number;
  description: string;
}) => {
  return apiClient
    .post(`/job/manage-feedback`, formData)
    .then((res) => res.data);
};

export const manageMilestone = (formData: MilestoneInterface) => {
  return apiClient
    .post(`/job/manage-milestone`, formData)
    .then((res) => res.data);
};

export const manageMilestoneNew = async (formData: MilestoneInterface) => {
  const { data, status } = await apiClient.post(
    `/job/manage-milestone`,
    formData
  );
  return { data, status };
};

export const endJob = (formData: {
  job_id: string;
  status: string;
  rate?: number;
  description?: string;
  reason?: string;
  incomplete_description?: string;
}) => {
  return apiClient.post(`/job/end-job`, formData).then((res) => res.data);
};

export const manageHours = async (formData: {
  action: string;
  hourly_id?: string;
  description?: string;
  title?: string;
  logged_hour?: string;
  job_post_id?: string;
  status?: string;
}) => {
  const res = await apiClient.post(`/job/manage-hours`, formData);
  return res.data;
};

export const cancelClosureRequest = (job_id: string) => {
  return apiClient
    .post("/job/closure-request-cancel", {
      job_id,
    })
    .then((res) => res.data);
};

export const jobClosureRequest = (formData: { job_id?: string }) => {
  return apiClient
    .post(`/job/closure-request-send`, formData)
    .then((res) => res.data);
};

export const acceptClosureRequest = (formData: { job_id?: string }) => {
  return apiClient
    .post(`/job/closure-request-accept`, formData)
    .then((res) => res.data);
};

export const clientJobNameSearch = (formData: {
  status?: string;
  text?: string;
  page: number;
  limit: number;
}) => {
  return apiClient
    .post(`/job/client-job-name/search`, formData)
    .then((res) => res.data);
};

export const freelancerJobNameSearch = (formData: {
  status?: string;
  text?: string;
  page: number;
  limit: number;
}) => {
  return apiClient
    .post(`/job/job-name/search`, formData)
    .then((res) => res.data);
};

export const sendTip = async (data: { job_id: string; amount: number }) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/jobs/send-tip`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending tip:", error);
    throw error;
  }
};
