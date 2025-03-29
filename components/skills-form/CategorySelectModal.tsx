"use client";
import { getCategoriesApi, getSkillsApi } from "@/helpers/http/common";
import { TJobDetails } from "@/helpers/types/job.type";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getRelevantSkillsBasedOnCategory } from "@/helpers/utils/helper";
import { CONSTANTS } from "@/helpers/const/constants";
import { IoClose } from "react-icons/io5";
import { VscClose } from "react-icons/vsc";
import { FaRegCircleCheck } from "react-icons/fa6";

type Props = {
  labelClassName?: string;
  label?: string;
  showTooltip?: boolean;
  tooltip?: string;
  user_type?: "freelancer" | "client";
  subText?: {
    isHidden?: boolean;
    className?: string;
    content?: string;
  };
  errorMessage?: string;
  type: "CATEGORY" | "SKILL";
  formData: TJobDetails["skills"];
  setFormData: (data: Props["formData"]) => void;
  categories?: TJobDetails["skills"];
  isMandatory?: boolean;
  noResultFoundText?: string;
  modalOpenCloseListener?: (value: boolean) => void;
};

type TSkills = (TJobDetails["skills"][0] & { skills: TJobDetails["skills"] })[];

const constantKeys = (type: Props["type"]) => {
  if (type === "CATEGORY") {
    return {
      id: "category_id",
      name: "category_name",
    };
  }
  return {
    id: "skill_id",
    name: "skill_name",
  };
};

// Tooltip component
const Tooltip = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="group relative inline-block">
      <span className="cursor-help text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </span>
      <div className="absolute z-10 w-64 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100 top-full left-1/2 transform -translate-x-1/2 mt-2">
        {children}
      </div>
    </div>
  );
};

// Error Message Component
const ErrorMessage = ({ message }: { message: string }) => {
  return <div className="text-red-500 mt-1 text-sm">{message}</div>;
};

// Chip Component
const Chip = ({
  isActive,
  label,
  className = "",
  onSelect,
}: {
  isActive?: boolean;
  label: string;
  className?: string;
  onSelect?: () => void;
}) => {
  return (
    <div
      onClick={onSelect}
      className={`${
        isActive
          ? "bg-[#F2B420] text-[#212529]"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      } px-3 py-[6px] rounded-full flex items-center gap-[2.5px] cursor-pointer text-[16px] capitalize font-medium transition-all ${className}`}
    >
      <FaRegCircleCheck className={`${isActive ? "block" : "hidden"}`} />
      {label}
    </div>
  );
};

