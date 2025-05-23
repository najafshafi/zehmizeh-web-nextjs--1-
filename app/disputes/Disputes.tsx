/*
 * This component will list down all the disputes
 */
"use client";
import { useState, useCallback } from "react";
import moment from "moment";
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

interface Milestone {
  title: string;
}

interface UserData {
  first_name: string;
  last_name: string;
  user_image?: string;
  user_type?: string;
}

interface DisputeItem {
  dispute_id: string;
  job_title: string;
  milestone?: Milestone;
  description: string;
  submitted_by: "CLIENT" | "FREELANCER";
  clientdata?: UserData;
  freelancerdata?: UserData;
  userdata?: UserData;
  dispute_status: string;
  date_created: string;
  date_modified: string;
}

interface DetailsModalState {
  show: boolean;
  disputeId: string;
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
  const [detailsModalState, setDetailsModalState] = useState<DetailsModalState>(
    {
      show: false,
      disputeId: "",
    }
  );

  const { data, isLoading, isRefetching, totalResults } = useDisputes({
    page: currentPage,
    limit: RECORDS_PER_PAGE,
  });

  const onPageChange = useCallback((page: { selected: number }) => {
    /* This will set next page as active and load new page data */
    setCurrentPage(page?.selected + 1);
  }, []);

  const showDisputeDetails = useCallback(
    (disputeId: string) => () => {
      setDetailsModalState({
        show: true,
        disputeId,
      });
    },
    []
  );

  const onCloseDetailsModal = useCallback(() => {
    setDetailsModalState({
      show: false,
      disputeId: "",
    });
  }, []);

  const renderDisputeItem = (item: DisputeItem) => {
    const submittedBy =
      item?.submitted_by === "CLIENT"
        ? `${item?.clientdata?.first_name} ${item?.clientdata?.last_name}`
        : `${item?.freelancerdata?.first_name} ${item?.freelancerdata?.last_name}`;

    const statusColor = DISPUTE_STATUSES[item?.dispute_status]?.color || "gray";
    const statusLabel =
      DISPUTE_STATUSES[item?.dispute_status]?.label || "Unknown";

    return (
      <div
        key={item?.dispute_id}
        className="flex justify-between flex-wrap gap-3 cursor-pointer p-8 mt-8 rounded-[0.875rem] bg-white shadow-[0_4px_52px_rgba(0,0,0,0.08)] transition-all duration-300"
        onClick={showDisputeDetails(item?.dispute_id)}
      >
        <div className="max-w-[70%]">
          <div className="flex  md:flex-nowrap flex-wrap">
            <div className="opacity-50 min-w-[140px] mr-2 break-words text-xl font-normal">
              Project Name:
            </div>
            <div className="break-words text-xl font-normal">
              {convertToTitleCase(item?.job_title)}
            </div>
          </div>
          <div className="flex mt-2  md:flex-nowrap flex-wrap">
            <div className="opacity-50 min-w-[140px] mr-2 break-words text-xl font-normal">
              Milestone:
            </div>
            <div className="break-words text-xl font-normal">
              <StyledHtmlText
                htmlString={item?.milestone?.title || ""}
                id={`dispute_${item?.milestone?.title}`}
                needToBeShorten={true}
              />
            </div>
          </div>
          <div className="flex mt-2  md:flex-nowrap flex-wrap">
            <div className="opacity-50 min-w-[140px] mr-2 break-words text-xl font-normal">
              Reason:
            </div>
            <div className="break-words text-xl font-normal">
              <StyledHtmlText
                htmlString={item?.description || ""}
                id={`dispute_${item.dispute_id}`}
                needToBeShorten={true}
              />
            </div>
          </div>
          <div className="flex mt-2  md:flex-nowrap flex-wrap">
            <div className="opacity-50 min-w-[140px] mr-2 break-words text-xl font-normal">
              Submitted By:
            </div>
            <div className="break-words text-xl font-normal capitalize">
              {submittedBy}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <StatusBadge color={statusColor}>{statusLabel}</StatusBadge>
          <div className="opacity-50 text-xl font-normal mt-4">
            Submitted On:{" "}
            {item.date_created &&
              moment(item.date_created).format("MMM DD, YYYY")}
          </div>
          <div className="opacity-50 text-xl font-normal mt-2">
            Closed On:{" "}
            {item.date_modified &&
              moment(item.date_modified).format("MMM DD, YYYY")}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading || isRefetching) {
      return <Loader />;
    }

    if (!data?.length) {
      return <NoDataFound className="py-5" />;
    }

    return (
      <>
        {data.map(renderDisputeItem)}

        {data.length > 0 && (
          <div className="flex justify-center mt-3 items-center">
            <PaginationComponent
              total={Math.ceil(totalResults / RECORDS_PER_PAGE)}
              onPageChange={onPageChange}
              currentPage={currentPage}
            />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="h-full min-w-[1170px] mt-10">
      <div className="max-w-[1170px] mx-auto mb-[100px]">
        {/* Back button */}
        <BackButton />

        {/* Page Title */}
        <h1 className="text-[3.25rem] mb-7 text-center font-normal">Dispute History</h1>

        {renderContent()}

        <DisputeDetails
          show={detailsModalState.show}
          dispute_id={detailsModalState.disputeId}
          onCloseModal={onCloseDetailsModal}
        />
      </div>
    </div>
  );
};

export default Disputes;
