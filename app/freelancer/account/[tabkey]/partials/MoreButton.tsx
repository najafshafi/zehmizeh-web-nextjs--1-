import styled from "styled-components";
import { Dropdown } from "react-bootstrap";
import MoreIcon from "@/public/icons/more.svg";

const UserDropdown = styled(Dropdown)`
  .dropdown-toggle {
    background: none;
    border: ${({ theme }) => `1px solid ${theme.colors.gray5}`};
    color: inherit;
    height: 32px;
    width: 32px;
    &::after {
      display: none;
    }
  }
  border-radius: 5px;
  .dropdown-menu {
    margin-top: 10px;
    border: 0;
    box-shadow: 0 0 15px rgb(0 0 0 / 25%);
    padding: 4px 20px 24px;
    border-radius: 0.5rem;
    .dropdown-item {
      background-color: transparent;
      padding: 0px;
      &:hover {
        transform: scale(1.03);
        transition: 0.1s ease-in;
      }
      margin-top: 20px;
      .make-default {
        opacity: 0.7;
        color: ${({ theme }) => theme.font.color.heading};
      }
      .delete {
        color: #e5175c;
      }
    }
  }
`;

type Props = {
  onDelete: () => void;
  onMakeDefault: () => void;
  disabled?: boolean;
};

const MoreButton = ({ onDelete, onMakeDefault, disabled = false }: Props) => {
  return (
    <UserDropdown>
      <Dropdown.Toggle disabled={disabled}>
        <div className="flex justify-center items-center pointer">
          <MoreIcon />
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu align="end">
        <Dropdown.Item className="flex make-default" onClick={onMakeDefault}>
          Make default
        </Dropdown.Item>
        <Dropdown.Item className="flex" onClick={onDelete}>
          <div className="delete">Delete</div>
        </Dropdown.Item>
      </Dropdown.Menu>
    </UserDropdown>
  );
};

export default MoreButton;