// Spinner Component
const Spinner = ({ size = "sm" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full border-t-2 border-b-2 border-[#F2B420] ${sizeClasses[size]}`}
      ></div>
    </div>
  );
};

export const CategorySkillSelectModal = ({
  type,
  errorMessage,
  formData,
  label,
  labelClassName,
  showTooltip,
  subText,
  tooltip = "",
  user_type,
  setFormData,
  categories = [],
  isMandatory,
  noResultFoundText,
  modalOpenCloseListener,
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allItems, setAllItems] = useState<TSkills>([]);
  const [search, setSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState<Props["formData"]>([]);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [allSkills, setAllSkills] = useState<any[]>([]);

  /* START ----------------------------------------- Set form data in selected state */
  useEffect(() => {
    setSelectedItems(formData);
  }, [formData, isModalOpen]);

  // START ----------------------------------------- Will call function for parent to know when modal was opened or closed
  useEffect(() => {
    if (modalOpenCloseListener) modalOpenCloseListener(isModalOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);
  // END ------------------------------------------- Will call function for parent to know when modal was opened or closed
  /* END ------------------------------------------- Set form data in selected state */

  const getCategories = async () => {
    try {
      setIsLoading(true);
      const { data } = await getCategoriesApi();
      setIsLoading(false);

      if (Array.isArray(data)) setAllCategories(data);
    } catch (error: any) {
      let errorMessage = "Failed to load categories";
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

  useEffect(() => {
    if (type === "CATEGORY") getCategories();
    if (type === "SKILL") getSkills();
  }, [type]);

  /* START ----------------------------------------- Search side effect */
  useEffect(() => {
    if (isModalOpen) {
      if (type === "CATEGORY") loadAllCategories(search);
      if (type === "SKILL") loadAllSkills(search);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, type, isModalOpen, allCategories, allSkills]);
  /* END ------------------------------------------- Search side effect */

  /* START ----------------------------------------- Cleanup */
  useEffect(() => {
    return () => {
      setSelectedItems([]);
      setSearch("");
    };
  }, [isModalOpen]);
  /* END ------------------------------------------- Cleanup */

  const loadAllCategories = async (keyword = "") => {
    const options = allCategories
      .filter((item) =>
        item?.name?.toLowerCase()?.includes(keyword?.toLowerCase())
      )
      .map((cat) => {
        return {
          category_name: cat.name,
          category_id: cat.id,
        };
      }) as TSkills;
    setAllItems(options);
  };

  const loadAllSkills = async (keyword = "") => {
    const skills = allSkills
      .filter((item) =>
        item?.name?.toLowerCase()?.includes(keyword?.toLowerCase())
      )
      .map((item) => ({
        skill_id: item.id,
        skill_name: item.name,
        categories: item.categories.map((x: any) => x.id),
      }));
    const relevantSkills: TSkills = getRelevantSkillsBasedOnCategory([
      ...skills,
      ...categories,
    ]);
    setAllItems(relevantSkills);
  };

  const SkillChip = (item: any) => {
    const isActive =
      selectedItems.findIndex(
        (selectedCategory) =>
          selectedCategory[
            constantKeys(type).id as keyof typeof selectedCategory
          ] === item[constantKeys(type).id as keyof typeof item]
      ) >= 0;
    return (
      <Chip
        isActive={isActive}
        key={item[constantKeys(type).id as keyof typeof item]}
        label={item[constantKeys(type).name as keyof typeof item]}
        className="m-1 transition-all"
        onSelect={() => {
          const maxItemsAllowedToSelect =
            type === "CATEGORY"
              ? CONSTANTS.MAX_SELECT_CATEGORY
              : CONSTANTS.MAX_SELECT_SKILLS;
          if (!isActive && selectedItems.length > maxItemsAllowedToSelect - 1) {
            return toast.error(
              `Can't select more than ${maxItemsAllowedToSelect} ${
                type === "CATEGORY" ? "categories" : "skills"
              }`
            );
          }
          setSelectedItems((prev) => {
            const newItems = [...prev];
            const existIndex = prev.findIndex(
              (prevCategory) =>
                prevCategory[
                  constantKeys(type).id as keyof typeof prevCategory
                ] === item[constantKeys(type).id as keyof typeof item]
            );
            if (existIndex >= 0) {
              newItems.splice(existIndex, 1);
            } else {
              const objectToPush: any = {
                [constantKeys(type).id]:
                  item[constantKeys(type).id as keyof typeof item],
                [constantKeys(type).name]:
                  item[constantKeys(type).name as keyof typeof item],
              };
              if (type === "SKILL") objectToPush.categories = item.categories;
              newItems.push(objectToPush);
            }
            return newItems;
          });
        }}
      />
    );
  };

  return (
    <div>
      {/* START ----------------------------------------- Inputbox */}
      <div className="form-group" id="category-skills">
        <div className="flex items-center gap-1">
          <span className={`capitalize ${labelClassName}`}>{label}</span>
          {isMandatory && <span className="text-red-500">&nbsp;*</span>}
          {showTooltip && (
            <Tooltip>
              {tooltip?.length > 0
                ? tooltip
                : user_type === "freelancer"
                ? `If you were to think of the types of services you want to offer on ZMZ,
              which of the listed categories would they fall into? Select all that apply.`
                : `Think of the skill categories you want your freelancer to have in
              order to complete this project successfully. Type them in below and
              select relevant choices from the drop-down menu.`}
            </Tooltip>
          )}
        </div>
        {!subText?.isHidden && (
          <div className="my-1 mb-2">
            <span className={`text-base ${subText?.className || ""}`}>
              {subText?.content ||
                "Which of the categories listed below include the skills you want to offer on ZMZ? Select all that apply."}
            </span>
          </div>
        )}
        <div
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer border border-gray-300 rounded p-2 min-h-[42px]"
        >
          {formData.length > 0 ? (
            <div className="flex flex-row flex-wrap gap-2 p-1 capitalize">
              {formData.map((item) => {
                return (
                  <Chip
                    key={item[constantKeys(type).id as keyof typeof item]}
                    label={
                      item[
                        constantKeys(type).name as keyof typeof item
                      ] as string
                    }
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-gray-500 py-1">
              {type === "CATEGORY"
                ? "Select Skill Categories"
                : "Select Skills"}
            </div>
          )}
        </div>
        <div className="flex justify-between mt-2 text-[#656565]">
          <div>{errorMessage && <ErrorMessage message={errorMessage} />}</div>
          <div>
            {selectedItems?.length || 0} out of{" "}
            {type === "CATEGORY"
              ? CONSTANTS.MAX_SELECT_CATEGORY
              : CONSTANTS.MAX_SELECT_SKILLS}
          </div>
        </div>
      </div>
      {/* END ------------------------------------------- Inputbox */}

      {/* START ----------------------------------------- Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal Content */}
          <div className="bg-white rounded-xl w-full  md:max-w-[500px] lg:max-w-[80vw] max-h-[90vh] p-11 relative z-50 m-4">
            {/* Close Button (positioned at top right -40px) */}
            <button
              className="absolute md:top-0 top-2 right-2 md:-right-8 text-gray-900 lg:text-zinc-100 text-xl hover:text-gray-200 transition-colors"
              onClick={() => setIsModalOpen(false)}
            >
              <VscClose />
            </button>

            {/* Modal Header */}
            <div className="flex items-center justify-center mb-4">
              <h2 className="text-[#212529] text-lg font-bold">
                {type === "CATEGORY" ? "Skill Categories" : "Skills"}
              </h2>
              <div className="absolute top-10 lg:top-4 right-4 bg-[#fbf5e8] text-[#f2b420] px-5 py-2 rounded-[6px] text-base font-medium">
                {selectedItems?.length || 0} /{" "}
                {type === "CATEGORY"
                  ? CONSTANTS.MAX_SELECT_CATEGORY
                  : CONSTANTS.MAX_SELECT_SKILLS}
              </div>
            </div>

            {/* Modal Content */}
            <div className="space-y-2">
              {isLoading && allItems?.length === 0 && (
                <div className="flex justify-center items-center py-8">
                  <Spinner size="md" />
                </div>
              )}

              {(!isLoading || allItems?.length > 0) && (
                <>
                  {/* START ----------------------------------------- Searchbox */}
                  <div className="relative w-full flex flex-col justify-center">
                    <input
                      type="text"
                      placeholder="Search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      autoFocus
                      className="w-fit self-center border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-base"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      >
                        <IoClose className="text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                    {isLoading && allItems?.length > 0 && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <Spinner />
                      </div>
                    )}
                  </div>
                  {/* END ------------------------------------------- Searchbox */}

                  {/* START ----------------------------------------- Items */}
                  <div className="max-h-[60vh] overflow-y-auto px-2 py-4">
                    {allItems?.length === 0 ||
                    allItems.every((x) => x.skills?.length === 0) ? (
                      <div className="text-center py-8 text-gray-500">
                        {noResultFoundText || "No Results found"}
                      </div>
                    ) : (
                      <div className="flex flex-wrap justify-center">
                        {allItems.map((item) => {
                          if (item?.skills?.length > 0) {
                            return (
                              <div
                                key={item.category_id}
                                className="w-full mb-8"
                              >
                                <h3 className="capitalize text-lg font-bold mb-4 text-center">
                                  {item.category_name}
                                </h3>
                                <div className="flex flex-wrap justify-center gap-2">
                                  {item.skills.map((skill) => {
                                    return SkillChip(skill);
                                  })}
                                </div>
                              </div>
                            );
                          }
                          if (item?.skills?.length === 0) return null;
                          return (
                            <div key={item.skill_id}>{SkillChip(item)}</div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  {/* END ------------------------------------------- Items */}

                  {/* Action Buttons */}
                  <div className="flex justify-center mt-4 gap-4">
                    <button
                      className="px-8 py-[14px] border text-lg border-gray-900 text-gray-700 rounded-full hover:bg-gray-100 disabled:opacity-50 transition-all"
                      disabled={isLoading}
                      onClick={() => {
                        setSelectedItems([]);
                        setFormData([]);
                        setIsModalOpen(false);
                      }}
                    >
                      Reset
                    </button>
                    <button
                      className="px-8 py-[14px] border text-lg bg-[#F2B420] text-[#212529] rounded-full hover:scale-105 transition-all disabled:opacity-50"
                      disabled={isLoading}
                      onClick={() => {
                        setFormData(selectedItems);
                        setIsModalOpen(false);
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {/* END ------------------------------------------- Modal */}
    </div>
  );
};
