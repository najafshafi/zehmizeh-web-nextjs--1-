// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useRouter, usePathname, useSearchParams } from "next/navigation";
// import dynamic from "next/dynamic";
// import Spinner from "@/components/forms/Spin/Spinner";
// import toast from "react-hot-toast";
// import classNames from "classnames";
// import Loader from "@/components/Loader";
// import BackButton from "@/components/ui/BackButton";
// import DetailsBanner from "./partials/DetailsBanner";
// import { StyledButton } from "@/components/forms/Buttons";
// import Tabs from "@/components/ui/Tabs";
// import useStartPageFromTop from "@/helpers/hooks/useStartPageFromTop";
// import useResponsive from "@/helpers/hooks/useResponsive";
// import useJobDetails from "./useJobDetails";
// import TrashIcon from "@/public/icons/trash-orange.svg";
// import EditIcon from "@/public/icons/edit-blue.svg";
// import { deleteJob } from "@/helpers/http/client";
// import { PaymentProvider } from "./controllers/usePayments";
// import { JobCloseMessageWrapper } from "./partials/hours-management/hours-management.styled";
// import { cancelClosureRequest } from "@/helpers/http/jobs";
// import NoDataFound from "@/components/ui/NoDataFound";
// import { editUser } from "@/helpers/http/auth";
// import useClientProfile from "@/controllers/useClientProfile";
// import { USER_PROFILE_SETTINGS_KEY } from "@/helpers/const/constants";
// import { StatusBadge } from "@/components/styled/Badges";
// import { TJOB_STATUS } from "@/helpers/types/job.type";
// import { Wrapper } from "./client-job-details.styled";
// import { postAJob } from "@/helpers/http/post-job";

// // Dynamically import components that might use browser APIs
// const GeneralDetails = dynamic(() => import("./partials/GeneralDetails"), {
//   ssr: false,
// });
// const Feedback = dynamic(() => import("./partials/feedback"), { ssr: false });
// const Milestones = dynamic(() => import("./partials/milestones"), {
//   ssr: false,
// });
// const HoursManagement = dynamic(() => import("./partials/hours-management"), {
//   ssr: false,
// });
// const Applicants = dynamic(() => import("./partials/applicants"), {
//   ssr: false,
// });
// const SubmitEndJobModal = dynamic(() => import("./modals/SubmitEndJobModal"), {
//   ssr: false,
// });

// import QuickOptions from "./quick-options/QuickOptions";

// const DeletePropmpt = dynamic(() => import("@/components/ui/DeletePropmpt"), {
//   ssr: false,
// });

// const JobEndRequestByFreelancer = dynamic(
//   () => import("./partials/JobEndRequestByFreelancer"),
//   { ssr: false }
// );
// const ConfirmEndRequestPrompt = dynamic(
//   () => import("./partials/ConfirmEndRequestPrompt"),
//   { ssr: false }
// );
// const FinalMilestoneModal = dynamic(
//   () => import("./quick-options/FinalMilestoneModal"),
//   { ssr: false }
// );
// const SingleMessaging = dynamic(
//   () => import("@/components/messaging-page/SingleMessaging"),
//   { ssr: false }
// );
// const Invitees = dynamic(
//   () => import("./partials/invitees").then((mod) => mod.Invitees),
//   { ssr: false }
// );

// // Named export components need special handling
// const ChangeBudgetRequestModal = dynamic(
//   () =>
//     import("@/components/changeBudget/ChangeBudgetRequestModal").then(
//       (mod) => mod.ChangeBudgetRequestModal
//     ),
//   { ssr: false }
// );
// const ChangeBudgetDeniedModal = dynamic(
//   () =>
//     import("@/components/changeBudget/ChangeBudgetDeniedModal").then(
//       (mod) => mod.ChangeBudgetDeniedModal
//     ),
//   { ssr: false }
// );
// const PostVisibilityConfirmationModal = dynamic(
//   () =>
//     import("./modals/PostVisibilityConfirmationModal").then(
//       (mod) => mod.PostVisibilityConfirmationModal
//     ),
//   { ssr: false }
// );

// export type TcomponentConnectorRef = React.MutableRefObject<{
//   openMilestoneListModal: () => void;
// }>;

// interface ClientJobDetailsProps {
//   initialTab?: string;
//   jobId: string;
// }

// // Client-side only wrapper component
// const ClientJobDetailsWrapper = (props: ClientJobDetailsProps) => {
//   // Return null during server-side rendering
//   if (typeof window === "undefined") {
//     return <div>Loading job details...</div>;
//   }

//   return <ClientJobDetails {...props} />;
// };

// const ClientJobDetails = ({ initialTab, jobId }: ClientJobDetailsProps) => {
//   useStartPageFromTop();
//   const { isMobile } = useResponsive();
//   const router = useRouter();
//   const pathname = usePathname() || "";
//   const searchParams = useSearchParams();
//   const [showFreelancerEndRequestModal, setShowFreelancerEndRequestModal] =
//     useState<boolean>(false);
//   const [
//     showConfirmEndRequestPromptModal,
//     setShowConfirmEndRequestPromptModal,
//   ] = useState<{
//     show: boolean;
//     completionStatus?: string;
//   }>({
//     show: false,
//   });
//   const [loading, setLoading] = useState<boolean>(false);
//   const [showSubmitEndJobModal, setShowSubmitEndJobModal] =
//     useState<boolean>(false);
//   const [showEndJobStatusModal, setShowEndJobStatusModal] =
//     useState<boolean>(false);
//   const [endJobStatus, setEndJobStatus] = useState<string>("");
//   const [showEndJobButton, setShowEndJobButton] = useState<boolean>(false);
//   const [showDeleteJobModal, setShowDeleteJobModal] = useState<boolean>(false);
//   const [finalMilestoneModal, setFinalMilestoneModal] =
//     useState<boolean>(false);
//   const [activeTab, setActiveTab] = useState<string>(
//     initialTab || "gen_details"
//   );
//   const [totalProposals, setTotalProposals] = useState<number>(0);
//   const [totalInvitees, setTotalInvitees] = useState<number>(0);
//   const [isHidden, setIsHidden] = useState<boolean>(false);
//   const [
//     isPostVisibilityConfirmationModalOpen,
//     setIsPostVisibilityConfirmationModalOpen,
//   ] = useState(false);
//   const [isLoadingPostVisibilityModal, setIsLoadingPostVisibilityModal] =
//     useState(false);

//   const { jobdetails, isLoading, refetch, tabItems, isRefetching } =
//     useJobDetails(jobId);

//   const { profileData, refetchData } = useClientProfile();

//   // Ref that connects function and variable across different children of this component
//   const componentConnectorRef = useRef<TcomponentConnectorRef["current"]>({
//     openMilestoneListModal: () => {
//       //
//     },
//   });

