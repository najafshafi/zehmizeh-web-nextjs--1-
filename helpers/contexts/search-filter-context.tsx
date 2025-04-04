/* eslint-disable @typescript-eslint/no-non-null-assertion */

"use client";
import React, { useEffect, useMemo, useState } from "react";
import { update_query_parameters } from "@/helpers/utils/misc";
import { useRouter, useSearchParams } from "next/navigation";
import {
  SEARCH_CLIENT_INITIAL_FILTERS,
  SEARCH_FREELANCER_INITIAL_FILTERS,
  getCategoriesApi,
  getDefaultParameter,
} from "@/helpers/http/common";
import { search } from "@/helpers/http/search";
import toast from "react-hot-toast";
import { useAuth } from "./auth-context";

const SearchFiltersContext = React.createContext<any>(null!);
Object.freeze(SEARCH_CLIENT_INITIAL_FILTERS);
Object.freeze(SEARCH_FREELANCER_INITIAL_FILTERS);

// Define interfaces for structured data
interface Category {
  id: string;
  name: string;
  skills: Array<{ id: string; name: string }>;
}

interface SearchPayload {
  page: number;
  limit: number;
  keyword: string;
  searchTypeForFreelancer?: "name" | "profile";
  filter: {
    categories: string[];
    skills: string[];
    languages: string[];
    [key: string]: any;
  };
}

function SearchFilterProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Convert searchParams to object safely
  const params: any = useMemo(() => {
    const paramsObject: Record<string, string> = {};
    if (searchParams) {
      searchParams.forEach((value, key) => {
        paramsObject[key] = value;
      });
    }
    return paramsObject;
  }, [searchParams]);

  const [filters, setFilters] = React.useState<any>(null);
  const [searchType, setSearchType] = useState<any>("");
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchTypeForNameOrProfile, setSearchTypeForNameOrProfile] = useState<
    "name" | "profile"
  >("profile");
  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState<boolean>(false);
  const [categoryList, setCategoryList] = useState([]);
  const [modalOpen, setModalOpen] = useState<"CATEGORIES" | "SKILLS" | "">("");

  const isFilterApplied = useMemo(() => {
    if (!params?.type) return false;
    let initialFilters = {};

    if (params.type === "freelancers")
      initialFilters = {
        account_type: [],
        skills: [],
        categories: [],
        languages: [],
        rating: [],
        hourly_rate: {},
        location: [],
        freelancerFilters: [],
        hasPortfolio: [],
      };
    else
      initialFilters = {
        job_type: [],
        skills: [],
        categories: [],
        languages: [],
        fixed_budget: [],
        hourly_rate: [],
        job_status: [],
      };

    return !(JSON.stringify(filters) === JSON.stringify(initialFilters));
  }, [filters]);

  const getFiltersFromParams = () => {
    const filterKeys = [
      "categories",
      "skills",
      "account_type",
      "job_type",
      "languages",
      "location",
      "rating",
      "freelancerFilters",
      "hasPortfolio",
      "job_status",
    ];
    const paramFilters: any = {};

    filterKeys.forEach((ky) => {
      const value: any = params[ky];
      if (!value || typeof value !== "string") return;

      if (["categories", "skills"].includes(ky))
        paramFilters[ky] = value.split(",,");
      else paramFilters[ky] = value.split(",");
    });

    const jsonParams = ["fixed_budget", "hourly_rate"];
    jsonParams.forEach((key) => {
      if (params[key]) {
        try {
          paramFilters[key] = JSON.parse(params[key]);
        } catch (error) {
          paramFilters[key] = params.type === "freelancers" ? {} : [];
        }
      }
    });

    return {
      is_exists: !!Object.keys(paramFilters).length,
      paramFilters,
    };
  };

  const filterHandler = () => {
    // Getting Page from the params
    setPage((pg) => Number(params?.page ?? pg));

    // Updating Filters
    if (typeof params?.type === "string") {
      if (
        !["freelancers", "jobs"].includes(params?.type) ||
        (user?.user_type === "client" && params.type === "jobs")
      )
        router.push("/");

      setSearchType(params.type);

      const { paramFilters, is_exists } = getFiltersFromParams();
      let updatedFilters: any = {
        ...(params.type === "freelancers"
          ? SEARCH_FREELANCER_INITIAL_FILTERS
          : SEARCH_CLIENT_INITIAL_FILTERS),
      };

      if (is_exists) updatedFilters = { ...updatedFilters, ...paramFilters };
      if (params.keyword) setSearchTerm(params.keyword);
      if (params.searchTypeForNameOrProfile)
        setSearchTypeForNameOrProfile(params.searchTypeForNameOrProfile);
      // if (params.searchTypeForNameOrProfile) setSearchTypeForNameOrProfile=(params.searchTypeForNameOrProfile);

      setFilters(updatedFilters);
    } else router.push("/");
  };

  const paramsHandler = (payload: SearchPayload, searchType: string) => {
    let paramsToAdd: Record<string, any> = {
      page: payload.page,
      keyword: payload.keyword,
      languages: payload.filter.languages,
      categories: payload.filter.categories.join(",,"),
      skills: payload.filter.skills.join(",,"),
    };

    if (searchType === "freelancers") {
      paramsToAdd = {
        ...paramsToAdd,
        searchTypeForFreelancer: payload.searchTypeForFreelancer,
        location: payload.filter.location,
        rating: payload.filter.rating,
        account_type: payload.filter.account_type,
        freelancerFilters: payload.filter.freelancerFilters,
        hasPortfolio: payload.filter.hasPortfolio,
      };
    }

    if (searchType === "jobs") {
      paramsToAdd = {
        ...paramsToAdd,
        job_type: payload.filter.job_type,
        fixed_budget: payload.filter.fixed_budget,
        job_status: payload.filter.job_status?.join(","),
      };
    }

    const jsonKeys = ["fixed_budget", "hourly_rate"];

    jsonKeys.forEach((key) => {
      if (
        typeof payload.filter[key] === "object" &&
        Object.keys(payload.filter[key] || {}).length > 0
      ) {
        paramsToAdd[key] = JSON.stringify(payload.filter[key]);
      } else {
        paramsToAdd[key] = [];
      }
    });
    for (const key in paramsToAdd) {
      update_query_parameters(key, paramsToAdd[key]);
    }
  };

  const categoryChangeHandler = (categories: string[]) => {
    const selectedCategories = (categoryList as Category[]).filter(
      (cat: Category) => {
        return categories.includes(`${cat.name}#${cat.id}`);
      }
    );

    // Get all skills from all categories and flatten the array
    const allSkills: Array<{ id: string; name: string }> = [];
    selectedCategories.forEach((cat: Category) => {
      if (Array.isArray(cat.skills)) {
        cat.skills.forEach((skill) => allSkills.push(skill));
      }
    });

    const skillIdentifiers = allSkills.map(
      (skill) => `${skill.name}#${skill.id}`
    );

    // Filter the skills in filters to only include those that are in selected categories
    return filters.skills.filter((skillId: string) =>
      skillIdentifiers.includes(skillId)
    );
  };

  const updateFilterHandler = async (field: string, item: any) => {
    setFilters(null);
    setPage(1);
    let updatedFilter = { ...filters, [field]: item };
    if (field === "categories") {
      const skills = categoryChangeHandler(item);
      updatedFilter = { ...updatedFilter, skills };
    }

    setFilters(updatedFilter);
  };

  const searchHandler = async (filter: any) => {
    try {
      const payload: SearchPayload = {
        page,
        limit: 10,
        keyword: debouncedSearchTerm,
        searchTypeForFreelancer: searchTypeForNameOrProfile,
        filter: { ...filter },
      };
      paramsHandler(payload, searchType);

      const specialKeys = ["categories", "skills", "languages"];

      specialKeys.forEach((key) => {
        if (Array.isArray(payload?.filter[key])) {
          payload.filter[key] = payload.filter[key].map(
            (elem: string) => elem?.split("#")[1]
          );
        }
      });

      // Make searchTypeForFreelancer optional so it can be deleted
      const searchPayload = { ...payload } as {
        searchTypeForFreelancer?: "name" | "profile";
        [key: string]: any;
      };

      if (searchType === "jobs") {
        delete searchPayload.searchTypeForFreelancer;
      }

      setLoading(true);
      const response = await search(searchType, searchPayload);
      setLoading(false);

      setData(response);
    } catch (error: unknown) {
      console.log("Error: ", error);
      setLoading(false);

      // Safe error handling
      if (error && typeof error === "object") {
        const errorObj = error as {
          response?: { data?: { message?: string } };
          message?: string;
        };

        const errorMessage =
          errorObj.response?.data?.message ||
          (errorObj.message ? errorObj.message : "An error occurred");

        toast.error(errorMessage);
      } else {
        toast.error("An error occurred");
      }
    }
  };

  const clearFilters = () => {
    const resetResp = getDefaultParameter(params.type);
    setFilters(resetResp);
  };
  useEffect(() => {
    getCategoriesApi().then((res) => {
      setCategoryList(res.data);
    });
  }, []);

  useEffect(() => {
    filterHandler();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const onSearchHandler = () => {
    if (!filters) return null;
    searchHandler(filters);
  };
  useEffect(() => {
    onSearchHandler();
  }, [filters, debouncedSearchTerm, page, searchTypeForNameOrProfile]);

  const payload = {
    searchType,
    data,
    loading,
    page,
    setPage,
    searchTerm,
    setSearchTerm,
    searchTypeForNameOrProfile,
    setSearchTypeForNameOrProfile,
    filters,
    updateFilterHandler,
    isFilterApplied,
    clearFilters,
    modalOpen,
    setModalOpen,
  };

  return (
    <SearchFiltersContext.Provider value={payload}>
      {children}
    </SearchFiltersContext.Provider>
  );
}

function useSearchFilters() {
  return React.useContext(SearchFiltersContext);
}

export { SearchFilterProvider, useSearchFilters };
