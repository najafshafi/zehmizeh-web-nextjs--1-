import React, { useEffect, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import styled from "styled-components";

const Wrapper = styled.div`
  .input {
    padding: 0.875rem 1rem;
    border-radius: 7px;
  }
  .search-result {
    margin-top: 0.5rem;
    max-height: 200px;
    overflow-y: scroll;
    box-shadow: 0px 4px 36px rgba(0, 0, 0, 0.08);
    border-radius: 7px;
  }
  .search-option {
    border-bottom: 1px solid #f0f0f0;
    padding: 0.875rem;
    text-transform: capitalize;
  }
  .loader {
    padding: 0.875rem;
  }
`;

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
    const handleDocumentClick = (event) => {
      if (!event.target.closest(`.searchable-input`)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);
  return (
    <Wrapper>
      <Form.Control
        onFocus={() => {
          if (showSuggessions) {
            setSuggest(true);
            setShowOptions(true);
          }
        }}
        autoFocus={true}
        placeholder={placeholder || "Search"}
        value={searchQuery}
        className="fs-sm fw-300 input searchable-input"
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {((searchQuery !== null && searchQuery !== "") || suggest) && (
        <div className="search-result">
          {fetching ? (
            <div className="loader fs-sm">
              <Spinner animation="border" size="sm" /> &nbsp;Searching...
            </div>
          ) : showOptions ? (
            searchResults.length > 0 ? (
              searchResults.map((item: any, index) => (
                <div
                  key={`common-searchable-dropdown-${index}`}
                  className="search-option fs-1rem pointer"
                  onClick={() => onClick(item)}
                >
                  {item.label}
                </div>
              ))
            ) : (
              <div className="search-option fs-sm">No result found</div>
            )
          ) : null}
        </div>
      )}
    </Wrapper>
  );
};

export default SearchableDropdown;
