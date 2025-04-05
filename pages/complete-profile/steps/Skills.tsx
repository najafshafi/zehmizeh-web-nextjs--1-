"use client";
import { useState } from "react";
import { FormWrapper } from "./steps.styled";
import { StyledButton } from "@/components/forms/Buttons";
import { IClientDetails } from "@/helpers/types/client.type";
import { IFreelancerDetails } from "@/helpers/types/freelancer.type";
import { CategorySkillSelectModal } from "@/components/skills-form/CategorySelectModal";
import {
  getCategories,
  getRelevantSkillsBasedOnCategory,
  getSkills,
} from "@/helpers/utils/helper";

// Define the Skill type to match what's expected
type Skill = Partial<{
  category_id: number;
  category_name: string;
  skill_id: number;
  skill_name: string;
  categories: number[];
}>;

type Props = {
  selectedSkills?: Skill[];
  selectedCategories: Skill[];
  onUpdate: (data: Partial<IClientDetails & IFreelancerDetails>) => void;
  onPrevious: () => void;
  skipForNow: () => void;
};

const initialErrorMessages = { skills: "", categories: "" };

const Skills = ({
  selectedSkills = [], // Default to empty array if undefined
  selectedCategories = [], // Default to empty array if undefined
  onUpdate,
  onPrevious,
  skipForNow,
}: Props) => {
  const [categoryAndSkillData, setCategoryAndSkillData] = useState<Skill[]>([
    ...selectedCategories,
    ...selectedSkills,
  ]);
  const [error, setError] = useState(initialErrorMessages);

  const handleUpdate = () => {
    setError(initialErrorMessages);
    if (getCategories(categoryAndSkillData)?.length === 0)
      return setError((prev) => ({
        ...prev,
        categories: "Please add at least one skill category.",
      }));

    if (getSkills(categoryAndSkillData)?.length === 0)
      return setError((prev) => ({
        ...prev,
        skills: "Please add at least one skill for each skill category.",
      }));

    onUpdate({ skills: categoryAndSkillData });
  };

  return (
    <FormWrapper className="flex flex-col">
      <CategorySkillSelectModal
        type="CATEGORY"
        label="Skill Categories"
        labelClassName="fs-18 font-weight-bold"
        subText={{
          content:
            "When you think of the types of services you would like to offer on ZMZ, which of the categories listed below would they fall into? Select all that apply.",
          className: "text-secondary",
        }}
        errorMessage={error.categories}
        formData={getCategories(categoryAndSkillData)}
        setFormData={(categories) => {
          const skills = getRelevantSkillsBasedOnCategory([
            ...getSkills(categoryAndSkillData),
            ...categories,
          ])
            .filter((x) => "skills" in x)
            .map((x) => x.skills)
            .flat();

          setCategoryAndSkillData([...skills, ...categories]);
        }}
        isMandatory
      />
      <CategorySkillSelectModal
        type="SKILL"
        label="Skills"
        labelClassName="fs-18 font-weight-bold"
        subText={{
          content:
            "Select the freelancing skills you would like to offer as a service on ZMZ.",
          className: "text-secondary",
        }}
        errorMessage={error.skills}
        categories={getCategories(categoryAndSkillData)}
        formData={getSkills(categoryAndSkillData)}
        setFormData={(skills) => {
          const categories = getCategories(categoryAndSkillData);
          setCategoryAndSkillData([...categories, ...skills]);
        }}
        noResultFoundText="No Results Found. Please Select Category first to See Skills."
        isMandatory
      />
      <div className="flex justify-center justify-content-md-end gap-3">
        <StyledButton variant="outline-dark" onClick={onPrevious}>
          Previous
        </StyledButton>
        <StyledButton onClick={skipForNow} variant="dark">
          Skip
        </StyledButton>
        <StyledButton onClick={() => handleUpdate()}>Next</StyledButton>
      </div>
    </FormWrapper>
  );
};

export default Skills;
