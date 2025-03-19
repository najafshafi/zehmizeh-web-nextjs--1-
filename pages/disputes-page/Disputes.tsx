/*
 * This component will list down all the disputes
 */
"use client";
import { useState } from "react";
import moment from "moment";
import { Wrapper, DisputeListItem } from "./disputes.styled";
import Loader from "@/components/Loader";
import BackButton from "@/components/ui/BackButton";
import { StatusBadge, StatusColor } from "@/components/styled/Badges";
import NoDataFound from "@/components/ui/NoDataFound";
import StyledHtmlText from "@/components/ui/StyledHtmlText";
import PaginationComponent from "@/components/ui/Pagination";
import useDisputes from "./hooks/useDisputes";
import useStartPageFromTop from "@/helpers/hooks/useStartPageFromTop";
import DisputeDetails from "./DisputeDetails";
import { convertToTitleCase } from "@/helpers/utils/misc";

interface DisputeStatus {
  color: StatusColor;
  label: string;
}

interface DisputeStatusMap {
  [key: string]: DisputeStatus;
}

interface DisputeItem {
  dispute_id: string;
  job_title: string;
  milestone?: {
    title: string;
  };
  description: string;
  submitted_by: string;
  clientdata?: {
    first_name: string;
    last_name: string;
  };
  freelancerdata?: {
    first_name: string;
    last_name: string;
  };
  dispute_status: string;
  date_created: string;
  date_modified: string;
}

const DISPUTE_STATUSES: DisputeStatusMap = {
  closed: {
    color: "green",
    label: "Closed",
  },
  opened: {
    color: "pinkTint",
    label: "Open",
  },
};

const RECORDS_PER_PAGE = 10;

const Disputes = () => {
  useStartPageFromTop();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [detailsModalState, setDetailsModalState] = useState<{
    show: boolean;
    disputeId: string;
  }>({
    show: false,
    disputeId: "",
  });

  const { data, isLoading, isRefetching, totalResults } = useDisputes({
    page: currentPage,
    limit: RECORDS_PER_PAGE,
  });

  const onPageChange = (page: { selected: number }) => {
    /* This will set next page as active and load new page data */
    setCurrentPage(page?.selected + 1);
  };

  const showDisputeDetails = (disputeId: string) => () => {
    setDetailsModalState({
      show: true,
      disputeId,
    });
  };

  const onCloseDetailsModal = () => {
    setDetailsModalState({
      show: false,
      disputeId: "",
    });
  };

  return (
    <div className=" h-full min-w-[1170px] mt-10">
      <Wrapper>
        {/* Back button */}
        <BackButton />

        {/* Page Title */}

        <h1 className="title text-center font-normal">Dispute History</h1>

        {isLoading || (isRefetching && <Loader />)}

        {!isLoading && !isRefetching && data?.length == 0 && (
          <NoDataFound className="py-5" />
        )}

        {!isLoading &&
          data?.length > 0 &&
          data.map((item: DisputeItem) => (
            <DisputeListItem
              key={item?.dispute_id}
              className="flex justify-between flex-wrap gap-3 pointer"
              onClick={showDisputeDetails(item?.dispute_id)}
            >
              <div className="dispute-content">
                <div className="flex dispute-row flex-wrap">
                  <div className="label text-xl font-normal">Project Name:</div>
                  <div className="value text-xl font-normal">
                    {convertToTitleCase(item?.job_title)}
                  </div>
                </div>
                <div className="flex mt-2 dispute-row flex-wrap">
                  <div className="label text-xl font-normal">Milestone:</div>
                  <div className="value text-xl font-normal">
                    <StyledHtmlText
                      htmlString={item?.milestone?.title}
                      id={`dispute_${item?.milestone?.title}`}
                      needToBeShorten={true}
                    />
                  </div>
                </div>
                <div className="flex mt-2 dispute-row flex-wrap">
                  <div className="label text-xl font-normal">Reason:</div>
                  <div className="value text-xl font-normal">
                    <StyledHtmlText
                      htmlString={item?.description}
                      id={`dispute_${item.dispute_id}`}
                      needToBeShorten={true}
                    />
                  </div>
                </div>
                <div className="flex mt-2 dispute-row flex-wrap">
                  <div className="label text-xl font-normal">Submitted By:</div>
                  <div className="value text-xl font-normal capitalize">
                    {item?.submitted_by === "CLIENT"
                      ? `${item?.clientdata?.first_name} ${item?.clientdata?.last_name}`
                      : `${item?.freelancerdata?.first_name} ${item?.freelancerdata?.last_name}`}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div>
                  <StatusBadge
                    color={
                      DISPUTE_STATUSES[item?.dispute_status]?.color || "gray"
                    }
                  >
                    {DISPUTE_STATUSES[item?.dispute_status]?.label || "Unknown"}
                  </StatusBadge>
                </div>
                <div className="created-date text-xl font-normal mt-4">
                  Submitted On:{" "}
                  {item.date_created &&
                    moment(item.date_created).format("MMM DD, YYYY")}
                </div>
                <div className="created-date text-xl font-normal mt-2">
                  Closed On:{" "}
                  {item.date_modified &&
                    moment(item.date_modified).format("MMM DD, YYYY")}
                </div>
              </div>
            </DisputeListItem>
          ))}

        {/* Pagination */}
        {data?.length > 0 && (
          <div className="flex justify-center mt-3 items-center">
            <PaginationComponent
              total={Math.ceil(totalResults / RECORDS_PER_PAGE)}
              onPageChange={onPageChange}
              currentPage={currentPage}
            />
          </div>
        )}

        <DisputeDetails
          show={detailsModalState.show}
          dispute_id={detailsModalState.disputeId}
          onCloseModal={onCloseDetailsModal}
        />
      </Wrapper>
    </div>
  );
};

export default Disputes;
