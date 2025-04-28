import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import ArrowDown from "@/public/icons/chevronDown.svg";
import ArrowUp from "@/public/icons/chevronUp.svg";

type Props = {
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

const initialState = {
  selectedStatus: "",
  endingReason: "",
  incompleteJobDescription: "",
};

const EndJobStatus = ({ onContinue, endJobSelectedStatus }: Props) => {
  const [formState, setFormState] = useState(initialState);

  const handleChange = useCallback(
    (field: keyof typeof initialState, value: string) => {
      setFormState((prevFormState) => {
        return { ...prevFormState, [field]: value };
      });
    },
    []
  );

  const [showDropdownOptions, setShowDropdownOprtions] =
    useState<boolean>(false);

  useEffect(() => {
    return () => {
      setFormState(initialState);
    };
  }, []);

  useEffect(() => {
    if (endJobSelectedStatus) {
      handleChange("selectedStatus", endJobSelectedStatus);
    }
  }, [endJobSelectedStatus, handleChange]);

  const onNext = () => {
    toast.dismiss();
    const { selectedStatus, endingReason, incompleteJobDescription } =
      formState;
    if (selectedStatus == "in-complete") {
      if (endingReason == "") {
        toast.error("Please select the reason why you're ending the project.");
        return;
      }
      if (incompleteJobDescription === "") {
        toast.error("Please elaborate on why you're ending the project.");
        return;
      }
    }
    onContinue({
      selectedStatus: selectedStatus,
      endingReason: endingReason,
      incompleteJobDescription: incompleteJobDescription,
    });
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

  return (
    <div className="flex flex-col gap-11 mt-11">
      <div className="text-3xl font-bold">Close Project</div>
      <div className="flex flex-col gap-5">
        <div>
          <div className="text-base font-normal mb-5">Choose status</div>
          <div className="flex items-center flex-wrap gap-5 mt-5">
            <div
              className={`flex-1 text-center cursor-pointer py-5 rounded-xl border ${
                formState?.selectedStatus == "closed"
                  ? "border-2 border-blue-400"
                  : "border border-gray-300"
              }`}
              onClick={onSelectStatus("closed")}
            >
              Completed
            </div>
            <div
              className={`flex-1 text-center cursor-pointer py-5 rounded-xl border ${
                formState?.selectedStatus == "in-complete"
                  ? "border-2 border-blue-400"
                  : "border border-gray-300"
              }`}
              onClick={onSelectStatus("in-complete")}
            >
              Incomplete
            </div>
          </div>
        </div>
        {formState?.selectedStatus == "in-complete" && (
          <div>
            <div className="text-base font-normal mb-5">
              Please explain why you are ending the project while it is still
              incomplete:
            </div>
            <div className="relative">
              <div
                className="flex items-center justify-between cursor-pointer p-4 mt-3 border border-black rounded-lg"
                onClick={toggleDropdownOptions}
              >
                <div>
                  {formState?.endingReason
                    ? formState?.endingReason
                    : "Choose the reason"}
                </div>
                {showDropdownOptions ? <ArrowUp /> : <ArrowDown />}
              </div>
              {showDropdownOptions && (
                <div className="mt-1 border border-black rounded-lg pb-2">
                  {JOB_ENDING_REASONS.map((item: string) => (
                    <div
                      className="cursor-pointer p-4 pt-1 hover:bg-gray-100 rounded-lg"
                      key={item}
                      onClick={onSelectReason(item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="text-base font-normal mt-5">
              Please elaborate why you're marking this project as incomplete. Be
              sure to mention if you experienced poor customer service or any
              form of misconduct.
            </div>
            <textarea
              placeholder="Please explain further"
              value={formState?.incompleteJobDescription}
              onChange={(e) =>
                handleChange("incompleteJobDescription", e.target.value)
              }
              className="w-full p-4 mt-2 border border-gray-300 rounded-lg resize-none"
              maxLength={500}
              rows={4}
            />
          </div>
        )}
        <div className="text-end my-5">
          <button
            className={`px-8 py-3 rounded-full bg-primary text-black transition-transform duration-200 hover:scale-105 ${
              formState?.selectedStatus == ""
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={formState?.selectedStatus == ""}
            onClick={onNext}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default EndJobStatus;