//   const toggleSubmitEndJobModal = () => {
//     setShowSubmitEndJobModal((prev) => !prev);
//   };

//   useEffect(() => {
//     if (!isLoading && jobdetails) {
//       // Settings proposals count from jobdetails
//       setTotalProposals(jobdetails?.applicants ?? 0);
//       setTotalInvitees(jobdetails?.invite_count ?? 0);

//       if (
//         jobdetails.status === "active" &&
//         jobdetails?.milestone.filter((x) => x.is_final_milestone).length > 0
//       ) {
//         goToMileStoneTab();
//       }

//       if (
//         jobdetails?.is_closure_request_accepted &&
//         jobdetails?.status === "active"
//       ) {
//         toggleSubmitEndJobModal();
//       }

//       const final_milestone = jobdetails?.milestone?.filter(
//         (jb) => jb.is_final_milestone
//       );
//       if (
//         final_milestone.length > 0 &&
//         (final_milestone[0]?.hourly_status === "paid" ||
//           final_milestone[0]?.hourly_status === "released") &&
//         jobdetails?.status === "active" &&
//         !jobdetails?.milestone
//           ?.filter(
//             (data) =>
//               data.hourly_status === "paid" || data.hourly_status === "released"
//           )
//           .includes(false)
//       ) {
//         setShowEndJobButton(true);
//         setShowEndJobStatusModal(true);
//       }

//       if (
//         jobdetails?.status === "active" &&
//         jobdetails?.is_closure_request &&
//         jobdetails?.milestone.filter(
//           (x) => x.is_final_milestone && x.hourly_status === "pending"
//         ).length > 0 &&
//         jobdetails?.budget?.type == "hourly"
//       ) {
//         setFinalMilestoneModal(true);
//       }
//       setIsHidden(jobdetails?.is_hidden?.value === 1);
//     }
//   }, [jobdetails, isLoading]);

//   /** This will check if applicants tab was opened previously then it will make that tab active again */
//   useEffect(() => {
//     if (searchParams) {
//       const hasApplicants = searchParams.has("applicants");
//       if (hasApplicants) {
//         setActiveTab("applicants");
//       }
//     }
//   }, [searchParams]);

//   const onTabChange = (tab: string) => {
//     if (tab === "applicants") {
//       if (activeTab !== "applicants") {
//         makeTabPersistent();
//       }
//     } else {
//       removePersistedTab();
//     }

//     setActiveTab(tab);
//     router.push(`/client-job-details/${jobId}/${tab}`);
//   };

//   useEffect(() => {
//     const pathSegments = pathname.split("/");
//     const lastSegment = pathSegments[pathSegments.length - 1];

//     const key =
//       lastSegment &&
//       tabItems?.length > 0 &&
//       tabItems.find((tab) => lastSegment.includes(tab?.key))?.key;

//     if (key) {
//       setActiveTab(key);
//     } else if (initialTab) {
//       setActiveTab(initialTab);
//     } else {
//       if (
//         tabItems?.length > 0 &&
//         tabItems.findIndex((tab) => tab?.key === "m_stone") >= 0
//       ) {
//         setActiveTab("m_stone");
//       } else if (
//         tabItems?.length > 0 &&
//         tabItems.findIndex((tab) => tab?.key === "applicants") >= 0
//       ) {
//         setActiveTab("applicants");
//       } else {
//         setActiveTab("gen_details");
//       }
//     }
//   }, [jobId, jobdetails?.status, pathname, tabItems, initialTab]);

//   const toggleFinalMilestoneModal = () => {
//     setFinalMilestoneModal(!finalMilestoneModal);
//   };

//   const onUpdateDecline = () => {
//     setFinalMilestoneModal(false);
//   };

//   const onCancelClosureRequest = () => {
//     if (!jobdetails?.job_post_id) return;

//     setLoading(true);
//     const promise = cancelClosureRequest(jobdetails.job_post_id);
//     toast.promise(promise, {
//       loading: "Please wait...",
//       success: (res) => {
//         setLoading(false);
//         refetch();
//         return res.response;
//       },
//       error: (err) => {
//         setLoading(false);
//         return err?.response?.data?.message || "error";
//       },
//     });
//   };

//   /** @function This will make the selected tab persistent so when we come back from freelancer details page,
//    * we will be on the same tab
//    */
//   const makeTabPersistent = () => {
//     if (typeof window === "undefined") return;

//     try {
//       const url = new URL(window.location.href);
//       url.searchParams.set("applicants", "true");
//       window.history.replaceState({ path: url.toString() }, "", url.toString());
//     } catch (error) {
//       console.error("Error making tab persistent:", error);
//     }
//   };

//   /** @function This will remove the persisted tab */
//   const removePersistedTab = () => {
//     if (typeof window === "undefined") return;

//     try {
//       const url = new URL(window.location.href);
//       url.searchParams.delete("applicants");
//       window.history.replaceState({ path: url.toString() }, "", url.toString());
//     } catch (error) {
//       console.error("Error removing persisted tab:", error);
//     }
//   };

//   const goToMileStoneTab = () => {
//     setActiveTab("m_stone");
//     router.push(`/client-job-details/${jobId}/m_stone`);
//   };

//   const refreshOnStatusChange = (tab: string) => () => {
//     setActiveTab(tab);
//     router.push(`/client-job-details/${jobId}/${tab}`);
//     refetch();
//   };

//   /** @function This will toggle the modal when the freelancer has requested to end the job */
//   const toggleRequestEndJobModal = () => {
//     setShowFreelancerEndRequestModal((prev) => !prev);
//   };

//   /** @function This will open the end job prompt upon confiming freelancer end job request */
//   const openEndJobRequestConfirmPrompt = (completionStatus: string) => {
//     setEndJobStatus(completionStatus);
//     toggleRequestEndJobModal();
//     setShowEndJobStatusModal(true);
//   };

//   /** @function This will close the end job prompt upon confiming freelancer end job request */
//   const closeEndJobRequestConfirmPrompt = () => {
//     setShowConfirmEndRequestPromptModal({
//       show: false,
//     });
//     toggleRequestEndJobModal();
//   };

//   /** @function This function will be called once end job api is called from the request jon confirm prompt and successfully ended the job */
//   const onEndJob = () => {
//     setShowConfirmEndRequestPromptModal({
//       show: false,
//     });
//     refreshOnStatusChange("feedback")();
//   };

//   const onConfirm = () => {
//     setLoading(!loading);
//     setShowEndJobStatusModal(!showEndJobStatusModal);
//   };

