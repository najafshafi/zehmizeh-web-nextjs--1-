import { PostForm } from "../postJob.styled";
import { usePostJobContext } from "../context";
import { FooterButtons } from "../partials/FooterButtons";
import { CategorySkillSelectModal } from "@/components/skills-form/CategorySelectModal";
import {
  getCategories,
  getRelevantSkillsBasedOnCategory,
  getSkills,
} from "@/helpers/utils/helper";

export const Skills = () => {
  const { formData, setFormData, errors } = usePostJobContext();

  return (
    <PostForm>
      <CategorySkillSelectModal
        type="CATEGORY"
        label="Skill Categories"
        labelClassName="fw-bold fs-18"
        subText={{
          content:
            "What TYPE of skills do you need your freelancer to have? Select all categories that apply.",
          className: "fs-14",
        }}
        errorMessage={errors.categories}
        formData={getCategories(formData.skills)}
        setFormData={(categories) => {
          const skills = getRelevantSkillsBasedOnCategory([
            ...getSkills(formData.skills),
            ...categories,
          ])
            .filter((x) => "skills" in x)
            .map((x) => x.skills)
            .flat();

          setFormData({ skills: [...skills, ...categories] });
        }}
        isMandatory
      />
      <CategorySkillSelectModal
        type="SKILL"
        label="Skills"
        labelClassName="fw-bold fs-18"
        subText={{
          content:
            "What SPECIFIC skills does your freelancer need to complete this project? Select all that apply.",
          className: "fs-14",
        }}
        errorMessage={errors.skills}
        categories={getCategories(formData.skills)}
        formData={getSkills(formData.skills)}
        setFormData={(skills) => {
          setFormData({
            skills: [...getCategories(formData.skills), ...skills],
          });
        }}
        noResultFoundText="No Results Found. Please Select Category first to See Skills."
      />
      <FooterButtons />
    </PostForm>
  );
};
