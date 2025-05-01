import { useEffect, useMemo, useState } from "react";
import { showErr } from "@/helpers/utils/misc";
import { budgetChangeRequest } from "@/helpers/http/proposals";
import toast from "react-hot-toast";
import { queryKeys } from "@/helpers/const/queryKeys";
import { useRefetch } from "@/helpers/hooks/useQueryData";
import { IoChevronBackSharp } from "react-icons/io5";
import { TJobDetails } from "@/helpers/types/job.type";
import { VscClose } from "react-icons/vsc";

type Props = {
  show: boolean;
  toggle: () => void;
  userType: "freelancer" | "client";
  jobDetails: TJobDetails;
};
type TIncOrDec = "INCREASE" | "DECREASE" | "";

const ChangeBudgetModal = ({ show, toggle, userType, jobDetails }: Props) => {
  const approvedBudget = jobDetails.proposal.approved_budget;
  const jobPostId = jobDetails.job_post_id;
  const jobTypeText =
    approvedBudget.type === "fixed" ? "budget" : "hourly rate";

  /* START ----------------------------------------- Edit configuration */
  const isEdit =
    jobDetails?.proposal?.budget_change?.status === "pending" &&
    jobDetails?.proposal?.budget_change?.requested_by === userType;

  const isEditIncreaseOrDecrease: TIncOrDec =
    isEdit &&
    Number(jobDetails.proposal.approved_budget.amount) >
      Number(jobDetails?.proposal?.budget_change?.amount)
      ? "DECREASE"
      : "INCREASE";
  /* END ------------------------------------------- Edit configuration */

  const { refetch } = useRefetch(queryKeys.jobDetails(jobPostId));

  const [step, setStep] = useState(1);
  const [selectedChange, setSelectedChange] = useState<TIncOrDec>("");
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) setStep(2);
    if (isEditIncreaseOrDecrease) setSelectedChange(isEditIncreaseOrDecrease);
  }, [isEdit, isEditIncreaseOrDecrease, show]);

  /* START ----------------------------------------- Set budget to value state and reset state on closing modal */
  useEffect(() => {
    if (show && approvedBudget?.amount) {
      setValue(Number(approvedBudget?.amount));
    }
    return () => {
      setStep(1);
      setSelectedChange("");
    };
  }, [approvedBudget?.amount, show]);
  /* END ------------------------------------------- Set budget to value state and reset state on closing modal */

  // Check entered value is valid for increase and decrease request
  const isValid = () => {
    if (
      selectedChange === "INCREASE" &&
      Number(value) &&
      Number(value) <= Number(approvedBudget?.amount)
    ) {
      showErr(`Please enter a figure greater than the current ${jobTypeText}.`);
      return false;
    }
    if (
      selectedChange === "DECREASE" &&
      Number(value) &&
      Number(value) >= Number(approvedBudget?.amount)
    ) {
      showErr(`Please enter a figure smaller than the current ${jobTypeText}.`);
      return false;
    }
    return true;
  };

  // api call
  const apiCall = async () => {
    const body = {
      amount: Number(value),
      job_post_id: jobPostId,
    };
    const res = await budgetChangeRequest(body);
    await refetch();

    return res;
  };

  const handleUpdate = () => {
    if (!isValid()) return;

    setLoading(true);
    toast.promise(apiCall(), {
      loading: "Please wait...",
      success: () => {
        toggle();
        setLoading(false);
        let message = "";
        if (userType === "client") {
          if (selectedChange === "INCREASE")
            message = `Increased ${jobTypeText} successfully`;
          else message = `Decrease ${jobTypeText} request sent successfully`;
        } else {
          if (selectedChange === "INCREASE")
            message = `Increase ${jobTypeText} request sent successfully`;
          else message = `Decreased ${jobTypeText} successfully`;
        }
        return message;
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || "error";
      },
    });
  };

  // change page and set type is increase or decrease
  const handleIncreaseOrDecrease = (type: typeof selectedChange) => {
    setSelectedChange(type);
    setStep(2);
  };

  const textContent = useMemo(() => {
    let headers: { step1: string; step2: string };
    let buttons: {
      step1: { text: string; onClick: () => void }[];
      step2: { text: string; onClick: () => void };
    };
    let note: string | undefined;

    /* START ----------------------------------------- Client side contents */
    if (userType === "client") {
      headers = {
        step1: `Would you like to increase the ${jobTypeText} or request a decrease?`,
        step2:
          selectedChange === "INCREASE"
            ? `Increase ${jobTypeText}`
            : `What would you like the freelancer to decrease the ${jobTypeText} to?`,
      };
      buttons = {
        step1: [
          {
            text: "Request Decrease",
            onClick: () => handleIncreaseOrDecrease("DECREASE"),
          },
          {
            text: "Increase",
            onClick: () => handleIncreaseOrDecrease("INCREASE"),
          },
        ],
        step2: {
          text:
            selectedChange === "INCREASE"
              ? `Increase ${jobTypeText}`
              : `${isEdit ? "Edit Request" : "Request Decrease"}`,
          onClick: handleUpdate,
        },
      };
      note =
        selectedChange === "DECREASE"
          ? `Note: Only freelancers can decrease the project ${jobTypeText}.`
          : undefined;
      /* END ------------------------------------------- Client side contents */

      /* START ----------------------------------------- Freelancer side contents */
    } else {
      headers = {
        step1: `Would you like to decrease the ${jobTypeText} or request an increase?`,
        step2:
          selectedChange === "INCREASE"
            ? `What would you like the client to increase the ${jobTypeText} to?`
            : `Decrease ${jobTypeText}`,
      };
      buttons = {
        step1: [
          {
            text: `Decrease`,
            onClick: () => handleIncreaseOrDecrease("DECREASE"),
          },
          {
            text: "Request Increase",
            onClick: () => handleIncreaseOrDecrease("INCREASE"),
          },
        ],
        step2: {
          text:
            selectedChange === "INCREASE"
              ? `${isEdit ? "Edit Request" : "Request Increase"}`
              : `Decrease ${jobTypeText}`,
          onClick: handleUpdate,
        },
      };
      note =
        selectedChange === "INCREASE"
          ? `Note: Only clients can increase the project ${jobTypeText}.`
          : undefined;
    }
    /* END ------------------------------------------- Freelancer side contents */

    return { headers, buttons, note };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobTypeText, selectedChange, userType, value]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={toggle}
      />

      <div className="relative w-full max-w-[800px] mx-4 bg-white rounded-xl py-8 px-4 md:p-12 max-h-[90vh]">
        <button
          type="button"
          className="sticky right-4 top-4 float-right md:absolute lg:top-0 lg:-right-8 lg:text-white text-gray-500 hover:text-gray-700 transition-colors"
          onClick={toggle}
          aria-label="Close modal"
        >
          <VscClose size={24} />
        </button>

        <div className="text-center">
          {!isEdit && (
            <>
              <div className="absolute right-10 md:right-2 top-2 px-4 py-2 bg-[#fbf5e8] text-[#F2B420] text-sm font-medium rounded-lg">
                {step}/2
              </div>
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep((prev) => prev - 1)}
                  className="absolute left-2 top-2 text-gray-600 hover:text-gray-800 transition-colors"
                  aria-label="Go back"
                >
                  <IoChevronBackSharp size={20} />
                </button>
              )}
            </>
          )}

          {step === 1 ? (
            <div className="mt-6">
              <h2 className="text-3xl font-normal mb-6">
                {textContent.headers.step1}
              </h2>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                {textContent.buttons.step1.map(({ onClick, text }) => (
                  <button
                    key={text}
                    type="button"
                    onClick={onClick}
                    className="px-4 py-0 md:px-8 md:py-[0.9rem] text-base md:text-lg font-medium bg-[#F2B420] text-[#212529] rounded-full hover:scale-105 transition-transform duration-200"
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <h2 className="text-2xl md:text-3xl font-normal mb-4">
                {textContent.headers.step2}
              </h2>
              {textContent.note && (
                <p className="font-semibold text-gray-700 mb-4">
                  {textContent.note}
                </p>
              )}
              <div className="relative max-w-xs mx-auto mb-6">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  value={value || ""}
                  onChange={(e) => setValue(Number(e.target.value))}
                  placeholder={`Enter new ${jobTypeText}`}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F2B420] focus:border-transparent outline-none transition-all"
                  maxLength={approvedBudget.type === "fixed" ? 5 : 3}
                />
              </div>
              <button
                type="button"
                disabled={loading}
                onClick={textContent.buttons.step2.onClick}
                className="px-8 py-4 md:px-8 md:py-[0.9rem] text-base md:text-lg font-medium bg-[#F2B420] text-[#212529] rounded-full hover:scale-105 transition-transform duration-200"
              >
                {textContent.buttons.step2.text}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangeBudgetModal;