//   const onEndJobModal = (status: string) => {
//     if (status === "error" || status === "close") {
//       if (jobdetails?.closure_req_submitted_by === "FREELANCER") {
//         setShowEndJobStatusModal(false);
//         setShowFreelancerEndRequestModal(true);
//       } else {
//         setShowEndJobStatusModal(false);
//         setLoading(!loading);
//       }
//     } else if (status === "success") {
//       setShowSubmitEndJobModal(false);
//       setShowEndJobStatusModal(false);
//       setShowFreelancerEndRequestModal(false);
//       refetch();
//     } else if (jobdetails?.closure_req_submitted_by === "FREELANCER") {
//       if (status === "continue") {
//         setShowFreelancerEndRequestModal(false);
//       } else {
//         setShowEndJobStatusModal(false);
//         setShowFreelancerEndRequestModal(true);
//       }
//     } else {
//       setShowEndJobStatusModal(false);
//     }
//   };

//   const enableEnbJobModal = (value: boolean) => {
//     setShowEndJobStatusModal(value);
//   };

//   const onBack = () => {
//     router.push("/client-jobs/");
//   };

//   const toggleDeleteJobModal = () => {
//     setShowDeleteJobModal(!showDeleteJobModal);
//   };

//   const onDelete = () => {
//     if (!jobdetails?.job_post_id) return;

//     setLoading(true);
//     const promise = deleteJob(jobdetails.job_post_id);

//     toast.promise(promise, {
//       loading: "Deleting the project...",
//       success: (res) => {
//         onBack();
//         setLoading(false);
//         return res.response;
//       },
//       error: (err) => {
//         setLoading(false);
//         return err?.response || "error";
//       },
//     });
//   };

//   const onEdit = () => {
//     if (!jobdetails?.job_post_id) return;
//     router.push(`/edit/job/${jobdetails.job_post_id}`);
//   };

//   const handleCloseJob = () => {
//     // checking that all submissions are paid
//     // 'paid', 'cancelled', 'decline', 'decline_dispute'
//     try {
//       let is_all_paid = true;

//       if (Array.isArray(jobdetails?.milestone)) {
//         jobdetails.milestone.forEach((submission) => {
//           if (is_all_paid) {
//             is_all_paid = [
//               "paid",
//               "cancelled",
//               "decline",
//               "decline_dispute",
//             ].includes(submission.hourly_status);
//           }
//         });
//       }

//       if (is_all_paid) return setShowEndJobStatusModal(true);
//     } catch (error) {
//       console.log(
//         "error: ",
//         error instanceof Error ? error.message : String(error)
//       );
//     }
//   };

//   const isFinalHourSubmitted = () => {
//     if (!jobdetails) return false;
//     if (jobdetails.budget.type !== "hourly") return false;
//     if (!Array.isArray(jobdetails?.milestone)) return false;

//     let final_milestone = false;
//     jobdetails?.milestone?.forEach(({ is_final_milestone }) => {
//       if (!final_milestone) final_milestone = !!is_final_milestone;
//     });
//     return final_milestone;
//   };

//   // 1. post job api with is_hidden toggle
//   // 2. edit user api to update user settings of showing post visibility warning
//   const apiCall = async (isDoNotShowWarningChecked: boolean) => {
//     if (!jobdetails?.job_post_id) return null;

//     const res = await postAJob({
//       job_post_id: jobdetails.job_post_id,
//       is_hidden: !isHidden ? 1 : 0,
//     });
//     if (isDoNotShowWarningChecked) {
//       const settingsKey = !isHidden
//         ? USER_PROFILE_SETTINGS_KEY.DO_NOT_SHOW_SWITCH_TO_HIDDEN_POST_WARNING
//         : USER_PROFILE_SETTINGS_KEY.DO_NOT_SHOW_SWITCH_TO_PUBLIC_POST_WARNING;
//       await editUser({
//         settings: {
//           [settingsKey]: 1,
//         },
//       });
//     }
//     return res;
//   };

//   // Switch is hidden value and update user settings
//   const handlePostVisibilityConfirm = (isDoNotShowWarningChecked: boolean) => {
//     if (!jobdetails?.job_post_id) return;

//     setIsLoadingPostVisibilityModal(true);
//     toast.promise(apiCall(isDoNotShowWarningChecked), {
//       loading: "please wait...",
//       success: () => {
//         setIsLoadingPostVisibilityModal(false);
//         setIsPostVisibilityConfirmationModalOpen(false);
//         setIsHidden((prev) => !prev);
//         refetch();
//         if (isDoNotShowWarningChecked) refetchData();
//         return "Updated post visibility successfully";
//       },
//       error: (error) => {
//         setIsLoadingPostVisibilityModal(false);
//         return error.message;
//       },
//     });
//   };

//   // If do not show again is checked then not opening modal again and
//   // directly changing value
//   const handlePostVisibilityButtonClick = (value: "PUBLIC" | "HIDDEN") => {
//     // Not allowing click if option is already selected
//     if ((value === "HIDDEN" && isHidden) || (value === "PUBLIC" && !isHidden)) {
//       return;
//     }

//     const shouldShowModal = isHidden
//       ? profileData?.settings?.do_not_show_switch_to_public_post_warning
//       : profileData?.settings?.do_not_show_switch_to_hidden_post_warning;

//     if (shouldShowModal) {
//       handlePostVisibilityConfirm(false);
//     } else {
//       setIsPostVisibilityConfirmationModalOpen(true);
//     }
//   };

//   // If job not found then redirecting to 404 page
//   if (!isLoading && !isRefetching && !jobdetails) {
//     router.push("/404");
//     return null;
//   }

//   return (
//     <PaymentProvider>
//       <Wrapper>
//         <div className="max-w-[1170px] mx-auto">
//           {/* Back button header */}
//           <div className="flex justify-between items-center">
//             <BackButton onBack={onBack}>
//               {isRefetching ? <Spinner className="ms-1" /> : null}
//             </BackButton>
//             {/* START ----------------------------------------- Post visibility switch */}
//             {jobdetails?.status === "prospects" &&
//               !isRefetching &&
//               !isLoading && (
//                 <div className="post-visibility-switch">
//                   <div
//                     className={classNames({
//                       "active user-select-none": !isHidden,
//                     })}
//                     onClick={() => handlePostVisibilityButtonClick("PUBLIC")}
//                   >
//                     Public
//                   </div>
//                   <div
//                     className={classNames({
//                       "active user-select-none": isHidden,
//                     })}
//                     onClick={() => handlePostVisibilityButtonClick("HIDDEN")}
//                   >
//                     Hidden
//                   </div>
//                 </div>
//               )}
//             {/* END ------------------------------------------- Post visibility switch */}
//           </div>

//           {(isLoading || isRefetching) && <Loader />}

//           {!isLoading && !isRefetching && jobdetails ? (
//             <DetailsBanner data={jobdetails as any} refetch={refetch} />
//           ) : null}

