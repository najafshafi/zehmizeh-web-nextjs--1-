"use client";
import DownArrowIcon from "@/public/icons/chevronDown.svg";
import { useEffect, useState, useRef } from "react";
import { useSearchFilters } from "@/helpers/contexts/search-filter-context";

interface SearchType {
  label: string;
  key: string;
}

const searchTypes: SearchType[] = [
  {
    label: "Search Profiles",
    key: "profile",
  },
  {
    label: "Search Names",
    key: "name",
  },
];

const SearchTypeDropdownForClient = () => {
  const { searchTypeForNameOrProfile, setSearchTypeForNameOrProfile } =
    useSearchFilters();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchTypeForNameOrProfile) {
      setSearchTypeForNameOrProfile("");
    }
  }, [searchTypeForNameOrProfile, setSearchTypeForNameOrProfile]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative cursor-pointer" ref={dropdownRef}>
      {/* Dropdown toggle */}
      <div
        onClick={toggleDropdown}
        className="flex items-center mr-6 border-none bg-transparent"
      >
        <div className="text-base mx-2">
          {searchTypeForNameOrProfile === "name"
            ? "Search Names"
            : "Search Profiles"}
        </div>
        <DownArrowIcon
          className={`transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 border-0 shadow-[0_0_15px_rgba(0,0,0,0.25)] py-2.5 px-5 rounded-lg bg-white z-10">
          {searchTypes.map((item: SearchType) => (
            <div
              key={item.key}
              className={`text-xl mt-2 py-1 px-1 min-w-[160px] text-primary hover:text-black bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent cursor-pointer ${
                item.key === "name" ? "font-medium" : "font-normal"
              }`}
              onClick={() => {
                setSearchTypeForNameOrProfile(item.key);
                setIsOpen(false);
              }}
            >
              <div>{item.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchTypeDropdownForClient;
