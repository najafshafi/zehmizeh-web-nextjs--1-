"use client";
import { useEffect } from "react";
import styled from "styled-components";
import { Form } from "react-bootstrap";
import Spinner from "@/components/forms/Spin/Spinner";
import SearchTypeDropdown from "./SearchTypeDropdown";
import { useAuth } from "@/helpers/contexts/auth-context";
import SearchIcon from "@/public/icons/search.svg";
import CrossIcon from "@/public/icons/cross-black.svg";
import { useSearchFilters } from "@/helpers/contexts/search-filter-context";
import SearchTypeDropdownForClient from "./searchTypeDropdownForClient";

const Wrapper = styled.div`
  max-width: 822px;
  margin: auto;
  .search-box-wrapper {
    border-radius: 7px;
    background: ${(props) => props.theme.colors.white};
    box-shadow: 0px 6px 29px rgba(229, 226, 221, 0.74);
    height: 4.4375rem;
    padding-left: 1.5rem;
  }
  .custom-search {
    border: none;
    margin-left: 0.875rem;
    padding: 0rem;
    height: 2.2375rem;
    box-shadow: none;
    width: 100% !important;
    line-height: 1.5rem;
    letter-spacing: -0.02em;
  }
  .button {
    background: ${(props) => props.theme.colors.yellow};
    height: 100%;
    line-height: 1.5rem;
    letter-spacing: -0.02em;
    padding: 1.5rem 3rem;
    color: ${(props) => props.theme.colors.black};
    border-radius: 0px 7px 7px 0px;
  }
  .mobile {
    border-radius: 7px;
  }
`;

const SearchBox = ({
  fetching,
  onSubmit,
  searchType,
}: {
  fetching?: boolean;
  onSubmit?: any;
  searchType: "freelancers" | "jobs";
}) => {
  const { user } = useAuth();

  const {
    searchTerm,
    setSearchTerm,
    searchTypeForNameOrProfile,
    setSearchTypeForNameOrProfile,
  } = useSearchFilters();

  const handleSubmit = (search: string, searchTypeBy?: string) => (e: any) => {
    e.preventDefault();
    // This will submit the search when find button is clicked
    onSubmit(search);
    setSearchTypeForNameOrProfile(searchTypeBy);
  };

  const onChange = (e: any) => {
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
    <Wrapper className="mt-4">
      <Form onSubmit={handleSubmit(searchTerm, searchTypeForNameOrProfile)}>
        <div className="search-box-wrapper d-flex align-items-center justify-content-between">
          <div className="flex-1 search-and-dropdown d-flex align-items-center">
            <SearchIcon />
            <Form.Control
              placeholder={
                searchType === "freelancers" ? "Search" : "Search for Projects"
              }
              value={searchTerm}
              onChange={onChange}
              autoFocus={true}
              className="custom-search fs-20 fw-300 w-100"
            />
            {fetching && <Spinner animation="border" size="sm" />}
            {searchTerm && (
              <CrossIcon
                onClick={() => {
                  setSearchTerm("");
                  setSearchTypeForNameOrProfile("");
                  onSubmit("");
                  setSearchTypeForNameOrProfile("");
                }}
                className="me-4 cursor-pointer"
              />
            )}
          </div>

          {!user && <SearchTypeDropdown />}

          {searchType === "freelancers" && <SearchTypeDropdownForClient />}

          {/* Find button for desktop */}
          <div
            onClick={handleSubmit(searchTerm, searchTypeForNameOrProfile)}
            className="button pointer justify-content-center align-items-center fw-400 fs-1rem d-none d-lg-flex"
          >
            {searchType === "freelancers" ? "Find Freelancer" : "Find Projects"}
          </div>
        </div>
        {/* Find button mobile view */}
        <div
          onClick={handleSubmit(searchTerm, searchTypeForNameOrProfile)}
          className="mt-3 button mobile pointer justify-content-center align-items-center fw-400 fs-1rem d-lg-none d-flex"
        >
          {searchType === "freelancers" ? "Find Freelancer" : "Find Projects"}
        </div>
      </Form>
    </Wrapper>
  );
};

export default SearchBox;
