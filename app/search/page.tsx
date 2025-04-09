import React from "react";
import { SearchFilterProvider } from "@/helpers/contexts/search-filter-context";
import Search from "./Search";

const page = () => {
  return (
    <div className="pt-[90px]">
      <SearchFilterProvider>
        <Search />
      </SearchFilterProvider>
    </div>
  );
};

export default page;
