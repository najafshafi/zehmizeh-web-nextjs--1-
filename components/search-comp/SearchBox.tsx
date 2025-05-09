"use client";
import { useEffect } from "react";
import SearchTypeDropdown from "./SearchTypeDropdown";
import { useAuth } from "@/helpers/contexts/auth-context";
import SearchIcon from "@/public/icons/search.svg";
import CrossIcon from "@/public/icons/cross-black.svg";
import { useSearchFilters } from "@/helpers/contexts/search-filter-context";
import SearchTypeDropdownForClient from "./searchTypeDropdownForClient";
import Spinner from "@/components/forms/Spin/Spinner";

interface SearchBoxProps {
  fetching?: boolean;
  onSubmit: (search: string) => void;
  searchType: "freelancers" | "jobs";
}

interface FormEvent extends React.FormEvent<HTMLFormElement> {
  preventDefault(): void;
}

interface InputEvent extends React.ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement;
}

const SearchBox = ({ fetching, onSubmit, searchType }: SearchBoxProps) => {
  const { user } = useAuth();

  const {
    searchTerm,
    setSearchTerm,
    searchTypeForNameOrProfile,
    setSearchTypeForNameOrProfile,
  } = useSearchFilters();

  const handleSubmit =
    (search: string, searchTypeBy?: string) => (e: FormEvent) => {
      e.preventDefault();
      // This will submit the search when find button is clicked
      onSubmit(search);
      setSearchTypeForNameOrProfile(searchTypeBy);
    };

  const handleButtonClick = () => {
    onSubmit(searchTerm);
    setSearchTypeForNameOrProfile(searchTypeForNameOrProfile);
  };

  const onChange = (e: InputEvent) => {
    setSearchTerm(e.target.value);
    /* TODO: Mudit, here we have a button "Find" to perform search but as per Yogesh,
     * when the search is cleared, it should automatically call api to search without keyword without clicking on the find button
     * So I added this, is this good?
     */
    if (e.target.value == "") {
      onSubmit(e.target.value);
    }
  };

  useEffect(() => {
    if (!searchTerm) {
      setSearchTerm("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  return (
    <div className="w-full max-w-[822px] mx-auto mt-4">
      <form onSubmit={handleSubmit(searchTerm, searchTypeForNameOrProfile)}>
        <div className="flex items-center justify-between rounded-lg bg-white shadow-[0px_6px_29px_rgba(229,226,221,0.74)] h-[4.4375rem] pl-6">
          <div className="flex-1 flex items-center">
            <SearchIcon />
            <input
              placeholder={
                searchType === "freelancers" ? "Search" : "Search for Projects"
              }
              value={searchTerm}
              onChange={onChange}
              autoFocus={true}
              className="border-none ml-3.5 p-0 h-9 shadow-none w-full text-xl leading-6 tracking-[-0.02em] font-light focus:outline-none"
            />
            {fetching && <Spinner className="ml-2" />}
            {searchTerm && (
              <CrossIcon
                onClick={() => {
                  setSearchTerm("");
                  setSearchTypeForNameOrProfile("");
                  onSubmit("");
                  setSearchTypeForNameOrProfile("");
                }}
                className="mr-4 cursor-pointer"
              />
            )}
          </div>

          {!user && <SearchTypeDropdown />}

          {searchType === "freelancers" && <SearchTypeDropdownForClient />}

          {/* Find button for desktop */}
          <div
            onClick={handleButtonClick}
            className="hidden lg:flex justify-center items-center bg-primary h-full leading-6 tracking-[-0.02em] px-12 text-black rounded-r-lg font-normal text-base cursor-pointer"
          >
            {searchType === "freelancers" ? "Find Freelancer" : "Find Projects"}
          </div>
        </div>
        {/* Find button mobile view */}
        <div
          onClick={handleButtonClick}
          className="mt-3 flex lg:hidden justify-center items-center bg-primary py-6 text-black rounded-lg font-normal text-base cursor-pointer"
        >
          {searchType === "freelancers" ? "Find Freelancer" : "Find Projects"}
        </div>
      </form>
    </div>
  );
};

export default SearchBox;