//           {!isLoading && !isRefetching && jobdetails && (
//             <>
//               {/* Tabs */}
//               <div className="tabs-quick-options flex items-center justify-between flex-wrap">
//                 {jobdetails?.status !== "draft" ? (
//                   <Tabs
//                     tabs={tabItems}
//                     activeTab={activeTab}
//                     onTabChange={onTabChange}
//                     counts={{
//                       applicants: totalProposals,
//                       invitees: totalInvitees,
//                     }}
//                     breakPoint="576px"
//                     fontSize="1rem"
//                   />
//                 ) : (
//                   <div className="tabs empty" />
//                 )}

//                 {/* Quick options */}

//                 <div>
//                   <QuickOptions
//                     payAllBtn
//                     jobData={{
//                       status: jobdetails?.status,
//                       jobPostId: jobdetails?.job_post_id,
//                       jobType: jobdetails?.budget?.type,
//                       freelancerUserId: jobdetails?._freelancer_user_id,
//                       freelancerData: jobdetails?.userdata,
//                       isClosureRequest: jobdetails?.is_closure_request ? 1 : 0,
//                       closureReqBy: jobdetails?.closure_req_submitted_by,
//                       isFinalMilestonePosted:
//                         jobdetails?.milestone.filter(
//                           (x) => x.is_final_milestone
//                         ).length > 0,
//                       openEndJobStatusModal: showEndJobStatusModal,
//                       enableEndJobButton: showEndJobButton,
//                       milestones: jobdetails?.milestone,
//                       endJobStatus: endJobStatus,
//                       activeTab: activeTab,
//                       is_client_feedback: jobdetails?.is_client_feedback,
//                       job_reason: jobdetails?.job_reason,
//                       is_completed: jobdetails?.is_completed ? 1 : 0,
//                     }}
//                     refetch={(tab?: string) => refreshOnStatusChange(tab || "")}
//                     goToMilestonesTab={goToMileStoneTab}
//                     onEndJobModal={onEndJobModal}
//                     componentConnectorRef={componentConnectorRef}
//                   />
//                 </div>
//               </div>

//               {activeTab == "gen_details" && (
//                 <GeneralDetails data={jobdetails} />
//               )}

//               {activeTab === "invitees" && (
//                 <Invitees
//                   jobPostId={jobdetails?.job_post_id}
//                   refetch={refreshOnStatusChange("invitees")}
//                   jobStatus={jobdetails?.status as TJOB_STATUS}
//                 />
//               )}

//               {activeTab == "messages" && <SingleMessaging id={jobId} />}

//               {activeTab == "feedback" && jobdetails?.is_completed === 0 && (
//                 <NoDataFound
//                   className="py-5"
//                   title="You can't submit review to freelancer."
//                 />
//               )}

//               {activeTab == "feedback" && jobdetails?.is_completed === 1 && (
//                 <Feedback
//                   feedbackData={jobdetails?.feedback}
//                   freelancerDetails={jobdetails?.userdata}
//                   jobPostId={jobdetails?.job_post_id}
//                   clientUserId={jobdetails?._client_user_id}
//                   freelancerUserId={jobdetails?._freelancer_user_id}
//                   onSubmitFeedback={refetch}
//                 />
//               )}

//               {activeTab === "m_stone" && (
//                 <PaymentProvider>
//                   {jobdetails.proposal?.approved_budget?.type == "fixed" && (
//                     <Milestones
//                       milestone={jobdetails?.milestone}
//                       refetch={refetch}
//                       isRefetching={isRefetching}
//                       jobstatus={jobdetails?.status}
//                       componentConnectorRef={componentConnectorRef}
//                     />
//                   )}
//                   {jobdetails.proposal?.approved_budget?.type == "hourly" && (
//                     <>
//                       {jobdetails.is_closure_request &&
//                       jobdetails.closure_req_submitted_by == "FREELANCER" &&
//                       jobdetails.status === "active" &&
//                       isFinalHourSubmitted() === false ? (
//                         <JobCloseMessageWrapper>
//                           <h3>Freelancer requested to close the project</h3>
//                           <div className="mt-4 btn-wrappers">
//                             <StyledButton
//                               padding="1rem 2rem"
//                               className={isMobile ? "mt-4 w-100" : ""}
//                               onClick={handleCloseJob}
//                             >
//                               Accept - I&apos;ll Close
//                             </StyledButton>
//                             <StyledButton
//                               onClick={onCancelClosureRequest}
//                               padding="1rem 2rem"
//                               className={isMobile ? "mt-4 w-100" : ""}
//                               variant="outline-dark"
//                             >
//                               Decline - I Want to Continue
//                             </StyledButton>
//                           </div>
//                         </JobCloseMessageWrapper>
//                       ) : null}

//                       <HoursManagement
//                         milestone={jobdetails?.milestone}
//                         refetch={refetch}
//                         setEndJobModal={enableEnbJobModal}
//                         onUpdateDecline={onUpdateDecline}
//                         componentConnectorRef={componentConnectorRef}
//                       />
//                     </>
//                   )}
//                 </PaymentProvider>
//               )}

//               {activeTab === "applicants" && (
//                 <Applicants
//                   jobTitle={jobdetails?.job_title}
//                   jobPostId={jobdetails?.job_post_id}
//                   refetch={refreshOnStatusChange("applicants")}
//                   jobStatus={jobdetails?.status as TJOB_STATUS}
//                 />
//               )}

//               <SubmitEndJobModal
//                 show={showSubmitEndJobModal}
//                 onConfirm={onConfirm}
//                 loading={loading}
//               />

//               {jobdetails?.budget?.type !== "hourly" && (
//                 <JobEndRequestByFreelancer
//                   jobPostId={jobId}
//                   refetch={refetch}
//                   show={showFreelancerEndRequestModal}
//                   toggle={toggleRequestEndJobModal}
//                   onConfirmEndJob={openEndJobRequestConfirmPrompt}
//                 />
//               )}

//               <ConfirmEndRequestPrompt
//                 jobPostId={jobId}
//                 onEndJob={onEndJob}
//                 show={showConfirmEndRequestPromptModal.show}
//                 toggle={closeEndJobRequestConfirmPrompt}
//                 completionStatus={
//                   showConfirmEndRequestPromptModal.completionStatus || ""
//                 }
//               />

//               <FinalMilestoneModal
//                 show={finalMilestoneModal}
//                 toggle={toggleFinalMilestoneModal}
//                 onConfirm={toggleFinalMilestoneModal}
//                 loading={loading}
//               />

