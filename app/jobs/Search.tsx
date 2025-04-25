/*
 * Search component that helps to search the jobs in the jobs page on the freelancer side  *
 */
import { useState } from "react";
import SearchIcon from "@/public/icons/search.svg";
import CrossIcon from "@/public/icons/cross-black.svg";

interface Props {
  searchTerm: string;
  onChange?: React.ChangeEvent<HTMLInputElement> | any;
}

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
    <div
      className={`bg-white py-5 px-8 rounded-[4.75rem] shadow-[0px_4px_29px_rgba(0,0,0,0.07)] flex items-center cursor-pointer md:w-auto w-full md:m-0 m-auto justify-center`}
      onClick={() => toggleSearch(true)}
    >
      <input
        className={`${
          focused ? "w-[200px] md:px-2.5 px-2.5" : "w-0"
        } border-none outline-none p-0 bg-transparent text-[1.1rem] transition-all duration-500 ease text-black`}
        type="text"
        placeholder="Type to search..."
        id="search-box"
        onChange={(e) => onChange(e.target.value)}
        value={searchTerm}
      />
      <div className="flex items-center gap-2.5">
        {focused ? <CrossIcon onClick={hideSearchbox} /> : <SearchIcon />}
        {!focused && (
          <div className="text-[18px] font-normal">Search My Projects</div>
        )}
      </div>
    </div>
  );
};

export default Search;
