/*
 * This is a project dropdown
 */

import { useState } from "react";
import Loader from "@/components/Loader";
import useProjects from "./use-projects";
import { useAuth } from "@/helpers/contexts/auth-context";
import ArrowDown from "@/public/icons/chevronDown.svg";
import ArrowUp from "@/public/icons/chevronUp.svg";
import { convertToTitleCase } from "@/helpers/utils/misc";

type Props = {
  onSelectProject: (item: any) => void;
  selectedProject: any;
};

const ProjectDropdown = ({ onSelectProject, selectedProject }: Props) => {
  const auth = useAuth();
  const [showDropdownOptions, setShowDropdownOptions] =
    useState<boolean>(false);

  /* This will load all the ongoing projects of the current user */
  const { myProjects, isLoading } = useProjects();

  const onSelect = (item: any) => () => {
    // When project is selected, it will store the selected project and hide the project dropdown options
    onSelectProject(item);
    toggleDropdownOptions();
  };

  const toggleDropdownOptions = () => {
    // This will toggle project dropdown options
    setShowDropdownOptions(!showDropdownOptions);
  };

  return (
    <div className="mt-1">
      {/* Dropdown button */}
      <div>
        <div
          className="p-4 px-5 border border-[#dddddd] rounded-[7px] flex justify-between items-center cursor-pointer"
          onClick={toggleDropdownOptions}
        >
          <div>
            {selectedProject
              ? convertToTitleCase(selectedProject?.job_title)
              : "Select"}
          </div>
          {showDropdownOptions ? <ArrowUp /> : <ArrowDown />}
        </div>
      </div>

      {/* Project Dropdown options */}
      {showDropdownOptions && (
        <div className="mt-3 bg-white max-h-[250px] overflow-y-auto shadow-[0_4px_19px_rgba(0,0,0,0.13)] rounded-lg p-6 flex flex-col gap-3">
          {isLoading ? (
            <Loader height={250} />
          ) : myProjects?.length > 0 ? (
            myProjects.map((item: any) => (
              <div
                className="border border-[#d9d9d9] p-6 rounded-lg hover:bg-gray-200 cursor-pointer"
                key={item?.job_post_id}
                onClick={onSelect(item)}
              >
                <div className="break-words text-base font-normal">
                  {convertToTitleCase(item?.job_title)}
                </div>

                {/* Client name / freelancer name: Based on the user type,
                 * To client freelncer's name will be displayed and
                 * To freelancerclient's name will be displayed */}
                <div className="text-base font-normal mt-1 opacity-70 capitalize">
                  {auth?.user?.user_type == "client"
                    ? item?.freelancerdata?.first_name +
                      " " +
                      item?.freelancerdata?.last_name
                    : item?.clientdata?.first_name +
                      " " +
                      item?.clientdata?.last_name}
                </div>
              </div>
            ))
          ) : (
            <div className="text-base font-normal text-center">
              No projects found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectDropdown;
