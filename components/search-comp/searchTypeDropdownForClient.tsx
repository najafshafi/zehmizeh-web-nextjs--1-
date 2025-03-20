"use client";
import styled from "styled-components";
import { Dropdown } from "react-bootstrap";
import DownArrowIcon from "@/public/icons/chevronDown.svg";
import { useEffect } from "react";
import { useSearchFilters } from "@/helpers/contexts/search-filter-context";

const searchTypes = [
  {
    label: "Search Profiles",
    key: "profile",
  },
  {
    label: "Search Names",
    key: "name",
  },
];

const TypeDropdown = styled(Dropdown)`
  .dropdown-toggle {
    background: none;
    border: none;
    color: inherit;
    &::after {
      display: none;
    }
    margin-right: 1.5rem;
  }
  .dropdown-menu {
    border: 0;
    box-shadow: 0 0 15px rgb(0 0 0 / 25%);
    padding: 10px 20px;
    border-radius: 0.5rem;
    .dropdown-item {
      margin-top: 0.5rem;
      &:hover,
      &:active,
      &:focus,
      &:visited {
        background-color: transparent !important;
        color: ${({ theme }) => theme.colors.blue};
      }
    }
  }
`;
const TypeDropdownToggle = styled.div``;

const SearchTypeDropdownForClient = () => {
  const { searchTypeForNameOrProfile, setSearchTypeForNameOrProfile } =
    useSearchFilters();

  useEffect(() => {
    if (!searchTypeForNameOrProfile) {
      setSearchTypeForNameOrProfile("");
    }
  }, [searchTypeForNameOrProfile]);

  return (
    <TypeDropdown className="pointer">
      <Dropdown.Toggle as={TypeDropdownToggle}>
        <div className="d-flex align-items-center">
          <div className="fs-18 mx-2">
            {searchTypeForNameOrProfile == "name"
              ? "Search Names"
              : "Search Profiles"}
          </div>
          <DownArrowIcon className="dropdown-arrow" />
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu align="end">
        {searchTypes.map((item: any) => (
          <Dropdown.Item
            key={item.key}
            className={`fs-20 ${item == "name" ? "fw-700" : "fw-400"}`}
            onClick={() => setSearchTypeForNameOrProfile(item.key)}
          >
            <div>{item.label}</div>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </TypeDropdown>
  );
};

export default SearchTypeDropdownForClient;
