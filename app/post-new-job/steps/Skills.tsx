"use client";

import { usePostJobContext } from "../context";
import { FooterButtons } from "../partials/FooterButtons";
import { CategorySkillSelectModal } from "@/components/skills-form/CategorySelectModal";
import {
  getCategories,
  getRelevantSkillsBasedOnCategory,
  getSkills,
} from "@/helpers/utils/helper";

// Define skill type based on TJobDetails
type Skill = Partial<{
  category_id: number;
  category_name: string;
  skill_id: number;
  skill_name: string;
  categories: number[];
}>;

// Define the return type of getRelevantSkillsBasedOnCategory
type TSkills = (Skill & { skills: Skill[] })[];

export const Skills = () => {
  const { formData, setFormData, errors } = usePostJobContext();

  return (
    <div className="flex flex-col space-y-6 text-left">
      <div className="mb-6">
        <CategorySkillSelectModal
          type="CATEGORY"
          label="Skill Categories"
          labelClassName="text-base font-bold mb-2 text-left"
          subText={{
            content:
              "What TYPE of skills do you need your freelancer to have? Select all categories that apply.",
            className: "text-sm text-gray-600 text-left",
          }}
          errorMessage={errors.categories}
          formData={getCategories(formData.skills || [])}
          setFormData={(categories) => {
            const relevantSkills = getRelevantSkillsBasedOnCategory([
              ...getSkills(formData.skills || []),
              ...categories,
            ]) as TSkills;

            const skills = relevantSkills
              .filter((x) => "skills" in x && Array.isArray(x.skills))
              .map((x) => x.skills)
              .flat();

            setFormData({ skills: [...skills, ...categories] });
          }}
          isMandatory
        />
      </div>

      <div className="mb-6">
        <CategorySkillSelectModal
          type="SKILL"
          label="Skills"
          labelClassName="text-base font-bold mb-2 text-left"
          subText={{
            content:
              "What SPECIFIC skills does your freelancer need to complete this project? Select all that apply.",
            className: "text-sm text-gray-600 text-left",
          }}
          errorMessage={errors.skills}
          categories={getCategories(formData.skills || [])}
          formData={getSkills(formData.skills || [])}
          setFormData={(skills) => {
            setFormData({
              skills: [...getCategories(formData.skills || []), ...skills],
            });
          }}
          noResultFoundText="No Results Found. Please Select Category first to See Skills."
        />
      </div>

      <FooterButtons />
    </div>
  );
};
