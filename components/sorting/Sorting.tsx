import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import DownArrowIcon from "@/public/icons/chevronDown.svg";

const TypeDropdown = styled.div`
  position: relative;
  .mainDropdown {
    justify-content: flex-end;
    align-items: center;
    margin-top: 15px;
    div {
      align-items: center;
      display: flex;
      padding: 5px;
      border: 1px solid #aaa;
      border-radius: 4px;
      background-color: white;
      // box-shadow: 0 0 15px rgb(0 0 0 / 25%);
    }
  }
  .dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    min-width: 160px;
    margin-top: 5px;
    border: 0;
    box-shadow: 0 0 15px rgb(0 0 0 / 25%);
    padding: 5px;
    border-radius: 0.5rem;
    .dropdown-item {
      margin-top: 0.5rem;
      &:hover,
      &:active,
      &:focus,
      &:visited {
        background-color: transparent !important;
        color: ${({ theme }) => theme.colors.primary};
      }
    }
  }
`;
const TypeDropdownToggle = styled.div``;

interface Props {
  sortTypes: any;
  sorting: any;
  setSorting: any;
}

const Sorting = ({ sortTypes, sorting, setSorting }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [findSorts] = sortTypes.filter(function (type) {
    return type.key === sorting;
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (key: string) => {
    setSorting(key);
    setIsOpen(false);
  };

  return (
    <TypeDropdown ref={dropdownRef}>
      <TypeDropdownToggle className="cursor-pointer" onClick={handleToggle}>
        <div className="flex items-center mainDropdown">
          <span className="text-base mx-2"> Sort By :</span>
          <div>
            <span className="text-base mx-2">{findSorts.label}</span>
            <DownArrowIcon className="dropdown-arrow" />
          </div>
        </div>
      </TypeDropdownToggle>

      {isOpen && (
        <div className="dropdown-menu z-10 bg-white">
          {sortTypes.map((item: any) => (
            <div
              key={item.key}
              className="dropdown-item px-4 py-2 text-base cursor-pointer hover:text-primary"
              onClick={() => handleSelect(item.key)}
            >
              <div>{item.label}</div>
            </div>
          ))}
        </div>
      )}
    </TypeDropdown>
  );
};

export default Sorting;
