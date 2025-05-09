import React, { useEffect, useState } from "react";
import Spinner from "@/components/forms/Spin/Spinner";

const SearchableDropdown = ({
  placeholder,
  searchQuery,
  setSearchQuery,
  fetching,
  searchResults,
  onSelectItem,
  showSuggessions = false,
}: {
  placeholder?: string;
  searchQuery: string;
  setSearchQuery: any;
  fetching: boolean;
  searchResults: { label: any; value: any }[];
  onSelectItem?: any;
  showSuggessions?: any;
}) => {
  const [showOptions, setShowOptions] = React.useState<boolean>(false);
  const [suggest, setSuggest] = useState(showSuggessions ?? false);
  const onClick = (item: any) => {
    setShowOptions(false);
    setSuggest(false);
    onSelectItem(item);
  };
  React.useEffect(() => {
    if (searchResults.length !== 0 && !showOptions) {
      setShowOptions(true);
    }
  }, [searchResults]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(`.searchable-input`)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);
  return (
    <div>
      <input
        type="text"
        onFocus={() => {
          if (showSuggessions) {
            setSuggest(true);
            setShowOptions(true);
          }
        }}
        autoFocus={true}
        placeholder={placeholder || "Search"}
        value={searchQuery}
        className="w-full text-sm font-light px-4 py-3.5 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 searchable-input"
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {((searchQuery !== null && searchQuery !== "") || suggest) && (
        <div className="mt-2 max-h-[200px] overflow-y-scroll shadow-[0px_4px_36px_rgba(0,0,0,0.08)] rounded-md">
          {fetching ? (
            <div className="p-3.5 text-sm flex">
              <Spinner /> &nbsp;Searching...
            </div>
          ) : showOptions ? (
            searchResults.length > 0 ? (
              searchResults.map((item: any, index) => (
                <div
                  key={`common-searchable-dropdown-${index}`}
                  className="border-b border-[#f0f0f0] p-3.5 text-base cursor-pointer capitalize"
                  onClick={() => onClick(item)}
                >
                  {item.label}
                </div>
              ))
            ) : (
              <div className="border-b border-[#f0f0f0] p-3.5 text-sm">
                No result found
              </div>
            )
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
