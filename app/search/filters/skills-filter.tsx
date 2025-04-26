import { useEffect, useMemo, useRef, useState } from "react";
import Checkbox from "@/components/forms/FilterCheckBox2";
import { getSkillsApi } from "@/helpers/http/common";
import { useSearchFilters } from "@/helpers/contexts/search-filter-context";
import { TJobDetails } from "@/helpers/types/job.type";
import toast from "react-hot-toast";
import { getRelevantSkillsBasedOnCategory } from "@/helpers/utils/helper";
import Spinner from "@/components/forms/Spin/Spinner";
import useOnClickOutside from "@/helpers/hooks/useClickOutside";
import { SkillAndCategoryFilterWrapper } from "./skillAndCategoryStyled";
import { IoMdClose } from "react-icons/io";

type TSkills = (TJobDetails["skills"][0] & { skills: TJobDetails["skills"] })[];

type SkillItem = {
  skill_id?: number;
  skill_name?: string;
  category_id: number;
  category_name: string;
  [key: string]: any;
};

const generateKey = (item: SkillItem): string =>
  `${item.skill_name || ""}#${item.skill_id || ""}#${item.category_id}`;

export const SkillFilter = () => {
  const { filters, updateFilterHandler, modalOpen, setModalOpen } =
    useSearchFilters();

  const [allSkills, setAllSkills] = useState<
    {
      id: number;
      name: string;
      categories: { id: number; name: string }[];
    }[]
  >([]);
  const [allItems, setAllItems] = useState<
    {
      category_id: number;
      category_name: string;
      skills: TSkills;
    }[]
  >([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(modalRef, () => {
    if (modalOpen === "SKILLS") setModalOpen("");
  });

  const getAllSkillsFromAllCategories = (skills: any[]) =>
    getRelevantSkillsBasedOnCategory([
      ...skills,
      ...allSkills.reduce((acc: any[], x) => {
        acc.push(
          ...x.categories
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((y: any) => ({
              category_id: y.id,
              category_name: y.name,
            }))
            .filter(
              (item: { category_id: number }) =>
                acc.findIndex(
                  (item2: { category_id: number }) =>
                    item2.category_id === item.category_id
                ) === -1
            )
        );
        return acc;
      }, [] as any[]),
    ]).sort((a, b) =>
      (a.category_name || "").localeCompare(b.category_name || "")
    );

  const getSkills = async () => {
    try {
      setIsLoading(true);
      const { data } = await getSkillsApi();
      setIsLoading(false);

      if (Array.isArray(data)) setAllSkills(data);
    } catch (error: any) {
      let errorMessage = "Failed to load skills";
      if (
        error?.response?.data?.message &&
        typeof error?.response?.data?.message === "string"
      )
        errorMessage = error.response.data.message;
      else if (error?.message && typeof error.message === "string")
        errorMessage = error.message;
      else if (error && typeof error === "string") errorMessage = error;
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  const loadAllSkills = async (keyword = "") => {
    const skills = allSkills
      .filter((item) =>
        item?.name?.toLowerCase()?.includes(keyword?.toLowerCase())
      )
      .map((item) => ({
        skill_id: item.id,
        skill_name: item.name,
        categories: item.categories.map((x) => x.id),
      }));
    const relevantSkills = getRelevantSkillsBasedOnCategory([
      ...skills,
      ...filters.categories.map((category: string) => ({
        category_id: Number(category.split("#")[1]),
        category_name: category.split("#")[0],
      })),
    ]);
    setAllItems(
      filters?.categories?.length > 0
        ? (relevantSkills as any)
        : (getAllSkillsFromAllCategories(skills) as any)
    );
  };

  useEffect(() => {
    getSkills();
    return () => setModalOpen("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadAllSkills(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, allSkills, filters.categories]);

  useEffect(() => {
    if (modalOpen === "SKILLS" && modalRef.current) {
      modalRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "center",
      });
    }
  }, [modalOpen]);

  const searchUI = () => {
    return (
      <input
        type="text"
        className="w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 my-3"
        placeholder="Search"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
    );
  };

  const checkboxUI = (item: SkillItem) => {
    const key = generateKey(item);
    return (
      <Checkbox
        key={key}
        checked={filters.skills.includes(key)}
        toggle={() => {
          const skills = [...filters.skills];
          const existIndex = skills.findIndex(
            (prevCategory) => prevCategory === key
          );
          if (existIndex >= 0) {
            skills.splice(existIndex, 1);
          } else {
            const objectToPush = key;
            skills.push(objectToPush);
          }
          updateFilterHandler("skills", skills);
        }}
        label={item.skill_name}
      />
    );
  };

  const modalUI = () => {
    const dataToDisplay = allItems.reduce<Array<string | SkillItem>>(
      (acc, item) => {
        if (item.category_name && item?.skills?.length > 0)
          acc.push(item.category_name);
        if (item.skills?.length > 0) {
          acc.push(
            ...item.skills.map((x) => ({
              ...x,
              category_id: item.category_id,
              category_name: item.category_name,
            }))
          );
        }
        return acc;
      },
      []
    );

    return (
      <div ref={modalRef} className="modal-wrapper shadow">
        {/* START ----------------------------------------- Search */}
        <div className="modal-search">
          <div>{searchUI()}</div>
          <IoMdClose
            className="cursor-pointer ml-2"
            onClick={() => {
              setModalOpen("");
            }}
          />
        </div>
        {/* END ------------------------------------------- Search */}

        {/* START ----------------------------------------- Data to display */}
        <div className="items-ui">
          {dataToDisplay.map((item) => {
            if (typeof item === "string")
              return (
                <p key={item} className="m-0 my-2 mt-3 font-bold capitalize">
                  {item}
                </p>
              );
            return checkboxUI(item as SkillItem);
          })}
        </div>
        {/* END ------------------------------------------- Data to display */}

        {/* START ----------------------------------------- Apply and clear button */}
        <div className="button-wrapper">
          <p
            className="text-blue-600 cursor-pointer mx-2"
            onClick={() => {
              updateFilterHandler("skills", []);
              setModalOpen("");
            }}
          >
            Clear all
          </p>
        </div>
        {/* END ------------------------------------------- Apply and clear button */}
      </div>
    );
  };

  const items = [...allItems]
    .map((item) =>
      item.skills.map((x) => ({
        ...x,
        category_id: item.category_id,
        category_name: item.category_name,
      }))
    )
    .flat();

  const dataToDisplay = useMemo(() => {
    if (filters?.skills?.length > 0) {
      return items.sort((a) =>
        filters.skills.includes(generateKey(a as SkillItem)) ? -1 : 0
      );
    }
    return items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allItems, filters.skills, filters.categories]);

  return (
    <SkillAndCategoryFilterWrapper
      $isModalOpen={modalOpen === "SKILLS"}
      $type="SKILLS"
    >
      {searchUI()}
      {isLoading ? (
        <div>
          <Spinner />
        </div>
      ) : (
        <>
          <div>
            {dataToDisplay.slice(0, 5).map((item) => {
              return checkboxUI(item as SkillItem);
            })}
            <p
              className="cursor-pointer text-blue-600 m-0 mt-2"
              onClick={() => setModalOpen("SKILLS")}
            >
              {
                allItems
                  .map((item) => item.skills)
                  .flat()
                  .slice(5).length
              }{" "}
              More
            </p>
          </div>
          {modalUI()}
        </>
      )}
    </SkillAndCategoryFilterWrapper>
  );
};
