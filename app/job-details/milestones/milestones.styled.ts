import styled from "styled-components";
import { Dropdown, Form } from "react-bootstrap";
import { breakpoints } from "@/helpers/hooks/useResponsive";

export const MilestonesWrapper = styled.div`
  margin: 2.5rem auto auto;
  width: 816px;
  max-width: 100%;
  .add-button {
    margin-top: 1.5rem;
  }
  a {
    color: ${(props) => props.theme.colors.yellow};
  }
`;

export const MileStoneListItem = styled.div`
  padding: 1.75rem;
  @media ${breakpoints.mobile} {
    padding: 1.25rem;
  }
  box-shadow: 0px 4px 74px rgba(0, 0, 0, 0.04);
  background: ${(props) => props.theme.colors.white};
  margin-top: 1.5rem;
  border-radius: 1.25rem;
  .milestone-desc {
    word-wrap: break-word;
    word-break: break-word;
  }
  .more-popover {
    height: 3rem;
    width: 3rem;
    border: 1px solid #d9d9d9;
    border-radius: 0.5rem;
  }
  .form-group {
    margin-top: 1.25rem;
  }
  .form-input {
    border-radius: 7px;
    padding: 1rem 1.25rem;
  }
  .bottom-buttons {
    margin-top: 1.25rem;
    justify-content: flex-end;
    @media (max-width: 768px) {
      justify-content: center;
      .btn {
        width: 100%;
      }
    }
  }
  .divider {
    height: 1px;
    background-color: rgba(0, 0, 0, 0.1);
  }
  .revision-banner {
    background-color: #fbf5e8;
    border-radius: 0.5rem;
  }
  .payment-btn {
    @media ${breakpoints.mobile} {
      font-size: 0.875rem;
    }
  }
`;

export const UserDropdown = styled(Dropdown)`
  .dropdown-toggle {
    background: none;
    border: none;
    color: inherit;
    &::after {
      display: none;
    }
  }
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
      .delete {
        color: #e5175c;
      }
    }
  }
`;

export const UserDropdownToggle = styled.div``;

export const FormWrapper = styled(Form)`
  .form-group {
    margin-top: 1.25rem;
  }
  .form-input {
    border-radius: 7px;
    padding: 1rem 1.25rem;
  }
  .bottom-buttons {
    margin-top: 1.25rem;
    justify-content: flex-end;
    @media (max-width: 768px) {
      justify-content: center;
      .btn {
        width: 100%;
      }
    }
  }
`;
