import React from "react";
import { SearchFilterProvider } from "@/helpers/contexts/search-filter-context";
import Search from "@/pages/search-page/Search";

const page = () => {
  return (
    <div className="pt-[90px] bg-secondary flex flex-col items-center">
      <SearchFilterProvider>
        <Search />
      </SearchFilterProvider>
    </div>
  );
};

export default page;
