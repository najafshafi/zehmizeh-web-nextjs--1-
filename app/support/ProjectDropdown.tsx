/*
 * This is a project dropdown
 */

import { useState } from 'react';
import Loader from '@/components/Loader';
import { DropdownWrapper } from './support.styled';
import useProjects from './use-projects';
import { useAuth } from '@/helpers/contexts/auth-context';
import ArrowDown from '@/public/icons/chevronDown.svg';
import ArrowUp from '@/public/icons/chevronUp.svg';
import { convertToTitleCase } from '@/helpers/utils/misc';

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
    <DropdownWrapper className="mt-1">
      {/* Dropdown button */}
      <div>
        <div
          className="dropdown-button flex justify-between items-center cursor-pointer"
          onClick={toggleDropdownOptions}
        >
          <div>
            {selectedProject
              ? convertToTitleCase(selectedProject?.job_title)
              : 'Select'}
          </div>
          {showDropdownOptions ? <ArrowUp /> : <ArrowDown />}
        </div>
      </div>

      {/* Project Dropdown options */}
      {showDropdownOptions && (
        <div className="dropdown-options flex flex-col gap-3">
          {isLoading ? (
            <Loader height={250} />
          ) : myProjects?.length > 0 ? (
            myProjects.map((item: any) => (
              <div
                className="option pointer"
                key={item?.job_post_id}
                onClick={onSelect(item)}
              >
                <div className="support-project--title text-base font-normal">
                  {convertToTitleCase(item?.job_title)}
                </div>

                {/* Client name / freelancer name: Based on the user type,
                 * To client freelncer's name will be displayed and
                 * To freelancerclient's name will be displayed */}
                <div className="text-base font-normal mt-1 user-text capitalize">
                  {auth?.user?.user_type == 'client'
                    ? item?.freelancerdata?.first_name +
                      ' ' +
                      item?.freelancerdata?.last_name
                    : item?.clientdata?.first_name +
                      ' ' +
                      item?.clientdata?.last_name}
                </div>
              </div>
            ))
          ) : (
            <div className="text-base font-normal text-center">No projects found</div>
          )}
        </div>
      )}
    </DropdownWrapper>
  );
};

export default ProjectDropdown;
