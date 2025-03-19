/*
 * This component displays the banner of job details page
 */
import { useMemo, useState } from "react";
import { useTheme } from "styled-components";
import moment from "moment";
import { StatusBadge } from "components/styled/Badges";
import BlurredImage from "components/ui/BlurredImage";
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
} from "helpers/utils/misc";
import { JOBS_STATUS } from "pages/jobs/consts";
import { ReactComponent as Edit } from "assets/icons/edit.svg";
import { getJobExpirationInDays } from "helpers/utils/helper";
import ChangeBudgetModal from "components/changeBudget/ChangeBudgetModal";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { ChangeBudgetDeleteRequest } from "components/changeBudget/ChangeBudgetDeleteRequest";
import { TJobDetails } from "helpers/types/job.type";
import MilestoneStats from "./MilestoneStats";

const JobDetailsBanner = ({
  data,
  refetch,
}: {
  data: TJobDetails;
  refetch: () => void;
}) => {
  const [changeBudgetModal, setChangeBudgetModal] = useState<boolean>(false);
  const [changeBudgetDeleteModal, setChangeBudgetDeleteModal] = useState(false);
  const [editDueDateModal, setEditDueDateModal] = useState<boolean>(false);
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

  console.log(data);

  const expirationDays = getJobExpirationInDays(data);

  return ["draft", "prospects", "deleted"].includes(data?.status) ? (
    <DraftProspectJobBanner className="d-flex flex-column gap-3">
      <div className="header d-flex justify-content-between align-items-start flex-wrap gap-3">
        <header className="banner-title fs-24 font-normal">
          {convertToTitleCase(data.job_title)}
        </header>
        <div>
          <StatusBadge
            className="width-fit-content"
            color={JOBS_STATUS[data?.status]?.color}
          >
            {jobStatus}
          </StatusBadge>
          {data.status === "prospects" && expirationDays && (
            <StatusBadge className="width-fit-content ms-3" color={"pink"}>
              {expirationDays}
            </StatusBadge>
          )}
        </div>
      </div>
      <div className="budget-and-earnings d-flex flex-column flex-lg-row align-items-lg-center gap-3">
        {/* START ----------------------------------------- Started on */}
        <div>
          <span className="light-text fs-20 font-normal">{dateLabel}</span>
          <span className="job-date fs-20 font-normal">
            {moment(data?.date_created).format("MMM DD, YYYY")}
          </span>
        </div>
        {/* END ------------------------------------------- Started on */}

        {/* START ----------------------------------------- Closed on */}
        {data?.status === "deleted" && data?.date_modified && (
          <>
            <Divider />
            <div>
              <span className="light-text fs-20 font-normal">Closed On: </span>
              <span className="job-date fs-20 font-normal">
                {moment(data.date_modified).format("MMM DD, YYYY")}
              </span>
            </div>
          </>
        )}
        {/* END ------------------------------------------- Closed on */}

        <Divider />
        <div className="gap-2">
          <span className="light-text fs-20 font-normal">Budget: </span>
          <span className="budget-amount fs-20 font-normal">
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
              <span className="light-text fs-20 font-normal">Due Date: </span>
              <span className="budget-amount fs-20 font-normal">
                {moment(data?.due_date).format("MMM DD, YYYY")}
              </span>
            </div>
          </>
        )}
      </div>
    </DraftProspectJobBanner>
  ) : (
    <>
      {data.milestone.length > 0 && (
        <MilestoneStats
          milestones={data.milestone}
          isHourly={data.budget?.type === "hourly"}
        />
      )}
      <InProgressClosedJobWrapper>
        <div className="header d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
          <div className="job-basic-details d-flex flex-column">
            <header className="banner-title fs-24 font-normal">
              {convertToTitleCase(data.job_title)}
            </header>
            <div className="d-flex flex-column flex-lg-row align-lg-items-center gap-3">
              <div>
                <span className="light-text fs-20 font-normal">
                  {dateLabel}
                </span>
                <span className="fs-20 font-normal">
                  {data?.job_start_date &&
                    moment(data?.job_start_date).format("MMM DD, YYYY")}
                </span>
              </div>
              {data.status === "active" && (
                <div className="d-flex align-items-center gap-3">
                  <Divider />
                  <div className="d-flex align-items-center gap-2">
                    <span className="light-text fs-20 font-normal">
                      Due Date:{" "}
                    </span>
                    <span className="budget-amount fs-20 font-normal">
                      {data?.due_date
                        ? moment(data?.due_date).format("MMM DD, YYYY")
                        : "-"}
                    </span>

                    <span className="pointer" onClick={toggleEditDueDateModal}>
                      <Edit stroke={theme.colors.primary} />
                    </span>
                  </div>
                </div>
              )}
              {data.status === "closed" && (
                <div className="d-flex align-items-center gap-3">
                  <Divider />
                  <div className="d-flex align-items-center gap-2">
                    <span className="light-text fs-20 font-normal">
                      Ended:{" "}
                    </span>
                    <span className="budget-amount fs-20 font-normal">
                      {data?.job_end_date
                        ? moment(data?.job_end_date).format("MMM DD, YYYY")
                        : "-"}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <StatusBadge
              className="width-fit-content"
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
              className="d-flex justify-content-center"
            />
            <div className="hired-freelancer-name">
              <div className="fs-20 font-normal capitalize">
                {data?.userdata?.first_name} {data?.userdata?.last_name}
                <span className="light-text fs-18 font-normal ps-2">Hired</span>
              </div>
            </div>
          </div>
        </div>

        <div className="budget-and-earnings gap-md-4 gap-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between">
          <div className="flex-1">
            <label className="light-text fs-1rem font-normal">
              Total Budget
            </label>
            <div className="mt-1 fs-20 font-normal">
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
                    className="budget-change-button d-inline-block"
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
                <label className="light-text fs-1rem font-normal">
                  Requested{" "}
                  {data?.proposal?.approved_budget?.type == "hourly"
                    ? "rate"
                    : "budget"}{" "}
                  <FaEdit
                    className="pointer text-dark align-text-top"
                    onClick={() => setChangeBudgetModal(true)}
                  />
                  <MdDelete
                    className="pointer text-dark align-text-top ms-1"
                    onClick={() => setChangeBudgetDeleteModal(true)}
                  />
                </label>
                <div className="fs-20 font-normal mt-1 ms-4">
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

          <div className="flex-1">
            <div className="light-text fs-1rem font-normal">
              {data?.budget?.type == "hourly"
                ? "Total Hours Worked"
                : "Total in Milestones"}
            </div>
            <div className="mt-1 fs-20 font-normal">
              {data?.budget?.type == "hourly"
                ? data?.total_hours
                  ? `${numberWithCommas(data?.total_hours)} Hours`
                  : "0"
                : data?.milestone
                    ?.filter((milestone) => milestone.status !== "cancelled")
                    .reduce((sum, milestone) => sum + milestone.amount, 0)
                ? `${numberWithCommas(
                    data?.milestone
                      ?.filter((milestone) => milestone.status !== "cancelled")
                      .reduce((sum, milestone) => sum + milestone.amount, 0),
                    "USD"
                  )}`
                : "-"}
            </div>
          </div>
          <div className="divider d-none d-md-block" />
          <div className="flex-1">
            <label className="light-text fs-1rem font-normal">
              Sent to Freelancer
            </label>
            <div className="mt-1 fs-20 font-normal">
              {data?.paid ? numberWithCommas(data?.paid, "USD") : "$0"}
            </div>
          </div>
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
          jobPostId={data.job_post_id}
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
      </InProgressClosedJobWrapper>
    </>
  );
};

export default JobDetailsBanner;

const Divider = () => {
  return <div className="d-none d-lg-block opacity-50">|</div>;
};
