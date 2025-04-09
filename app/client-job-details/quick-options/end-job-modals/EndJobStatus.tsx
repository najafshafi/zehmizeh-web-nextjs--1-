"use client";
/*
 * This component renders a modal asking for the status of the job when ending it.
 */
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { VscChevronDown, VscChevronUp, VscClose } from "react-icons/vsc";

type Props = {
  show: boolean; // Controls modal visibility and body scroll lock
  onClose: () => void; // Function to close the modal
  endJobSelectedStatus: string;
  onContinue: (endJobState: {
    selectedStatus: string;
    endingReason?: string;
    incompleteJobDescription?: string;
  }) => void;
};

const JOB_ENDING_REASONS = [
  "Not responding",
  "Freelancer requested to end early",
  "Client ending early",
  "Other",
];

interface FormState {
  selectedStatus: string;
  endingReason: string;
  incompleteJobDescription: string;
}

const initialState: FormState = {
  selectedStatus: "",
  endingReason: "",
  incompleteJobDescription: "",
};

const EndJobStatus = ({
  show,
  onClose,
  onContinue,
  endJobSelectedStatus,
}: Props) => {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [showDropdownOptions, setShowDropdownOprtions] =
    useState<boolean>(false);

  // Handle body scroll lock when the modal is shown
  useEffect(() => {
    let originalStyle = "";
    let scrollY = 0;
    if (show) {
      scrollY = window.scrollY;
      originalStyle = document.body.style.cssText;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflowY = "scroll"; // Prevent layout shift
    } else {
      // Only restore if the style was set by this effect
      if (document.body.style.position === "fixed") {
        document.body.style.cssText = originalStyle;
        window.scrollTo(0, scrollY); // Use the saved scrollY
      }
    }
    // Cleanup on unmount
    return () => {
      if (document.body.style.position === "fixed") {
        document.body.style.cssText = originalStyle;
        window.scrollTo(0, scrollY); // Use the saved scrollY
      }
    };
  }, [show]);

  const handleChange = useCallback((field: keyof FormState, value: string) => {
    setFormState((prevFormState: FormState) => {
      return { ...prevFormState, [field]: value };
    });
  }, []);

  // Initialize/Reset state when visibility changes
  useEffect(() => {
    if (show) {
      setFormState({
        ...initialState,
        selectedStatus: endJobSelectedStatus || "", // Set initial status if provided
      });
      setShowDropdownOprtions(false); // Close dropdown when modal opens
    } else {
      setFormState(initialState);
      setShowDropdownOprtions(false);
    }
    // Intentionally not depending on handleChange
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, endJobSelectedStatus]);

  const onNext = () => {
    toast.dismiss();
    const { selectedStatus, endingReason, incompleteJobDescription } =
      formState;
    if (selectedStatus === "in-complete") {
      if (endingReason === "") {
        toast.error("Please select the reason why you're ending the project.");
        return;
      }
      if (incompleteJobDescription === "") {
        toast.error("Please elaborate on why you're ending the project.");
        return;
      }
    }
    // Call onContinue *before* closing
    onContinue({
      selectedStatus,
      endingReason,
      incompleteJobDescription,
    });
    // Close the modal after continuing
    onClose();
  };

  const onSelectReason = (item: string) => () => {
    handleChange("endingReason", item);
    toggleDropdownOptions();
  };

  const toggleDropdownOptions = () => {
    setShowDropdownOprtions(!showDropdownOptions);
  };

  const onSelectStatus = (status: string) => () => {
    handleChange("selectedStatus", status);
  };

  if (!show) return null;

  return (
    <div
      className="fixed top-0 inset-0 z-[99999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="end-job-status-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
        onClick={onClose} // Close modal on backdrop click
        aria-hidden="true"
      />

      {/* Modal Panel */}
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl mx-4 transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modal-scale-in">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Close modal"
        >
          <VscClose size={24} />
        </button>

        {/* Modal Content Area */}
        <div className="p-6 md:p-8">
          <h2
            id="end-job-status-modal-title"
            className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8 text-gray-900"
          >
            Close Project
          </h2>
          <div className="flex flex-col gap-6 md:gap-8">
            {/* Status Selection */}
            <fieldset>
              <legend className="text-base font-medium mb-3 md:mb-4 text-gray-700">
                Choose status
              </legend>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Completed Option */}
                <div
                  className={`w-full sm:flex-1 text-center cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                    formState?.selectedStatus === "closed"
                      ? "border-2 border-blue-600 bg-blue-50 text-blue-700 font-semibold ring-2 ring-blue-200"
                      : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                  onClick={onSelectStatus("closed")}
                  onKeyDown={(e) =>
                    e.key === "Enter" || e.key === " "
                      ? onSelectStatus("closed")()
                      : null
                  }
                  role="radio"
                  aria-checked={formState?.selectedStatus === "closed"}
                  tabIndex={0}
                >
                  Completed
                </div>
                {/* Incomplete Option */}
                <div
                  className={`w-full sm:flex-1 text-center cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                    formState?.selectedStatus === "in-complete"
                      ? "border-2 border-blue-600 bg-blue-50 text-blue-700 font-semibold ring-2 ring-blue-200"
                      : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                  onClick={onSelectStatus("in-complete")}
                  onKeyDown={(e) =>
                    e.key === "Enter" || e.key === " "
                      ? onSelectStatus("in-complete")()
                      : null
                  }
                  role="radio"
                  aria-checked={formState?.selectedStatus === "in-complete"}
                  tabIndex={0}
                >
                  Incomplete
                </div>
              </div>
            </fieldset>

            {/* Reason Selection (Conditional) */}
            {formState?.selectedStatus === "in-complete" && (
              <div className="flex flex-col gap-5 border-t border-gray-200 pt-6">
                {/* Reason Dropdown */}
                <div>
                  <label
                    htmlFor="end-job-reason-button"
                    className="block text-base font-medium mb-2 text-gray-700"
                  >
                    Please explain why you are ending the project while it is
                    still incomplete:
                  </label>
                  <div className="relative">
                    <button
                      id="end-job-reason-button"
                      type="button"
                      className="w-full flex justify-between items-center p-3 border border-gray-300 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                      onClick={toggleDropdownOptions}
                      aria-haspopup="listbox"
                      aria-expanded={showDropdownOptions}
                    >
                      <span
                        className={
                          formState?.endingReason
                            ? "text-gray-900"
                            : "text-gray-500"
                        }
                      >
                        {formState?.endingReason || "Choose the reason"}
                      </span>
                      {showDropdownOptions ? (
                        <VscChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <VscChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    {showDropdownOptions && (
                      <div
                        className="absolute z-20 mt-1 w-full border border-gray-300 rounded-lg bg-white shadow-lg py-2 max-h-60 overflow-y-auto focus:outline-none"
                        role="listbox"
                        aria-labelledby="end-job-reason-button"
                        tabIndex={-1}
                      >
                        {JOB_ENDING_REASONS.map((item: string) => (
                          <div
                            className={`px-4 py-3 cursor-pointer text-gray-800 ${
                              formState.endingReason === item
                                ? "bg-blue-100 font-medium text-blue-700"
                                : "hover:bg-gray-100"
                            }`}
                            key={item}
                            onClick={onSelectReason(item)}
                            role="option"
                            aria-selected={formState.endingReason === item}
                            tabIndex={0}
                            onKeyDown={(e) =>
                              e.key === "Enter" || e.key === " "
                                ? onSelectReason(item)()
                                : null
                            }
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Elaboration Textarea */}
                <div>
                  <label
                    htmlFor="incompleteJobDescription"
                    className="block text-base font-medium mb-2 text-gray-700"
                  >
                    Please elaborate why you're marking this project as
                    incomplete. Be sure to mention if you experienced poor
                    customer service or any form of misconduct.
                  </label>
                  <textarea
                    id="incompleteJobDescription"
                    placeholder="Please explain further (max 500 characters)"
                    value={formState?.incompleteJobDescription}
                    onChange={(e) =>
                      handleChange("incompleteJobDescription", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    maxLength={500}
                    rows={4}
                    aria-required={formState?.selectedStatus === "in-complete"}
                  />
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="text-right mt-4 border-t border-gray-200 pt-6">
              <button
                type="button"
                className="px-6 py-2.5 bg-[#F2B420] text-[#212529] rounded-lg font-semibold text-base hover:scale-[1.03] transition-transform duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F2B420] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-sm"
                disabled={!formState?.selectedStatus}
                onClick={onNext}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndJobStatus;
