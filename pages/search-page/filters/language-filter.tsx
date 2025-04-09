/*
 * This is the language filter
 */
import React, { useEffect } from "react";
import styled from "styled-components";
import SearhableDropdown from "@/components/forms/SearchableDropdown2";
import Checkbox from "@/components/forms/FilterCheckBox2";
import useDebounce from "@/helpers/hooks/useDebounce";
import { getLanguages } from "@/helpers/http/common";
import { useSearchFilters } from "@/helpers/contexts/search-filter-context";

const LanguageFilterWrapper = styled.div`
  margin-top: 1.125rem;
`;

const LanguageFilter = () => {
  const [searchQuery, setSearchQuery] = React.useState<any>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [searchResults, setSearchResults] = React.useState<any>([]);
  const [fetching, setFetching] = React.useState<boolean>(false);

  const { filters, updateFilterHandler, isFilterApplied } = useSearchFilters();

  React.useEffect(() => {
    // This will load the languages when the input is typed
    const languages: { label: string; value: string }[] = [];
    setFetching(true);
    if (debouncedSearchQuery !== "") {
      getLanguages(debouncedSearchQuery || "").then((res) => {
        res.data.forEach(function (item: any) {
          const obj = {
            label: item.language_name,
            value: item.language_id,
          };
          languages.push(obj);
        });
        setSearchResults(languages);
        setFetching(false);
      });
    }
  }, [debouncedSearchQuery]);

  const onSelectItem = (item: any) => {
    item = `${item.label}#${item.value}`;
    const selectedLanguages = filters.languages || [];
    if (selectedLanguages.includes(item)) {
      selectedLanguages.splice(selectedLanguages.indexOf(item), 1);
    } else {
      selectedLanguages.push(item);
    }

    updateFilterHandler("languages", selectedLanguages);
  };

  useEffect(() => {
    if (!isFilterApplied) {
      setSearchQuery("");
    }
  }, [isFilterApplied]);

  return (
    <LanguageFilterWrapper>
      <SearhableDropdown
        placeholder="Search Languages"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        fetching={fetching}
        searchResults={searchResults}
        onSelectItem={(item: { label: string; value: string }) =>
          onSelectItem(item)
        }
      />
      {filters?.languages?.length > 0 &&
        filters?.languages?.map((item: any, index: number) => (
          <div
            className="filter__checkbox__row flex items-center"
            key={`skill-key-${index}`}
          >
            <Checkbox
              checked={true}
              toggle={() =>
                onSelectItem({
                  label: item.split("#")[0],
                  value: item.split("#")[1],
                })
              }
            />{" "}
            <div className="checkbox-label fs-1rem fw-400 text-capitalize">
              {item.split("#")[0]}
            </div>
          </div>
        ))}
    </LanguageFilterWrapper>
  );
};

export default LanguageFilter;
