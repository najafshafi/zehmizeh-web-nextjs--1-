import { UserDropdown, UserDropdownToggle } from './milestones.styled';
import { Dropdown } from 'react-bootstrap';
import  MoreIcon  from '@/public/icons/more.svg';

type Props = {
  onDelete: any;
  handleEdit: () => void;
  isEditEnabled?: boolean;
};

const MoreButton = ({ onDelete, handleEdit, isEditEnabled = true }: Props) => {
  return isEditEnabled ? (
    <UserDropdown>
      <Dropdown.Toggle as={UserDropdownToggle}>
        <div className="more-popover d-flex justify-content-center align-items-center pointer">
          <MoreIcon />
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu align="end">
        <Dropdown.Item className="d-flex" onClick={handleEdit}>
          Edit Proposal
        </Dropdown.Item>
        <Dropdown.Item className="d-flex" onClick={onDelete}>
          <div className="delete">Cancel Proposal</div>
        </Dropdown.Item>
      </Dropdown.Menu>
    </UserDropdown>
  ) : (
    <UserDropdown>
      <Dropdown.Toggle as={UserDropdownToggle}>
        <div className="more-popover d-flex justify-content-center align-items-center pointer">
          <MoreIcon />
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu align="end">
        <Dropdown.Item className="d-flex" onClick={onDelete}>
          <div className="delete">Cancel Milestone</div>
        </Dropdown.Item>
      </Dropdown.Menu>
    </UserDropdown>
  );
};

export default MoreButton;