//               <DeletePropmpt
//                 show={showDeleteJobModal}
//                 toggle={toggleDeleteJobModal}
//                 onDelete={onDelete}
//                 loading={loading}
//                 text={
//                   jobdetails?.status === "draft"
//                     ? "Are you sure you want to delete this draft? This cannot be undone."
//                     : "Are you sure you want to delete this project posting? This cannot be undone."
//                 }
//               />
//               <PostVisibilityConfirmationModal
//                 isLoading={isLoadingPostVisibilityModal}
//                 handleConfirm={handlePostVisibilityConfirm}
//                 handleReject={() => {
//                   setIsPostVisibilityConfirmationModalOpen(false);
//                 }}
//                 isHidden={!isHidden}
//                 setShow={setIsPostVisibilityConfirmationModalOpen}
//                 show={isPostVisibilityConfirmationModalOpen}
//               />
//               {jobdetails?.proposal?.approved_budget && (
//                 <>
//                   <ChangeBudgetRequestModal
//                     jobDetails={jobdetails as any}
//                     userType="client"
//                   />
//                   <ChangeBudgetDeniedModal
//                     jobDetails={jobdetails as any}
//                     refetch={refetch}
//                     userType="client"
//                   />
//                 </>
//               )}
//             </>
//           )}
//         </div>
//       </Wrapper>
//     </PaymentProvider>
//   );
// };

// export default ClientJobDetailsWrapper;

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Spinner from "@/components/forms/Spin/Spinner";
import toast from "react-hot-toast";
import classNames from "classnames";
import Loader from "@/components/Loader";
import BackButton from "@/components/ui/BackButton";
import DetailsBanner from "./partials/DetailsBanner";
import { StyledButton } from "@/components/forms/Buttons";
import Tabs from "@/components/ui/Tabs";
import GeneralDetails from "./partials/GeneralDetails";
import Feedback from "./partials/feedback";
import Milestones from "./partials/milestones";
import HoursManagement from "./partials/hours-management";
import Applicants from "./partials/applicants";
import SubmitEndJobModal from "./modals/SubmitEndJobModal";
import QuickOptions from "./quick-options/QuickOptions";
import DeletePropmpt from "@/components/ui/DeletePropmpt";
import JobEndRequestByFreelancer from "./partials/JobEndRequestByFreelancer";
import ConfirmEndRequestPrompt from "./partials/ConfirmEndRequestPrompt";
import FinalMilestoneModal from "./quick-options/FinalMilestoneModal";
import { Wrapper } from "./client-job-details.styled";
import useStartPageFromTop from "@/helpers/hooks/useStartPageFromTop";
import useResponsive from "@/helpers/hooks/useResponsive";
import useJobDetails from "./useJobDetails";
import TrashIcon from "@/public/icons/trash-orange.svg";
import EditIcon from "@/public/icons/edit-blue.svg";
import SingleMessaging from "@/components/messaging-page/SingleMessaging";
import { deleteJob } from "@/helpers/http/client";
import { PaymentProvider } from "./controllers/usePayments";
import { JobCloseMessageWrapper } from "./partials/hours-management/hours-management.styled";
import { cancelClosureRequest } from "@/helpers/http/jobs";
import { Invitees } from "./partials/invitees";
import NoDataFound from "@/components/ui/NoDataFound";
import { ChangeBudgetRequestModal } from "@/components/changeBudget/ChangeBudgetRequestModal";
import { ChangeBudgetDeniedModal } from "@/components/changeBudget/ChangeBudgetDeniedModal";
import { PostVisibilityConfirmationModal } from "./modals/PostVisibilityConfirmationModal";
import { postAJob } from "@/helpers/http/post-job";
import { editUser } from "@/helpers/http/auth";
import useClientProfile from "@/controllers/useClientProfile";
import { USER_PROFILE_SETTINGS_KEY } from "@/helpers/const/constants";
import { StatusBadge } from "@/components/styled/Badges";
import { TJOB_STATUS } from "@/helpers/types/job.type";

export type TcomponentConnectorRef = React.MutableRefObject<{
  openMilestoneListModal: () => void;
}>;

interface ClientJobDetailsProps {
  initialTab?: string;
  jobId: string;
}

