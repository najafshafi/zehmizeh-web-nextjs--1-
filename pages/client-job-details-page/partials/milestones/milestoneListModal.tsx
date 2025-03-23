import { StyledButton } from "@/components/forms/Buttons";
import Checkbox from "@/components/forms/CheckBox";
import { StyledModal } from "@/components/styled/StyledModal";
import { CONSTANTS } from "@/helpers/const/constants";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

interface Props {
  show: boolean;
  setShow: any;
  selectedMilestones: any[];
  setSelectedMilestones: any;
  milestones: any[];
  jobdetails: any;
  askForConfirmation: any;
}

export const MilestoneListModal = ({
  show = false,
  setShow,
  setSelectedMilestones,
  selectedMilestones,
  milestones,
  jobdetails,
  askForConfirmation,
}: Props) => {
  const job_status: string =
    jobdetails?.jobType === "hourly" ? "hourly_status" : "status";
  const pendingMilestones = milestones.filter(
    (mil) => mil[job_status] === "pending"
  );
  const [checkValues, setCheckValues] = useState(
    Array(pendingMilestones?.length).fill(false)
  );
  const [checkAllValue, setCheckAllValue] = useState(false);

  const selectAllHandler = (checked: boolean) => {
    setCheckValues(() => Array(pendingMilestones?.length).fill(checked));
    setSelectedMilestones(checked ? pendingMilestones : []);
    setCheckAllValue(checked);
  };

  const toggleHandler = (check: boolean, milestone: any, index) => {
    setCheckValues((checkValues) =>
      checkValues.map((checkArrVal, ind) =>
        ind === index ? check : checkArrVal
      )
    );
    if (check) return setSelectedMilestones([...selectedMilestones, milestone]);

    const milestone_id_flag =
      jobdetails?.jobType === "hourly" ? "hourly_id" : "milestone_id";
    return setSelectedMilestones(
      selectedMilestones.filter(
        (mil) => mil[milestone_id_flag] !== milestone[milestone_id_flag]
      )
    );
  };

  useEffect(() => {
    setCheckAllValue(!checkValues.includes(false));
  }, [checkValues]);

  return (
    <StyledModal show={show} onHide={() => setShow(false)} centered>
      <Modal.Body>
        {/* {pendingMilestones} */}
        <div>
          <h4>
            {jobdetails?.jobType === "hourly"
              ? CONSTANTS.job.selectSubmissionsYoureReadyToPayFor
              : `Select any milestone proposals that you're ready to accept and make deposits for:`}
          </h4>

          {pendingMilestones?.map((milestone, index: number) => {
            if (
              jobdetails?.jobType === "hourly" &&
              milestone?.is_final_milestone
            )
              return null;
            return (
              <div key={`milestone-group-${index}`}>
                {index === 0 && (
                  <div className="milestone-modal-list-checkbox mt-3">
                    <div className="flex items-center">
                      <Checkbox
                        checked={checkAllValue}
                        toggle={(e) => selectAllHandler(e.target.checked)}
                      />
                      <span className="ms-3">Select All</span>
                    </div>
                  </div>
                )}
                <div className="milestone-modal-list-checkbox mt-3 rounded border p-3">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <Checkbox
                        checked={checkValues[index]}
                        toggle={(e: any) =>
                          toggleHandler(e.target.checked, milestone, index)
                        }
                      />
                      <span className="ms-2 fw-bold">{milestone.title}</span>
                    </div>
                    <div
                      className="ml-3 mt-2 text-secondary"
                      dangerouslySetInnerHTML={{
                        __html: milestone.description,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="flex items-center justify-end gap-4 mt-4">
            {jobdetails?.jobType !== "hourly" && (
              <StyledButton
                variant="success"
                disabled={selectedMilestones.length === 0}
                onClick={askForConfirmation("PAY_NOW")}
              >
                Accept & Pay Now
              </StyledButton>
            )}
            <StyledButton
              disabled={selectedMilestones.length === 0}
              onClick={askForConfirmation()}
            >
              {jobdetails?.jobType === "hourly" ? "Pay" : "Accept & Deposit"}
            </StyledButton>
          </div>
        </div>
      </Modal.Body>
    </StyledModal>
  );
};
