import { UserDropdown, UserDropdownToggle } from "./hours-management.styled";
import { Dropdown } from "react-bootstrap";
import MoreIcon from "@/public/icons/more.svg";

type Props = {
  onDelete: () => void;
  handleEdit: () => void;
};

const MoreButton = ({ onDelete, handleEdit }: Props) => {
  return (
    <UserDropdown>
      <Dropdown.Toggle as={UserDropdownToggle}>
        <div className="more-popover flex justify-center items-center pointer">
          <MoreIcon />
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu align="end">
        <Dropdown.Item onClick={handleEdit}>Edit</Dropdown.Item>
        <Dropdown.Item onClick={onDelete}>
          <div className="delete">Cancel milestone</div>
        </Dropdown.Item>
      </Dropdown.Menu>
    </UserDropdown>
  );
};

export default MoreButton;