const ClientJobDetails = ({ initialTab, jobId }: ClientJobDetailsProps) => {
  useStartPageFromTop();
  const { isMobile } = useResponsive();
  const router = useRouter();
  const pathname = usePathname() || "";
  const searchParams = useSearchParams();
  const [showFreelancerEndRequestModal, setShowFreelancerEndRequestModal] =
    useState<boolean>(false);
  const [
    showConfirmEndRequestPromptModal,
    setShowConfirmEndRequestPromptModal,
  ] = useState<{
    show: boolean;
    completionStatus?: string;
  }>({
    show: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [showSubmitEndJobModal, setShowSubmitEndJobModal] =
    useState<boolean>(false);
  const [showEndJobStatusModal, setShowEndJobStatusModal] =
    useState<boolean>(false);
  const [endJobStatus, setEndJobStatus] = useState<string>("");
  const [showEndJobButton, setShowEndJobButton] = useState<boolean>(false);
  const [showDeleteJobModal, setShowDeleteJobModal] = useState<boolean>(false);
  const [finalMilestoneModal, setFinalMilestoneModal] =
    useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>(
    initialTab || "gen_details"
  );
  const [totalProposals, setTotalProposals] = useState<number>(0);
  const [totalInvitees, setTotalInvitees] = useState<number>(0);
  const [isHidden, setIsHidden] = useState<boolean>(false);
  const [
    isPostVisibilityConfirmationModalOpen,
    setIsPostVisibilityConfirmationModalOpen,
  ] = useState(false);
  const [isLoadingPostVisibilityModal, setIsLoadingPostVisibilityModal] =
    useState(false);

  const { jobdetails, isLoading, refetch, tabItems, isRefetching } =
    useJobDetails(jobId);

  const { profileData, refetchData } = useClientProfile();

  // Ref that connects function and variable across different chilren of this component
  const componentConnectorRef = useRef<TcomponentConnectorRef["current"]>({
    openMilestoneListModal: () => {
      //
    },
  });

  const toggleSubmitEndJobModal = () => {
    setShowSubmitEndJobModal((prev) => !prev);
  };

  useEffect(() => {
    if (!isLoading && jobdetails) {
      // Settings proposals count from jobdetails
      setTotalProposals(jobdetails?.applicants ?? 0);
      setTotalInvitees(jobdetails?.invite_count ?? 0);

      if (
        jobdetails.status === "active" &&
        jobdetails?.milestone.filter((x) => x.is_final_milestone).length > 0
      ) {
        goToMileStoneTab();
      }

      if (
        jobdetails?.is_closure_request_accepted &&
        jobdetails?.status === "active"
      ) {
        toggleSubmitEndJobModal();
      }

      const final_milestone = jobdetails?.milestone?.filter(
        (jb) => jb.is_final_milestone
      );
      if (
        final_milestone.length > 0 &&
        (final_milestone[0]?.hourly_status === "paid" ||
          final_milestone[0]?.hourly_status === "released") &&
        jobdetails?.status === "active" &&
        !jobdetails?.milestone
          ?.filter(
            (data) =>
              data.hourly_status === "paid" || data.hourly_status === "released"
          )
          .includes(false)
      ) {
        setShowEndJobButton(true);
        setShowEndJobStatusModal(true);
      }

      if (
        jobdetails?.status === "active" &&
        jobdetails?.is_closure_request &&
        jobdetails?.milestone.filter(
          (x) => x.is_final_milestone && x.hourly_status === "pending"
        ).length > 0 &&
        jobdetails?.budget?.type == "hourly"
      ) {
        setFinalMilestoneModal(true);
      }
      setIsHidden(jobdetails?.is_hidden?.value === 1);
    }
  }, [jobdetails, isLoading]);

  /** This will check if applicants tab was opened previously then it will make that tab active again */
  useEffect(() => {
    if (searchParams) {
      const hasApplicants = searchParams.has("applicants");
      if (hasApplicants) {
        setActiveTab("applicants");
      }
    }
  }, [searchParams]);

  const onTabChange = (tab: string) => {
    if (tab === "applicants") {
      if (activeTab !== "applicants") {
        makeTabPersistent();
      }
    } else {
      removePersistedTab();
    }

    setActiveTab(tab);
    router.push(`/client-job-details/${jobId}/${tab}`);
  };

  useEffect(() => {
    const pathSegments = pathname.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];

    const key =
      lastSegment &&
      tabItems?.length > 0 &&
      tabItems.find((tab) => lastSegment.includes(tab?.key))?.key;

    if (key) {
      setActiveTab(key);
    } else if (initialTab) {
      setActiveTab(initialTab);
    } else {
      if (
        tabItems?.length > 0 &&
        tabItems.findIndex((tab) => tab?.key === "m_stone") >= 0
      ) {
        setActiveTab("m_stone");
      } else if (
        tabItems?.length > 0 &&
        tabItems.findIndex((tab) => tab?.key === "applicants") >= 0
      ) {
        setActiveTab("applicants");
      } else {
        setActiveTab("gen_details");
      }
    }
  }, [jobId, jobdetails?.status, pathname, tabItems, initialTab]);

  const toggleFinalMilestoneModal = () => {
    setFinalMilestoneModal(!finalMilestoneModal);
  };

  const onUpdateDecline = () => {
    setFinalMilestoneModal(false);
  };

  const onCancelClosureRequest = () => {
    if (!jobdetails?.job_post_id) return;

    setLoading(true);
    const promise = cancelClosureRequest(jobdetails.job_post_id);
    toast.promise(promise, {
      loading: "Please wait...",
      success: (res) => {
        setLoading(false);
        refetch();
        return res.response;
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || "error";
      },
    });
  };

  /** @function This will make the selected tab persistent so when we come back from freelancer details page,
   * we will be on the same tab
   */
  const makeTabPersistent = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("applicants", "true");

    window.history.replaceState({ path: url.toString() }, "", url.toString());
  };

  /** @function This will remove the persisted tab */
  const removePersistedTab = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("applicants");

    window.history.replaceState({ path: url.toString() }, "", url.toString());
  };

  const goToMileStoneTab = () => {
    setActiveTab("m_stone");
    router.push(`/client-job-details/${jobId}/m_stone`);
  };

  const refreshOnStatusChange = (tab: string) => () => {
    setActiveTab(tab);
    router.push(`/client-job-details/${jobId}/${tab}`);
    refetch();
  };

  /** @function This will toggle the modal when the freelancer has requested to end the job */
  const toggleRequestEndJobModal = () => {
    setShowFreelancerEndRequestModal((prev) => !prev);
  };

  /** @function This will open the end job prompt upon confiming freelancer end job request */
  const openEndJobRequestConfirmPrompt = (completionStatus: string) => {
    setEndJobStatus(completionStatus);
    toggleRequestEndJobModal();
    setShowEndJobStatusModal(true);
  };

  /** @function This will close the end job prompt upon confiming freelancer end job request */
  const closeEndJobRequestConfirmPrompt = () => {
    setShowConfirmEndRequestPromptModal({
      show: false,
    });
    toggleRequestEndJobModal();
  };

  /** @function This function will be called once end job api is called from the request jon confirm prompt and successfully ended the job */
  const onEndJob = () => {
    setShowConfirmEndRequestPromptModal({
      show: false,
    });
    refreshOnStatusChange("feedback")();
  };

  const onConfirm = () => {
    setLoading(!loading);
    setShowEndJobStatusModal(!showEndJobStatusModal);
  };

  const onEndJobModal = (status: string) => {
    if (status === "error" || status === "close") {
      if (jobdetails?.closure_req_submitted_by === "FREELANCER") {
        setShowEndJobStatusModal(false);
        setShowFreelancerEndRequestModal(true);
      } else {
        setShowEndJobStatusModal(false);
        setLoading(!loading);
      }
    } else if (status === "success") {
      setShowSubmitEndJobModal(false);
      setShowEndJobStatusModal(false);
      setShowFreelancerEndRequestModal(false);
      refetch();
    } else if (jobdetails?.closure_req_submitted_by === "FREELANCER") {
      if (status === "continue") {
        setShowFreelancerEndRequestModal(false);
      } else {
        setShowEndJobStatusModal(false);
        setShowFreelancerEndRequestModal(true);
      }
    } else {
      setShowEndJobStatusModal(false);
    }
  };

  const enableEnbJobModal = (value: boolean) => {
    setShowEndJobStatusModal(value);
  };

  const onBack = () => {
    router.push("/client-jobs/");
  };

  const toggleDeleteJobModal = () => {
    setShowDeleteJobModal(!showDeleteJobModal);
  };

  const onDelete = () => {
    if (!jobdetails?.job_post_id) return;

    setLoading(true);
    const promise = deleteJob(jobdetails.job_post_id);

    toast.promise(promise, {
      loading: "Deleting the project...",
      success: (res) => {
        onBack();
        setLoading(false);
        return res.response;
      },
      error: (err) => {
        setLoading(false);
        return err?.response || "error";
      },
    });
  };

  const onEdit = () => {
    if (!jobdetails?.job_post_id) return;
    router.push(`/edit/job/${jobdetails.job_post_id}`);
  };

  const handleCloseJob = () => {
    // checking that all submissions are paid
    // 'paid', 'cancelled', 'decline', 'decline_dispute'
    try {
      let is_all_paid = true;

      if (Array.isArray(jobdetails?.milestone)) {
        jobdetails.milestone.forEach((submission) => {
          if (is_all_paid) {
            is_all_paid = [
              "paid",
              "cancelled",
              "decline",
              "decline_dispute",
            ].includes(submission.hourly_status);
          }
        });
      }

      if (is_all_paid) return setShowEndJobStatusModal(true);
    } catch (error) {
      console.log(
        "error: ",
        error instanceof Error ? error.message : String(error)
      );
    }
  };

  const isFinalHourSubmitted = () => {
    if (!jobdetails) return false;
    if (jobdetails.budget.type !== "hourly") return false;
    if (!Array.isArray(jobdetails?.milestone)) return false;

    let final_milestone = false;
    jobdetails?.milestone?.forEach(({ is_final_milestone }) => {
      if (!final_milestone) final_milestone = !!is_final_milestone;
    });
    return final_milestone;
  };

  // 1. post job api with is_hidden toggle
  // 2. edit user api to update user settings of showing post visibility warning
  const apiCall = async (isDoNotShowWarningChecked: boolean) => {
    if (!jobdetails?.job_post_id) return null;

    const res = await postAJob({
      job_post_id: jobdetails.job_post_id,
      is_hidden: !isHidden ? 1 : 0,
    });
    if (isDoNotShowWarningChecked) {
      const settingsKey = !isHidden
        ? USER_PROFILE_SETTINGS_KEY.DO_NOT_SHOW_SWITCH_TO_HIDDEN_POST_WARNING
        : USER_PROFILE_SETTINGS_KEY.DO_NOT_SHOW_SWITCH_TO_PUBLIC_POST_WARNING;
      await editUser({
        settings: {
          [settingsKey]: 1,
        },
      });
    }
    return res;
  };

  // Switch is hidden value and update user settings
  const handlePostVisibilityConfirm = (isDoNotShowWarningChecked: boolean) => {
    if (!jobdetails?.job_post_id) return;

    setIsLoadingPostVisibilityModal(true);
    toast.promise(apiCall(isDoNotShowWarningChecked), {
      loading: "please wait...",
      success: () => {
        setIsLoadingPostVisibilityModal(false);
        setIsPostVisibilityConfirmationModalOpen(false);
        setIsHidden((prev) => !prev);
        refetch();
        if (isDoNotShowWarningChecked) refetchData();
        return "Updated post visibility successfully";
      },
      error: (error) => {
        setIsLoadingPostVisibilityModal(false);
        return error.message;
      },
    });
  };

  // If do not show again is checked then not opening modal again and
  // directly changing value
  const handlePostVisibilityButtonClick = (value: "PUBLIC" | "HIDDEN") => {
    // Not allowing click if option is already selected
    if ((value === "HIDDEN" && isHidden) || (value === "PUBLIC" && !isHidden)) {
      return;
    }

    const shouldShowModal = isHidden
      ? profileData?.settings?.do_not_show_switch_to_public_post_warning
      : profileData?.settings?.do_not_show_switch_to_hidden_post_warning;

    if (shouldShowModal) {
      handlePostVisibilityConfirm(false);
    } else {
      setIsPostVisibilityConfirmationModalOpen(true);
    }
  };

  // If job not found then redirecting to 404 page
  if (!isLoading && !isRefetching && !jobdetails) {
    router.push("/404");
    return null;
  }

  return (
    <div className="px-4 lg:px-0 w-full max-w-[970px] mx-auto">
      <Wrapper>
        {/* Back button header */}
        <div className="flex justify-between items-center">
          <BackButton onBack={onBack}>
            {isRefetching ? <Spinner className="ms-1" /> : null}
          </BackButton>
          {/* START ----------------------------------------- Post visibility switch */}
          {jobdetails?.status === "prospects" &&
            !isRefetching &&
            !isLoading && (
              <div className="post-visibility-switch">
                <div
                  className={classNames({
                    "active user-select-none": !isHidden,
                  })}
                  onClick={() => handlePostVisibilityButtonClick("PUBLIC")}
                >
                  Public
                </div>
                <div
                  className={classNames({
                    "active user-select-none": isHidden,
                  })}
                  onClick={() => handlePostVisibilityButtonClick("HIDDEN")}
                >
                  Hidden
                </div>
              </div>
            )}
          {/* END ------------------------------------------- Post visibility switch */}
        </div>

        {(isLoading || isRefetching) && <Loader />}

        {!isLoading && !isRefetching && jobdetails ? (
          <DetailsBanner data={jobdetails as any} refetch={refetch} />
        ) : null}

        {!isLoading && !isRefetching && jobdetails && (
          <>
            {/* Tabs */}
            <div className="tabs-quick-options flex items-center justify-between flex-wrap">
              {jobdetails?.status !== "draft" ? (
                <Tabs
                  tabs={tabItems}
                  activeTab={activeTab}
                  onTabChange={onTabChange}
                  counts={{
                    applicants: totalProposals,
                    invitees: totalInvitees,
                  }}
                  breakPoint="576px"
                  fontSize="1rem"
                />
              ) : (
                <div className="tabs empty" />
              )}

              {/* Quick options */}

              <div>
                <PaymentProvider>
                  <QuickOptions
                    payAllBtn
                    jobData={{
                      status: jobdetails?.status,
                      jobPostId: jobdetails?.job_post_id,
                      jobType: jobdetails?.budget?.type,
                      freelancerUserId: jobdetails?._freelancer_user_id,
                      freelancerData: jobdetails?.userdata,
                      isClosureRequest: jobdetails?.is_closure_request ? 1 : 0,
                      closureReqBy: jobdetails?.closure_req_submitted_by,
                      isFinalMilestonePosted:
                        jobdetails?.milestone.filter(
                          (x) => x.is_final_milestone
                        ).length > 0,
                      openEndJobStatusModal: showEndJobStatusModal,
                      enableEndJobButton: showEndJobButton,
                      milestones: jobdetails?.milestone,
                      endJobStatus: endJobStatus,
                      activeTab: activeTab,
                      is_client_feedback: jobdetails?.is_client_feedback,
                      job_reason: jobdetails?.job_reason,
                      is_completed: jobdetails?.is_completed ? 1 : 0,
                    }}
                    refetch={(tab?: string) => refreshOnStatusChange(tab || "")}
                    goToMilestonesTab={goToMileStoneTab}
                    onEndJobModal={onEndJobModal}
                    componentConnectorRef={componentConnectorRef}
                  />
                </PaymentProvider>

                {/* Moving Draft/Prospects options out of QuickOptions to show independent of desktop/mobile */}
                {jobdetails?.status === "draft" && (
                  <div className="flex items-center justify-between">
                    <StyledButton
                      className="align-left"
                      padding="1rem 2rem"
                      onClick={onEdit}
                    >
                      Continue Posting
                    </StyledButton>
                    <div
                      className="round-button flex justify-center items-center cursor-pointer"
                      onClick={() => !loading && toggleDeleteJobModal()}
                    >
                      <TrashIcon />
                    </div>
                  </div>
                )}

                {jobdetails?.status === "prospects" && (
                  <div className="proposal-actions flex items-center flex-wrap gap-3 justify-center w-100">
                    <div
                      className="edit-btn flex justify-center items-center cursor-pointer"
                      onClick={() => !loading && onEdit()}
                    >
                      <EditIcon stroke="#0067FF" fill="#0067FF" />
                      <span>Edit</span>
                    </div>
                    <div
                      className="delete-btn p-2 cursor-pointer flex items-center"
                      onClick={() => !loading && toggleDeleteJobModal()}
                    >
                      <TrashIcon />
                      <span>Delete</span>
                    </div>
                  </div>
                )}
                {/* Moving Job status out of QuickOptions to show independent of desktop/mobile */}
                {jobdetails?.status === "active" &&
                jobdetails?.is_closure_request &&
                jobdetails?.closure_req_submitted_by === "CLIENT" &&
                !showEndJobButton ? (
                  <StatusBadge
                    color="darkPink"
                    className={classNames(
                      { "mt-4": isMobile },
                      "closure-request-status-badge"
                    )}
                  >
                    {jobdetails?.milestone.filter((x) => x.is_final_milestone)
                      .length > 0
                      ? "Final Hours Submitted by Freelancer"
                      : "Closure Requested - Waiting for Freelancer Response"}
                  </StatusBadge>
                ) : null}
              </div>
            </div>

            {activeTab == "gen_details" && <GeneralDetails data={jobdetails} />}

            {activeTab === "invitees" && (
              <Invitees
                jobPostId={jobdetails?.job_post_id}
                refetch={refreshOnStatusChange("invitees")}
                jobStatus={jobdetails?.status as TJOB_STATUS}
              />
            )}

            {activeTab == "messages" && <SingleMessaging id={jobId} />}

            {activeTab == "feedback" && jobdetails?.is_completed === 0 && (
              <NoDataFound
                className="py-5"
                title="You can't submit review to freelancer."
              />
            )}

            {activeTab == "feedback" && jobdetails?.is_completed === 1 && (
              <Feedback
                feedbackData={jobdetails?.feedback}
                freelancerDetails={jobdetails?.userdata}
                jobPostId={jobdetails?.job_post_id}
                clientUserId={jobdetails?._client_user_id}
                freelancerUserId={jobdetails?._freelancer_user_id}
                onSubmitFeedback={refetch}
              />
            )}

            {activeTab === "m_stone" && (
              <PaymentProvider>
                {jobdetails.proposal?.approved_budget?.type == "fixed" && (
                  <Milestones
                    milestone={jobdetails?.milestone}
                    refetch={refetch}
                    isRefetching={isRefetching}
                    jobstatus={jobdetails?.status}
                    componentConnectorRef={componentConnectorRef}
                  />
                )}
                {jobdetails.proposal?.approved_budget?.type == "hourly" && (
                  <>
                    {jobdetails.is_closure_request &&
                    jobdetails.closure_req_submitted_by == "FREELANCER" &&
                    jobdetails.status === "active" &&
                    isFinalHourSubmitted() === false ? (
                      <JobCloseMessageWrapper>
                        <h3>Freelancer requested to close the project</h3>
                        <div className="mt-4 btn-wrappers">
                          <StyledButton
                            padding="1rem 2rem"
                            className={isMobile ? "mt-4 w-100" : ""}
                            onClick={handleCloseJob}
                          >
                            Accept - I&apos;ll Close
                          </StyledButton>
                          <StyledButton
                            onClick={onCancelClosureRequest}
                            padding="1rem 2rem"
                            className={isMobile ? "mt-4 w-100" : ""}
                            variant="outline-dark"
                          >
                            Decline - I Want to Continue
                          </StyledButton>
                        </div>
                      </JobCloseMessageWrapper>
                    ) : null}

                    <HoursManagement
                      milestone={jobdetails?.milestone}
                      refetch={refetch}
                      setEndJobModal={enableEnbJobModal}
                      onUpdateDecline={onUpdateDecline}
                      componentConnectorRef={componentConnectorRef}
                    />
                  </>
                )}
              </PaymentProvider>
            )}

            {activeTab === "applicants" && (
              <Applicants
                jobTitle={jobdetails?.job_title}
                jobPostId={jobdetails?.job_post_id}
                refetch={refreshOnStatusChange("applicants")}
                jobStatus={jobdetails?.status as TJOB_STATUS}
              />
            )}

            <SubmitEndJobModal
              show={showSubmitEndJobModal}
              onConfirm={onConfirm}
              loading={loading}
            />

            {jobdetails?.budget?.type !== "hourly" && (
              <JobEndRequestByFreelancer
                jobPostId={jobId}
                refetch={refetch}
                show={showFreelancerEndRequestModal}
                toggle={toggleRequestEndJobModal}
                onConfirmEndJob={openEndJobRequestConfirmPrompt}
              />
            )}

            <ConfirmEndRequestPrompt
              jobPostId={jobId}
              onEndJob={onEndJob}
              show={showConfirmEndRequestPromptModal.show}
              toggle={closeEndJobRequestConfirmPrompt}
              completionStatus={
                showConfirmEndRequestPromptModal.completionStatus || ""
              }
            />

            <FinalMilestoneModal
              show={finalMilestoneModal}
              toggle={toggleFinalMilestoneModal}
              onConfirm={toggleFinalMilestoneModal}
              loading={loading}
            />

            <DeletePropmpt
              show={showDeleteJobModal}
              toggle={toggleDeleteJobModal}
              onDelete={onDelete}
              loading={loading}
              text={
                jobdetails?.status === "draft"
                  ? "Are you sure you want to delete this draft? This cannot be undone."
                  : "Are you sure you want to delete this project posting? This cannot be undone."
              }
            />
            <PostVisibilityConfirmationModal
              isLoading={isLoadingPostVisibilityModal}
              handleConfirm={handlePostVisibilityConfirm}
              handleReject={() => {
                setIsPostVisibilityConfirmationModalOpen(false);
              }}
              isHidden={!isHidden}
              setShow={setIsPostVisibilityConfirmationModalOpen}
              show={isPostVisibilityConfirmationModalOpen}
            />
            {jobdetails?.proposal?.approved_budget && (
              <>
                <ChangeBudgetRequestModal
                  jobDetails={jobdetails as any}
                  userType="client"
                />
                <ChangeBudgetDeniedModal
                  jobDetails={jobdetails as any}
                  refetch={refetch}
                  userType="client"
                />
              </>
            )}
          </>
        )}
      </Wrapper>
    </div>
  );
};

export default ClientJobDetails;
