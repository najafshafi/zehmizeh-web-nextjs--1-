"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";
import Search from "@/components/forms/Search";
import useMyJobs from "@/controllers/use-jobs";
import useDebounce from "@/helpers/hooks/useDebounce";
import StyledHtmlText from "@/components/ui/StyledHtmlText";
import NoDataFound from "@/components/ui/NoDataFound";
import { convertToTitleCase, showFormattedBudget } from "@/helpers/utils/misc";
import { checkIsProposalExists } from "@/helpers/http/proposals";
import { StatusBadge } from "@/components/styled/Badges";

// Define interfaces for better type safety
interface Skill {
  id: string;
  name?: string;
  label?: string;
}

interface Budget {
  type: "fixed" | "hourly";
  isProposal?: boolean;
  amount?: number;
  min?: number;
  max?: number;
}

interface JobItem {
  job_post_id: string;
  job_title: string;
  job_description: string;
  skills: Skill[];
  budget: Budget;
  expected_delivery_date?: string;
}

interface Props {
  show: boolean;
  toggle: () => void;
  freelancerName: string;
  onNext: (jobId: string, proposalExists: boolean) => void;
  freelancerId?: string;
}

interface BudgetAndDateProps {
  budget: Budget;
  expectedDate?: string;
  isProposal: boolean;
}

const BudgetAndDate = ({
  budget,
  expectedDate,
  isProposal,
}: BudgetAndDateProps) => {
  if (isProposal) {
    return (
      <div className="text-xl font-normal">
        Open to Proposals (
        {budget.type === "fixed" ? "Project-Based" : "Hourly"})
      </div>
    );
  }
  if (budget.type === "fixed") {
    return (
      <div className="text-xl font-normal">
        {showFormattedBudget(budget)} ({budget.type})
      </div>
    );
  } else if (budget.type === "hourly") {
    return (
      <div className="text-xl font-normal">
        {showFormattedBudget(budget)} ({budget.type})
        {expectedDate && <span> | {expectedDate}</span>}
      </div>
    );
  }
  return null;
};

const SelectJobModal = ({
  show,
  toggle,
  freelancerName,
  onNext,
  freelancerId,
}: Props) => {
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const COLORS = useMemo(() => ["orange", "green", "blue"], []);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchTerm, 500);
  const { myJobs, isLoading, refetch, isRefetching } = useMyJobs(
    "prospects",
    debouncedSearchQuery,
    freelancerId || ""
  );

  const router = useRouter();

  // Handle body scroll lock when modal is open
  useEffect(() => {
    if (show) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, parseInt(scrollY || "0", 10));
    }
  }, [show]);

  useEffect(() => {
    if (debouncedSearchQuery !== null && freelancerId) {
      refetch();
    }
  }, [debouncedSearchQuery, refetch, freelancerId]);

  const selectJob = (id: string) => {
    setSelectedJobId(id);
  };

  const onContinue = async () => {
    if (selectedJobId === "") {
      toast.error("Please select a project.");
      return;
    }

    if (!freelancerId) {
      toast.error("Freelancer ID is required.");
      return;
    }

    const payload = {
      _freelancer_user_id: freelancerId,
      _job_post_id: selectedJobId,
    };

    const promise = checkIsProposalExists(payload);
    toast.promise(promise, {
      loading: "please wait...",
      error: (error) => {
        return error.message;
      },
      success: ({ proposal }) => {
        onNext(selectedJobId, !!proposal);
        return proposal ? "Proposal already exists" : null;
      },
    });
  };

  const onCreateNewJob = () => {
    if (!freelancerId) {
      toast.error("Freelancer ID is required.");
      return;
    }
    router.push(
      `/post-new-job?freelancerId=${freelancerId}&freelancerName=${encodeURIComponent(
        freelancerName
      )}`
    );
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={toggle}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-[800px] transform rounded-lg bg-white px-4 py-8 md:p-12 shadow-xl transition-all">
          {/* Close button */}
          <button
            onClick={toggle}
            className="absolute right-4 top-4 md:top-0 md:-right-8 md:text-white text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Content */}
          <div className="my-jobs">
            <h3 className="text-[28px] font-semibold">Select Posted Project</h3>
            <div className="mt-2 text-xl">
              Select the project you would like{" "}
              <span className="font-bold capitalize">{freelancerName}</span> to
              submit a proposal for. (Projects the freelancer{" "}
              <span className="font-bold">
                has already submitted proposals to
              </span>{" "}
              are excluded from the list below.)
            </div>

            <div className="mt-10 w-full">
              <Search
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                containerClassName="w-full"
              />
            </div>

            {isLoading || isRefetching ? (
              <Loader />
            ) : (
              <div className="mt-5 max-h-[50vh] space-y-3 overflow-y-auto modal-scrollbar">
                {myJobs?.length ? (
                  myJobs.map((item: JobItem) => (
                    <div
                      key={item.job_post_id}
                      className={`cursor-pointer rounded-xl border-2 p-6 transition-colors ${
                        selectedJobId === item.job_post_id
                          ? "border-blue-500"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => selectJob(item.job_post_id)}
                    >
                      <div className="flex flex-wrap justify-between">
                        <div className="break-words text-2xl">
                          {convertToTitleCase(item.job_title)}
                        </div>
                      </div>
                      <div className="mt-2 text-base opacity-70">
                        <StyledHtmlText
                          htmlString={item.job_description}
                          id={`invite_job_${item.job_post_id}`}
                          needToBeShorten={true}
                        />
                      </div>
                      <div className="mt-3.5 flex flex-wrap items-center gap-2">
                        {item.skills?.map(
                          (skill, index) =>
                            (skill.label || skill.name) && (
                              <StatusBadge
                                key={skill.id}
                                color={COLORS[index % COLORS.length]}
                              >
                                {skill.name ?? skill.label}
                              </StatusBadge>
                            )
                        )}
                      </div>
                      <div className="mt-5">
                        <BudgetAndDate
                          budget={item.budget}
                          isProposal={item.budget?.isProposal ?? false}
                          expectedDate={item.expected_delivery_date}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <NoDataFound
                    className="h-full"
                    title={
                      searchTerm
                        ? `No projects found for '${searchTerm}'.`
                        : 'You have no projects posted! To post a new project, click the "Post Project" button in the corner.'
                    }
                  />
                )}
              </div>
            )}
          </div>

          {/* Bottom buttons */}
          <div className="w-full justify-end mt-6 flex flex-wrap gap-4">
            <button
              onClick={onCreateNewJob}
              className="rounded-full border-2 border-gray-800 px-9 py-[0.9rem] text-lg font-normal text-gray-800 transition-transform hover:scale-105"
            >
              Create New Project
            </button>
            <button
              onClick={onContinue}
              className="rounded-full bg-[#F2B420] px-9 py-[0.9rem] text-base font-lg text-[#212529] transition-transform hover:scale-105"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectJobModal;
