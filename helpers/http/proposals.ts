import { TJobDetails } from '@/helpers/types/job.type';
import { apiClient } from './index';

export const submitProposal = (formData: any) => {
  return apiClient.post(`/proposal/save`, formData).then((res) => {
    return res.data;
  });
};

export const editProposal = (formData: any) => {
  return apiClient.post(`/proposal/edit`, formData).then((res) => {
    return res.data;
  });
};

export const deleteProposal = (formData: any) => {
  return apiClient.delete(`/proposal/delete`, { data: formData }).then((res) => {
    return res.data;
  });
};

export const archiveUnarchiveProposal = (job_id: string, archive?: boolean, status?: string) => {
  return apiClient.put(`/invite/archived/${job_id}?archive=${archive}&status=${status || ''}`).then((res) => {
    return res.data;
  });
};

export const getApplicantsDetails = (formData: {
  job_id: string;
  page: number;
  limit: number;
  sorting: string;
  proposalStatus: string;
}) => {
  return apiClient
    .get(
      `proposal/get-applicant/${formData?.job_id}?limit=${formData?.limit}&page=${formData?.page}&proposalStatus=${formData?.proposalStatus}&sortKey=${formData?.sorting}`
    )
    .then((res) => {
      return res.data;
    });
};

export const getInvitees = (formData: { job_id: string; page: number; limit: number }) => {
  return apiClient.get(`invitees/${formData?.job_id}?limit=${formData?.limit}&page=${formData?.page}`).then((res) => {
    return res.data;
  });
};

export const getInviteeDetails = (inviteeId: string) => {
  return apiClient.get(`invitee/detail/${inviteeId}`).then((res) => {
    return res.data;
  });
};

export const getProposalDetails = (id: string) => {
  return apiClient.get(`proposal/get-details/${id}`).then((res) => {
    return res.data;
  });
};

export const acceptProposal = (formData: any) => {
  return apiClient.post('proposal/accept', formData).then((res) => {
    return res.data;
  });
};

export const viewProposal = (proposal_id: any) => {
  return apiClient.post(`proposal/view/${proposal_id}`).then((res) => {
    return res.data;
  });
};

export const checkIsProposalExists = (formData: any) => {
  return apiClient.post('invite/proposal-exists', formData).then((res) => {
    return res.data;
  });
};

export const budgetChangeRequest = (formData: { job_post_id: string; amount: number }) => {
  return apiClient.post('proposal/budget-change', formData).then((res) => {
    return res.data;
  });
};

export const budgetChangeAcceptOrDenied = (formData: {
  job_post_id: string;
  status: TJobDetails['budget_change']['status'];
}) => {
  return apiClient.post('proposal/budget-change', formData).then((res) => {
    return res.data;
  });
};

export const budgetChangeSeenDeniedModal = (formData: {
  job_post_id: string;
  is_seen_denied_modal: TJobDetails['budget_change']['is_seen_denied_modal'];
}) => {
  return apiClient.post('proposal/budget-change', formData).then((res) => {
    return res.data;
  });
};

export const budgetChangeDeleteRequest = (job_post_id: string) => {
  return apiClient.post('proposal/budget-change', { job_post_id, is_delete: 1 }).then((res) => {
    return res.data;
  });
};

export const reopenProposal = ({ proposal_id }: { proposal_id: number }) => {
  return apiClient.post('proposal/reopen', { proposal_id }).then((res) => {
    return res.data;
  });
};
