/*
 * This component displays the banner of job details page
 */
import { useMemo, useState } from "react";
import { useTheme } from "styled-components";
import moment from "moment";
import { StatusBadge } from "@/components/styled/Badges";
import BlurredImage from "@/components/ui/BlurredImage";
import EditDueDate from "./EditDueDate";
import {
  DraftProspectJobBanner,
  InProgressClosedJobWrapper,
} from "../client-job-details.styled";
import {
  numberWithCommas,
  changeStatusDisplayFormat,
  showFormattedBudget,
  convertToTitleCase,
} from "@/helpers/utils/misc";
import { JOBS_STATUS } from "@/app/jobs/consts";
import Edit from "@/public/icons/edit.svg";
import { getJobExpirationInDays } from "@/helpers/utils/helper";
import ChangeBudgetModal from "@/components/changeBudget/ChangeBudgetModal";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { ChangeBudgetDeleteRequest } from "@/components/changeBudget/ChangeBudgetDeleteRequest";
import { TJobDetails } from "@/helpers/types/job.type";
import MilestoneStats from "./MilestoneStats";
import SendTipModal from "@/components/sendTip/SendTipModal";

interface DetailsBannerProps {
  data: TJobDetails;
  refetch: () => void;
}

const JobDetailsBanner = ({ data, refetch }: DetailsBannerProps) => {
  const [changeBudgetModal, setChangeBudgetModal] = useState<boolean>(false);
  const [changeBudgetDeleteModal, setChangeBudgetDeleteModal] = useState(false);
  const [editDueDateModal, setEditDueDateModal] = useState<boolean>(false);
  const [sendTipModal, setSendTipModal] = useState<boolean>(false);
  const theme = useTheme();
  /* This will format the date label to be displayed */
  const dateLabel = useMemo(() => {
    if (data?.status == "draft") {
      return "Date started: ";
    } else if (["prospects", "deleted"].includes(data?.status)) {
      return "Posted on: ";
    } else {
      return "Started: ";
    }
  }, [data?.status]);

  /* This will format the date label to be displayed */
  const jobStatus = useMemo(() => {
    /* checking if the job got expired. */
    if (
      data?.attributes &&
      data?.attributes?.isExpired &&
      data?.status === "deleted"
    )
      return "Expired";

    if (data?.status === "draft") {
      return "Drafts";
    } else if (data?.status === "prospects") {
      return "Posted Project";
    } else if (data?.status === "active") {
      return "Work In Progress";
    } else if (data?.status === "closed") {
      return "Closed";
    } else if (data?.status === "deleted") {
      return "Closed Before Hiring Freelancer";
    }
  }, [data?.status]);

  /** @function This will open/close the edit due date modal */
  const toggleEditDueDateModal = () => {
    setEditDueDateModal((prev) => !prev);
  };

  const expirationDays = getJobExpirationInDays(data);

  return ["draft", "prospects", "deleted"].includes(data?.status) ? (
    <DraftProspectJobBanner className="flex flex-col gap-3">
      <div className="header flex justify-between items-start flex-wrap gap-3">
        <header className="banner-title text-2xl font-normal">
          {convertToTitleCase(data.job_title)}
        </header>
        <div>
          <StatusBadge
            className="w-fit"
            color={JOBS_STATUS[data?.status]?.color}
          >
            {jobStatus}
          </StatusBadge>
          {data.status === "prospects" && expirationDays && (
            <StatusBadge className="w-fit ms-3" color={"pink"}>
              {expirationDays}
            </StatusBadge>
          )}
        </div>
      </div>
      <div className="budget-and-earnings flex flex-col lg:flex-row lg:items-center gap-3">
        {/* START ----------------------------------------- Started on */}
        <div>
          <span className="text-gray-500 text-xl font-normal">{dateLabel}</span>
          <span className="job-date text-xl font-normal">
            {moment(data?.date_created).format("MMM DD, YYYY")}
          </span>
        </div>
        {/* END ------------------------------------------- Started on */}

        {/* START ----------------------------------------- Closed on */}
        {data?.status === "deleted" && data?.date_modified && (
          <>
            <Divider />
            <div>
              <span className="text-gray-500 text-xl font-normal">
                Closed On:{" "}
              </span>
              <span className="job-date text-xl font-normal">
                {moment(data.date_modified).format("MMM DD, YYYY")}
              </span>
            </div>
          </>
        )}
        {/* END ------------------------------------------- Closed on */}

        <Divider />
        <div className="gap-2">
          <span className="text-gray-500 text-xl font-normal">Budget: </span>
          <span className="budget-amount text-xl font-normal">
            {data?.budget?.isProposal === true
              ? "Open to Proposals"
              : data?.budget
                ? showFormattedBudget(data?.budget)
                : "-"}
          </span>
        </div>
        {["prospects", "deleted"].includes(data.status) && data?.due_date && (
          <>
            <Divider />
            <div className="gap-2">
              <span className="text-gray-500 text-xl font-normal">
                Due Date:{" "}
              </span>
              <span className="budget-amount text-xl font-normal">
                {moment(data?.due_date).format("MMM DD, YYYY")}
              </span>
            </div>
          </>
        )}
      </div>
    </DraftProspectJobBanner>
  ) : (
    <>
      {data?.milestone.length > 0 && (
        <MilestoneStats
          milestones={data.milestone}
          isHourly={data?.budget?.type === "hourly"}
        />
      )}
      <InProgressClosedJobWrapper>
        <div className="header flex flex-col md:flex-row justify-between items-start gap-3">
          <div className="job-basic-details flex flex-col">
            <header className="banner-title text-2xl font-normal">
              {convertToTitleCase(data?.job_title)}
            </header>
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
              <div>
                <span className="text-gray-500 text-xl font-normal">
                  {dateLabel}
                </span>
                <span className="text-xl font-normal">
                  {data?.job_start_date &&
                    moment(data?.job_start_date).format("MMM DD, YYYY")}
                </span>
              </div>
              {data?.status === "active" && (
                <div className="flex items-center gap-3">
                  <Divider />
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xl font-normal">
                      Due Date:{" "}
                    </span>
                    <span className="budget-amount text-xl font-normal">
                      {data?.due_date
                        ? moment(data?.due_date).format("MMM DD, YYYY")
                        : "-"}
                    </span>

                    <span
                      className="cursor-pointer"
                      onClick={toggleEditDueDateModal}
                    >
                      <Edit stroke={theme.colors.primary} />
                    </span>
                  </div>
                </div>
              )}
              {data?.status === "closed" && (
                <div className="flex items-center gap-3">
                  <Divider />
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xl font-normal">
                      Ended:{" "}
                    </span>
                    <span className="budget-amount text-xl font-normal">
                      {data?.job_end_date
                        ? moment(data?.job_end_date).format("MMM DD, YYYY")
                        : "-"}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <StatusBadge
              className="w-fit"
              color={
                JOBS_STATUS[data?.status]?.color
                  ? JOBS_STATUS[data?.status]?.color
                  : "gray"
              }
            >
              {data?.status == "active"
                ? "Work In Progress"
                : changeStatusDisplayFormat(data?.status)}
            </StatusBadge>
          </div>
          <div>
            <BlurredImage
              src={data?.userdata?.user_image || "/images/default_avatar.png"}
              height="5.25rem"
              width="5.25rem"
              className="flex justify-center"
            />
            <div className="hired-freelancer-name">
              <div className="text-xl font-normal capitalize">
                {data?.userdata?.first_name} {data?.userdata?.last_name}
                <span className="text-gray-500 text-lg font-normal pl-2">
                  Hired
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="budget-and-earnings md:gap-4 gap-3 flex flex-col md:flex-row md:items-center justify-between ">
          <div className="flex-1">
            <label className="text-gray-500 text-base font-normal">
              Total Budget
            </label>
            <div className="mt-1 text-xl font-normal">
              {data?.proposal?.approved_budget?.amount ? (
                <>
                  {numberWithCommas(
                    data?.proposal?.approved_budget?.amount,
                    "USD"
                  )}
                  {data?.proposal?.approved_budget?.type === "hourly"
                    ? "/hr"
                    : ""}
                </>
              ) : null}
              {/* START ----------------------------------------- Change budget button */}
              {/* 
            {/* 
            1. job is in progress
            2. budget change status isn't pending. should be accepted or denied OR
             budget change request should be initiated by client 
            */}
              {data?.status == "active" &&
                (data?.proposal?.budget_change?.status !== "pending" ||
                  data?.proposal?.budget_change?.requested_by !== "client") && (
                  <span
                    className="budget-change-button inline-block"
                    onClick={() => setChangeBudgetModal((prev) => !prev)}
                  >
                    Change Budget
                  </span>
                )}
              {/* END ------------------------------------------- Change budget button */}
            </div>
          </div>

          {/* START ----------------------------------------- Requested increase budget amount */}
          {/*
        1. project should be in progress 
        2. budget change request status should be pending
        3. should have amount in budget change
        */}
          {data?.status == "active" &&
            data?.proposal?.budget_change?.status === "pending" &&
            data?.proposal?.budget_change?.amount && (
              <div className="budget-and-earnings__block gap-2 flex-1">
                <label className="text-gray-500 text-base font-normal flex gap-2">
                  Requested{" "}
                  {data?.proposal?.approved_budget?.type == "hourly"
                    ? "rate"
                    : "budget"}{" "}
                  <FaEdit
                    className="cursor-pointer text-gray-900 align-top"
                    onClick={() => setChangeBudgetModal(true)}
                  />
                  <MdDelete
                    className="cursor-pointer text-gray-900 align-top"
                    onClick={() => setChangeBudgetDeleteModal(true)}
                  />
                </label>
                <div className="text-xl font-normal mt-1 ml-4">
                  {data?.proposal?.budget_change?.amount &&
                    `${numberWithCommas(
                      data?.proposal?.budget_change?.amount,
                      "USD"
                    )}${
                      data?.proposal?.approved_budget?.type == "hourly"
                        ? "/hr"
                        : ""
                    }`}
                </div>
              </div>
            )}
          {/* END ------------------------------------------- Requested increase budget amount */}

          <div className="flex-1 ">
            <div className="text-gray-500 text-base font-normal">
              {data?.budget?.type == "hourly"
                ? "Total Hours Worked"
                : "Total in Milestones"}
            </div>
            <div className="mt-1 text-xl font-normal">
              {data?.budget?.type == "hourly"
                ? data?.total_hours
                  ? `${numberWithCommas(data?.total_hours)} Hours`
                  : "0"
                : data?.milestone
                      ?.filter((milestone) => milestone.status !== "cancelled")
                      .reduce((sum, milestone) => sum + milestone.amount, 0)
                  ? `${numberWithCommas(
                      data?.milestone
                        ?.filter(
                          (milestone) => milestone.status !== "cancelled"
                        )
                        .reduce((sum, milestone) => sum + milestone.amount, 0),
                      "USD"
                    )}`
                  : "-"}
            </div>
          </div>
          <div className="divider hidden lg:block" />
          <div className="flex-1">
            <label className="text-gray-500 text-base font-normal">
              Sent to Freelancer
            </label>
            <div className="mt-1 text-xl font-normal">
              {data?.paid ? numberWithCommas(data?.paid, "USD") : "$0"}
            </div>
          </div>

          <span
            className="inline-block budget-change-button h-fit self-end cursor-pointer"
            onClick={() => setSendTipModal(true)}
          >
            Send Tip
          </span>
        </div>
        {data?.proposal?.approved_budget && (
          <ChangeBudgetModal
            show={changeBudgetModal}
            toggle={() => setChangeBudgetModal((prev) => !prev)}
            jobDetails={data}
            userType="client"
          />
        )}
        <ChangeBudgetDeleteRequest
          show={changeBudgetDeleteModal}
          setShow={(value) => setChangeBudgetDeleteModal(value)}
          jobPostId={data?.job_post_id}
          refetch={refetch}
        />
        <EditDueDate
          show={editDueDateModal}
          toggle={toggleEditDueDateModal}
          update={refetch}
          data={{
            jobId: data?.job_post_id,
            dueDate: data?.due_date,
          }}
        />
        <SendTipModal
          show={sendTipModal}
          toggle={() => setSendTipModal(false)}
          jobId={data?.job_post_id}
          refetch={refetch}
        />
      </InProgressClosedJobWrapper>
    </>
  );
};

export default JobDetailsBanner;

const Divider = () => {
  return <div className="hidden lg:block opacity-50">|</div>;
};
