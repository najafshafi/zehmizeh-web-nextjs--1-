/*
 * This is the Location filter
 */

import React, { useEffect } from "react";
import styled from "styled-components";
import SearhableDropdown from "@/components/forms/SearchableDropdown2";
import Checkbox from "@/components/forms/FilterCheckBox2";
import useDebounce from "@/helpers/hooks/useDebounce";
import { getCountries } from "@/helpers/http/common";
import { useSearchFilters } from "@/helpers/contexts/search-filter-context";

const LocationFilterWrapper = styled.div`
  margin-top: 1.125rem;
`;

const LocationFilter = () => {
  const { filters, updateFilterHandler, isFilterApplied } = useSearchFilters();
  const [searchQuery, setSearchQuery] = React.useState<any>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [searchResults, setSearchResults] = React.useState<any>([]);
  const [fetching, setFetching] = React.useState<boolean>(false);

  React.useEffect(() => {
    // This will fetch the countries when input is typed, with that keyword
    const countries: { label: string; value: string }[] = [];
    setFetching(true);
    if (debouncedSearchQuery !== "") {
      getCountries(debouncedSearchQuery || "").then((res) => {
        res.data.forEach(function (item: any) {
          const obj = {
            label: item.country_name,
            value: item.country_id,
          };
          countries.push(obj);
        });
        setSearchResults(countries);
        setFetching(false);
      });
    }
  }, [debouncedSearchQuery]);

  const onSelectItem = (item: any) => {
    const selectedLocations = filters.location || [];
    if (selectedLocations.includes(item)) {
      selectedLocations.splice(selectedLocations.indexOf(item), 1);
    } else {
      selectedLocations.push(item);
    }
    updateFilterHandler("location", selectedLocations);
  };

  useEffect(() => {
    if (!isFilterApplied) {
      setSearchQuery("");
    }
  }, [isFilterApplied]);

  return (
    <LocationFilterWrapper>
      <SearhableDropdown
        placeholder="Search country"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        fetching={fetching}
        searchResults={searchResults}
        onSelectItem={(item: { label: string; value: string }) =>
          onSelectItem(item.label)
        }
      />
      {filters?.location?.length > 0 &&
        filters?.location?.map((item: string) => (
          <div
            className="filter__checkbox__row flex items-center"
            key={`location-${item}`}
          >
            <Checkbox checked={true} toggle={() => onSelectItem(item)} />{" "}
            <div className="checkbox-label fs-1rem fw-400">{item}</div>
          </div>
        ))}
    </LocationFilterWrapper>
  );
};

export default LocationFilter;
