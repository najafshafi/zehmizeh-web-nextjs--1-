/*
 * This is a modal that asks to select status of the job while ending the job
 */
import { useEffect, useState, useCallback } from "react";
import { Form } from "react-bootstrap";
import toast from "react-hot-toast";
import styled from "styled-components";
import { StyledButton } from "components/forms/Buttons";
import { ReactComponent as ArrowDown } from "assets/icons/chevronDown.svg";
import { ReactComponent as ArrowUp } from "assets/icons/chevronUp.svg";

type Props = {
  endJobSelectedStatus: string;
  onContinue: (endJobState: {
    selectedStatus: string;
    endingReason?: string;
    incompleteJobDescription?: string;
  }) => void;
};

const Wrapper = styled.div`
  .content {
    gap: 2.75rem;
    margin-top: 2.75rem;
  }
  .status-options {
    gap: 1.25rem;
    margin-top: 1.25rem;
    .option {
      border-radius: 0.875rem;
      border: 1px solid #d9d9d9;
      padding: 1.25rem 0;
    }
    .selected {
      border: ${(props) => `2px solid ${props.theme.colors.lightBlue}`};
    }
  }
  .dropdown-button {
    padding: 1rem 1.25rem;
    border: ${(props) => `1px solid ${props.theme.colors.black}`};
    border-radius: 7px;
    margin-top: 0.75rem;
  }
  .dropdown-options {
    margin-top: 4px;
    border-radius: 8px;
    border: ${(props) => `1px solid ${props.theme.colors.black}`};
    padding-bottom: 0.5rem;
    .option {
      padding: 1rem 1rem 0.5rem 1rem;
      border-radius: 8px;
      &:hover {
        background: ${(props) => props.theme.colors.gray2};
      }
    }
  }
  .form-input {
    padding: 1rem 1.25rem;
    border-radius: 7px;
    border: ${(props) => `1px solid ${props.theme.colors.gray6}`};
  }
`;

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

  const handleChange = useCallback((field, value) => {
    setFormState((prevFormState: any) => {
      return { ...prevFormState, [field]: value };
    });
  }, []);

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
        toast.error("Please select the reason why you’re ending the project.");
        return;
      }
      if (incompleteJobDescription === "") {
        toast.error("Please elaborate on why you’re ending the project.");
        return;
      }
    }
    onContinue({
      // selectedStatus, endingReason, incompleteJobDescription
      selectedStatus: selectedStatus,
      endingReason: endingReason,
      incompleteJobDescription: incompleteJobDescription,
    });
  };

  const onSelectReason = (item: any) => () => {
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
    <Wrapper>
      <div className="fs-32 fw-700">Close Project</div>
      <div className="content d-flex flex-column">
        <div>
          <div className="label fs-16 font-normal">Choose status</div>
          <div className="status-options d-flex align-items-center flex-wrap">
            <div
              className={`option flex-1 text-center pointer ${
                formState?.selectedStatus == "closed" ? "selected" : ""
              }`}
              onClick={onSelectStatus("closed")}
            >
              Completed
            </div>
            <div
              className={`option flex-1 text-center pointer ${
                formState?.selectedStatus == "in-complete" ? "selected" : ""
              }`}
              onClick={onSelectStatus("in-complete")}
            >
              Incomplete
            </div>
          </div>
        </div>
        {formState?.selectedStatus == "in-complete" && (
          <div>
            <div className="label fs-16 font-normal">
              Please explain why you are ending the project while it is still
              incomplete:
            </div>
            <div className="dropdown">
              <div
                className="dropdown-button d-flex justify-content-between align-items-center pointer"
                onClick={toggleDropdownOptions}
              >
                <div className="dropdown-placeholder">
                  {formState?.endingReason
                    ? formState?.endingReason
                    : "Choose the reason"}
                </div>
                {showDropdownOptions ? <ArrowUp /> : <ArrowDown />}
              </div>
              {showDropdownOptions && (
                <div className="dropdown-options">
                  {JOB_ENDING_REASONS.map((item: string) => (
                    <div
                      className="option pointer"
                      key={item}
                      onClick={onSelectReason(item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="label fs-16 font-normal mt-5">
              Please elaborate why you're marking this project as incomplete. Be
              sure to mention if you experienced poor customer service or any
              form of misconduct.
            </div>
            <Form.Control
              placeholder="Please explain further"
              value={formState?.incompleteJobDescription}
              onChange={(e) =>
                handleChange("incompleteJobDescription", e.target.value)
              }
              className="form-input mt-2"
              maxLength={500}
              as="textarea"
              rows={4}
            />
          </div>
        )}
        <div className="text-end">
          <StyledButton
            padding="0.75rem 2rem"
            variant="primary"
            className="button"
            disabled={formState?.selectedStatus == ""}
            onClick={onNext}
          >
            Continue
          </StyledButton>
        </div>
      </div>
    </Wrapper>
  );
};

export default EndJobStatus;
