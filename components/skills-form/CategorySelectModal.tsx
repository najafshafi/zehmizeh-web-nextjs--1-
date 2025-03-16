import { Chip } from "@/components/chip/Chip";
import { StyledModal } from "@/components/styled/StyledModal";
import { getCategoriesApi, getSkillsApi } from "@/helpers/http/common";
import { TJobDetails } from "@/helpers/types/job.type";
import { useEffect, useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import toast from "react-hot-toast";
import Tooltip from "@/components/ui/Tooltip";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { StyledButton } from "@/components/forms/Buttons";
import CrossIcon from "../../public/icons/cross-black.svg";
import styled from "styled-components";
import { getRelevantSkillsBasedOnCategory } from "@/helpers/utils/helper";
import { CONSTANTS } from "@/helpers/const/constants";
import { StatusBadge } from "@/components/styled/Badges";
import useResponsive from "@/helpers/hooks/useResponsive";

const DummyInputBox = styled.div`
  cursor: pointer;
  border: 1px solid ${(props) => props.theme.colors.borderColor};
  border-radius: 4px;
  padding: 6px 10px;
`;

const Items = styled.div`
  max-height: 60vh;
  overflow-y: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-wrap: wrap;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 5px;
  }
`;

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

export const CategorySkillSelectModal = ({
  type,
  errorMessage,
  formData,
  label,
  labelClassName,
  showTooltip,
  subText,
  tooltip,
  user_type,
  setFormData,
  categories,
  isMandatory,
  noResultFoundText,
  modalOpenCloseListener,
}: Props) => {
  const { isMobile, isTablet } = useResponsive();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allItems, setAllItems] = useState<TSkills>([]);
  const [search, setSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState<Props["formData"]>([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allSkills, setAllSkills] = useState([]);

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
    } catch (error) {
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
    } catch (error) {
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
        categories: item.categories.map((x) => x.id),
      }));
    const relevantSkills: TSkills = getRelevantSkillsBasedOnCategory([
      ...skills,
      ...categories,
    ]);
    setAllItems(relevantSkills);
  };

  const SkillChip = (item) => {
    const isActive =
      selectedItems.findIndex(
        (selectedCategory) =>
          selectedCategory[constantKeys(type).id] ===
          item[constantKeys(type).id]
      ) >= 0;
    return (
      <Chip
        isActive={isActive}
        key={item[constantKeys(type).id]}
        label={item[constantKeys(type).name]}
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
                prevCategory[constantKeys(type).id] ===
                item[constantKeys(type).id]
            );
            if (existIndex >= 0) {
              newItems.splice(existIndex, 1);
            } else {
              const objectToPush = {
                [constantKeys(type).id]: item[constantKeys(type).id],
                [constantKeys(type).name]: item[constantKeys(type).name],
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
          <span className={`text-capitalize ${labelClassName}`}>{label}</span>
          {isMandatory && <span className="mandatory">&nbsp;*</span>}
          {showTooltip && (
            <Tooltip>
              {tooltip.length > 0
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
        <DummyInputBox onClick={() => setIsModalOpen(true)}>
          {formData.length > 0 ? (
            <div className="flex flex-row flex-wrap gap-3 p-[6px] capitalize">
              {formData.map((item) => {
                return (
                  <Chip
                    className="pointer"
                    key={item[constantKeys(type).id]}
                    label={item[constantKeys(type).name]}
                  />
                );
              })}
            </div>
          ) : (
            <div>
              {type === "CATEGORY"
                ? "Select Skill Categories"
                : "Select Skills"}
            </div>
          )}
        </DummyInputBox>
        <div className="flex justify-between mt-2 suggested-skills text-[#656565]">
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
      <StyledModal
        show={isModalOpen}
        size="xl"
        onHide={() => setIsModalOpen(false)}
        centered
        maxwidth={isMobile || isTablet ? "90vw" : "80vw"}
      >
        <Modal.Body className="flex flex-col justify-center items-center">
          <p className="text-lg font-bold">
            {type === "CATEGORY" ? "Skill Categories" : "Skills"}
          </p>
          {isLoading && allItems?.length === 0 && (
            <Spinner animation="border" size="sm" />
          )}
          {(!isLoading || allItems?.length > 0) && (
            <>
              <Button
                variant="transparent"
                className="close"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </Button>
              <StatusBadge
                color="yellow"
                className="absolute"
                style={{ right: "20px", top: `${isMobile ? "40px" : "20px"}` }}
              >
                {selectedItems?.length || 0} /{" "}
                {type === "CATEGORY"
                  ? CONSTANTS.MAX_SELECT_CATEGORY
                  : CONSTANTS.MAX_SELECT_SKILLS}
              </StatusBadge>
              {/* START ----------------------------------------- Searchbox */}
              <div className="relative flex-1 search-and-dropdown flex items-center mb-4">
                <Form.Control
                  placeholder={"Search"}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  autoFocus={true}
                  className="custom-search text-base font-light w-[100px]"
                />
                {search && !isLoading && (
                  <CrossIcon
                    onClick={() => {
                      setSearch("");
                    }}
                    className="cursor-pointer absolute"
                    style={{ right: "10px" }}
                  />
                )}
                {isLoading && allItems?.length > 0 && (
                  <Spinner
                    className="absolute"
                    style={{ right: "10px" }}
                    animation="border"
                    size="sm"
                  />
                )}
              </div>
              {/* END ------------------------------------------- Searchbox */}

              {/* START ----------------------------------------- Items */}
              <Items>
                {allItems?.length === 0 ||
                allItems.every((x) => x.skills?.length === 0) ? (
                  <div>{noResultFoundText || "No Results found"}</div>
                ) : (
                  allItems.map((item) => {
                    if (item?.skills?.length > 0) {
                      return (
                        <div key={item.category_id} className="mb-[2rem]">
                          <b className="capitalize mt-2 text-lg">
                            {item.category_name}
                          </b>
                          <div className="flex flex-wrap justify-center items-center text-center mt-2">
                            {item.skills.map((skill) => {
                              return SkillChip(skill);
                            })}
                          </div>
                        </div>
                      );
                    }
                    if (item?.skills?.length === 0) return <></>;
                    return <div key={item.skill_id}>{SkillChip(item)}</div>;
                  })
                )}
              </Items>
              {/* END ------------------------------------------- Items */}
              <div className="mt-2 gap-2">
                <StyledButton
                  className="me-2"
                  variant="outline-dark"
                  disabled={isLoading}
                  onClick={() => {
                    setSelectedItems([]);
                    setFormData([]);
                    setIsModalOpen(false);
                  }}
                >
                  Reset
                </StyledButton>
                <StyledButton
                  className="ms-2"
                  disabled={isLoading}
                  onClick={() => {
                    setFormData(selectedItems);
                    setIsModalOpen(false);
                  }}
                >
                  Apply
                </StyledButton>
              </div>
            </>
          )}
        </Modal.Body>
      </StyledModal>
      {/* END ------------------------------------------- Modal */}
    </div>
  );
};
