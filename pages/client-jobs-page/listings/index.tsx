/*
 * This is the main component that lists all the components of jobs list - client side
 */
import { useMemo, useState, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import ListingFooter from "./ListingFooter";
import ChevronUp from "@/public/icons/chevronUp.svg";
import ChevronDown from "@/public/icons/chevronDown.svg";
import SelectJobModal from "@/components/invite-flow-modals/SelectJobModal";
import InviteFreelancerMessageModal from "@/components/invite-flow-modals/InviteFreelancerMessageModal";
import NoDataFound from "@/components/ui/NoDataFound";
import StatusAndDateSection from "./StatusAndDateSection";
import { inviteFreelancer } from "@/helpers/http/jobs";
import { convertToTitleCase } from "@/helpers/utils/misc";

import ProposalExistsModal from "@/components/invite-flow-modals/ProposalExistsModa";
import { getJobExpirationInDays } from "@/helpers/utils/helper";

// Define types for better type safety
interface JobItem {
  job_post_id: string;
  job_title: string;
  status: string;
  date_created?: string;
  userdata?: {
    user_id: string;
    first_name: string;
    last_name: string;
  };
}

interface Freelancer {
  user_id: string;
  first_name: string;
  last_name: string;
}

interface Props {
  data: JobItem[];
  listingType: string;
  toggleReset: string;
  sortFilter: (value: string) => void;
}

const closeStatuses = {
  All: "all",
  Closed: "closed",
  Closed_before_hiring_freelancer: "deleted",
} as const;

type CloseStatusKey = keyof typeof closeStatuses;

const Listings = ({ data, listingType, sortFilter, toggleReset }: Props) => {
  const [selectedFreelancer, setSelectedFreelancer] =
    useState<Freelancer | null>(null);
  const [showJobsModal, setShowJobsModal] = useState<boolean>(false);
  const [proposalExistModal, setProposalExistModal] = useState<boolean>(false);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [sendingInvite, setSendingInvite] = useState<boolean>(false);
  const [showInviteMessageModal, setShowInviteMessageModal] =
    useState<boolean>(false);
  const [toggleName, setToggleName] = useState("Filter by");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const onInviteClick = (userData: Freelancer) => () => {
    setSelectedFreelancer(userData);
    toggleJobsModal();
  };

  const toggleJobsModal = () => {
    setShowJobsModal(!showJobsModal);
  };

  const toggleInviteMessageModal = () => {
    if (showInviteMessageModal) {
      setSelectedFreelancer(null);
      setSelectedJobId("");
    }
    setShowInviteMessageModal(!showInviteMessageModal);
  };

  const onSelectJobAndContinue = (jobId: string, proposalExists: boolean) => {
    toggleJobsModal();
    setSelectedJobId(jobId);
    if (!proposalExists) toggleInviteMessageModal();
    else setProposalExistModal(true);
  };

  const onInvite = (msg: string) => {
    const body = {
      job_post_id: selectedJobId,
      freelancer_user_id: [selectedFreelancer?.user_id],
      message: msg || undefined,
    };

    setSendingInvite(true);
    inviteFreelancer(body)
      .then((res) => {
        setSendingInvite(false);
        if (res.message === "PROPOSAL_EXIST") {
          toggleInviteMessageModal();
          setProposalExistModal(true);
          setSelectedJobId(body.job_post_id);
          return;
        }
        if (res.status) {
          if (res.alreadyInvited.includes(selectedFreelancer?.user_id)) {
            toast.success("Freelancer is already invited");
          } else {
            toast.success(
              `Invitation to ${
                selectedFreelancer?.first_name +
                " " +
                selectedFreelancer?.last_name
              } sent successfully!`
            );
          }
          toggleInviteMessageModal();
          setSelectedJobId("");
        } else {
          toast.error(
            res?.message ? res?.message : "Invitation not sent successfully!"
          );
        }
      })
      .catch(() => {
        setSendingInvite(false);
      });
  };

  const toggleResetValue = useMemo(() => {
    switch (toggleReset) {
      case "closed":
        return "Closed";
      case "deleted":
        return "Closed before Hiring Freelancer";
      default:
        return toggleReset;
    }
  }, [toggleReset]);

  const filterJobProposals = (status: CloseStatusKey) => () => {
    sortFilter(closeStatuses[status]);
    setToggleName(closeStatuses[status]);
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById("dropdown-menu");
      const button = document.getElementById("dropdown-button");
      if (
        dropdown &&
        button &&
        !button.contains(event.target as Node) &&
        !dropdown.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      {listingType === "closed" && (
        <>
          <div className="relative">
            <button
              id="dropdown-button"
              className="w-full max-w-[300px] px-4 py-2 text-left focus:outline-none flex items-center justify-start gap-2 hover:scale-105 transition-transform duration-200"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {toggleResetValue ?? toggleName}
              {isDropdownOpen ? <ChevronUp /> : <ChevronDown />}
            </button>
            <div
              id="dropdown-menu"
              className={`${
                isDropdownOpen ? "block" : "hidden"
              } absolute z-10 w-full mt-1 max-w-[280px] bg-white rounded-md shadow-lg`}
            >
              <div className="py-1">
                <button
                  className="block w-full max-w-[280px] px-4 py-2 text-left hover:bg-gray-100"
                  onClick={filterJobProposals("All")}
                >
                  All
                </button>
                <button
                  className="block w-full max-w-[280px] px-4 py-2 text-left hover:bg-gray-100"
                  onClick={filterJobProposals("Closed")}
                >
                  Closed
                </button>
                <button
                  className="block w-full max-w-[280px] px-4 py-2 text-left hover:bg-gray-100"
                  onClick={filterJobProposals(
                    "Closed_before_hiring_freelancer"
                  )}
                >
                  Closed before Hiring Freelancer
                </button>
              </div>
            </div>
          </div>
          <br />
        </>
      )}
      {/* Listings of Jobs */}
      {data && data?.length > 0 ? (
        data?.map((item: JobItem) => {
          const expirationDays = getJobExpirationInDays(item);

          return (
            <Link
              key={item.job_post_id}
              href={
                ["prospects", "deleted"].includes(item?.status)
                  ? `/client-job-details/${item.job_post_id}/applicants`
                  : `/client-job-details/${item.job_post_id}`
              }
              className="block no-underline text-inherit"
            >
              <div className="relative bg-white p-8 rounded-[0.875rem] mb-7 shadow-[0px_4px_74px_rgba(0,0,0,0.04)] cursor-pointer flex flex-col md:flex-row items-start md:items-center gap-3 justify-between hover:shadow-lg transition-shadow duration-200">
                {/* Left section of the Job card */}
                <div className="flex-1 ">
                  <div className="text-2xl font-normal mb-4">
                    {convertToTitleCase(item.job_title)}
                  </div>
                  <ListingFooter item={item as any} />
                </div>

                {/* Right section of the Job card */}
                <div className="w-full md:w-fit">
                  {item.status === "prospects" && (
                    <div className="text-end mb-3 text-red-500">
                      {expirationDays}
                    </div>
                  )}
                  <StatusAndDateSection
                    item={item as any}
                    onInvite={
                      item?.userdata ? onInviteClick(item.userdata) : () => {}
                    }
                  />
                </div>
              </div>
            </Link>
          );
        })
      ) : (
        <NoDataFound className="py-5" />
      )}

      {/* Select Job modal */}
      <SelectJobModal
        show={showJobsModal}
        toggle={toggleJobsModal}
        onNext={onSelectJobAndContinue}
        freelancerName={
          selectedFreelancer?.first_name + " " + selectedFreelancer?.last_name
        }
        freelancerId={selectedFreelancer?.user_id}
      />

      {/* Invite message modal */}
      <InviteFreelancerMessageModal
        show={showInviteMessageModal}
        toggle={toggleInviteMessageModal}
        freelancerName={
          selectedFreelancer?.first_name + " " + selectedFreelancer?.last_name
        }
        onInvite={onInvite}
        loading={sendingInvite}
      />

      {/* Proposal Exists Modal */}
      <ProposalExistsModal
        job_post_id={selectedJobId}
        show={proposalExistModal}
        toggle={() => {
          setSelectedJobId("");
          setProposalExistModal((prev) => !prev);
        }}
      />
    </div>
  );
};

export default Listings;
