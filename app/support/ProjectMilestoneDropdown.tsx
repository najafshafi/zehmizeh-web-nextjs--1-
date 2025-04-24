/*
 * This is a project milestone dropdown
 */

import { useEffect, useState } from "react";

import Loader from "@/components/Loader";
import { manageMilestone } from "@/helpers/http/jobs";
import ArrowDown from "@/public/icons/chevronDown.svg";
import ArrowUp from "@/public/icons/chevronUp.svg";
import { convertToTitleCase } from "@/helpers/utils/misc";

type Props = {
  onSelectMilestone: (item: any) => void;
  selectedProjectId: string;
  selectedMilestone: any;
};

const ProjectMilestoneDropdown = ({
  onSelectMilestone,
  selectedProjectId,
  selectedMilestone,
}: Props) => {
  const [showDropdownOptions, setShowDropdownOptions] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [milestones, setMilestones] = useState<any>([]);

  useEffect(() => {
    /* This will fetch all the milestones of the selected project */
    if (selectedProjectId) {
      setIsLoading(true);
      const body = {
        action: "get_milestone",
        job_post_id: selectedProjectId,
        page: 1,
        limit: 100,
      };
      manageMilestone(body).then((res) => {
        if (res.status) {
          setMilestones(res.data);
        }
        setIsLoading(false);
      });
    }
  }, [selectedProjectId]);

  const onSelect = (item: any) => () => {
    // When milestone is selected, it will store the selected milestone and hide the milestone dropdown options
    onSelectMilestone(item);
    toggleDropdownOptions();
  };

  const toggleDropdownOptions = () => {
    // This will toggle milestone dropdown options
    setShowDropdownOptions(!showDropdownOptions);
  };

  return (
    <div className="mt-1 md:min-w-[720px]">
      <div>
        {/* Dropdown button */}
        <div
          className="p-4 px-5 border border-[#dddddd] rounded-[7px] flex justify-between items-center cursor-pointer"
          onClick={toggleDropdownOptions}
        >
          <div className="capital-first-ltr">
            {selectedMilestone ? selectedMilestone?.title : "Select"}
          </div>
          {showDropdownOptions ? <ArrowUp /> : <ArrowDown />}
        </div>
      </div>

      {/* Milestone Dropdown options */}
      {showDropdownOptions && (
        <div className="mt-3 bg-white max-h-[250px] overflow-y-auto shadow-[0_4px_19px_rgba(0,0,0,0.13)] rounded-lg p-6 flex flex-col gap-3">
          {isLoading ? (
            <Loader height={250} />
          ) : milestones?.length > 0 ? (
            milestones.map((item: any) => (
              <div
                className="border border-[#d9d9d9] p-6 rounded-lg hover:bg-gray-200 cursor-pointer"
                // If it is milestone then key will be milestone_id else hourly_id
                key={item?.milestone_id || item?.hourly_id}
                onClick={onSelect(item)}
              >
                <div className="text-base font-normal capital-first-ltr">
                  {convertToTitleCase(item?.title)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-base font-normal text-center">
              <div>
                No project milestones are currently eligible for dispute.
              </div>
              <div>
                {" "}
                (Disputes can be submitted when: a freelancer has requested
                payment AND the client has not yet paid.)
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectMilestoneDropdown;
