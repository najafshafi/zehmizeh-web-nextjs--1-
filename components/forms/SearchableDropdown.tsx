import React, { useEffect, useState } from "react";
import Spinner from "@/components/ui/Spinner";

interface SearchableDropdownProps {
  placeholder?: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  fetching: boolean;
  searchResults: { label: string; value: string }[];
  onSelectItem?: (item: { label: string; value: string }) => void;
  showSuggestions?: boolean;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  placeholder = "Search",
  searchQuery,
  setSearchQuery,
  fetching,
  searchResults,
  onSelectItem,
  showSuggestions = false,
}) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [suggest, setSuggest] = useState<boolean>(showSuggestions);

  const handleClick = (item: { label: string; value: string }) => {
    setShowOptions(false);
    setSuggest(false);
    if (onSelectItem) onSelectItem(item);
  };

  useEffect(() => {
    if (searchResults.length > 0 && !showOptions) {
      setShowOptions(true);
    }
  }, [searchResults, showOptions]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".searchable-input")) {
        setShowOptions(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
    <div className="relative w-full">
      <input
        type="text"
        onFocus={() => {
          if (showSuggestions) {
            setSuggest(true);
            setShowOptions(true);
          }
        }}
        autoFocus
        placeholder={placeholder}
        value={searchQuery}
        className="w-full p-3 rounded-md border border-gray-300 focus:ring focus:ring-blue-300 searchable-input"
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {((searchQuery && searchQuery !== "") || suggest) && (
        <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-md bg-white shadow-lg z-10">
          {fetching ? (
            <div className="flex items-center p-3 text-sm text-gray-600">
              <Spinner /> Searching...
            </div>
          ) : showOptions ? (
            searchResults.length > 0 ? (
              searchResults.map((item, index) => (
                <div
                  key={`searchable-dropdown-${index}`}
                  className="cursor-pointer px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => handleClick(item)}
                >
                  {item.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">No result found</div>
            )
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;