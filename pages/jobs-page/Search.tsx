/*
 * Search component that helps to search the jobs in the jobs page on the freelancer side  *
 */
import { useState } from "react";
import styled from "styled-components";
import SearchIcon from "@/public/icons/search.svg";
import CrossIcon from "@/public/icons/cross-black.svg";

interface Props {
  searchTerm: string;
  onChange?: React.ChangeEvent<HTMLInputElement> | any;
}

export const SearchWrapper = styled.div<{ focused: boolean }>`
  background: ${(props) => props.theme.colors.white};
  padding: 1.25rem 2rem;
  border-radius: 4.75rem;
  box-shadow: 0px 4px 29px rgba(0, 0, 0, 0.07);
  @media (max-width: 768px) {
    margin: auto;
    width: 100%;
    justify-content: center;
  }
  .search-icon-label {
    gap: 10px;
  }
  .search-input {
    width: 0px;
    border: none;
    outline: none;
    padding: 0;
    background: none;
    font-size: 1.1rem;
    transition: 0.5s ease;
    color: #000;
  }
  .active {
    width: 200px;
    padding: 0 10px;
    @media (max-width: 768px) {
      padding: 0 10px;
      width: 100%;
    }
  }
`;

const Search = ({ searchTerm, onChange }: Props) => {
  const [focused, setFocused] = useState<boolean>(false);

  const toggleSearch = (value: boolean) => {
    // This will toggle the search box
    const searchBox = document.getElementById("search-box");
    if (value) {
      searchBox?.classList.add("active");
    } else {
      searchBox?.classList.remove("active");
    }
    setFocused(value);
  };

  const hideSearchbox = (e: any) => {
    e.stopPropagation();
    toggleSearch(false);
    onChange("");
  };

  return (
    <SearchWrapper
      focused={focused}
      onClick={() => toggleSearch(true)}
      className="flex items-center pointer"
    >
      <input
        className="search-input"
        type="text"
        placeholder="Type to search..."
        id="search-box"
        onChange={(e) => onChange(e.target.value)}
        value={searchTerm}
      />
      <div className="search-icon-label flex items-center">
        {focused ? <CrossIcon onClick={hideSearchbox} /> : <SearchIcon />}
        {!focused && (
          <div className="fs-18 font-normal">Search My Projects</div>
        )}
      </div>
    </SearchWrapper>
  );
};

export default Search;
